// Pruebas de la API del panel contra el servidor LOCAL (node scripts/probar-panel.mjs).
// Necesita "npx wrangler dev" en marcha con DEV_BYPASS_AUTH=true en .dev.vars.
// Crea un producto de prueba, lo cambia y lo borra al terminar. Solo funciona en localhost.
//
//   node scripts/probar-panel.mjs [http://localhost:8787]
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { RAIZ } from "./comun.mjs";

const BASE = (process.argv[2] || "http://localhost:8787").replace(/\/+$/, "");
if (!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(BASE)) throw new Error("Estas pruebas solo se ejecutan contra el servidor local.");

const FOTO = readFileSync(join(RAIZ, "public", "assets", "photos", "bag-480.webp"));
const CABECERAS = { Origin: BASE, "X-Requested-With": "XMLHttpRequest" };

async function api(ruta, { metodo = "GET", datos, cuerpo, cabeceras = {} } = {}) {
  const respuesta = await fetch(`${BASE}/api/admin/${ruta}`, {
    method: metodo,
    headers: { ...CABECERAS, ...(datos === undefined ? {} : { "Content-Type": "application/json" }), ...cabeceras },
    body: datos === undefined ? cuerpo : JSON.stringify(datos)
  });
  let json = null;
  try { json = await respuesta.json(); } catch { /* sin JSON */ }
  return { estado: respuesta.status, json };
}

async function subir(cabeceras = {}) {
  const r = await api("imagenes", { metodo: "POST", cuerpo: FOTO, cabeceras: { "Content-Type": "image/webp", ...cabeceras } });
  assert.equal(r.estado, 201, JSON.stringify(r.json));
  return r.json.imagen;
}

async function enTienda(id) {
  const { productos } = await (await fetch(`${BASE}/api/productos`)).json();
  return productos.find(producto => producto.id === id) || null;
}
const estadoDe = async url => (await fetch(BASE + url)).status;
const idsDe = producto => producto.imagenes.map(imagen => imagen.id);
const DATOS = { titulo: "Prueba automática del panel", categoria: "bolsos", descripcion: "", precio: "39,90", marca: null, color: null, visible: true, destacado: false };

const casos = [];
const caso = (nombre, funcion) => casos.push([nombre, funcion]);
let producto = null;

caso("una foto subida no cambia nada en la tienda hasta que se guarda", async () => {
  const antes = (await (await fetch(`${BASE}/api/productos`)).json()).productos.length;
  const foto = await subir();
  assert.equal(await estadoDe(foto.url), 200);
  assert.equal((await (await fetch(`${BASE}/api/productos`)).json()).productos.length, antes);
});

caso("crear: producto y fotos se guardan de una vez", async () => {
  const foto = await subir();
  const r = await api("productos", { metodo: "POST", datos: { ...DATOS, imagenes: [foto.id] } });
  assert.equal(r.estado, 201, JSON.stringify(r.json));
  producto = r.json.producto;
  assert.match(producto.referencia, /^LYSA-\d{3,}$/);
  assert.equal(producto.slug, `prueba-automatica-del-panel-${producto.referencia.toLowerCase()}`);
  assert.deepEqual(idsDe(producto), [foto.id]);
  assert.deepEqual(idsDe(await enTienda(producto.id)), [foto.id]);
});

caso("crear con una foto que no existe: no se crea nada y la referencia no avanza", async () => {
  const fallida = await api("productos", { metodo: "POST", datos: { ...DATOS, titulo: "No debe existir", imagenes: ["00000000-0000-4000-8000-000000000000"] } });
  assert.equal(fallida.estado, 409);
  const foto = await subir();
  const siguiente = await api("productos", { metodo: "POST", datos: { ...DATOS, titulo: "Prueba de referencia", imagenes: [foto.id] } });
  assert.equal(siguiente.estado, 201);
  const numero = referencia => Number(referencia.replace(/\D/g, ""));
  assert.equal(numero(siguiente.json.producto.referencia), numero(producto.referencia) + 1);
  assert.equal((await api(`productos/${siguiente.json.producto.id}`, { metodo: "DELETE" })).estado, 200);
});

caso("hasta 12 fotos; la número 13 se rechaza sin tocar el producto", async () => {
  const nuevas = [];
  for (let i = 0; i < 11; i++) nuevas.push((await subir()).id);
  const lista = [...idsDe(producto), ...nuevas];
  const r = await api(`productos/${producto.id}`, { metodo: "PATCH", datos: { imagenes: lista } });
  assert.equal(r.estado, 200, JSON.stringify(r.json));
  producto = r.json.producto;
  assert.deepEqual(idsDe(producto), lista);
  const extra = await subir();
  const demasiadas = await api(`productos/${producto.id}`, { metodo: "PATCH", datos: { imagenes: [...lista, extra.id] } });
  assert.equal(demasiadas.estado, 400);
  assert.deepEqual(idsDe(await enTienda(producto.id)), lista);
});

caso("fallo a mitad (subida que no llega): el producto sigue visible con sus 12 fotos", async () => {
  const antes = idsDe(producto);
  // La foto nueva nunca llegó al servidor: el guardado con su identificador falla entero.
  const r = await api(`productos/${producto.id}`, { metodo: "PATCH", datos: { titulo: "Título que no debe guardarse", imagenes: ["11111111-1111-4111-8111-111111111111", ...antes.slice(1)] } });
  assert.equal(r.estado, 409, JSON.stringify(r.json));
  assert.equal(r.json.campo, "fotos");
  const tienda = await enTienda(producto.id);
  assert.deepEqual(idsDe(tienda), antes);
  assert.equal(tienda.titulo, DATOS.titulo);
  for (const imagen of tienda.imagenes) assert.equal(await estadoDe(imagen.url), 200);
});

caso("datos no válidos con fotos válidas: tampoco se cambia ninguna foto", async () => {
  const antes = idsDe(producto);
  const nueva = await subir();
  const r = await api(`productos/${producto.id}`, { metodo: "PATCH", datos: { titulo: "", imagenes: [nueva.id, ...antes.slice(1)] } });
  assert.equal(r.estado, 400);
  assert.deepEqual(idsDe(await enTienda(producto.id)), antes);
});

caso("sustituir una foto con el producto lleno (12): entra la nueva y solo entonces se borra la antigua", async () => {
  const antes = producto.imagenes;
  const nueva = await subir();
  const lista = [nueva.id, ...antes.slice(1).map(imagen => imagen.id)];
  const r = await api(`productos/${producto.id}`, { metodo: "PATCH", datos: { ...DATOS, color: "Rosa", imagenes: lista } });
  assert.equal(r.estado, 200, JSON.stringify(r.json));
  producto = r.json.producto;
  assert.deepEqual(idsDe(producto), lista);
  assert.equal(producto.color, "Rosa");
  assert.equal(await estadoDe(antes[0].url), 404, "la foto antigua tenía que borrarse de R2");
  assert.equal(await estadoDe(nueva.url), 200);
});

caso("reordenar sin subir nada", async () => {
  const lista = idsDe(producto).reverse();
  const r = await api(`productos/${producto.id}`, { metodo: "PATCH", datos: { imagenes: lista } });
  assert.equal(r.estado, 200);
  producto = r.json.producto;
  assert.deepEqual(idsDe(producto), lista);
  assert.deepEqual(idsDe(await enTienda(producto.id)), lista);
});

caso("una foto de un producto no se puede usar en otro", async () => {
  const r = await api("productos", { metodo: "POST", datos: { ...DATOS, titulo: "No debe existir", imagenes: [producto.imagenes[0].id] } });
  assert.equal(r.estado, 409);
});

caso("cambiar solo la visibilidad no toca las fotos", async () => {
  const r = await api(`productos/${producto.id}`, { metodo: "PATCH", datos: { visible: false } });
  assert.equal(r.estado, 200);
  assert.equal(r.json.producto.imagenes.length, 12);
  assert.equal(await enTienda(producto.id), null);
});

caso("subida repetida con el mismo identificador de operación: devuelve la misma foto", async () => {
  const operacion = crypto.randomUUID();
  const primera = await subir({ "X-Operacion": operacion });
  const repetida = await api("imagenes", { metodo: "POST", cuerpo: FOTO, cabeceras: { "Content-Type": "image/webp", "X-Operacion": operacion } });
  assert.equal(repetida.estado, 200);
  assert.equal(repetida.json.imagen.id, primera.id);
  assert.notEqual((await subir({ "X-Operacion": crypto.randomUUID() })).id, primera.id);
});

caso("alta repetida con el mismo identificador de operación: no crea otro producto", async () => {
  const operacion = crypto.randomUUID();
  const foto = await subir();
  const alta = () => api("productos", { metodo: "POST", datos: { ...DATOS, titulo: "Prueba de reintento", imagenes: [foto.id] }, cabeceras: { "X-Operacion": operacion } });
  const primera = await alta();
  assert.equal(primera.estado, 201, JSON.stringify(primera.json));
  // Reintento, y además dos a la vez (doble pulsación).
  const [segunda, tercera] = await Promise.all([alta(), alta()]);
  for (const repetida of [segunda, tercera]) {
    assert.equal(repetida.estado, 200, JSON.stringify(repetida.json));
    assert.equal(repetida.json.producto.id, primera.json.producto.id);
    assert.equal(repetida.json.producto.referencia, primera.json.producto.referencia);
  }
  const { productos } = (await api("productos")).json;
  assert.equal(productos.filter(item => item.titulo === "Prueba de reintento").length, 1);
  assert.equal((await api(`productos/${primera.json.producto.id}`, { metodo: "DELETE" })).estado, 200);
});

caso("dos altas simultáneas de la misma operación: un solo producto", async () => {
  const operacion = crypto.randomUUID();
  const foto = await subir();
  const alta = () => api("productos", { metodo: "POST", datos: { ...DATOS, titulo: "Prueba simultánea", imagenes: [foto.id] }, cabeceras: { "X-Operacion": operacion } });
  const respuestas = await Promise.all([alta(), alta(), alta()]);
  assert.ok(respuestas.every(r => r.estado === 200 || r.estado === 201), JSON.stringify(respuestas.map(r => [r.estado, r.json?.error])));
  assert.equal(new Set(respuestas.map(r => r.json.producto.id)).size, 1);
  assert.equal((await api(`productos/${respuestas[0].json.producto.id}`, { metodo: "DELETE" })).estado, 200);
});

caso("identificador de operación mal formado: se rechaza", async () => {
  const r = await api("imagenes", { metodo: "POST", cuerpo: FOTO, cabeceras: { "Content-Type": "image/webp", "X-Operacion": "no válido!" } });
  assert.equal(r.estado, 400);
});

caso("Origin: las escrituras exigen la cabecera y que coincida entera", async () => {
  const puerto = new URL(BASE).port;
  const cuerpo = JSON.stringify({ visible: false });
  const probar = async origen => (await fetch(`${BASE}/api/admin/productos/${producto.id}`, {
    method: "PATCH", body: cuerpo, headers: { "Content-Type": "application/json", ...(origen === null ? {} : { Origin: origen }) }
  })).status;
  assert.equal(await probar(null), 403, "sin Origin");
  assert.equal(await probar("https://otra-web.example"), 403);
  assert.equal(await probar("null"), 403);
  // Esquema y puerto distintos se prueban en probar-rutas.mjs: aquí "wrangler dev" reescribe
  // la cabecera Origin de localhost antes de que llegue al Worker.
  assert.equal(await probar(BASE), 200);
  // Las lecturas no la necesitan.
  assert.equal((await fetch(`${BASE}/api/admin/productos/${producto.id}`)).status, 200);
});

caso("precio y nombre con emoji: errores claros, nunca un error genérico", async () => {
  const guardar = datos => api(`productos/${producto.id}`, { metodo: "PATCH", datos });
  const espacios = await guardar({ precio: "1 2" });
  assert.equal(espacios.estado, 400);
  assert.equal(espacios.json.campo, "precio");
  const miles = await guardar({ precio: "1.234,56" });
  assert.equal(miles.estado, 200, JSON.stringify(miles.json));
  assert.equal(miles.json.producto.precio, 1234.56);
  const corto = await guardar({ titulo: "👜" });
  assert.equal(corto.estado, 400, JSON.stringify(corto.json));
  assert.equal(corto.json.campo, "titulo");
  const emojis = await guardar({ titulo: "👜".repeat(120), descripcion: "💗".repeat(1000) });
  assert.equal(emojis.estado, 200, JSON.stringify(emojis.json));
  assert.equal([...emojis.json.producto.titulo].length, 120);
  const largo = await guardar({ titulo: "👜".repeat(121) });
  assert.equal(largo.estado, 400);
  assert.equal(largo.json.campo, "titulo");
});

caso("borrar: desaparecen el producto y sus fotos", async () => {
  const fotos = producto.imagenes;
  assert.equal((await api(`productos/${producto.id}`, { metodo: "DELETE" })).estado, 200);
  assert.equal((await api(`productos/${producto.id}`)).estado, 404);
  assert.equal(await estadoDe(fotos[0].url), 404);
  producto = null;
});

let fallos = 0;
try {
  for (const [nombre, funcion] of casos) {
    try { await funcion(); console.log(`  ok  ${nombre}`); }
    catch (error) { fallos += 1; console.log(`FALLO ${nombre}\n      ${error.message}`); }
  }
} finally {
  // Pase lo que pase, no se deja el producto de prueba en la base de datos local.
  if (producto) await api(`productos/${producto.id}`, { metodo: "DELETE" });
}
console.log(`\n${casos.length - fallos} de ${casos.length} pruebas correctas`);
process.exit(fallos ? 1 : 0);
