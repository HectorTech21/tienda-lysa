"use strict";

const BRANDS = [
  { id: "gladiator", name: "Gladiator", families: ["Maletas", "Mochilas de viaje", "Bolsas de viaje"], website: "https://maletasgladiator.com/", logo: "assets/marcas/gladiator-logo.png", logoStatus: "approved" },
  { id: "cacharel", name: "Cacharel", families: ["Bolsos", "Mochilas", "Carteras", "Complementos"], website: "https://cacharelbags.com/", logo: "assets/marcas/cacharel-logo.jpg", logoStatus: "approved" },
  { id: "anekke", name: "Anekke", families: ["Bolsos", "Mochilas", "Monederos", "Complementos"], website: "https://anekke.com/", logo: "assets/marcas/anneke-logo.png", logoStatus: "approved" },
  { id: "totto", name: "Totto", families: ["Mochilas", "Maletas", "Bolsos", "Accesorios"], website: "https://www.totto.es/", logo: "assets/marcas/totto-logo.jpg", logoStatus: "approved" },
  { id: "pepe-moll", name: "Pepe Moll", families: ["Bolsos", "Mochilas", "Complementos"], website: "https://pepemoll.es/", logo: "assets/marcas/pepemoll-logo.jpg", logoStatus: "approved" },
  { id: "torrens", name: "Torrens", identity: "Torrens Hermanos · marroquinería", families: ["Bolsos", "Bandoleras", "Mochilas", "Carteras"], website: "https://www.torrenshermanos.com/", logo: null, logoStatus: "pending-verification" },
  { id: "gabol", name: "Gabol", families: ["Maletas", "Mochilas", "Estuches", "Neceseres", "Complementos"], website: "https://gabol.com/", logo: "assets/marcas/gabol-logo.png", logoStatus: "approved" },
  { id: "nicole-lee-usa", name: "Nicole Lee USA", catalogOnly: true }
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
  },
  {
    "id": "unclassified",
    "name": "Por clasificar",
    "internalOnly": true
  }
];

/* Único catálogo: product se publica; review se conserva solo para revisión interna.
 * Los IDs y referencias no se regeneran al ordenar o editar. No reutilizar referencias.
 * brand referencia BRANDS. observedBrand conserva identificaciones sin filtro propio.
 * brandStatus visually-identified permite mostrar la marca observada con evidencia.
 * price, availability y commercialStatus siguen pendientes hasta confirmación. */
const CATALOG_PRODUCTS = [
  {
    "id": "lysa-product-035",
    "name": "Bolso verde con asas rosas",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Verde y rosa",
    "swatch": "#858872",
    "images": [
      {
        "src": "assets/products/lysa-035.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.48.38 (9).jpeg",
        "alt": "Bolso verde con asas rosas"
      }
    ],
    "description": "Asas rosas, cordones laterales y borde fruncido.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre Pepe Moll legible bajo el bordado frontal.",
    "reference": "LYSA-035",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-038",
    "name": "Maleta rígida morada",
    "brand": "gladiator",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "maletas"
    ],
    "color": "Morado",
    "swatch": "#4b447c",
    "images": [
      {
        "src": "assets/products/lysa-038.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.53.02 (1).jpeg",
        "alt": "Maleta rígida morada",
        "crop": [
          0.094444,
          0.290041,
          0.83,
          0.546715
        ]
      }
    ],
    "description": "Carcasa con relieve, placa central y ruedas dobles.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Placa Gladiator en el frontal. Recorte de la imagen individual que excluye la interfaz y los rótulos superpuestos.",
    "reference": "LYSA-038",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-039",
    "name": "Mochila beige con corazones",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "mochilas"
    ],
    "color": "Beige y granate",
    "swatch": "#b79e80",
    "images": [
      {
        "src": "assets/products/lysa-039.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.48.38 (6).jpeg",
        "alt": "Mochila beige con corazones",
        "crop": [
          0.177778,
          0.015686,
          0.608333,
          0.576471
        ]
      }
    ],
    "description": "Frontal estampado, bordados de corazones y asa granate.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Etiqueta Pepe Moll legible en la mochila. Recorte de la pieza superior; el bolso inferior sigue en LYSA-051.",
    "reference": "LYSA-039",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-040",
    "name": "Cartera verde con tachuelas",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "complementos"
    ],
    "color": "Verde oliva",
    "swatch": "#55573c",
    "images": [
      {
        "src": "assets/products/lysa-040.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.48.35 (6).jpeg",
        "alt": "Cartera verde con tachuelas",
        "crop": [
          0.166667,
          0.772917,
          0.388889,
          0.185417
        ]
      }
    ],
    "description": "Cierre de cremallera y pequeñas tachuelas en el frontal.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre Pepe Moll legible en el frontal. Variante verde aislada de la composición LYSA-006.",
    "reference": "LYSA-040",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-036",
    "name": "Bolso negro acolchado",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Negro",
    "swatch": "#272627",
    "images": [
      {
        "src": "assets/products/lysa-036.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.48.39 (1).jpeg",
        "alt": "Bolso negro acolchado"
      }
    ],
    "description": "Asas largas y bolsillo de cremallera sobre el panel acolchado.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Placa Pepe Moll en el frontal. Reaparece en la foto con la variante granate LYSA-044.",
    "reference": "LYSA-036",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-037",
    "name": "Bandolera negra brillante",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Negro",
    "swatch": "#282527",
    "images": [
      {
        "src": "assets/products/lysa-037.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.48.39.jpeg",
        "alt": "Bandolera negra brillante"
      }
    ],
    "description": "Correa ancha, acabado brillante y dos bolsillos frontales con cremallera dorada.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre Pepe Moll en el frontal de la bandolera.",
    "reference": "LYSA-037",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-041",
    "name": "Cartera negra con tachuelas",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "complementos"
    ],
    "color": "Negro",
    "swatch": "#262627",
    "images": [
      {
        "src": "assets/products/lysa-041.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.48.35 (6).jpeg",
        "alt": "Cartera negra con tachuelas",
        "crop": [
          0.552778,
          0.772917,
          0.397222,
          0.16875
        ]
      }
    ],
    "description": "Cierre de cremallera y pequeñas tachuelas en el frontal.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre Pepe Moll legible en el frontal. Variante negra aislada de la composición LYSA-006.",
    "reference": "LYSA-041",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-042",
    "name": "Bolso beige acolchado",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Beige",
    "swatch": "#a18663",
    "images": [
      {
        "src": "assets/products/lysa-042.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.48.38 (8).jpeg",
        "alt": "Bolso beige acolchado",
        "crop": [
          0.418889,
          0.096667,
          0.547778,
          0.3925
        ]
      }
    ],
    "description": "Forma de media luna, costuras diagonales y asa de cadena.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Monograma Pepe Moll en relieve, con la misma composición de letras que las placas legibles de LYSA-045 y LYSA-046.",
    "reference": "LYSA-042",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-043",
    "name": "Bolso azul con asa rosa",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Azul claro y rosa",
    "swatch": "#92aaa9",
    "images": [
      {
        "src": "assets/products/lysa-043.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.48.38 (8).jpeg",
        "alt": "Bolso azul con asa rosa",
        "crop": [
          0.415556,
          0.489167,
          0.567778,
          0.295833
        ]
      }
    ],
    "description": "Solapa triangular y asa corta trenzada en rosa y azul.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre Pepe Moll bajo el bordado frontal.",
    "reference": "LYSA-043",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-044",
    "name": "Bolso granate acolchado",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Granate",
    "swatch": "#782f3d",
    "images": [
      {
        "src": "assets/products/lysa-044.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.48.39 (2).jpeg",
        "alt": "Bolso granate acolchado",
        "crop": [
          0.147222,
          0,
          0.730556,
          0.515444
        ]
      }
    ],
    "description": "Asas marrones y bolsillo delantero con cremallera sobre el acolchado.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Placa Pepe Moll legible. Variante granate separada de la toma con LYSA-036.",
    "reference": "LYSA-044",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-045",
    "name": "Bandolera marrón",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Marrón",
    "swatch": "#523c33",
    "images": [
      {
        "src": "assets/products/lysa-045.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.48.35 (1).jpeg",
        "alt": "Bandolera marrón",
        "crop": [
          0.158333,
          0,
          0.661111,
          0.641026
        ]
      }
    ],
    "description": "Correa larga, cierre superior de cremallera y laterales estampados.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Placa Pepe Moll legible. Pieza superior de la fotografía de LYSA-005.",
    "reference": "LYSA-045",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-046",
    "name": "Bandolera negra con laterales estampados",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Negro y gris",
    "swatch": "#2b2929",
    "images": [
      {
        "src": "assets/products/lysa-046.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.48.35 (1).jpeg",
        "alt": "Bandolera negra con laterales estampados",
        "crop": [
          0.102778,
          0.641026,
          0.841667,
          0.34714
        ]
      }
    ],
    "description": "Cierre superior de cremallera, placa cuadrada y laterales estampados.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Placa Pepe Moll legible. Pieza inferior de la fotografía de LYSA-005.",
    "reference": "LYSA-046",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-001",
    "name": "Bolso beige",
    "brand": "nicole-lee-usa",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Beige",
    "swatch": "#8b8571",
    "images": [
      {
        "src": "assets/products/photo-001.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.51.jpeg",
        "alt": "Bolso beige de Nicole Lee USA"
      }
    ],
    "description": "Cuerpo fruncido, asa con piezas metálicas y adornos colgantes.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Distintivos Nicole Lee USA legibles en el frontal y medallón.",
    "reference": "LYSA-001",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-002",
    "name": "Bolso rosa",
    "brand": "nicole-lee-usa",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Rosa",
    "swatch": "#b88c89",
    "images": [
      {
        "src": "assets/products/photo-002.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.52 (1).jpeg",
        "alt": "Bolso rosa de Nicole Lee USA"
      }
    ],
    "description": "Silueta curva, cierre superior y asa con eslabones dorados.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre Nicole Lee USA legible en el frontal. Es un artículo distinto del bolso topo.",
    "reference": "LYSA-002",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-003",
    "name": "Maleta marrón",
    "brand": "nicole-lee-usa",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "maletas"
    ],
    "color": "Marrón",
    "swatch": "#60412e",
    "images": [
      {
        "src": "assets/products/photo-003.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.52 (2).jpeg",
        "alt": "Maleta marrón de Nicole Lee USA"
      }
    ],
    "description": "Maleta con ruedas, asa superior y dibujo de una mujer con flores.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Placa Nicole Lee USA y tiradores rotulados.",
    "reference": "LYSA-003",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-007",
    "name": "Bolso negro de asas verdes",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Negro y menta",
    "swatch": "#76675b",
    "images": [
      {
        "src": "assets/products/photo-007.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.52 (6).jpeg",
        "alt": "Bolso negro de asas verdes de Pepe Moll"
      }
    ],
    "description": "Asas largas verde menta, cordones laterales y borde superior fruncido.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Etiqueta unida al bolso y nombre Pepe Moll en el frontal.",
    "reference": "LYSA-007",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-008",
    "name": "Bolso negro de rombos",
    "brand": null,
    "observedBrand": null,
    "brandStatus": "pending-commercial-confirmation",
    "categories": [
      "bolsos"
    ],
    "color": "Negro",
    "swatch": "#272727",
    "images": [
      {
        "src": "assets/products/photo-008.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.52 (7).jpeg",
        "alt": "Bolso negro de rombos"
      }
    ],
    "description": "Dos asas trenzadas y frontal con relieve de grandes rombos.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "baja",
    "evidence": "Emblema oscuro no suficientemente legible; no atribuir por similitud.",
    "reference": "LYSA-008",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-017",
    "name": "Bolso negro con bolsillo frontal",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Negro",
    "swatch": "#272727",
    "images": [
      {
        "src": "assets/products/photo-017.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.53.jpeg",
        "alt": "Bolso negro con bolsillo frontal de Pepe Moll"
      }
    ],
    "description": "Dos asas cortas, bolsillo con cremallera y adorno de flecos.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre Pepe Moll visible en el bolsillo del propio bolso.",
    "reference": "LYSA-017",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-013",
    "name": "Bolso negro con dos bolsillos",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Negro",
    "swatch": "#272727",
    "images": [
      {
        "src": "assets/products/photo-013.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.53 (4).jpeg",
        "alt": "Bolso negro con dos bolsillos de Pepe Moll"
      }
    ],
    "description": "Asas largas, banda horizontal gris y dos bolsillos delanteros con cremallera.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Logotipo Pepe Moll en la esquina inferior. Se repite al fondo de 53 (5).",
    "reference": "LYSA-013",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-016",
    "name": "Bolso de leopardo gris",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Gris y negro",
    "swatch": "#777674",
    "images": [
      {
        "src": "assets/products/photo-016.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.53 (7).jpeg",
        "alt": "Bolso de leopardo gris de Pepe Moll"
      }
    ],
    "description": "Estampado de manchas, asas negras y borde superior fruncido.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Etiqueta Pepe Moll unida al artículo y placa frontal.",
    "reference": "LYSA-016",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-018",
    "name": "Bolso gris",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Gris",
    "swatch": "#777674",
    "images": [
      {
        "src": "assets/products/photo-018.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.54 (1).jpeg",
        "alt": "Bolso gris de Pepe Moll"
      }
    ],
    "description": "Asa ancha regulable y dos bolsillos delanteros con botones.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre Pepe Moll en el parche del producto.",
    "reference": "LYSA-018",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-020",
    "name": "Bolso verde",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Verde oliva",
    "swatch": "#56654e",
    "images": [
      {
        "src": "assets/products/photo-020.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.54 (3).jpeg",
        "alt": "Bolso verde de Pepe Moll"
      }
    ],
    "description": "Dos asas cortas, cordones laterales y bolsillo frontal verde claro.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre Pepe Moll en el frontal. No hay prueba suficiente de uso como mochila.",
    "reference": "LYSA-020",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-022",
    "name": "Mochila verde y negra",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "mochilas"
    ],
    "color": "Verde y negro",
    "swatch": "#56654e",
    "images": [
      {
        "src": "assets/products/photo-022.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.54 (5).jpeg",
        "alt": "Mochila verde y negra de Pepe Moll"
      }
    ],
    "description": "Asa superior, cierre de cremallera y bolsillo frontal negro.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Placa Pepe Moll en el producto; el soporte Anekke no identifica la mochila.",
    "reference": "LYSA-022",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-024",
    "name": "Bolso de leopardo marrón",
    "brand": null,
    "observedBrand": null,
    "brandStatus": "pending-commercial-confirmation",
    "categories": [
      "bolsos"
    ],
    "color": "Marrón y negro",
    "swatch": "#76675b",
    "images": [
      {
        "src": "assets/products/photo-024.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.54.jpeg",
        "alt": "Bolso de leopardo marrón"
      }
    ],
    "description": "Dos asas negras, pequeñas hebillas y estampado de manchas.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "media",
    "evidence": "Monograma circular no inequívoco. El expositor Pepe Moll no basta. También aparece en 53 (6).",
    "reference": "LYSA-024",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-009",
    "name": "Fotografía por revisar: dos bolsos estampados",
    "brand": null,
    "observedBrand": "Nikky by Nicole Lee",
    "brandStatus": "pending-commercial-confirmation",
    "categories": [
      "bolsos"
    ],
    "color": "Multicolor",
    "swatch": "#76675b",
    "images": [
      {
        "src": "assets/products/photo-009.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.52.jpeg",
        "alt": "Fotografía por revisar: dos bolsos estampados — varios artículos, fotografía pendiente de revisión"
      }
    ],
    "description": "Fotografía de dos bolsos diferentes con estampado multicolor y bolsillos frontales.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "review",
    "confidence": "alta",
    "evidence": "Texto Nikky by Nicole Lee USA en las asas. Dos artículos: bolso de asas y bandolera; no son un lote confirmado.",
    "reference": "LYSA-009",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-004",
    "name": "Fotografía por revisar: dos bolsos marrones",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Marrón",
    "swatch": "#60412e",
    "images": [
      {
        "src": "assets/products/photo-004.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.52 (3).jpeg",
        "alt": "Fotografía por revisar: dos bolsos marrones — varios artículos, fotografía pendiente de revisión"
      }
    ],
    "description": "Dos bolsos marrones de formas distintas, con hebillas y asas.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "review",
    "confidence": "alta",
    "evidence": "Nombre Pepe Moll visible en ambos. Bolso de hombro trasero y bolso de asas delantero: dos artículos.",
    "reference": "LYSA-004",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-005",
    "name": "Fotografía por revisar: dos bandoleras",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Marrón y negro",
    "swatch": "#76675b",
    "images": [
      {
        "src": "assets/products/photo-005.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.52 (4).jpeg",
        "alt": "Fotografía por revisar: dos bandoleras — varios artículos, fotografía pendiente de revisión"
      }
    ],
    "description": "Dos bandoleras, marrón y negra, con cremallera y laterales estampados.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "review",
    "confidence": "alta",
    "evidence": "Placas Pepe Moll legibles en ambos productos. Las fichas LYSA-045 y LYSA-046 usan recortes individuales; esta toma se conserva como fuente.",
    "reference": "LYSA-005",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-006",
    "name": "Fotografía por revisar: bolsos y carteras",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos",
      "complementos"
    ],
    "color": "Verde oliva y negro",
    "swatch": "#56654e",
    "images": [
      {
        "src": "assets/products/photo-006.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.52 (5).jpeg",
        "alt": "Fotografía por revisar: bolsos y carteras — varios artículos, fotografía pendiente de revisión"
      },
      {
        "src": "assets/products/photo-010.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.53 (1).jpeg",
        "alt": "Otra toma de los bolsos y carteras Pepe Moll; no es un conjunto a la venta"
      },
      {
        "src": "assets/products/photo-006.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.53 (2).jpeg",
        "alt": "Otra toma de los bolsos y carteras Pepe Moll; no es un conjunto a la venta"
      }
    ],
    "description": "Dos bolsos curvos y dos carteras con pequeños detalles dorados.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "review",
    "confidence": "alta",
    "evidence": "Pepe Moll visible en los cuatro artículos de 53 (1). Las carteras están publicadas como LYSA-040 y LYSA-041; los dos bolsos siguen pendientes. 53 (2) es duplicado binario de 52 (5).",
    "reference": "LYSA-006",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-012",
    "name": "Fotografía por revisar: dos bolsos bicolor",
    "brand": null,
    "observedBrand": null,
    "brandStatus": "pending-commercial-confirmation",
    "categories": [
      "bolsos"
    ],
    "color": "Camel y beige",
    "swatch": "#b58b60",
    "images": [
      {
        "src": "assets/products/photo-012.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.53 (3).jpeg",
        "alt": "Fotografía por revisar: dos bolsos bicolor — varios artículos, fotografía pendiente de revisión"
      }
    ],
    "description": "Bolso camel de hombro y bolso beige con detalles camel y flecos.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "review",
    "confidence": "baja",
    "evidence": "Pepe Moll confirmado solo en el bolso beige delantero. Bolso camel trasero con R: marca sin confirmar.",
    "reference": "LYSA-012",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-014",
    "name": "Fotografía por revisar: bandolera negra",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Negro",
    "swatch": "#272727",
    "images": [
      {
        "src": "assets/products/photo-014.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.53 (5).jpeg",
        "alt": "Fotografía por revisar: bandolera negra — varios artículos, fotografía pendiente de revisión"
      }
    ],
    "description": "Bandolera negra con dos bolsillos, fotografiada junto a un bolso de asas.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "review",
    "confidence": "alta",
    "evidence": "Pepe Moll visible en la bandolera delantera. El bolso trasero ya está registrado en 53 (4).",
    "reference": "LYSA-014",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-015",
    "name": "Fotografía por revisar: cuatro artículos animal print",
    "brand": null,
    "observedBrand": null,
    "brandStatus": "pending-commercial-confirmation",
    "categories": [
      "bolsos",
      "mochilas"
    ],
    "color": "Marrón y negro",
    "swatch": "#76675b",
    "images": [
      {
        "src": "assets/products/photo-015.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.53 (6).jpeg",
        "alt": "Fotografía por revisar: cuatro artículos animal print — varios artículos, fotografía pendiente de revisión"
      }
    ],
    "description": "Tres bolsos de formas distintas y una mochila con estampado de manchas.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "review",
    "confidence": "media",
    "evidence": "Se ven etiquetas Pepe Moll en parte de la imagen, no en todos. Incluye el bolso de 54; comparar colores con 53 (7) y 54 (2) antes de crear variantes.",
    "reference": "LYSA-015",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-019",
    "name": "Fotografía por revisar: mochila y bandolera animal print",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos",
      "mochilas"
    ],
    "color": "Gris y negro",
    "swatch": "#777674",
    "images": [
      {
        "src": "assets/products/photo-019.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.54 (2).jpeg",
        "alt": "Fotografía por revisar: mochila y bandolera animal print — varios artículos, fotografía pendiente de revisión"
      }
    ],
    "description": "Mochila y bandolera estampadas con panel superior negro.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "review",
    "confidence": "alta",
    "evidence": "Placas Pepe Moll en ambos artículos. Posible relación con la composición 53 (6); confirmar variantes.",
    "reference": "LYSA-019",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-021",
    "name": "Fotografía por revisar: dos mochilas",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "mochilas"
    ],
    "color": "Camel y negro/gris",
    "swatch": "#b58b60",
    "images": [
      {
        "src": "assets/products/photo-021.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.54 (4).jpeg",
        "alt": "Fotografía por revisar: dos mochilas — varios artículos, fotografía pendiente de revisión"
      }
    ],
    "description": "Dos mochilas rectangulares con bolsillo frontal: una camel y otra negra y gris.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "review",
    "confidence": "alta",
    "evidence": "Pepe Moll visible en ambas. El soporte Anekke es ajeno a la identificación.",
    "reference": "LYSA-021",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-023",
    "name": "Fotografía por revisar: mochila y bolso verdes",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "mochilas",
      "bolsos"
    ],
    "color": "Verde",
    "swatch": "#56654e",
    "images": [
      {
        "src": "assets/products/photo-023.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.54 (6).jpeg",
        "alt": "Fotografía por revisar: mochila y bolso verdes — varios artículos, fotografía pendiente de revisión"
      }
    ],
    "description": "Mochila y bolso curvo verdes con relieve entrecruzado y adornos colgantes.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "review",
    "confidence": "alta",
    "evidence": "Nombre Pepe Moll legible en ambos productos. Dos artículos independientes.",
    "reference": "LYSA-023",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-025",
    "reference": "LYSA-025",
    "name": "Tres bolsos metalizados",
    "brand": "cacharel",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Gris y bronce",
    "swatch": "#746b56",
    "images": [
      {
        "src": "assets/products/photo-025.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.23.jpeg",
        "alt": "Tres bolsos metalizados Cacharel"
      },
      {
        "src": "assets/products/photo-026.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.23 (1).jpeg",
        "alt": "Otra vista de los mismos tres bolsos Cacharel"
      }
    ],
    "description": "Tres bolsos metalizados. Fotografía colectiva conservada solo para revisión interna.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "review",
    "confidence": "alta",
    "evidence": "Tres artículos diferentes. 19.21.23 y 19.21.23 (1) muestran las mismas piezas. Cacharel legible en bolso plisado y correa del bolso con solapa. No publicar el conjunto. El bolso superior podría repetirse en 19.21.24 (3), sin confirmación suficiente.",
    "relatedProductIds": [],
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-027",
    "reference": "LYSA-027",
    "name": "Tres bolsos marrones",
    "brand": "cacharel",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Marrón y beige",
    "swatch": "#746b56",
    "images": [
      {
        "src": "assets/products/photo-027.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.23 (2).jpeg",
        "alt": "Dos bolsos de asas y una bandolera marrones Cacharel"
      }
    ],
    "description": "Tres bolsos marrones. Fotografía colectiva conservada solo para revisión interna.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "review",
    "confidence": "alta",
    "evidence": "Tres artículos independientes; nombre Cacharel legible en cada frontal. Dos bolsos de asas y una bandolera. Los de asas están cortados por los bordes. No separar sin nuevas tomas.",
    "relatedProductIds": [],
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-028",
    "reference": "LYSA-028",
    "name": "Bolsos de letras y cartera negra",
    "brand": "cacharel",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos",
      "complementos"
    ],
    "color": "Negro y gris",
    "swatch": "#746b56",
    "images": [
      {
        "src": "assets/products/photo-028.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.23 (3).jpeg",
        "alt": "Dos bolsos estampados de letras Cacharel y una cartera negra"
      }
    ],
    "description": "Bolsos de letras y cartera negra. Fotografía colectiva conservada solo para revisión interna.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "review",
    "confidence": "alta",
    "evidence": "Tres artículos independientes. Cacharel legible en los productos. La cartera negra se ha aislado sin cortar su silueta: LYSA-033. Los bolsos quedan pendientes.",
    "relatedProductIds": [
      "lysa-product-033"
    ],
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-029",
    "reference": "LYSA-029",
    "name": "Dos bolsos de asas y cartera negra",
    "brand": "cacharel",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos",
      "complementos"
    ],
    "color": "Beige y negro",
    "swatch": "#746b56",
    "images": [
      {
        "src": "assets/products/photo-029.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.24.jpeg",
        "alt": "Bolsos beige y negro de asas Cacharel junto a una cartera negra"
      }
    ],
    "description": "Dos bolsos de asas y cartera negra. Fotografía colectiva conservada solo para revisión interna.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "review",
    "confidence": "alta",
    "evidence": "Cacharel legible en etiquetas y cartera. La cartera negra repite la de 19.21.23 (3): LYSA-033, sin nueva ficha. Los bolsos llegan a los bordes de la imagen; conservar para revisión.",
    "relatedProductIds": [
      "lysa-product-033"
    ],
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-030",
    "reference": "LYSA-030",
    "name": "Bolsos y cartera multicolor",
    "brand": "cacharel",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos",
      "complementos"
    ],
    "color": "Amarillo, naranja, azul, verde y negro",
    "swatch": "#746b56",
    "images": [
      {
        "src": "assets/products/photo-030.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.24 (1).jpeg",
        "alt": "Tres bolsos y una cartera Cacharel multicolor"
      },
      {
        "src": "assets/products/photo-031.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.24 (2).jpeg",
        "alt": "Otra vista de los mismos bolsos y cartera Cacharel multicolor"
      }
    ],
    "description": "Bolsos y cartera multicolor. Fotografía colectiva conservada solo para revisión interna.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "review",
    "confidence": "alta",
    "evidence": "Mismos cuatro artículos en dos tomas. Marca legible en los bolsos y monograma Cacharel en la cartera. Cartera inferior aislada de 24 (1): LYSA-034. Bandolera central se conserva pendiente: un recorte rectangular incluye parte de otro bolso. No publicar como conjunto.",
    "relatedProductIds": [
      "lysa-product-034"
    ],
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-032",
    "reference": "LYSA-032",
    "name": "Tres bolsos de leopardo metalizados",
    "brand": "cacharel",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Bronce, negro y gris",
    "swatch": "#746b56",
    "images": [
      {
        "src": "assets/products/photo-032.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.24 (3).jpeg",
        "alt": "Dos bolsos de asas y un bolso pequeño metalizados Cacharel"
      }
    ],
    "description": "Tres bolsos de leopardo metalizados. Fotografía colectiva conservada solo para revisión interna.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "review",
    "confidence": "alta",
    "evidence": "Tres artículos independientes. Cacharel legible en etiqueta; monogramas coincidentes en los tres. Los bolsos de asas están cortados por los bordes. Posible repetición del bolso pequeño con LYSA-025: no crear ficha sin confirmar.",
    "relatedProductIds": [],
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-033",
    "reference": "LYSA-033",
    "name": "Cartera negra",
    "brand": "cacharel",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "complementos"
    ],
    "color": "Negro",
    "swatch": "#272727",
    "images": [
      {
        "src": "assets/products/lysa-033.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.24.jpeg",
        "alt": "Cartera negra de Cacharel con cierre de cremallera",
        "crop": [
          0.24,
          0.745,
          0.38,
          0.2
        ]
      }
    ],
    "description": "Una cartera negra de líneas sencillas, con cremallera superior y el nombre Cacharel en dorado.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Cacharel legible en el frontal. Recorte individual revisado de 19.21.24: cartera completa y sin otros artículos. Reaparece en 19.21.23 (3); una única ficha.",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-034",
    "reference": "LYSA-034",
    "name": "Cartera multicolor",
    "brand": "cacharel",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "complementos"
    ],
    "color": "Amarillo, naranja, azul, verde y negro",
    "swatch": "#c3832b",
    "images": [
      {
        "src": "assets/products/lysa-034.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.24 (1).jpeg",
        "alt": "Cartera multicolor de Cacharel con estampados y cierre negro",
        "crop": [
          0.36,
          0.725,
          0.35,
          0.215
        ]
      }
    ],
    "description": "Estampados de manchas, rayas y cuadros en una cartera multicolor con una tira negra de cierre.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Monograma Cacharel visible en la tira de cierre. Misma familia y marca legible en los bolsos de la composición. Recorte de la cartera inferior, completa y separada del resto. Reaparece en 24 (2); no se duplica.",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-047",
    "name": "Maletas turquesas y moradas",
    "brand": null,
    "observedBrand": "Bienoti",
    "brandStatus": "visually-identified",
    "categories": [
      "maletas"
    ],
    "color": "Turquesa y morado",
    "swatch": "#528a91",
    "images": [
      {
        "src": "assets/products/WhatsApp Image 2026-11-07 at 11.42.58 (1).jpeg",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.42.58 (1).jpeg",
        "alt": "Maletas turquesas y moradas"
      },
      {
        "src": "assets/products/WhatsApp Image 2026-11-07 at 11.48.42.jpeg",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.48.42.jpeg",
        "alt": "Maletas turquesas y moradas"
      }
    ],
    "description": "Tres tamaños por color, solapados. Bienoti es legible en las etiquetas y carcasas. Confirmar variantes y aportar tomas individuales.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "review",
    "confidence": "alta",
    "evidence": "Tres tamaños por color, solapados. Bienoti es legible en las etiquetas y carcasas. Confirmar variantes y aportar tomas individuales.",
    "reference": "LYSA-047",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-048",
    "name": "Bolsas de viaje naranjas",
    "brand": null,
    "observedBrand": "Bienoti",
    "brandStatus": "visually-identified",
    "categories": [
      "maletas"
    ],
    "color": "Naranja",
    "swatch": "#b35b2b",
    "images": [
      {
        "src": "assets/products/WhatsApp Image 2026-11-07 at 11.42.58 (2).jpeg",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.42.58 (2).jpeg",
        "alt": "Bolsas de viaje naranjas"
      },
      {
        "src": "assets/products/WhatsApp Image 2026-11-07 at 11.48.42 (1).jpeg",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.48.42 (1).jpeg",
        "alt": "Bolsas de viaje naranjas"
      }
    ],
    "description": "Tres bolsas blandas de viaje con ruedas, superpuestas.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "review",
    "confidence": "alta",
    "evidence": "Bienoti es legible en las etiquetas y en el cuerpo de la bolsa delantera.",
    "reference": "LYSA-048",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-049",
    "name": "Exposición de maletas y bolsos",
    "brand": null,
    "observedBrand": null,
    "brandStatus": "pending-commercial-confirmation",
    "categories": [
      "maletas",
      "bolsos"
    ],
    "color": "Multicolor",
    "swatch": "#7b7265",
    "images": [
      {
        "src": "assets/products/WhatsApp Image 2026-11-07 at 11.42.58 (3).jpeg",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.42.58 (3).jpeg",
        "alt": "Exposición de maletas y bolsos"
      },
      {
        "src": "assets/products/WhatsApp Image 2026-11-07 at 11.48.42 (2).jpeg",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.48.42 (2).jpeg",
        "alt": "Exposición de maletas y bolsos"
      }
    ],
    "description": "Dos vistas de la zona de viaje. Hay varias piezas y cartelería de fondo. Confirmar marca, variantes y correspondencia con LYSA-053.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "review",
    "confidence": "media",
    "evidence": "Dos vistas de la zona de viaje. Hay varias piezas y cartelería de fondo. Confirmar marca, variantes y correspondencia con LYSA-053.",
    "reference": "LYSA-049",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-050",
    "name": "Maletas, mochila y bolsos rosas",
    "brand": "totto",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "maletas",
      "mochilas",
      "bolsos"
    ],
    "color": "Rosa",
    "swatch": "#c09eaa",
    "images": [
      {
        "src": "assets/products/WhatsApp Image 2026-11-07 at 11.42.58.jpeg",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.42.58.jpeg",
        "alt": "Maletas, mochila y bolsos rosas"
      },
      {
        "src": "assets/products/WhatsApp Image 2026-11-07 at 11.48.41 (1).jpeg",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.48.41 (1).jpeg",
        "alt": "Maletas, mochila y bolsos rosas"
      }
    ],
    "description": "Totto legible en las piezas rosas. Hay tres tamaños de maleta, una mochila y dos bolsos. Las piezas se solapan.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "review",
    "confidence": "alta",
    "evidence": "Totto legible en las piezas rosas. Hay tres tamaños de maleta, una mochila y dos bolsos. Las piezas se solapan.",
    "reference": "LYSA-050",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-051",
    "name": "Bolso beige con corazones",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Beige y granate",
    "swatch": "#ac9383",
    "images": [
      {
        "src": "assets/products/WhatsApp Image 2026-11-07 at 11.48.38 (6).jpeg",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.48.38 (6).jpeg",
        "alt": "Bolso beige con corazones"
      }
    ],
    "description": "Pieza inferior. Su correa coincide en el encuadre con la base de la mochila publicada como LYSA-039. Pendiente de toma individual.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "review",
    "confidence": "alta",
    "evidence": "Pieza inferior. Su correa coincide en el encuadre con la base de la mochila publicada como LYSA-039. Pendiente de toma individual.",
    "reference": "LYSA-051",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-052",
    "name": "Bolsos crema y beige con cadena",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Crema y beige",
    "swatch": "#b1a48d",
    "images": [
      {
        "src": "assets/products/WhatsApp Image 2026-11-07 at 11.48.38 (7).jpeg",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.48.38 (7).jpeg",
        "alt": "Bolsos crema y beige con cadena"
      }
    ],
    "description": "Monograma Pepe Moll visible en ambos. El asa del bolso inferior se cruza con el borde del superior.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "review",
    "confidence": "alta",
    "evidence": "Monograma Pepe Moll visible en ambos. El asa del bolso inferior se cruza con el borde del superior.",
    "reference": "LYSA-052",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-053",
    "name": "Maletas rojas, beige y verdes en exposición",
    "brand": null,
    "observedBrand": null,
    "brandStatus": "pending-commercial-confirmation",
    "categories": [
      "maletas"
    ],
    "color": "Multicolor",
    "swatch": "#766350",
    "images": [
      {
        "src": "assets/products/WhatsApp Image 2026-11-07 at 11.53.02 (2).jpeg",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.53.02 (2).jpeg",
        "alt": "Maletas rojas, beige y verdes en exposición"
      }
    ],
    "description": "Captura con varias piezas superpuestas. Confirmar marca y relación con las vistas generales de la tienda.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "review",
    "confidence": "media",
    "evidence": "Captura con varias piezas superpuestas. Confirmar marca y relación con las vistas generales de la tienda.",
    "reference": "LYSA-053",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-054",
    "name": "Maletas rígidas de varios colores",
    "brand": "gladiator",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "maletas"
    ],
    "color": "Multicolor",
    "swatch": "#6a7181",
    "images": [
      {
        "src": "assets/products/WhatsApp Image 2026-11-07 at 11.53.02 (3).jpeg",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.53.02 (3).jpeg",
        "alt": "Maletas rígidas de varios colores"
      }
    ],
    "description": "Gladiator en el cartel. Captura de exposición con varios tamaños, colores y texto superpuesto. Requiere fotografías individuales.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "review",
    "confidence": "alta",
    "evidence": "Gladiator en el cartel. Captura de exposición con varios tamaños, colores y texto superpuesto. Requiere fotografías individuales.",
    "reference": "LYSA-054",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-photo-055",
    "name": "Cartel promocional de maletas",
    "brand": null,
    "observedBrand": null,
    "brandStatus": "pending-commercial-confirmation",
    "categories": [
      "maletas"
    ],
    "color": "Multicolor",
    "swatch": "#7a5e79",
    "images": [
      {
        "src": "assets/products/WhatsApp Image 2026-11-07 at 11.53.02.jpeg",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.53.02.jpeg",
        "alt": "Cartel promocional de maletas"
      }
    ],
    "description": "Captura publicitaria con precio y oferta. Requiere confirmar la marca de las piezas, variantes y vigencia de la promoción.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "review",
    "confidence": "media",
    "evidence": "Captura publicitaria con precio y oferta. Requiere confirmar la marca de las piezas, variantes y vigencia de la promoción.",
    "reference": "LYSA-055",
    "commercialStatus": "pending"
  }
];
