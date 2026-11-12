// Pruebas de la autenticación del panel (node scripts/probar-auth.mjs). No usa la red:
// firma tokens con una clave generada aquí y se la entrega al validador.
import assert from "node:assert/strict";
import { autorizar } from "../src/auth.js";

const DOMINIO = "equipo-de-prueba.cloudflareaccess.com";
const AUD = "aud-de-prueba-1234567890";
const env = { ACCESS_TEAM_DOMAIN: DOMINIO, ACCESS_AUD: AUD };
const b64 = datos => Buffer.from(datos).toString("base64url");
const algoritmo = { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" };

const propia = await crypto.subtle.generateKey(algoritmo, true, ["sign", "verify"]);
const ajena = await crypto.subtle.generateKey(algoritmo, true, ["sign", "verify"]);
const jwk = { ...(await crypto.subtle.exportKey("jwk", propia.publicKey)), kid: "clave-1" };
const obtenerClaves = async () => [jwk];
const ahora = Math.floor(Date.now() / 1000);

async function token(datos = {}, { clave = propia.privateKey, cabecera = { alg: "RS256", kid: "clave-1", typ: "JWT" } } = {}) {
  const cuerpo = { iss: `https://${DOMINIO}`, aud: [AUD], exp: ahora + 600, iat: ahora, nbf: ahora, email: "duena@example.com", ...datos };
  const base = `${b64(JSON.stringify(cabecera))}.${b64(JSON.stringify(cuerpo))}`;
  const firma = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", clave, new TextEncoder().encode(base));
  return `${base}.${b64(new Uint8Array(firma))}`;
}
const peticion = (jwt, url = "https://tiendalysa.example/api/admin/productos") =>
  new Request(url, jwt ? { headers: { "Cf-Access-Jwt-Assertion": jwt } } : undefined);
const probar = async (jwt, entorno = env, url) => autorizar(peticion(jwt, url), entorno, { obtenerClaves });

const casos = [];
const caso = (nombre, funcion) => casos.push([nombre, funcion]);

caso("token válido: permite y devuelve el correo", async () => {
  const r = await probar(await token());
  assert.equal(r.ok, true); assert.equal(r.email, "duena@example.com");
});
caso("sin cabecera: bloquea", async () => assert.equal((await probar(null)).ok, false));
caso("audiencia distinta: bloquea", async () => assert.equal((await probar(await token({ aud: ["otra"] }))).ok, false));
caso("emisor distinto: bloquea", async () => assert.equal((await probar(await token({ iss: "https://otro.cloudflareaccess.com" }))).ok, false));
caso("caducado: bloquea", async () => assert.equal((await probar(await token({ exp: ahora - 3600 }))).ok, false));
caso("sin caducidad: bloquea", async () => assert.equal((await probar(await token({ exp: undefined }))).ok, false));
caso("firmado con otra clave: bloquea", async () => assert.equal((await probar(await token({}, { clave: ajena.privateKey }))).ok, false));
caso("contenido manipulado: bloquea", async () => {
  const [c, , f] = (await token()).split(".");
  const falso = b64(JSON.stringify({ iss: `https://${DOMINIO}`, aud: [AUD], exp: ahora + 600, email: "intruso@example.com" }));
  assert.equal((await probar(`${c}.${falso}.${f}`)).ok, false);
});
caso("alg none: bloquea", async () => {
  const sinFirma = `${b64(JSON.stringify({ alg: "none", kid: "clave-1" }))}.${b64(JSON.stringify({ iss: `https://${DOMINIO}`, aud: [AUD], exp: ahora + 600 }))}.`;
  assert.equal((await probar(sinFirma)).ok, false);
});
caso("clave desconocida (kid): bloquea", async () => assert.equal((await probar(await token({}, { cabecera: { alg: "RS256", kid: "otra" } }))).ok, false));
caso("texto que no es un token: bloquea", async () => assert.equal((await probar("hola")).ok, false));
caso("Access sin configurar: bloquea aunque el token sea válido", async () => {
  assert.equal((await probar(await token(), {})).ok, false);
  assert.equal((await probar(await token(), { ACCESS_TEAM_DOMAIN: DOMINIO, ACCESS_AUD: "" })).ok, false);
  assert.equal((await probar(await token(), { ACCESS_TEAM_DOMAIN: "malo.example.com", ACCESS_AUD: AUD })).ok, false);
});
caso("DEV_BYPASS_AUTH=true en local: permite", async () => {
  assert.equal((await probar(null, { DEV_BYPASS_AUTH: "true" }, "http://localhost:8787/api/admin/productos")).ok, true);
  assert.equal((await probar(null, { DEV_BYPASS_AUTH: "true" }, "http://192.168.1.20:8787/admin/")).ok, true);
});
caso("DEV_BYPASS_AUTH=true en un dominio público: bloquea", async () => {
  assert.equal((await probar(null, { DEV_BYPASS_AUTH: "true" })).ok, false);
});
caso("DEV_BYPASS_AUTH con otro valor o ausente: bloquea", async () => {
  for (const valor of ["1", "TRUE", "yes", "", undefined, true]) {
    assert.equal((await probar(null, { DEV_BYPASS_AUTH: valor }, "http://localhost:8787/api/admin/productos")).ok, false, String(valor));
  }
});

let fallos = 0;
for (const [nombre, funcion] of casos) {
  try { await funcion(); console.log(`  ok  ${nombre}`); }
  catch (error) { fallos += 1; console.log(`FALLO ${nombre}\n      ${error.message}`); }
}
console.log(`\n${casos.length - fallos} de ${casos.length} pruebas correctas`);
process.exit(fallos ? 1 : 0);
