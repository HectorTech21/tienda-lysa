// Pasa el catálogo original (catalog-data.js) a D1 y sus imágenes a R2.
//
//   node scripts/migrar-catalogo.mjs --local      (por defecto; no toca Cloudflare)
//   node scripts/migrar-catalogo.mjs --remote     (recursos reales; requiere "wrangler login")
//   Opciones:
//     --forzar         permite ejecutarla aunque la base de datos ya tenga productos
//     --solo-datos     no sube imágenes (pero comprueba que ya están en R2)
//     --solo-imagenes  sube y comprueba las imágenes sin tocar la base de datos
//
// Es la carga INICIAL del catálogo. Si la base de datos de destino ya tiene productos, se
// niega a ejecutarse: lo normal es que el catálogo ya se gestione desde el panel. Con
// --forzar continúa avisando: los productos que ya existen NO se sobrescriben, pero los que
// se hayan borrado desde el panel volverían a aparecer.
// Orden: primero se suben las imágenes a R2 y se comprueba una a una que han llegado bien;
// solo entonces se insertan las filas. Así nunca queda un producto apuntando a una foto que no existe.
// Solo se migran los registros "product"; los "review" se quedan en el archivo interno.
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, extname, join } from "node:path";
import { RAIZ, consultar, descargarDeR2, leerConfiguracion, leerDestino, wrangler } from "./comun.mjs";
import { slugificar, CATEGORIAS } from "../src/validacion.js";

const argumentos = process.argv.slice(2);
const destino = leerDestino(argumentos);
const soloDatos = argumentos.includes("--solo-datos");
const soloImagenes = argumentos.includes("--solo-imagenes");
const forzar = argumentos.includes("--forzar");
if (soloDatos && soloImagenes) throw new Error("Elige solo una opción: --solo-datos o --solo-imagenes.");
const { baseDatos, bucket } = leerConfiguracion();

const origenes = [join(RAIZ, "datos", "catalogo-original.js"), join(RAIZ, "public", "catalog-data.js")];
const archivoCatalogo = origenes.find(existsSync);
if (!archivoCatalogo) throw new Error("No encuentro el catálogo original (datos/catalogo-original.js o public/catalog-data.js).");
const { BRANDS, CATALOG_PRODUCTS } = new Function(`${readFileSync(archivoCatalogo, "utf8")}; return { BRANDS, CATALOG_PRODUCTS };`)();

const TIPOS = { ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png" };
const categoriasValidas = new Set(CATEGORIAS.map(item => item.id));
const sql = valor => (valor === null || valor === undefined ? "NULL" : typeof valor === "number" ? String(valor) : `'${String(valor).replace(/'/g, "''")}'`);
const numeroDe = referencia => parseInt(String(referencia || "").replace(/\D/g, ""), 10) || 0;

const publicos = CATALOG_PRODUCTS.filter(producto => producto.recordType === "product");
const inicio = Date.UTC(2026, 10, 12, 12, 0, 0); // el orden actual de la web se conserva con la fecha de creación
const sentencias = [];
const subidas = [];

publicos.forEach((producto, indice) => {
  const categoria = producto.categories[0];
  if (!categoriasValidas.has(categoria)) throw new Error(`${producto.reference}: categoría no admitida (${categoria}).`);
  if (!producto.reference || !producto.images?.length) throw new Error(`${producto.id}: falta la referencia o la imagen.`);
  const marca = BRANDS.find(item => item.id === producto.brand)?.name || producto.observedBrand || null;
  const fecha = new Date(inicio - indice * 60000).toISOString();
  sentencias.push(
    "INSERT OR IGNORE INTO productos (id, referencia, titulo, slug, descripcion, precio_centimos, categoria, marca, marca_slug, color, visible, destacado, creado_en, actualizado_en) VALUES (" +
    [producto.id, producto.reference, producto.name, `${slugificar(producto.name) || "producto"}-${producto.reference.toLowerCase()}`, producto.description || "",
      typeof producto.price === "number" ? Math.round(producto.price * 100) : null, categoria, marca, marca ? slugificar(marca) : null,
      producto.color || null, 1, producto.featured ? 1 : 0, fecha, fecha].map(sql).join(", ") + ");"
  );
  producto.images.forEach((imagen, orden) => {
    const archivo = join(RAIZ, "public", imagen.src);
    if (!existsSync(archivo)) throw new Error(`${producto.reference}: no existe la imagen ${imagen.src}.`);
    const tipo = TIPOS[extname(archivo).toLowerCase()];
    if (!tipo) throw new Error(`${producto.reference}: formato de imagen no admitido (${imagen.src}).`);
    const clave = `productos/${producto.id}/${basename(archivo)}`;
    const bytes = readFileSync(archivo).length;
    sentencias.push(
      "INSERT OR IGNORE INTO imagenes (id, producto_id, clave, alt, orden, bytes, creado_en) VALUES (" +
      [`img-${producto.id}-${orden}`, producto.id, clave, imagen.alt || producto.name, orden, bytes, fecha].map(sql).join(", ") + ");"
    );
    subidas.push({ archivo, clave, tipo });
  });
});

// El contador nunca baja: así no se reutiliza ninguna referencia, tampoco las de los registros internos.
const ultimaReferencia = Math.max(...CATALOG_PRODUCTS.map(producto => numeroDe(producto.reference)));
sentencias.push(`UPDATE contadores SET valor = MAX(valor, ${ultimaReferencia}) WHERE nombre = 'referencia';`);

console.log(`Destino: ${destino === "--remote" ? "Cloudflare (REMOTO)" : "local"} · ${publicos.length} productos · ${subidas.length} imágenes · última referencia LYSA-${ultimaReferencia}`);

const temporal = mkdtempSync(join(tmpdir(), "lysa-migracion-"));
try {
  // 1. La base de datos de destino no puede tener ya productos (salvo con --forzar).
  if (!soloImagenes) {
    let existentes;
    try {
      existentes = consultar(baseDatos, destino, "SELECT COUNT(*) AS total FROM productos")[0].total;
    } catch {
      throw new Error(`No se puede leer la tabla de productos. Aplica antes el esquema: npx wrangler d1 migrations apply ${baseDatos} ${destino}`);
    }
    if (existentes > 0 && !forzar) {
      console.error(`\nLa base de datos de destino ya tiene ${existentes} productos. La migración NO se ha ejecutado.`);
      console.error("Esta migración es solo para la carga inicial. Si de verdad quieres volver a pasarla, añade --forzar:");
      console.error("los productos que ya existen no se tocan, pero los borrados desde el panel volverían a aparecer.");
      process.exit(1);
    }
    if (existentes > 0) {
      console.warn(`\nAVISO (--forzar): la base de datos ya tiene ${existentes} productos. Los que ya existen no se sobrescriben;`);
      console.warn("los del catálogo original que se hayan borrado desde el panel volverán a aparecer.\n");
    }
  }

  // 2. Imágenes: subir (salvo --solo-datos) y comprobar que lo que hay en R2 es idéntico al archivo.
  const huella = archivo => createHash("sha256").update(readFileSync(archivo)).digest("hex");
  const descarga = join(temporal, "comprobacion.bin");
  const fallidas = [];
  let hechas = 0;
  for (const { archivo, clave, tipo } of subidas) {
    if (!soloDatos) wrangler(["r2", "object", "put", `${bucket}/${clave}`, "--file", archivo, "--content-type", tipo, destino], { capturar: true });
    rmSync(descarga, { force: true });
    const correcta = descargarDeR2(bucket, clave, descarga, destino) && existsSync(descarga) && huella(descarga) === huella(archivo);
    if (!correcta) fallidas.push(clave);
    hechas += 1;
    if (hechas % 10 === 0 || hechas === subidas.length) console.log(`Imágenes ${soloDatos ? "comprobadas" : "subidas y comprobadas"}: ${hechas} de ${subidas.length}`);
  }
  if (fallidas.length) {
    console.error(`\n${fallidas.length} imágenes no están bien en R2. No se ha insertado ninguna fila en la base de datos:`);
    for (const clave of fallidas.slice(0, 20)) console.error(`  ${clave}`);
    process.exit(1);
  }

  // 3. Solo con todas las imágenes comprobadas se insertan las filas.
  if (!soloImagenes) {
    const archivoSql = join(temporal, "catalogo.sql");
    writeFileSync(archivoSql, sentencias.join("\n") + "\n", "utf8");
    wrangler(["d1", "execute", baseDatos, destino, "--file", archivoSql, "--yes"], { capturar: true });
    console.log("Base de datos: productos e imágenes registrados.");
  }
} finally {
  rmSync(temporal, { recursive: true, force: true });
}
console.log("Migración terminada.");
