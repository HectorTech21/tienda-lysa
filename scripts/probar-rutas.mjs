// Pruebas de las rutas privadas (node scripts/probar-rutas.mjs). No usa la red ni wrangler:
// llama al Worker con un ASSETS falso y comprueba que ninguna forma de escribir /admin o
// /api/admin llega a los archivos ni a la API sin una sesión válida.
import assert from "node:assert/strict";
import worker, { normalizarRuta, rutaPrivada } from "../src/index.js";

const ORIGEN = "https://tienda-lysa.com";
console.warn = () => {}; // el Worker avisa de cada acceso denegado; aquí sobra

function entorno(extra = {}) {
  const servidos = [];
  return {
    servidos,
    env: {
      ASSETS: { fetch: async request => { servidos.push(new URL(request.url).pathname); return new Response("archivo"); } },
      DB: { prepare() { throw new Error("La base de datos no debería usarse sin sesión"); }, batch() { throw new Error("La base de datos no debería usarse sin sesión"); } },
      BUCKET: {},
      ...extra
    }
  };
}

/** Pide la ruta tal cual (sin que URL la «arregle» más de lo que haría un navegador) y sigue las redirecciones. */
async function pedir(ruta, env, { metodo = "GET" } = {}) {
  const pasos = [];
  let url = ORIGEN + ruta;
  for (let salto = 0; salto < 5; salto++) {
    const respuesta = await worker.fetch(new Request(url, { method: metodo, redirect: "manual" }), env);
    pasos.push({ url, estado: respuesta.status, destino: respuesta.headers.get("Location"), robots: respuesta.headers.get("X-Robots-Tag") });
    if (respuesta.status < 300 || respuesta.status >= 400) return { pasos, respuesta };
    url = new URL(respuesta.headers.get("Location"), url).toString();
  }
  throw new Error("Demasiadas redirecciones: " + ruta);
}

// Variantes que, normalizadas, son el panel o su API.
const VARIANTES_PANEL = [
  "/admin", "/admin/", "/admin/index.html", "/admin/admin.js", "/admin/admin.css",
  "//admin", "//admin/", "///admin//admin.js", "/admin//admin.js",
  "/ADMIN", "/Admin/", "/aDmIn/admin.js", "/ADMIN/INDEX.HTML",
  "/%61dmin", "/%61dmin/", "/%41DMIN/admin.js", "/a%64min/admin.js", "/%2561dmin/", "/%252561dmin/admin.js",
  "/admin/./", "/admin/./admin.js", "/./admin/", "/x/../admin/", "/admin/x/../admin.js",
  "/admin/%2e/admin.js", "/%2e/admin/", "/x/%2e%2e/admin/", "/x/..%2fadmin/admin.js", "/x%2f..%2fadmin%2fadmin.js",
  "/%2fadmin", "/%2Fadmin/admin.js", "/admin%2Fadmin.js", "/admin%2f", "/%5cadmin/", "/\\admin/admin.js", "/admin\\admin.js",
  "/assets/../admin/admin.js", "/assets/..%2fadmin/admin.js", "/assets/%2e%2e/admin/", "/assets/..%5cadmin/admin.js"
];
const VARIANTES_API = [
  "/api/admin", "/api/admin/", "/api/admin/productos", "/api/admin/sesion",
  "/api//admin", "/api//admin/productos", "//api/admin/productos", "/api/admin//productos",
  "/API/ADMIN/productos", "/Api/Admin/Productos", "/api/ADMIN/sesion",
  "/api/%61dmin/productos", "/%61pi/admin/productos", "/api%2fadmin/productos", "/api/%2561dmin/productos",
  "/api/./admin/productos", "/api/x/../admin/productos", "/api/x/..%2fadmin/productos", "/api\\admin/productos",
  "/assets/../api/admin/productos", "/assets/..%2fapi%2fadmin/productos"
];

const casos = [];
const caso = (nombre, funcion) => casos.push([nombre, funcion]);

caso("normalizarRuta: decodifica, une barras y resuelve puntos", () => {
  assert.equal(normalizarRuta("//admin"), "/admin");
  assert.equal(normalizarRuta("/%61dmin/"), "/admin/");
  assert.equal(normalizarRuta("/%2561dmin"), "/admin");
  assert.equal(normalizarRuta("/admin/./x/../admin.js"), "/admin/admin.js");
  assert.equal(normalizarRuta("/api//admin\\productos"), "/api/admin/productos");
  assert.equal(normalizarRuta("/"), "/");
  assert.equal(normalizarRuta("/styles.css"), "/styles.css");
  assert.equal(normalizarRuta("/%E0%A4%A"), null); // codificación rota
  assert.equal(normalizarRuta("/%25252525252561dmin"), null); // codificada demasiadas veces
});

caso("rutaPrivada: reconoce el panel y la API sin distinguir mayúsculas, y nada más", () => {
  assert.deepEqual(rutaPrivada("/ADMIN/admin.js"), { zona: "/admin", canonica: "/admin/admin.js" });
  assert.deepEqual(rutaPrivada("/Api/Admin/productos/AbC"), { zona: "/api/admin", canonica: "/api/admin/productos/AbC" });
  for (const publica of ["/", "/administracion", "/admin.html", "/adminx/", "/api/productos", "/api/administrar", "/img/productos/a.webp", "/aviso-legal"]) {
    assert.equal(rutaPrivada(publica), null, publica);
  }
});

for (const ruta of VARIANTES_PANEL) {
  caso(`sin sesión, ${ruta} no sirve ningún archivo`, async () => {
    const { env, servidos } = entorno();
    const { pasos, respuesta } = await pedir(ruta, env);
    assert.equal(respuesta.status, 401, JSON.stringify(pasos));
    assert.deepEqual(servidos, [], "se ha servido un archivo sin sesión");
    assert.ok(pasos.every(paso => paso.robots === "noindex, nofollow"), "falta noindex");
    // Si la forma no era la canónica, tiene que haber pasado por una redirección a /admin…
    const final = new URL(pasos.at(-1).url).pathname;
    assert.ok(final === "/admin" || final.startsWith("/admin/"), `forma final no canónica: ${final}`);
    assert.equal(final, normalizarRuta(final));
  });
}

for (const ruta of VARIANTES_API) {
  for (const metodo of ["GET", "POST", "DELETE"]) {
    caso(`sin sesión, ${metodo} ${ruta} responde 401 sin tocar los datos`, async () => {
      const { env, servidos } = entorno();
      const { pasos, respuesta } = await pedir(ruta, env, { metodo });
      assert.equal(respuesta.status, 401, JSON.stringify(pasos));
      assert.deepEqual(servidos, []);
      assert.ok(pasos.filter(paso => paso.estado >= 300 && paso.estado < 400).every(paso => paso.estado === 308), "la redirección tiene que conservar el método (308)");
      const final = new URL(pasos.at(-1).url).pathname;
      assert.ok(final === "/api/admin" || final.startsWith("/api/admin/"), `forma final no canónica: ${final}`);
    });
  }
}

caso("la forma canónica no se redirige; las demás, sí, con una sola redirección", async () => {
  const { env } = entorno();
  assert.equal((await pedir("/admin/", env)).pasos.length, 1);
  assert.equal((await pedir("/api/admin/productos", env)).pasos.length, 1);
  for (const ruta of ["//admin/", "/ADMIN/", "/%61dmin/", "/api//admin/productos"]) {
    const { pasos } = await pedir(ruta, env);
    assert.equal(pasos.length, 2, ruta);
    assert.equal(pasos[0].estado, 308, ruta);
  }
});

caso("la redirección conserva los parámetros y no sale del sitio", async () => {
  const { env } = entorno();
  const { pasos } = await pedir("//ADMIN/?a=1&b=//otro.example", env);
  assert.equal(pasos[0].destino, "/admin/?a=1&b=//otro.example");
  const doble = await pedir("//admin//otro.example/", env);
  assert.ok(doble.pasos[0].destino.startsWith("/admin/"), doble.pasos[0].destino);
});

caso("con el salto de desarrollo en local, solo la forma canónica llega a los archivos", async () => {
  const { env, servidos } = entorno({ DEV_BYPASS_AUTH: "true" });
  const local = async ruta => worker.fetch(new Request("http://localhost:8787" + ruta, { redirect: "manual" }), env);
  assert.equal((await local("/ADMIN/admin.js")).status, 308);
  assert.equal((await local("//admin/admin.js")).status, 308);
  assert.deepEqual(servidos, []);
  const respuesta = await local("/admin/admin.js");
  assert.equal(respuesta.status, 200);
  assert.equal(respuesta.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(servidos, ["/admin/admin.js"]);
});

caso("las rutas públicas siguen llegando a los archivos", async () => {
  const { env, servidos } = entorno();
  for (const ruta of ["/", "/styles.css", "/aviso-legal", "/administracion", "/admin.html"]) {
    assert.equal((await pedir(ruta, env)).respuesta.status, 200, ruta);
  }
  assert.equal(servidos.length, 5);
});

caso("una ruta que no se puede decodificar no llega a los archivos", async () => {
  const { env, servidos } = entorno();
  assert.equal((await pedir("/%E0%A4%A", env)).respuesta.status, 400);
  assert.deepEqual(servidos, []);
});

let fallos = 0;
for (const [nombre, funcion] of casos) {
  try { await funcion(); console.log(`  ok  ${nombre}`); }
  catch (error) { fallos += 1; console.log(`FALLO ${nombre}\n      ${error.message}`); }
}
console.log(`\n${casos.length - fallos} de ${casos.length} pruebas correctas`);
process.exit(fallos ? 1 : 0);
