// Worker de Tienda Lysa.
// Solo llegan aquí /api/*, /admin, /admin/* e /img/* (ver run_worker_first en wrangler.jsonc);
// el resto de la web pública se sirve directamente desde public/.
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

async function encaminar(request, env) {
  const url = new URL(request.url);
  const ruta = url.pathname;

  if (ruta.startsWith("/img/")) return servirImagen(request, env, url);

  const esApiAdmin = ruta === "/api/admin" || ruta.startsWith("/api/admin/");
  const esPanel = ruta === "/admin" || ruta.startsWith("/admin/");
  if (esApiAdmin || esPanel) {
    // Por defecto se bloquea: solo se continúa con una autorización explícita.
    const sesion = await autorizar(request, env);
    if (sesion.ok !== true) {
      console.warn("Acceso al panel denegado:", sesion.motivo);
      if (esApiAdmin) return json({ error: "No tienes permiso para hacer esto. Vuelve a entrar en el panel." }, 401);
      return new Response(PAGINA_401, { status: 401, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
    }
    if (esApiAdmin) return apiAdmin(request, env, url, sesion);
    const respuesta = await env.ASSETS.fetch(request);
    const privada = new Response(respuesta.body, respuesta);
    privada.headers.set("Cache-Control", "no-store");
    privada.headers.set("X-Robots-Tag", "noindex, nofollow");
    return privada;
  }

  if (ruta.startsWith("/api/")) return apiPublica(request, env, url);
  return env.ASSETS.fetch(request);
}

export default {
  async fetch(request, env) {
    let respuesta;
    try {
      respuesta = await encaminar(request, env);
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
    return final;
  }
};
