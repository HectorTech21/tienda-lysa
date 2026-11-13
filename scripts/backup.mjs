// Copia de seguridad completa: datos de D1 (productos, imágenes, subidas y contador) y los
// archivos de imagen de R2.
//
//   node scripts/backup.mjs --local      (por defecto)
//   node scripts/backup.mjs --remote     (datos reales; requiere "wrangler login")
//
// Cada copia va a su propia carpeta dentro de backups/ (fuera de git):
//   backups/tienda-lysa-<origen>-<AAAAMMDD>-<HHMMSS>-<sufijo>/datos.json
//   backups/tienda-lysa-<origen>-<AAAAMMDD>-<HHMMSS>-<sufijo>/imagenes/<clave de R2>
// Si falta alguna imagen, la copia se guarda igualmente, se indica en datos.json y el
// script termina con error.
import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { RAIZ, consultar, descargarDeR2, leerConfiguracion, leerDestino } from "./comun.mjs";

const destino = leerDestino(process.argv.slice(2));
const { baseDatos, bucket } = leerConfiguracion();
const leer = consulta => consultar(baseDatos, destino, consulta);

// Huella del estado de la base de datos: cambia con cualquier alta, edición o borrado.
const huella = () => JSON.stringify(leer(
  `SELECT (SELECT COUNT(*) FROM productos) AS productos, (SELECT MAX(actualizado_en) FROM productos) AS ultimo_cambio,
          (SELECT COUNT(*) FROM imagenes) AS imagenes, (SELECT COUNT(*) FROM subidas) AS subidas,
          (SELECT valor FROM contadores WHERE nombre = 'referencia') AS contador`
)[0]);

/**
 * Lectura coherente: las tablas se leen por separado, así que se comprueba que nada haya
 * cambiado entre la primera y la última lectura. Si alguien guarda desde el panel justo
 * en ese momento, se vuelve a leer todo.
 */
function leerDatos() {
  for (let intento = 1; intento <= 4; intento++) {
    const antes = huella();
    const datos = {
      productos: leer("SELECT * FROM productos ORDER BY referencia"),
      imagenes: leer("SELECT * FROM imagenes ORDER BY producto_id, orden"),
      subidas: leer("SELECT * FROM subidas ORDER BY creado_en"),
      contadores: leer("SELECT * FROM contadores")
    };
    const ids = new Set(datos.productos.map(producto => producto.id));
    const coherente = antes === huella() && datos.imagenes.every(imagen => ids.has(imagen.producto_id));
    if (coherente) return datos;
    console.log(`La base de datos ha cambiado durante la lectura (intento ${intento}). Se vuelve a leer…`);
  }
  throw new Error("No se ha podido leer la base de datos de forma coherente: hay cambios continuos. Inténtalo de nuevo en un momento.");
}

const datos = leerDatos();
const creado = new Date();
const origen = destino === "--remote" ? "remoto" : "local";

// Nombre único: fecha, hora con segundos y un sufijo aleatorio. Nunca se reutiliza una carpeta.
const marca = creado.toISOString().replace(/[-:]/g, "").replace("T", "-").slice(0, 15);
const base = join(RAIZ, "backups");
mkdirSync(base, { recursive: true });
let carpeta;
do { carpeta = join(base, `tienda-lysa-${origen}-${marca}-${randomBytes(3).toString("hex")}`); } while (existsSync(carpeta));
mkdirSync(carpeta); // sin "recursive": si ya existiera, falla en lugar de mezclar dos copias

console.log(`Copia en ${carpeta}`);
console.log(`${datos.productos.length} productos · ${datos.imagenes.length} imágenes. Descargando imágenes de R2…`);

const faltan = [];
let hechas = 0;
for (const imagen of datos.imagenes) {
  if (imagen.clave.includes("..") || imagen.clave.startsWith("/") || imagen.clave.includes("\\")) { faltan.push({ clave: imagen.clave, motivo: "clave no válida" }); continue; }
  const archivo = join(carpeta, "imagenes", ...imagen.clave.split("/"));
  mkdirSync(dirname(archivo), { recursive: true });
  if (!descargarDeR2(bucket, imagen.clave, archivo, destino) || !existsSync(archivo)) {
    faltan.push({ clave: imagen.clave, motivo: "no está en R2 o no se ha podido descargar" });
  } else {
    const bytes = statSync(archivo).size;
    if (bytes === 0 || (imagen.bytes > 0 && bytes !== imagen.bytes)) faltan.push({ clave: imagen.clave, motivo: `tamaño distinto (${bytes} bytes; se esperaban ${imagen.bytes})` });
  }
  hechas += 1;
  if (hechas % 10 === 0 || hechas === datos.imagenes.length) console.log(`Imágenes: ${hechas} de ${datos.imagenes.length}`);
}

// datos.json se escribe al final: si existe, la copia ha terminado.
const copia = {
  creado: creado.toISOString(),
  origen,
  baseDatos,
  bucket,
  completa: faltan.length === 0,
  imagenesConProblemas: faltan,
  ...datos
};
writeFileSync(join(carpeta, "datos.json"), JSON.stringify(copia, null, 2) + "\n", "utf8");

if (faltan.length) {
  console.error(`\nCOPIA INCOMPLETA: ${faltan.length} imágenes con problemas (detalle en datos.json):`);
  for (const { clave, motivo } of faltan.slice(0, 20)) console.error(`  ${clave}: ${motivo}`);
  process.exit(1);
}
console.log(`Copia completa: ${datos.productos.length} productos y ${datos.imagenes.length} imágenes.`);
