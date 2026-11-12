// Copia de seguridad de la base de datos (productos, imágenes y contador) en un archivo JSON.
//
//   node scripts/backup.mjs --local      (por defecto)
//   node scripts/backup.mjs --remote     (base de datos real; requiere "wrangler login")
//
// El archivo se guarda en backups/ (fuera de git). Incluye las rutas de las fotos,
// pero no los archivos de imagen, que están en R2.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { RAIZ, leerConfiguracion, leerDestino, wrangler } from "./comun.mjs";

const destino = leerDestino(process.argv.slice(2));
const { baseDatos } = leerConfiguracion();

function consultar(consulta) {
  const salida = wrangler(["d1", "execute", baseDatos, destino, "--json", "--command", consulta], { capturar: true });
  const datos = JSON.parse(salida.slice(salida.indexOf("[")));
  return datos[0].results;
}

const copia = {
  creado: new Date().toISOString(),
  origen: destino === "--remote" ? "remoto" : "local",
  baseDatos,
  productos: consultar("SELECT * FROM productos ORDER BY referencia"),
  imagenes: consultar("SELECT * FROM imagenes ORDER BY producto_id, orden"),
  contadores: consultar("SELECT * FROM contadores")
};

const carpeta = join(RAIZ, "backups");
mkdirSync(carpeta, { recursive: true });
const marca = copia.creado.replace(/[-:]/g, "").replace("T", "-").slice(0, 15);
const archivo = join(carpeta, `tienda-lysa-${copia.origen}-${marca}.json`);
writeFileSync(archivo, JSON.stringify(copia, null, 2) + "\n", "utf8");
console.log(`Copia guardada: ${archivo}`);
console.log(`${copia.productos.length} productos · ${copia.imagenes.length} imágenes`);
