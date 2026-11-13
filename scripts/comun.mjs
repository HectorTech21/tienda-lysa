// Utilidades compartidas por los scripts: leen wrangler.jsonc y llaman a wrangler sin shell.
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");

export function leerConfiguracion() {
  const texto = readFileSync(join(RAIZ, "wrangler.jsonc"), "utf8").replace(/^\s*\/\/.*$/gm, "");
  const config = JSON.parse(texto);
  return { baseDatos: config.d1_databases[0].database_name, bucket: config.r2_buckets[0].bucket_name };
}

/** Devuelve "--local" o "--remote". Sin indicar nada se usa local, que no toca Cloudflare. */
export function leerDestino(argumentos) {
  const local = argumentos.includes("--local");
  const remoto = argumentos.includes("--remote");
  if (local && remoto) throw new Error("Elige solo una opción: --local o --remote.");
  return remoto ? "--remote" : "--local";
}

export function wrangler(argumentos, { capturar = false } = {}) {
  const resultado = spawnSync(process.execPath, [join(RAIZ, "node_modules", "wrangler", "bin", "wrangler.js"), ...argumentos], {
    cwd: RAIZ,
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
    stdio: capturar ? ["ignore", "pipe", "pipe"] : ["ignore", "inherit", "inherit"]
  });
  if (resultado.error) throw resultado.error;
  if (resultado.status !== 0) {
    throw new Error(`wrangler ${argumentos.slice(0, 3).join(" ")} ha fallado.\n${capturar ? (resultado.stderr || resultado.stdout || "").slice(-1500) : ""}`);
  }
  return resultado.stdout || "";
}

/** Ejecuta una consulta en D1 y devuelve sus filas. */
export function consultar(baseDatos, destino, consulta) {
  const salida = wrangler(["d1", "execute", baseDatos, destino, "--json", "--command", consulta], { capturar: true });
  const datos = JSON.parse(salida.slice(salida.indexOf("[")));
  return datos[0].results;
}

/** Descarga un objeto de R2 a un archivo. Devuelve false si no existe o no se puede leer. */
export function descargarDeR2(bucket, clave, archivo, destino) {
  try {
    wrangler(["r2", "object", "get", `${bucket}/${clave}`, "--file", archivo, destino], { capturar: true });
    return true;
  } catch {
    return false;
  }
}
