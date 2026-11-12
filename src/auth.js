// Autenticación del panel: Cloudflare Access en producción.
// Regla: si algo falta o falla, se BLOQUEA. Nunca se abre por defecto.

const CACHE_CLAVES_MS = 10 * 60 * 1000;
const MARGEN_RELOJ_S = 60;
const cacheClaves = new Map(); // dominio -> { claves, caduca }

/** Solo equipos locales o de red privada: una web pública nunca tiene estos nombres. */
function esHostLocal(hostname) {
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]") return true;
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) return true;
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname)) return true;
  return /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(hostname);
}

function normalizarDominio(valor) {
  const dominio = String(valor || "").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/+$/, "");
  return /^[a-z0-9-]+\.cloudflareaccess\.com$/.test(dominio) ? dominio : "";
}

function base64UrlABytes(texto) {
  if (!/^[A-Za-z0-9_-]+$/.test(texto)) throw new Error("Token mal formado");
  const base64 = texto.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (texto.length % 4)) % 4);
  const binario = atob(base64);
  const bytes = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);
  return bytes;
}

function leerJson(parte) {
  return JSON.parse(new TextDecoder().decode(base64UrlABytes(parte)));
}

async function descargarClaves(dominio) {
  const respuesta = await fetch(`https://${dominio}/cdn-cgi/access/certs`);
  if (!respuesta.ok) throw new Error("No se han podido descargar las claves de Access");
  const datos = await respuesta.json();
  return Array.isArray(datos.keys) ? datos.keys : [];
}

async function buscarClave(dominio, kid, obtenerClaves) {
  const ahora = Date.now();
  let entrada = cacheClaves.get(dominio);
  let clave = entrada && entrada.caduca > ahora ? entrada.claves.find(item => item.kid === kid) : null;
  if (!clave) {
    // Clave desconocida o caché caducada: se vuelven a pedir (Access rota las claves).
    entrada = { claves: await obtenerClaves(dominio), caduca: ahora + CACHE_CLAVES_MS };
    cacheClaves.set(dominio, entrada);
    clave = entrada.claves.find(item => item.kid === kid);
  }
  if (!clave) throw new Error("Clave de firma desconocida");
  return clave;
}

async function verificarToken(token, dominio, audiencia, obtenerClaves) {
  const partes = token.split(".");
  if (partes.length !== 3) throw new Error("Token mal formado");
  const [cabeceraB64, cuerpoB64, firmaB64] = partes;
  const cabecera = leerJson(cabeceraB64);
  if (cabecera.alg !== "RS256" || typeof cabecera.kid !== "string") throw new Error("Algoritmo no admitido");

  const jwk = await buscarClave(dominio, cabecera.kid, obtenerClaves);
  if (jwk.kty !== "RSA") throw new Error("Clave no admitida");
  const clave = await crypto.subtle.importKey(
    "jwk",
    { kty: "RSA", n: jwk.n, e: jwk.e, alg: "RS256", ext: true },
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const firmaValida = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    clave,
    base64UrlABytes(firmaB64),
    new TextEncoder().encode(`${cabeceraB64}.${cuerpoB64}`)
  );
  if (!firmaValida) throw new Error("Firma no válida");

  const datos = leerJson(cuerpoB64);
  const ahora = Math.floor(Date.now() / 1000);
  if (datos.iss !== `https://${dominio}`) throw new Error("Emisor no válido");
  const audiencias = Array.isArray(datos.aud) ? datos.aud : [datos.aud];
  if (!audiencias.includes(audiencia)) throw new Error("Audiencia no válida");
  if (typeof datos.exp !== "number" || datos.exp < ahora - MARGEN_RELOJ_S) throw new Error("Sesión caducada");
  if (typeof datos.nbf === "number" && datos.nbf > ahora + MARGEN_RELOJ_S) throw new Error("Token aún no válido");
  return datos;
}

/**
 * Decide si la petición puede usar el panel.
 * Devuelve { ok: true, email } o { ok: false, motivo }.
 * opciones.obtenerClaves permite inyectar las claves en las pruebas.
 */
export async function autorizar(request, env, opciones = {}) {
  // Salto SOLO para desarrollo: variable exacta "true" (definida en .dev.vars) y equipo local.
  if (env.DEV_BYPASS_AUTH === "true" && esHostLocal(new URL(request.url).hostname)) {
    return { ok: true, email: "desarrollo@local", desarrollo: true };
  }

  const dominio = normalizarDominio(env.ACCESS_TEAM_DOMAIN);
  const audiencia = String(env.ACCESS_AUD || "").trim();
  if (!dominio || !audiencia) return { ok: false, motivo: "Cloudflare Access no está configurado" };

  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) return { ok: false, motivo: "Falta la credencial de Access" };

  try {
    const datos = await verificarToken(token, dominio, audiencia, opciones.obtenerClaves || descargarClaves);
    return { ok: true, email: typeof datos.email === "string" ? datos.email : "" };
  } catch (error) {
    return { ok: false, motivo: error instanceof Error ? error.message : "Credencial no válida" };
  }
}
