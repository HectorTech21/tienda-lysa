// Worker de Tienda Lysa.
// Recibe TODAS las peticiones (run_worker_first: true en wrangler.jsonc): así
// ninguna forma rara de escribir /admin puede llegar a los archivos sin pasar por aquí.
import { autorizar } from "./auth.js";
import { apiPublica, apiAdmin, servirImagen, json, ErrorValidacion } from "./api.js";

// Mismas cabeceras que public/_headers aplica a los archivos estáticos.
const CABECERAS_SEGURIDAD = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()"
};

const PAGINA_401 = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Acceso restringido · Tienda Lysa</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#FAF6F1;color:#4B2A21;font:16px/1.5 "Segoe UI",Arial,sans-serif;text-align:center;padding:24px}h1{font:400 28px Georgia,serif;margin:0 0 12px}a{color:inherit}</style></head><body><main><h1>Acceso restringido</h1><p>Esta zona es solo para la gestión de la tienda.</p><p><a href="/">Volver a Tienda Lysa</a></p></main></body></html>`;

const ZONAS_PRIVADAS = ["/api/admin", "/admin"];

/**
 * Deja la ruta en su forma más simple para decidir a qué zona pertenece: decodifica %xx
 * (también si viene codificado varias veces), trata \ como /, une barras repetidas y
 * resuelve «.» y «..». Devuelve null si la ruta no se puede decodificar.
 */
export function normalizarRuta(pathname) {
  let ruta = pathname;
  for (let vuelta = 0; ; vuelta++) {
    let decodificada;
    try { decodificada = decodeURIComponent(ruta); } catch { return null; }
    if (decodificada === ruta) break;
    if (vuelta >= 3) return null; // codificada demasiadas veces: no es una petición legítima
    ruta = decodificada;
  }
  ruta = ruta.replace(/\\/g, "/");
  const partes = [];
  for (const parte of ruta.split("/")) {
    if (parte === "" || parte === ".") continue;
    if (parte === "..") partes.pop();
    else partes.push(parte);
  }
  return "/" + partes.join("/") + (partes.length && ruta.endsWith("/") ? "/" : "");
}

/**
 * Si la ruta, una vez normalizada y sin distinguir mayúsculas, cae en el panel o en su API,
 * devuelve la zona y la forma canónica de la ruta. En otro caso, null.
 */
export function rutaPrivada(normalizada) {
  const minusculas = normalizada.toLowerCase();
  for (const zona of ZONAS_PRIVADAS) {
    if (minusculas === zona || minusculas.startsWith(zona + "/")) {
      return { zona, canonica: zona + normalizada.slice(zona.length) };
    }
  }
  return null;
}

async function encaminar(request, env, url, privada) {
  // Un solo dominio: www.tienda-lysa.com pasa a tienda-lysa.com conservando ruta y parámetros.
  if (url.hostname.startsWith("www.")) {
    const destino = new URL(url);
    destino.hostname = destino.hostname.slice(4);
    destino.protocol = "https:";
    return Response.redirect(destino.toString(), 301);
  }

  if (privada) {
    // Cualquier otra forma de escribir la ruta (//admin, /ADMIN, /%61dmin…) se lleva a la
    // canónica, que es la única que continúa. 308 conserva el método y el cuerpo.
    if (url.pathname !== privada.canonica) {
      return new Response(null, { status: 308, headers: { Location: privada.canonica + url.search, "Cache-Control": "no-store" } });
    }
    const esApi = privada.zona === "/api/admin";
    // Por defecto se bloquea: solo se continúa con una autorización explícita.
    const sesion = await autorizar(request, env);
    if (sesion.ok !== true) {
      console.warn("Acceso al panel denegado:", sesion.motivo);
      if (esApi) return json({ error: "Tu sesión ha caducado. Vuelve a entrar para guardar." }, 401);
      return new Response(PAGINA_401, { status: 401, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
    }
    if (esApi) return apiAdmin(request, env, url, sesion);
    const respuesta = await env.ASSETS.fetch(request);
    const protegida = new Response(respuesta.body, respuesta);
    protegida.headers.set("Cache-Control", "no-store");
    return protegida;
  }

  const ruta = url.pathname;
  if (ruta.startsWith("/img/")) return servirImagen(request, env, url);
  if (ruta.startsWith("/api/")) return apiPublica(request, env, url);
  return env.ASSETS.fetch(request);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const normalizada = normalizarRuta(url.pathname);
    const privada = normalizada === null ? null : rutaPrivada(normalizada);
    let respuesta;
    try {
      // Una ruta que no se puede decodificar no llega nunca a los archivos.
      respuesta = normalizada === null ? json({ error: "Dirección no válida." }, 400) : await encaminar(request, env, url, privada);
    } catch (fallo) {
      if (fallo instanceof ErrorValidacion) {
        respuesta = json(fallo.campo ? { error: fallo.message, campo: fallo.campo } : { error: fallo.message }, fallo.estado);
      } else {
        console.error("Error no controlado:", fallo);
        respuesta = json({ error: "Ha ocurrido un error inesperado. Inténtalo de nuevo en un momento." }, 500);
      }
    }
    const final = new Response(respuesta.body, respuesta);
    for (const [nombre, valor] of Object.entries(CABECERAS_SEGURIDAD)) final.headers.set(nombre, valor);
    // La API y el panel nunca se indexan, tampoco sus errores, redirecciones ni el 401. Las fotos de /img/ sí.
    if (privada || normalizada === null || /^\/api(\/|$)/i.test(normalizada)) final.headers.set("X-Robots-Tag", "noindex, nofollow");
    return final;
  }
};
