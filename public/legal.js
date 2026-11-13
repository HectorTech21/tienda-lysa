"use strict";

// Páginas legales: rellena los datos de la titular (LEGAL, en store-config.js),
// los enlaces de contacto del pie y el año. No guarda ni envía nada.
(() => {
  const datos = typeof LEGAL === "object" && LEGAL ? LEGAL : {};

  document.querySelectorAll("[data-legal]").forEach(elemento => {
    const clave = elemento.dataset.legal;
    const valor = typeof datos[clave] === "string" ? datos[clave].trim() : null;
    // Dato sin definir: se conserva el marcador escrito en la página.
    if (valor === null) return;
    // Dato vacío a propósito (por ejemplo, datos registrales de una autónoma): se quita su línea.
    if (valor === "") {
      (elemento.closest("[data-legal-linea]") || elemento).remove();
      return;
    }
    const pendiente = /^\[\[.*\]\]$/.test(valor);
    if (!pendiente && clave === "EMAIL_LEGAL") {
      const enlace = document.createElement("a");
      enlace.href = "mailto:" + valor;
      enlace.textContent = valor;
      elemento.replaceChildren(enlace);
    } else if (!pendiente && clave === "TELEFONO") {
      const enlace = document.createElement("a");
      enlace.href = "tel:" + valor.replace(/[^\d+]/g, "");
      enlace.textContent = valor;
      elemento.replaceChildren(enlace);
    } else {
      elemento.textContent = valor;
    }
  });

  const numeroValido = typeof WHATSAPP_NUMBER === "string" && /^\d{8,15}$/.test(WHATSAPP_NUMBER);
  document.querySelectorAll("[data-contact]").forEach(enlace => {
    if (numeroValido) enlace.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(WHATSAPP_GENERAL_MESSAGE);
  });
  document.querySelectorAll("[data-instagram]").forEach(enlace => {
    if (typeof INSTAGRAM_URL === "string") enlace.href = INSTAGRAM_URL;
  });

  const anio = document.getElementById("current-year");
  if (anio) anio.textContent = String(new Date().getFullYear());
})();
