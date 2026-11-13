// Pruebas de la validación del servidor (node scripts/probar-validacion.mjs). No usa la red.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { RAIZ } from "./comun.mjs";
import { ErrorValidacion, LIMITES, largo, precioEnCentimos, validarProducto } from "../src/validacion.js";

// El panel lleva una copia de precioEnCentimos: se extrae de admin.js para probar las dos con los mismos casos.
const panel = readFileSync(join(RAIZ, "public", "admin", "admin.js"), "utf8");
const copia = /function precioEnCentimos\(valor\) \{[\s\S]*?\n {2}\}/.exec(panel);
assert.ok(copia, "No encuentro precioEnCentimos en public/admin/admin.js");
const precioDelPanel = new Function(`${copia[0]}; return precioEnCentimos;`)();

const PRECIOS_VALIDOS = {
  "39,90": 3990, "39.90": 3990, "1.234,56": 123456, "39": 3900, "39,9": 3990, "39.9": 3990, "0": 0, "0,5": 50,
  "1.234": 123400, "12.345,6": 1234560, "99.999,99": 9999999, "99999,99": 9999999, "1234,56": 123456,
  "39,90 €": 3990, "39,90€": 3990, " 39,90 ": 3990
};
const PRECIOS_VACIOS = ["", "   "];
const PRECIOS_NO_VALIDOS = [
  "1 2", "1 234,56", "39, 90", "3 9,90", "1,234.56", "1.234.567", "1.23,4", "0.500", "01.234", "39,900", "39,", ",5", ".5",
  "-5", "+5", "1e3", "abc", "39,90 euros", "€ 39", "39,90  €", "123456", "100.000", "1.2.3", "1,2,3", "39.90.1", "٣٩"
];

const base = { titulo: "Bolso de prueba", categoria: "bolsos", descripcion: "", precio: null, marca: null, color: null };
const errorDe = entrada => { try { validarProducto(entrada); return null; } catch (fallo) { assert.ok(fallo instanceof ErrorValidacion); return fallo; } };

const casos = [];
const caso = (nombre, funcion) => casos.push([nombre, funcion]);

caso("precio: formatos admitidos", () => {
  for (const [texto, centimos] of Object.entries(PRECIOS_VALIDOS)) {
    assert.equal(precioEnCentimos(texto), centimos, texto);
    assert.equal(validarProducto({ ...base, precio: texto }).precio_centimos, centimos, texto);
  }
});

caso("precio: vacío significa «Consultar precio»", () => {
  for (const texto of PRECIOS_VACIOS) assert.equal(validarProducto({ ...base, precio: texto }).precio_centimos, null);
  assert.equal(validarProducto({ ...base, precio: null }).precio_centimos, null);
});

caso("precio: todo lo demás se rechaza con un mensaje claro («1 2» no es 12)", () => {
  for (const texto of PRECIOS_NO_VALIDOS) {
    assert.ok(Number.isNaN(precioEnCentimos(texto)), `tenía que rechazarse: ${JSON.stringify(texto)}`);
    const fallo = errorDe({ ...base, precio: texto });
    assert.equal(fallo?.campo, "precio", texto);
    assert.match(fallo.message, /39,90 o 1\.234,56/);
  }
});

caso("precio: números, límites y tipos raros", () => {
  assert.equal(validarProducto({ ...base, precio: 39.9 }).precio_centimos, 3990);
  assert.equal(validarProducto({ ...base, precio: 0 }).precio_centimos, 0);
  for (const valor of [39.999, -1, 100000, Infinity, NaN, true, [], {}]) assert.equal(errorDe({ ...base, precio: valor })?.campo, "precio", String(valor));
});

caso("precio: el panel y el servidor entienden lo mismo", () => {
  for (const texto of [...Object.keys(PRECIOS_VALIDOS), ...PRECIOS_VACIOS, ...PRECIOS_NO_VALIDOS]) {
    assert.ok(Object.is(precioDelPanel(texto), precioEnCentimos(texto)), texto);
  }
});

caso("longitud: se cuenta en caracteres, un emoji es 1 (igual que length() en D1)", () => {
  assert.equal(largo("👜"), 1);
  assert.equal(largo("Bolso 👜"), 7);
  const fallo = errorDe({ ...base, titulo: "👜" });
  assert.equal(fallo?.campo, "titulo"); // antes pasaba la validación y fallaba en D1 con un error genérico
  assert.match(fallo.message, /al menos 2/);
  assert.equal(validarProducto({ ...base, titulo: "👜👜" }).titulo, "👜👜");
});

caso("longitud: los máximos admiten emojis hasta el mismo tope que la base de datos", () => {
  const lleno = "👜".repeat(LIMITES.titulo.max);
  assert.equal(largo(validarProducto({ ...base, titulo: lleno }).titulo), LIMITES.titulo.max);
  assert.equal(errorDe({ ...base, titulo: lleno + "👜" })?.campo, "titulo");
  assert.equal(largo(validarProducto({ ...base, descripcion: "💗".repeat(LIMITES.descripcion.max) }).descripcion), LIMITES.descripcion.max);
  assert.equal(errorDe({ ...base, descripcion: "💗".repeat(LIMITES.descripcion.max + 1) })?.campo, "descripcion");
  assert.equal(errorDe({ ...base, marca: "é".repeat(LIMITES.marca.max + 1) })?.campo, "marca");
  assert.equal(errorDe({ ...base, color: "x".repeat(LIMITES.color.max + 1) })?.campo, "color");
});

caso("longitud: las letras con acento escritas en dos partes cuentan como una", () => {
  const descompuesto = "é".repeat(LIMITES.color.max); // «é» como e + acento
  assert.equal(largo(validarProducto({ ...base, color: descompuesto }).color), LIMITES.color.max);
});

let fallos = 0;
for (const [nombre, funcion] of casos) {
  try { await funcion(); console.log(`  ok  ${nombre}`); }
  catch (error) { fallos += 1; console.log(`FALLO ${nombre}\n      ${error.message}`); }
}
console.log(`\n${casos.length - fallos} de ${casos.length} pruebas correctas`);
process.exit(fallos ? 1 : 0);
