// Genera REVISION_PENDIENTE.html: los registros «review» del catálogo original, con su
// foto y el motivo, para repasarlos con la dueña. No se publican ni se migran.
//
//   node scripts/lista-revision.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { RAIZ } from "./comun.mjs";

const codigo = readFileSync(join(RAIZ, "datos", "catalogo-original.js"), "utf8");
const { CATALOG_PRODUCTS } = new Function(`${codigo}; return { CATALOG_PRODUCTS };`)();
const porId = new Map(CATALOG_PRODUCTS.map(producto => [producto.id, producto]));
const pendientes = CATALOG_PRODUCTS.filter(producto => producto.recordType === "review");
const html = texto => String(texto ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const ruta = src => "public/" + src.split("/").map(encodeURIComponent).join("/");

const filas = pendientes.map(registro => {
  const publicadas = (registro.publishedItems || []).map(item => {
    const id = typeof item === "string" ? item : item.id || item.productId;
    const ficha = porId.get(id) || CATALOG_PRODUCTS.find(producto => producto.reference === id);
    return ficha ? `${ficha.reference} · ${ficha.name}` : String(typeof item === "string" ? item : JSON.stringify(item));
  });
  return `<article>
  <a href="${ruta(registro.images[0].src)}"><img src="${ruta(registro.images[0].src)}" alt="" loading="lazy"></a>
  <div>
    <h2>${html(registro.reference || registro.id)} · ${html(registro.name.replace(/^Fotografía por revisar: /, ""))}</h2>
    <p><strong>Por qué está en revisión:</strong> ${html(registro.evidence)}</p>
    <p><strong>Qué se ve:</strong> ${html(registro.description)}</p>
    ${publicadas.length
      ? `<p><strong>Ya publicados a partir de esta foto (${publicadas.length}):</strong></p><ul>${publicadas.map(texto => `<li>${html(texto)}</li>`).join("")}</ul>`
      : `<p class="nada"><strong>De esta foto no se ha publicado ningún producto.</strong></p>`}
    <p class="decision">Decisión: ☐ No hace falta nada más &nbsp; ☐ Falta algún producto: subirlo desde el panel con una foto nueva</p>
  </div>
</article>`;
});

const sinPublicar = pendientes.filter(registro => !(registro.publishedItems || []).length).length;
const documento = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Fotos en revisión · Tienda Lysa</title>
<style>
body{margin:0 auto;max-width:900px;padding:24px 16px;background:#FAF6F1;color:#4B2A21;font:16px/1.5 "Segoe UI",Arial,sans-serif}
h1{font:400 30px Georgia,serif;margin:0 0 8px}h2{font:400 21px Georgia,serif;margin:0 0 8px}
article{display:grid;grid-template-columns:200px 1fr;gap:20px;padding:20px 0;border-top:1px solid #DCCFC6;break-inside:avoid}
img{width:200px;height:auto;display:block;border:1px solid #DCCFC6;background:#fff}
p{margin:0 0 8px}ul{margin:0 0 8px;padding-left:20px}.nada{color:#9B1C1C}.decision{margin-top:12px;font-size:15px}
@media (max-width:600px){article{grid-template-columns:1fr}img{width:100%;max-width:320px}}
</style></head><body>
<h1>Fotos en revisión</h1>
<p>${pendientes.length} fotografías con varios artículos que no se publican como producto. De casi todas ya se recortaron y publicaron sus productos; ${sinPublicar} no tienen ninguno publicado. Si falta alguna pieza, se sube desde el panel con una foto individual.</p>
${filas.join("\n")}
</body></html>
`;
writeFileSync(join(RAIZ, "REVISION_PENDIENTE.html"), documento, "utf8");
console.log(`REVISION_PENDIENTE.html: ${pendientes.length} registros, ${sinPublicar} sin productos publicados.`);
