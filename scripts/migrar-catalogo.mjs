// Pasa el catálogo original (catalog-data.js) a D1 y sus imágenes a R2.
//
//   node scripts/migrar-catalogo.mjs --local      (por defecto; no toca Cloudflare)
//   node scripts/migrar-catalogo.mjs --remote     (recursos reales; requiere "wrangler login")
//   Opciones: --solo-datos (sin imágenes) · --solo-imagenes (sin base de datos)
//
// Se puede repetir: los productos que ya existen NO se sobrescriben (se respetan los
// cambios hechos desde el panel) y las imágenes se vuelven a subir con la misma clave.
// Solo se migran los registros "product"; los "review" se quedan en el archivo interno.
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, extname, join } from "node:path";
import { RAIZ, leerConfiguracion, leerDestino, wrangler } from "./comun.mjs";
import { slugificar, CATEGORIAS } from "../src/validacion.js";

const argumentos = process.argv.slice(2);
const destino = leerDestino(argumentos);
const soloDatos = argumentos.includes("--solo-datos");
const soloImagenes = argumentos.includes("--solo-imagenes");
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

if (!soloImagenes) {
  const carpeta = mkdtempSync(join(tmpdir(), "lysa-migracion-"));
  const archivoSql = join(carpeta, "catalogo.sql");
  writeFileSync(archivoSql, sentencias.join("\n") + "\n", "utf8");
  try {
    wrangler(["d1", "execute", baseDatos, destino, "--file", archivoSql, "--yes"], { capturar: true });
  } finally {
    rmSync(carpeta, { recursive: true, force: true });
  }
  console.log("Base de datos: productos e imágenes registrados.");
}

if (!soloDatos) {
  let hechas = 0;
  for (const { archivo, clave, tipo } of subidas) {
    wrangler(["r2", "object", "put", `${bucket}/${clave}`, "--file", archivo, "--content-type", tipo, destino], { capturar: true });
    hechas += 1;
    if (hechas % 10 === 0 || hechas === subidas.length) console.log(`Imágenes: ${hechas} de ${subidas.length}`);
  }
}
console.log("Migración terminada.");
