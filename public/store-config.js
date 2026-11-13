"use strict";

// Contactos oficiales facilitados por Tienda Lysa. Teléfono con prefijo,
// solo dígitos, sin +, espacios ni guiones.
const WHATSAPP_NUMBER = "34644016917";
const WHATSAPP_GENERAL_MESSAGE = "¡Hola! He visitado vuestra página web y me gustaría hacer una consulta. ¡Gracias!";
const INSTAGRAM_URL = "https://www.instagram.com/tienda.lysa/";

// ───────────────────────────────────────────────────────────────────────────
// DATOS DE LA TITULAR · único sitio donde se rellenan.
// Los leen aviso-legal.html, privacidad.html y cookies.html (legal.js).
// Sustituir cada marcador [[…]] por el dato real, entre las mismas comillas.
// Mientras quede un marcador sin rellenar, se ve tal cual en las páginas.
// ───────────────────────────────────────────────────────────────────────────
const LEGAL = {
  // Nombre y apellidos (autónoma) o razón social (sociedad). Ej.: "María Pérez López" o "Lysa Complementos, S.L."
  NOMBRE_TITULAR: "[[NOMBRE_TITULAR]]",
  // NIF de la persona o de la sociedad. Ej.: "12345678Z" o "B12345678"
  NIF: "[[NIF]]",
  // Domicilio completo: calle, número, código postal, localidad y provincia.
  DOMICILIO: "[[DOMICILIO]]",
  // Correo para asuntos legales y de protección de datos.
  EMAIL_LEGAL: "[[EMAIL_LEGAL]]",
  // Teléfono de contacto, como se quiera mostrar. Ej.: "+34 600 00 00 00"
  TELEFONO: "[[TELEFONO]]",
  // Solo si es sociedad. Ej.: "Registro Mercantil de Madrid, tomo 0000, folio 00, hoja M-000000".
  // Si es autónoma, dejar vacío ("") y la línea desaparece de las páginas.
  DATOS_REGISTRALES: "[[DATOS_REGISTRALES]]",
  // Fecha de la última revisión de los textos. Ej.: "20 de noviembre de 2026"
  FECHA_ACTUALIZACION: "[[FECHA_ACTUALIZACION]]"
};
