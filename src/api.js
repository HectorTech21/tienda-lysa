// API de Tienda Lysa: lectura pública y gestión del catálogo para el panel.
import {
  LIMITES, ErrorValidacion, slugificar, validarProducto, detectarImagen,
  validarFiltroCategoria, validarFiltroMarca, esIdentificador
} from "./validacion.js";

const PREFIJO_IMAGENES = "productos/";

export function json(datos, estado = 200, cabeceras = {}) {
  return new Response(JSON.stringify(datos), {
    status: estado,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...cabeceras }
  });
}

const error = (mensaje, estado = 400, campo = null) => json(campo ? { error: mensaje, campo } : { error: mensaje }, estado);
const noEncontrado = () => error("Este producto ya no existe. Puede que se haya borrado.", 404);
const metodoNoPermitido = permitidos => json({ error: "Operación no permitida." }, 405, { Allow: permitidos });

function urlImagen(clave) {
  return "/img/" + clave.split("/").map(encodeURIComponent).join("/");
}

function formatearProducto(fila, imagenes, { admin = false } = {}) {
  const producto = {
    id: fila.id,
    referencia: fila.referencia,
    titulo: fila.titulo,
    slug: fila.slug,
    descripcion: fila.descripcion,
    precio: fila.precio_centimos === null ? null : fila.precio_centimos / 100,
    categoria: fila.categoria,
    marca: fila.marca,
    marcaId: fila.marca_slug,
    color: fila.color,
    destacado: fila.destacado === 1,
    imagenes: imagenes.map(imagen => ({ id: imagen.id, url: urlImagen(imagen.clave), alt: imagen.alt || fila.titulo })),
    creadoEn: fila.creado_en,
    actualizadoEn: fila.actualizado_en
  };
  if (admin) producto.visible = fila.visible === 1;
  return producto;
}

async function listarProductos(env, { soloVisibles, categoria = null, marca = null, admin = false }) {
  const condiciones = [];
  const valores = [];
  if (soloVisibles) condiciones.push("visible = 1", "EXISTS (SELECT 1 FROM imagenes WHERE imagenes.producto_id = productos.id)");
  if (categoria) { condiciones.push("categoria = ?"); valores.push(categoria); }
  if (marca) { condiciones.push("marca_slug = ?"); valores.push(marca); }
  const donde = condiciones.length ? `WHERE ${condiciones.join(" AND ")}` : "";
  const [productos, imagenes] = await env.DB.batch([
    env.DB.prepare(`SELECT * FROM productos ${donde} ORDER BY destacado DESC, creado_en DESC, referencia DESC`).bind(...valores),
    env.DB.prepare("SELECT id, producto_id, clave, alt FROM imagenes ORDER BY producto_id, orden, creado_en")
  ]);
  const porProducto = new Map();
  for (const imagen of imagenes.results) {
    if (!porProducto.has(imagen.producto_id)) porProducto.set(imagen.producto_id, []);
    porProducto.get(imagen.producto_id).push(imagen);
  }
  return productos.results.map(fila => formatearProducto(fila, porProducto.get(fila.id) || [], { admin }));
}

async function obtenerProducto(env, id) {
  const fila = await env.DB.prepare("SELECT * FROM productos WHERE id = ?").bind(id).first();
  if (!fila) return null;
  const imagenes = await env.DB.prepare("SELECT id, producto_id, clave, alt FROM imagenes WHERE producto_id = ? ORDER BY orden, creado_en").bind(id).all();
  return formatearProducto(fila, imagenes.results, { admin: true });
}

async function leerJson(request) {
  const tipo = (request.headers.get("Content-Type") || "").split(";")[0].trim().toLowerCase();
  if (tipo !== "application/json") throw new ErrorValidacion("Formato de datos no admitido.", 415);
  const texto = await request.text();
  if (texto.length > LIMITES.cuerpoJsonBytes) throw new ErrorValidacion("Los datos enviados son demasiado grandes.", 413);
  try { return JSON.parse(texto); } catch { throw new ErrorValidacion("Los datos enviados no son válidos."); }
}

function crearSlug(titulo, referencia) {
  return `${slugificar(titulo) || "producto"}-${referencia.toLowerCase()}`;
}

/* ---------- API pública (solo lectura) ---------- */

export async function apiPublica(request, env, url) {
  if (url.pathname === "/api/productos") {
    if (request.method !== "GET" && request.method !== "HEAD") return metodoNoPermitido("GET, HEAD");
    const categoria = validarFiltroCategoria(url.searchParams.get("categoria"));
    const marca = validarFiltroMarca(url.searchParams.get("marca"));
    const productos = await listarProductos(env, { soloVisibles: true, categoria, marca });
    return json({ productos }, 200, { "Cache-Control": "public, max-age=30" });
  }
  return error("Ruta no encontrada.", 404);
}

/** Imágenes de R2. Las claves no se reutilizan, así que pueden guardarse en caché mucho tiempo. */
export async function servirImagen(request, env, url) {
  if (request.method !== "GET" && request.method !== "HEAD") return metodoNoPermitido("GET, HEAD");
  let clave;
  try { clave = decodeURIComponent(url.pathname.slice("/img/".length)); } catch { return new Response("No encontrado", { status: 404 }); }
  if (!clave.startsWith(PREFIJO_IMAGENES) || clave.includes("..") || clave.length > 300) return new Response("No encontrado", { status: 404 });
  const objeto = await env.BUCKET.get(clave);
  if (!objeto) return new Response("No encontrado", { status: 404 });
  const cabeceras = new Headers();
  objeto.writeHttpMetadata(cabeceras);
  if (!cabeceras.has("Content-Type")) cabeceras.set("Content-Type", "application/octet-stream");
  cabeceras.set("ETag", objeto.httpEtag);
  cabeceras.set("Cache-Control", "public, max-age=31536000, immutable");
  if (request.headers.get("If-None-Match") === objeto.httpEtag) return new Response(null, { status: 304, headers: cabeceras });
  return new Response(request.method === "HEAD" ? null : objeto.body, { headers: cabeceras });
}

/* ---------- API del panel (/api/admin/*), siempre detrás de autorizar() ---------- */

export async function apiAdmin(request, env, url, sesion) {
  const metodo = request.method;
  // Los cambios solo se aceptan desde el propio panel, no desde otra web.
  if (metodo !== "GET" && metodo !== "HEAD") {
    const origen = request.headers.get("Origin");
    if (origen) {
      let mismoSitio = false;
      try { mismoSitio = new URL(origen).host === url.host; } catch { /* origen ilegible: se rechaza */ }
      if (!mismoSitio) return error("Petición no permitida desde otro sitio.", 403);
    }
  }
  const partes = url.pathname.slice("/api/admin/".length).split("/").filter(Boolean);
  const [recurso, id, sub, accion] = partes;

  if (recurso === "sesion" && partes.length === 1) {
    return metodo === "GET" ? json({ email: sesion.email, desarrollo: Boolean(sesion.desarrollo) }) : metodoNoPermitido("GET");
  }

  if (recurso === "productos" && partes.length === 1) {
    if (metodo === "GET") return json({ productos: await listarProductos(env, { soloVisibles: false, admin: true }) });
    if (metodo === "POST") return crearProducto(request, env);
    return metodoNoPermitido("GET, POST");
  }

  if (recurso === "productos" && id) {
    if (!esIdentificador(id)) return noEncontrado();
    if (partes.length === 2) {
      if (metodo === "GET") { const producto = await obtenerProducto(env, id); return producto ? json({ producto }) : noEncontrado(); }
      if (metodo === "PATCH") return editarProducto(request, env, id);
      if (metodo === "DELETE") return borrarProducto(env, id);
      return metodoNoPermitido("GET, PATCH, DELETE");
    }
    if (sub === "imagenes" && partes.length === 3) return metodo === "POST" ? subirImagen(request, env, id) : metodoNoPermitido("POST");
    if (sub === "imagenes" && accion === "orden" && partes.length === 4) return metodo === "PUT" ? reordenarImagenes(request, env, id) : metodoNoPermitido("PUT");
  }

  if (recurso === "imagenes" && id && partes.length === 2) {
    if (!esIdentificador(id)) return error("Esta foto ya no existe.", 404);
    return metodo === "DELETE" ? borrarImagen(env, id) : metodoNoPermitido("DELETE");
  }

  return error("Ruta no encontrada.", 404);
}

async function crearProducto(request, env) {
  const datos = validarProducto(await leerJson(request));
  // La referencia sale de un contador que solo sube: nunca se reutiliza.
  const contador = await env.DB.prepare("UPDATE contadores SET valor = valor + 1 WHERE nombre = 'referencia' RETURNING valor").first();
  if (!contador) throw new Error("Falta el contador de referencias");
  const referencia = `LYSA-${String(contador.valor).padStart(3, "0")}`;
  const id = crypto.randomUUID();
  const ahora = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO productos (id, referencia, titulo, slug, descripcion, precio_centimos, categoria, marca, marca_slug, color, visible, destacado, creado_en, actualizado_en)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, referencia, datos.titulo, crearSlug(datos.titulo, referencia), datos.descripcion, datos.precio_centimos, datos.categoria,
    datos.marca, datos.marca_slug, datos.color, datos.visible, datos.destacado, ahora, ahora).run();
  return json({ producto: await obtenerProducto(env, id) }, 201);
}

async function editarProducto(request, env, id) {
  const actual = await env.DB.prepare("SELECT referencia FROM productos WHERE id = ?").bind(id).first();
  if (!actual) return noEncontrado();
  const datos = validarProducto(await leerJson(request), { parcial: true });
  if (datos.titulo !== undefined) datos.slug = crearSlug(datos.titulo, actual.referencia);
  datos.actualizado_en = new Date().toISOString();
  // Los nombres de columna salen de validarProducto, nunca del navegador.
  const columnas = Object.keys(datos);
  await env.DB.prepare(`UPDATE productos SET ${columnas.map(columna => `${columna} = ?`).join(", ")} WHERE id = ?`)
    .bind(...columnas.map(columna => datos[columna]), id).run();
  return json({ producto: await obtenerProducto(env, id) });
}

async function borrarProducto(env, id) {
  const existe = await env.DB.prepare("SELECT id FROM productos WHERE id = ?").bind(id).first();
  if (!existe) return noEncontrado();
  const imagenes = await env.DB.prepare("SELECT clave FROM imagenes WHERE producto_id = ?").bind(id).all();
  await env.DB.batch([
    env.DB.prepare("DELETE FROM imagenes WHERE producto_id = ?").bind(id),
    env.DB.prepare("DELETE FROM productos WHERE id = ?").bind(id)
  ]);
  const claves = imagenes.results.map(imagen => imagen.clave);
  if (claves.length) await env.BUCKET.delete(claves);
  return json({ ok: true });
}

async function subirImagen(request, env, productoId) {
  const producto = await env.DB.prepare("SELECT id, titulo FROM productos WHERE id = ?").bind(productoId).first();
  if (!producto) return noEncontrado();

  const mensajeTamano = `La foto pesa demasiado (máximo ${LIMITES.imagenBytes / 1024 / 1024} MB).`;
  const declarado = Number(request.headers.get("Content-Length"));
  if (Number.isFinite(declarado) && declarado > LIMITES.imagenBytes) return error(mensajeTamano, 413);
  const tipoDeclarado = (request.headers.get("Content-Type") || "").split(";")[0].trim().toLowerCase();
  if (!tipoDeclarado.startsWith("image/")) return error("Solo se pueden subir fotos.", 415);

  const datos = await request.arrayBuffer();
  if (datos.byteLength === 0) return error("La foto está vacía.", 400);
  if (datos.byteLength > LIMITES.imagenBytes) return error(mensajeTamano, 413);
  const formato = detectarImagen(new Uint8Array(datos, 0, Math.min(datos.byteLength, 16)));
  if (!formato) return error("Este archivo no es una foto válida (se admiten JPG, PNG y WebP).", 415);

  const resumen = await env.DB.prepare("SELECT COUNT(*) AS total, COALESCE(MAX(orden), -1) AS ultimo FROM imagenes WHERE producto_id = ?").bind(productoId).first();
  if (resumen.total >= LIMITES.imagenesPorProducto) return error(`Un producto puede tener como máximo ${LIMITES.imagenesPorProducto} fotos.`, 409);

  const id = crypto.randomUUID();
  const clave = `${PREFIJO_IMAGENES}${productoId}/${id}.${formato.extension}`;
  const ahora = new Date().toISOString();
  await env.BUCKET.put(clave, datos, { httpMetadata: { contentType: formato.tipo } });
  try {
    await env.DB.batch([
      env.DB.prepare("INSERT INTO imagenes (id, producto_id, clave, alt, orden, bytes, creado_en) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .bind(id, productoId, clave, producto.titulo, resumen.ultimo + 1, datos.byteLength, ahora),
      env.DB.prepare("UPDATE productos SET actualizado_en = ? WHERE id = ?").bind(ahora, productoId)
    ]);
  } catch (fallo) {
    await env.BUCKET.delete(clave); // no dejar archivos huérfanos
    throw fallo;
  }
  return json({ imagen: { id, url: urlImagen(clave), alt: producto.titulo } }, 201);
}

async function reordenarImagenes(request, env, productoId) {
  const cuerpo = await leerJson(request);
  const orden = cuerpo && cuerpo.orden;
  if (!Array.isArray(orden) || orden.length > LIMITES.imagenesPorProducto || !orden.every(esIdentificador) || new Set(orden).size !== orden.length) {
    return error("El orden de las fotos no es válido.");
  }
  const actuales = await env.DB.prepare("SELECT id FROM imagenes WHERE producto_id = ?").bind(productoId).all();
  const ids = new Set(actuales.results.map(imagen => imagen.id));
  if (ids.size !== orden.length || !orden.every(id => ids.has(id))) return error("Las fotos han cambiado. Recarga la página e inténtalo de nuevo.", 409);
  if (orden.length) {
    const ahora = new Date().toISOString();
    await env.DB.batch([
      ...orden.map((id, posicion) => env.DB.prepare("UPDATE imagenes SET orden = ? WHERE id = ? AND producto_id = ?").bind(posicion, id, productoId)),
      env.DB.prepare("UPDATE productos SET actualizado_en = ? WHERE id = ?").bind(ahora, productoId)
    ]);
  }
  return json({ producto: await obtenerProducto(env, productoId) });
}

async function borrarImagen(env, id) {
  const imagen = await env.DB.prepare("SELECT clave, producto_id FROM imagenes WHERE id = ?").bind(id).first();
  if (!imagen) return error("Esta foto ya no existe.", 404);
  await env.DB.batch([
    env.DB.prepare("DELETE FROM imagenes WHERE id = ?").bind(id),
    env.DB.prepare("UPDATE productos SET actualizado_en = ? WHERE id = ?").bind(new Date().toISOString(), imagen.producto_id)
  ]);
  await env.BUCKET.delete(imagen.clave);
  return json({ ok: true });
}

export { ErrorValidacion };
