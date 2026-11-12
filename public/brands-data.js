"use strict";

// Marcas con logo y categorías de la web. Los productos llegan de /api/productos (ver script.js).
// Las marcas escritas en el panel con «Otra marca…» se añaden solas al filtro, sin logo.

const BRANDS = [
  { id: "gladiator", name: "Gladiator", families: ["Maletas", "Mochilas de viaje", "Bolsas de viaje"], website: "https://maletasgladiator.com/", logo: "assets/marcas/gladiator-logo.png", logoStatus: "approved" },
  { id: "cacharel", name: "Cacharel", families: ["Bolsos", "Mochilas", "Carteras", "Complementos"], website: "https://cacharelbags.com/", logo: "assets/marcas/cacharel-logo.jpg", logoStatus: "approved" },
  { id: "anekke", name: "Anekke", families: ["Bolsos", "Mochilas", "Monederos", "Complementos"], website: "https://anekke.com/", logo: "assets/marcas/anneke-logo.png", logoStatus: "approved" },
  { id: "totto", name: "Totto", families: ["Mochilas", "Maletas", "Bolsos", "Accesorios"], website: "https://www.totto.es/", logo: "assets/marcas/totto-logo.jpg", logoStatus: "approved" },
  { id: "pepe-moll", name: "Pepe Moll", families: ["Bolsos", "Mochilas", "Complementos"], website: "https://pepemoll.es/", logo: "assets/marcas/pepemoll-logo.jpg", logoStatus: "approved" },
  { id: "torrens", name: "Torrens", identity: "Torrens Hermanos · marroquinería", families: ["Bolsos", "Bandoleras", "Mochilas", "Carteras"], website: "https://www.torrenshermanos.com/", logo: null, logoStatus: "pending-verification" },
  { id: "gabol", name: "Gabol", families: ["Maletas", "Mochilas", "Estuches", "Neceseres", "Complementos"], website: "https://gabol.com/", logo: "assets/marcas/gabol-logo.png", logoStatus: "approved" },
  { id: "nicole-lee-usa", name: "Nicole Lee USA", catalogOnly: true },
  { id: "bienoti", name: "Bienoti", catalogOnly: true }
];

const CATALOG_CATEGORIES = [
  {
    "id": "bolsos",
    "name": "Bolsos"
  },
  {
    "id": "mochilas",
    "name": "Mochilas"
  },
  {
    "id": "maletas",
    "name": "Maletas"
  },
  {
    "id": "complementos",
    "name": "Accesorios"
  },
  {
    "id": "zapatillas",
    "name": "Zapatillas"
  }
];
