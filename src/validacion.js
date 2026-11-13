// Validación en el servidor. Nada de lo que llega del navegador se da por bueno.

export const CATEGORIAS = [
  { id: "bolsos", nombre: "Bolsos" },
  { id: "mochilas", nombre: "Mochilas" },
  { id: "maletas", nombre: "Maletas" },
  { id: "complementos", nombre: "Accesorios" }, // la web usa «complementos» como identificador
  { id: "zapatillas", nombre: "Zapatillas" }
];
const IDS_CATEGORIA = new Set(CATEGORIAS.map(item => item.id));

export const LIMITES = {
  titulo: { min: 2, max: 120 },
  descripcion: { max: 1000 },
  marca: { max: 60 },
  color: { max: 60 },
  precioMaximo: 99999.99,
  imagenBytes: 5 * 1024 * 1024,
  imagenesPorProducto: 12,
  cuerpoJsonBytes: 20 * 1024
};

export class ErrorValidacion extends Error {
  constructor(mensaje, estado = 400, campo = null) {
    super(mensaje);
    this.estado = estado;
    this.campo = campo;
  }
}

/**
 * Longitud de un texto en caracteres (puntos de código Unicode), no en unidades UTF-16.
 * Es la misma medida que usa length() en D1 y que usa el panel: un emoji cuenta como 1.
 */
export const largo = texto => [...texto].length;

/** Texto en minúsculas, sin acentos ni símbolos, separado por guiones. */
export function slugificar(texto) {
  return String(texto || "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    .slice(0, 80).replace(/-+$/g, "");
}

function limpiarTexto(valor, campo, etiqueta, { min = 0, max, multilinea = false }) {
  if (typeof valor !== "string") throw new ErrorValidacion(`${etiqueta}: tiene que ser un texto.`, 400, campo);
  // Sin caracteres de control; los saltos de línea solo donde tienen sentido.
  // NFC: «é» escrita como e + acento cuenta como un solo carácter, igual que en el panel.
  let texto = valor.normalize("NFC").replace(multilinea ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, " ");
  texto = multilinea ? texto.replace(/\r\n?/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim() : texto.replace(/\s+/g, " ").trim();
  if (largo(texto) < min) throw new ErrorValidacion(min > 1 ? `${etiqueta}: escribe al menos ${min} letras.` : `${etiqueta}: no puede estar vacío.`, 400, campo);
  if (largo(texto) > max) throw new ErrorValidacion(`${etiqueta}: es demasiado largo (máximo ${max} caracteres).`, 400, campo);
  return texto;
}

function textoOpcional(valor, campo, etiqueta, max) {
  if (valor === null || valor === undefined || valor === "") return null;
  return limpiarTexto(valor, campo, etiqueta, { max }) || null;
}

export const MENSAJE_PRECIO = "Precio: escribe solo el número, sin espacios, por ejemplo 39,90 o 1.234,56.";

/**
 * Convierte un precio escrito a céntimos. Devuelve null si está vacío y NaN si no se entiende.
 * Admite «39», «39,90», «39.90» y «1.234,56» (punto de millares y coma decimal), con «€»
 * opcional al final. No se quitan espacios de en medio: «1 2» no es 12, es un error.
 * La misma función está copiada en public/admin/admin.js (precioEnCentimos): cambiar las dos.
 */
export function precioEnCentimos(valor) {
  const texto = String(valor).trim().replace(/\s?€$/, "");
  if (texto === "") return null;
  let entero;
  let decimales = "";
  let partes = /^(\d{1,5})(?:[.,](\d{1,2}))?$/.exec(texto); // 39 · 39,9 · 39.90
  if (partes) [, entero, decimales = ""] = partes;
  else {
    partes = /^([1-9]\d?)\.(\d{3})(?:,(\d{1,2}))?$/.exec(texto); // 1.234 · 1.234,56
    if (!partes) return NaN;
    entero = partes[1] + partes[2];
    decimales = partes[3] || "";
  }
  return Number(entero) * 100 + Number(decimales.padEnd(2, "0"));
}

function leerPrecio(valor) {
  if (valor === null || valor === undefined || valor === "") return null;
  let centimos;
  if (typeof valor === "number") {
    centimos = Math.round(valor * 100);
    if (!Number.isFinite(valor) || Math.abs(valor * 100 - centimos) > 1e-6) throw new ErrorValidacion(MENSAJE_PRECIO, 400, "precio");
  } else if (typeof valor === "string") {
    centimos = precioEnCentimos(valor);
    if (centimos === null) return null;
    if (Number.isNaN(centimos)) throw new ErrorValidacion(MENSAJE_PRECIO, 400, "precio");
  } else throw new ErrorValidacion(MENSAJE_PRECIO, 400, "precio");
  if (centimos < 0 || centimos > Math.round(LIMITES.precioMaximo * 100)) throw new ErrorValidacion("Precio: tiene que estar entre 0 y 99.999,99 €.", 400, "precio");
  return centimos;
}

function leerBooleano(valor, campo, etiqueta) {
  if (typeof valor !== "boolean") throw new ErrorValidacion(`${etiqueta}: valor no válido.`, 400, campo);
  return valor ? 1 : 0;
}

const CAMPOS = ["titulo", "descripcion", "precio", "categoria", "marca", "color", "visible", "destacado"];

/**
 * Valida los datos de un producto. Con parcial = true solo se exigen los campos enviados.
 * Devuelve un objeto con nombres de columna listos para guardar.
 */
export function validarProducto(entrada, { parcial = false } = {}) {
  if (!entrada || typeof entrada !== "object" || Array.isArray(entrada)) throw new ErrorValidacion("Los datos enviados no son válidos.");
  const desconocidos = Object.keys(entrada).filter(clave => !CAMPOS.includes(clave));
  if (desconocidos.length) throw new ErrorValidacion(`Campo no admitido: ${desconocidos[0].slice(0, 40)}.`);
  const tiene = campo => Object.prototype.hasOwnProperty.call(entrada, campo);
  const datos = {};

  if (tiene("titulo") || !parcial) datos.titulo = limpiarTexto(entrada.titulo ?? "", "titulo", "Nombre del producto", LIMITES.titulo);
  if (tiene("categoria") || !parcial) {
    if (typeof entrada.categoria !== "string" || !IDS_CATEGORIA.has(entrada.categoria)) throw new ErrorValidacion("Elige una categoría de la lista.", 400, "categoria");
    datos.categoria = entrada.categoria;
  }
  if (tiene("descripcion") || !parcial) datos.descripcion = limpiarTexto(entrada.descripcion ?? "", "descripcion", "Descripción", { max: LIMITES.descripcion.max, multilinea: true });
  if (tiene("precio") || !parcial) datos.precio_centimos = leerPrecio(entrada.precio);
  if (tiene("marca") || !parcial) {
    datos.marca = textoOpcional(entrada.marca, "marca", "Marca", LIMITES.marca.max);
    datos.marca_slug = datos.marca ? slugificar(datos.marca) || null : null;
    if (datos.marca && !datos.marca_slug) throw new ErrorValidacion("Marca: usa letras o números.", 400, "marca");
  }
  if (tiene("color") || !parcial) datos.color = textoOpcional(entrada.color, "color", "Color", LIMITES.color.max);
  if (tiene("visible")) datos.visible = leerBooleano(entrada.visible, "visible", "Visible");
  else if (!parcial) datos.visible = 1;
  if (tiene("destacado")) datos.destacado = leerBooleano(entrada.destacado, "destacado", "Destacado");
  else if (!parcial) datos.destacado = 0;

  if (parcial && !Object.keys(datos).length) throw new ErrorValidacion("No hay ningún cambio que guardar.");
  return datos;
}

/** Tipo real del archivo según sus primeros bytes (no se confía en el nombre ni en la cabecera). */
export function detectarImagen(bytes) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { tipo: "image/jpeg", extension: "jpg" };
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a) return { tipo: "image/png", extension: "png" };
  if (bytes.length >= 12 && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return { tipo: "image/webp", extension: "webp" };
  return null;
}

export function validarFiltroCategoria(valor) {
  if (!valor) return null;
  if (!IDS_CATEGORIA.has(valor)) throw new ErrorValidacion("Categoría desconocida.", 400, "categoria");
  return valor;
}

export function validarFiltroMarca(valor) {
  if (!valor) return null;
  if (valor.length > 80 || !/^[a-z0-9-]+$/.test(valor)) throw new ErrorValidacion("Marca no válida.", 400, "marca");
  return valor;
}

export function esIdentificador(valor) {
  return typeof valor === "string" && /^[A-Za-z0-9-]{1,64}$/.test(valor);
}
