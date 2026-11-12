"use strict";

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
      },
      {
        "src": "assets/products/lysa-024-2.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.53 (6).jpeg",
        "alt": "Bolso de leopardo marrón, otra vista",
        "crop": [
          0.1,
          0.43,
          0.5,
          0.52
        ]
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
    "commercialStatus": "pending",
    "publishedItems": [
      "LYSA-060",
      "LYSA-061"
    ]
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
    "commercialStatus": "pending",
    "publishedItems": [
      "LYSA-056",
      "LYSA-057"
    ]
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
    "commercialStatus": "pending",
    "publishedItems": [
      "LYSA-045",
      "LYSA-046"
    ]
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
    "commercialStatus": "pending",
    "publishedItems": [
      "LYSA-058",
      "LYSA-059",
      "LYSA-040",
      "LYSA-041"
    ]
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
    "commercialStatus": "pending",
    "publishedItems": [
      "LYSA-062",
      "LYSA-063"
    ]
  },
  {
    "id": "lysa-photo-014",
    "name": "Bandolera negra de nailon",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Negro",
    "swatch": "#1f1f21",
    "images": [
      {
        "src": "assets/products/lysa-014.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.53 (5).jpeg",
        "alt": "Bandolera negra de nailon",
        "crop": [
          0.12,
          0.54,
          0.84,
          0.41
        ]
      }
    ],
    "description": "Banda gris, dos bolsillos con cremallera y cordones laterales.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Logotipo Pepe Moll en la bandolera delantera. Recorte de la composición; el bolso trasero es LYSA-013.",
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
    "commercialStatus": "pending",
    "publishedItems": [
      "LYSA-064",
      "LYSA-065",
      "LYSA-066"
    ]
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
    "commercialStatus": "pending",
    "publishedItems": [
      "LYSA-067",
      "LYSA-068"
    ]
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
    "commercialStatus": "pending",
    "publishedItems": [
      "LYSA-069",
      "LYSA-070"
    ]
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
    "commercialStatus": "pending",
    "publishedItems": [
      "LYSA-071",
      "LYSA-072"
    ]
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
    "commercialStatus": "pending",
    "publishedItems": [
      "LYSA-075",
      "LYSA-076",
      "LYSA-077"
    ]
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
    "commercialStatus": "pending",
    "publishedItems": [
      "LYSA-078",
      "LYSA-079",
      "LYSA-080"
    ]
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
    "commercialStatus": "pending",
    "publishedItems": [
      "LYSA-081",
      "LYSA-082",
      "LYSA-033"
    ]
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
    "commercialStatus": "pending",
    "publishedItems": [
      "LYSA-089",
      "LYSA-090",
      "LYSA-033"
    ]
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
    "commercialStatus": "pending",
    "publishedItems": [
      "LYSA-083",
      "LYSA-084",
      "LYSA-085",
      "LYSA-034"
    ]
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
    "commercialStatus": "pending",
    "publishedItems": [
      "LYSA-086",
      "LYSA-087",
      "LYSA-088"
    ]
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
      },
      {
        "src": "assets/products/lysa-033-2.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.23 (3).jpeg",
        "alt": "Cartera negra, otra vista",
        "crop": [
          0.35,
          0.73,
          0.31,
          0.22
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
    "commercialStatus": "pending",
    "publishedItems": [
      "LYSA-091",
      "LYSA-092"
    ]
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
    "commercialStatus": "pending",
    "publishedItems": [
      "LYSA-093"
    ]
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
    "commercialStatus": "pending",
    "publishedItems": [
      "LYSA-094",
      "LYSA-095",
      "LYSA-096",
      "LYSA-097"
    ]
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
        "src": "assets/products/lysa-051.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.48.38 (6).jpeg",
        "alt": "Bolso beige con corazones",
        "crop": [
          0.08,
          0.52,
          0.77,
          0.43
        ]
      }
    ],
    "description": "Bordado de corazón, ribetes granate y laterales de pelo.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Misma colección que la mochila LYSA-039, con etiqueta Pepe Moll. Recorte de la pieza inferior.",
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
    "commercialStatus": "pending",
    "publishedItems": [
      "LYSA-073",
      "LYSA-074"
    ]
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
    "commercialStatus": "pending",
    "publishedItems": [
      "LYSA-101",
      "LYSA-102",
      "LYSA-103"
    ]
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
    "commercialStatus": "pending",
    "publishedItems": [
      "LYSA-098",
      "LYSA-099",
      "LYSA-100"
    ]
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
  },
  {
    "id": "lysa-product-056",
    "name": "Bolso de ante marrón grande",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Marrón chocolate",
    "swatch": "#4a2a20",
    "images": [
      {
        "src": "assets/products/lysa-056.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.52 (3).jpeg",
        "alt": "Bolso de ante marrón grande",
        "crop": [
          0.12,
          0,
          0.78,
          0.95
        ]
      }
    ],
    "description": "Bolso de hombro en ante con asas largas y hebillas laterales.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "media",
    "evidence": "Etiqueta Pepe Moll en el bolso trasero. Se ve detrás del bolso LYSA-057: no hay toma individual.",
    "sourceRecord": "LYSA-004",
    "reference": "LYSA-056",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-057",
    "name": "Bolso de ante marrón con asas",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Marrón chocolate",
    "swatch": "#4f2c22",
    "images": [
      {
        "src": "assets/products/lysa-057.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.52 (3).jpeg",
        "alt": "Bolso de ante marrón con asas",
        "crop": [
          0.12,
          0.31,
          0.78,
          0.62
        ]
      }
    ],
    "description": "Bolso de mano en ante con asas cortas, hebillas y logotipo grabado.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Etiqueta o nombre Pepe Moll legible en la pieza.",
    "sourceRecord": "LYSA-004",
    "reference": "LYSA-057",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-058",
    "name": "Bolso verde oliva con tachuelas",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Verde oliva",
    "swatch": "#5b5e3a",
    "images": [
      {
        "src": "assets/products/lysa-058.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.53 (1).jpeg",
        "alt": "Bolso verde oliva con tachuelas",
        "crop": [
          0.26,
          0.03,
          0.56,
          0.48
        ]
      },
      {
        "src": "assets/products/lysa-058-2.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.52 (5).jpeg",
        "alt": "Bolso verde oliva con tachuelas, otra vista",
        "crop": [
          0.33,
          0.12,
          0.55,
          0.44
        ]
      }
    ],
    "description": "Forma de media luna, tachuelas doradas, hebillas laterales y borla.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Etiqueta o nombre Pepe Moll legible en la pieza.",
    "sourceRecord": "LYSA-006",
    "reference": "LYSA-058",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-059",
    "name": "Bolso negro con tachuelas",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Negro",
    "swatch": "#1d1c1c",
    "images": [
      {
        "src": "assets/products/lysa-059.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.53 (1).jpeg",
        "alt": "Bolso negro con tachuelas",
        "crop": [
          0.19,
          0.43,
          0.64,
          0.36
        ]
      },
      {
        "src": "assets/products/lysa-059-2.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.52 (5).jpeg",
        "alt": "Bolso negro con tachuelas, otra vista",
        "crop": [
          0.29,
          0.48,
          0.66,
          0.36
        ]
      }
    ],
    "description": "Forma de media luna, tachuelas doradas, hebillas laterales y borla.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Etiqueta o nombre Pepe Moll legible en la pieza.",
    "sourceRecord": "LYSA-006",
    "reference": "LYSA-059",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-060",
    "name": "Bolso estampado Nikky",
    "brand": "nicole-lee-usa",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Multicolor",
    "swatch": "#2b2b33",
    "images": [
      {
        "src": "assets/products/lysa-060.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.52.jpeg",
        "alt": "Bolso estampado Nikky",
        "crop": [
          0.24,
          0,
          0.62,
          0.61
        ]
      }
    ],
    "description": "Estampado de grafitis, asas con letras y bolsillo frontal naranja.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Texto Nikky by Nicole Lee USA en las asas.",
    "sourceRecord": "LYSA-009",
    "reference": "LYSA-060",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-061",
    "name": "Bandolera estampada Nikky",
    "brand": "nicole-lee-usa",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Multicolor",
    "swatch": "#2d2a30",
    "images": [
      {
        "src": "assets/products/lysa-061.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.52.jpeg",
        "alt": "Bandolera estampada Nikky",
        "crop": [
          0.1,
          0.56,
          0.8,
          0.44
        ]
      }
    ],
    "description": "Estampado de grafitis, cremalleras con ribete rojo y borlas naranjas.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Texto Nikky en el estampado y la correa, misma línea Nikky by Nicole Lee USA.",
    "sourceRecord": "LYSA-009",
    "reference": "LYSA-061",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-062",
    "name": "Bolso camel fruncido",
    "brand": null,
    "observedBrand": null,
    "brandStatus": "pending-commercial-confirmation",
    "categories": [
      "bolsos"
    ],
    "color": "Camel",
    "swatch": "#9a5a2e",
    "images": [
      {
        "src": "assets/products/lysa-062.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.53 (3).jpeg",
        "alt": "Bolso camel fruncido",
        "crop": [
          0.13,
          0,
          0.79,
          0.63
        ]
      }
    ],
    "description": "Bolso de hombro fruncido con asas de hebilla y emblema metálico.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "baja",
    "evidence": "Emblema metálico con R no identificable como marca. Sin marca.",
    "sourceRecord": "LYSA-012",
    "reference": "LYSA-062",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-063",
    "name": "Bolso crema con detalles camel",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Crema y camel",
    "swatch": "#ddd3cc",
    "images": [
      {
        "src": "assets/products/lysa-063.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.53 (3).jpeg",
        "alt": "Bolso crema con detalles camel",
        "crop": [
          0.1,
          0.5,
          0.84,
          0.5
        ]
      }
    ],
    "description": "Bolso de mano con asa superior, cordones laterales y borla camel.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre Pepe Moll en el frontal y en la etiqueta.",
    "sourceRecord": "LYSA-012",
    "reference": "LYSA-063",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-064",
    "name": "Bolso de leopardo marrón acolchado",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Leopardo marrón y negro",
    "swatch": "#7a5232",
    "images": [
      {
        "src": "assets/products/lysa-064.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.53 (6).jpeg",
        "alt": "Bolso de leopardo marrón acolchado",
        "crop": [
          0.15,
          0,
          0.37,
          0.62
        ]
      }
    ],
    "description": "Bolso de hombro acolchado con parte superior negra y asas largas.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Etiqueta Pepe Moll en la mochila de la misma serie Ultra Light Bag y mismo parche que LYSA-016.",
    "sourceRecord": "LYSA-015",
    "reference": "LYSA-064",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-065",
    "name": "Bandolera de leopardo marrón",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Leopardo marrón y negro",
    "swatch": "#7a5232",
    "images": [
      {
        "src": "assets/products/lysa-065.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.53 (6).jpeg",
        "alt": "Bandolera de leopardo marrón",
        "crop": [
          0.49,
          0.22,
          0.33,
          0.3
        ]
      }
    ],
    "description": "Bandolera acolchada con franja superior negra y parche frontal.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Serie Ultra Light Bag con etiqueta Pepe Moll en la mochila.",
    "sourceRecord": "LYSA-015",
    "reference": "LYSA-065",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-066",
    "name": "Mochila de leopardo marrón",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "mochilas"
    ],
    "color": "Leopardo marrón y negro",
    "swatch": "#7a5232",
    "images": [
      {
        "src": "assets/products/lysa-066.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.53 (6).jpeg",
        "alt": "Mochila de leopardo marrón",
        "crop": [
          0.58,
          0.36,
          0.37,
          0.54
        ]
      }
    ],
    "description": "Mochila acolchada con parte superior negra, asa y parche frontal.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Etiqueta colgante Pepe Moll en la mochila.",
    "sourceRecord": "LYSA-015",
    "reference": "LYSA-066",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-067",
    "name": "Mochila de leopardo gris",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "mochilas"
    ],
    "color": "Leopardo gris metalizado",
    "swatch": "#8a8478",
    "images": [
      {
        "src": "assets/products/lysa-067.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.54 (2).jpeg",
        "alt": "Mochila de leopardo gris",
        "crop": [
          0.03,
          0.09,
          0.43,
          0.72
        ]
      }
    ],
    "description": "Mochila acolchada con leopardo metalizado, parte superior negra y placa frontal.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Etiqueta o nombre Pepe Moll legible en la pieza.",
    "sourceRecord": "LYSA-019",
    "reference": "LYSA-067",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-068",
    "name": "Bandolera de leopardo gris",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Leopardo gris metalizado",
    "swatch": "#8a8478",
    "images": [
      {
        "src": "assets/products/lysa-068.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.54 (2).jpeg",
        "alt": "Bandolera de leopardo gris",
        "crop": [
          0.44,
          0.12,
          0.56,
          0.8
        ]
      }
    ],
    "description": "Bandolera acolchada con leopardo metalizado, franja negra y placa frontal.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Etiqueta o nombre Pepe Moll legible en la pieza.",
    "sourceRecord": "LYSA-019",
    "reference": "LYSA-068",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-069",
    "name": "Mochila camel con cremallera naranja",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "mochilas"
    ],
    "color": "Camel y naranja",
    "swatch": "#c99a6c",
    "images": [
      {
        "src": "assets/products/lysa-069.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.54 (4).jpeg",
        "alt": "Mochila camel con cremallera naranja",
        "crop": [
          0.04,
          0.15,
          0.48,
          0.68
        ]
      }
    ],
    "description": "Bordado think different, bolsillo frontal con cremallera naranja y asas cortas.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Etiqueta o nombre Pepe Moll legible en la pieza.",
    "sourceRecord": "LYSA-021",
    "reference": "LYSA-069",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-070",
    "name": "Mochila negra y gris",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "mochilas"
    ],
    "color": "Negro y gris",
    "swatch": "#2a2a2c",
    "images": [
      {
        "src": "assets/products/lysa-070.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.54 (4).jpeg",
        "alt": "Mochila negra y gris",
        "crop": [
          0.5,
          0.11,
          0.46,
          0.7
        ]
      }
    ],
    "description": "Bordado think different, bolsillo gris con cremallera y asa superior.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Etiqueta o nombre Pepe Moll legible en la pieza.",
    "sourceRecord": "LYSA-021",
    "reference": "LYSA-070",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-071",
    "name": "Mochila verde acolchada",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "mochilas"
    ],
    "color": "Verde",
    "swatch": "#4f6b62",
    "images": [
      {
        "src": "assets/products/lysa-071.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.54 (6).jpeg",
        "alt": "Mochila verde acolchada",
        "crop": [
          0.25,
          0,
          0.58,
          0.62
        ]
      }
    ],
    "description": "Acolchado geométrico, asas negras y llavero de pompón.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Etiqueta o nombre Pepe Moll legible en la pieza.",
    "sourceRecord": "LYSA-023",
    "reference": "LYSA-071",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-072",
    "name": "Bandolera verde de media luna",
    "brand": "pepe-moll",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Verde",
    "swatch": "#4f6b62",
    "images": [
      {
        "src": "assets/products/lysa-072.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.54 (6).jpeg",
        "alt": "Bandolera verde de media luna",
        "crop": [
          0.1,
          0.56,
          0.82,
          0.44
        ]
      }
    ],
    "description": "Acolchado geométrico, correa negra y llavero de pompón.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Etiqueta o nombre Pepe Moll legible en la pieza.",
    "sourceRecord": "LYSA-023",
    "reference": "LYSA-072",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-073",
    "name": "Bolso crema con asa de cadena",
    "brand": null,
    "observedBrand": null,
    "brandStatus": "pending-commercial-confirmation",
    "categories": [
      "bolsos"
    ],
    "color": "Crema y azul marino",
    "swatch": "#e8e4da",
    "images": [
      {
        "src": "assets/products/lysa-073.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.48.38 (7).jpeg",
        "alt": "Bolso crema con asa de cadena",
        "crop": [
          0.42,
          0.08,
          0.47,
          0.42
        ]
      }
    ],
    "description": "Bolso de solapa con asa de cadena trenzada y emblema en relieve.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "baja",
    "evidence": "Solo el cartel del expositor dice Pepe Moll; el emblema de la pieza no se identifica. Sin marca.",
    "sourceRecord": "LYSA-052",
    "reference": "LYSA-073",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-074",
    "name": "Bolso topo con asa de cadena",
    "brand": null,
    "observedBrand": null,
    "brandStatus": "pending-commercial-confirmation",
    "categories": [
      "bolsos"
    ],
    "color": "Topo",
    "swatch": "#a99780",
    "images": [
      {
        "src": "assets/products/lysa-074.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.48.38 (7).jpeg",
        "alt": "Bolso topo con asa de cadena",
        "crop": [
          0.42,
          0.45,
          0.47,
          0.41
        ]
      }
    ],
    "description": "Bolso de solapa con asa de cadena trenzada y emblema en relieve.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "baja",
    "evidence": "Solo el cartel del expositor dice Pepe Moll; el emblema de la pieza no se identifica. Sin marca.",
    "sourceRecord": "LYSA-052",
    "reference": "LYSA-074",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-075",
    "name": "Bolso metalizado de leopardo",
    "brand": "cacharel",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Gris metalizado",
    "swatch": "#6d6a5f",
    "images": [
      {
        "src": "assets/products/lysa-075.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.23 (1).jpeg",
        "alt": "Bolso metalizado de leopardo",
        "crop": [
          0.03,
          0.25,
          0.48,
          0.28
        ]
      }
    ],
    "description": "Bolso de mano metalizado con leopardo en relieve y monograma frontal.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre o monograma Cacharel legible en la pieza o su etiqueta.",
    "sourceRecord": "LYSA-025",
    "reference": "LYSA-075",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-076",
    "name": "Bolso plisado metalizado",
    "brand": "cacharel",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Gris plomo",
    "swatch": "#6b6660",
    "images": [
      {
        "src": "assets/products/lysa-076.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.23 (1).jpeg",
        "alt": "Bolso plisado metalizado",
        "crop": [
          0.48,
          0.4,
          0.52,
          0.28
        ]
      }
    ],
    "description": "Bolso alargado plisado con asa de cadena y placa con el nombre.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre o monograma Cacharel legible en la pieza o su etiqueta.",
    "sourceRecord": "LYSA-025",
    "reference": "LYSA-076",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-077",
    "name": "Bandolera bronce con solapa",
    "brand": "cacharel",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Bronce",
    "swatch": "#8e7c6c",
    "images": [
      {
        "src": "assets/products/lysa-077.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.23 (1).jpeg",
        "alt": "Bandolera bronce con solapa",
        "crop": [
          0.05,
          0.56,
          0.47,
          0.36
        ]
      },
      {
        "src": "assets/products/lysa-077-2.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.23.jpeg",
        "alt": "Bandolera bronce con solapa, otra vista",
        "crop": [
          0.17,
          0.52,
          0.68,
          0.31
        ]
      }
    ],
    "description": "Bandolera de solapa con monograma metálico y correa con el nombre.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre o monograma Cacharel legible en la pieza o su etiqueta.",
    "sourceRecord": "LYSA-025",
    "reference": "LYSA-077",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-078",
    "name": "Bolso tote marrón acolchado",
    "brand": "cacharel",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Marrón y bronce",
    "swatch": "#6b4a32",
    "images": [
      {
        "src": "assets/products/lysa-078.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.23 (2).jpeg",
        "alt": "Bolso tote marrón acolchado",
        "crop": [
          0,
          0,
          0.56,
          0.59
        ]
      }
    ],
    "description": "Acolchado de logotipos, franja bronce y asas de cinta.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre o monograma Cacharel legible en la pieza o su etiqueta.",
    "sourceRecord": "LYSA-027",
    "reference": "LYSA-078",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-079",
    "name": "Bandolera taupe con bolsillo frontal",
    "brand": "cacharel",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Taupe",
    "swatch": "#7d6a5c",
    "images": [
      {
        "src": "assets/products/lysa-079.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.23 (2).jpeg",
        "alt": "Bandolera taupe con bolsillo frontal",
        "crop": [
          0.09,
          0.56,
          0.53,
          0.31
        ]
      }
    ],
    "description": "Bandolera de nailon con dos cremalleras, bolsillo frontal y logotipo.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre o monograma Cacharel legible en la pieza o su etiqueta.",
    "sourceRecord": "LYSA-027",
    "reference": "LYSA-079",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-080",
    "name": "Bolso marrón de asas cortas",
    "brand": "cacharel",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Marrón chocolate",
    "swatch": "#4e3527",
    "images": [
      {
        "src": "assets/products/lysa-080.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.23 (2).jpeg",
        "alt": "Bolso marrón de asas cortas",
        "crop": [
          0.54,
          0.34,
          0.46,
          0.41
        ]
      }
    ],
    "description": "Franja bronce, logotipos en relieve y laterales beige.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre o monograma Cacharel legible en la pieza o su etiqueta.",
    "sourceRecord": "LYSA-027",
    "reference": "LYSA-080",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-081",
    "name": "Bolso tote con monograma",
    "brand": "cacharel",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Marrón oscuro",
    "swatch": "#3d3530",
    "images": [
      {
        "src": "assets/products/lysa-081.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.23 (3).jpeg",
        "alt": "Bolso tote con monograma",
        "crop": [
          0,
          0,
          0.58,
          0.68
        ]
      }
    ],
    "description": "Monograma en toda la pieza, bolsillo con cremallera y asas con hebillas.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre o monograma Cacharel legible en la pieza o su etiqueta.",
    "sourceRecord": "LYSA-028",
    "reference": "LYSA-081",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-082",
    "name": "Bandolera con monograma",
    "brand": "cacharel",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Marrón oscuro",
    "swatch": "#3d3530",
    "images": [
      {
        "src": "assets/products/lysa-082.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.23 (3).jpeg",
        "alt": "Bandolera con monograma",
        "crop": [
          0.55,
          0.43,
          0.45,
          0.33
        ]
      }
    ],
    "description": "Bandolera rectangular con monograma, cremallera dorada y bolsillo frontal.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre o monograma Cacharel legible en la pieza o su etiqueta.",
    "sourceRecord": "LYSA-028",
    "reference": "LYSA-082",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-083",
    "name": "Bolso patchwork animal print",
    "brand": "cacharel",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Multicolor",
    "swatch": "#c88a2c",
    "images": [
      {
        "src": "assets/products/lysa-083.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.24 (1).jpeg",
        "alt": "Bolso patchwork animal print",
        "crop": [
          0,
          0.3,
          0.47,
          0.36
        ]
      }
    ],
    "description": "Bolso alargado con patchwork de estampados animales y cuadros.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre o monograma Cacharel legible en la pieza o su etiqueta.",
    "sourceRecord": "LYSA-030",
    "reference": "LYSA-083",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-084",
    "name": "Bandolera patchwork con solapa",
    "brand": "cacharel",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Multicolor",
    "swatch": "#c88a2c",
    "images": [
      {
        "src": "assets/products/lysa-084.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.24 (1).jpeg",
        "alt": "Bandolera patchwork con solapa",
        "crop": [
          0.48,
          0.2,
          0.5,
          0.28
        ]
      }
    ],
    "description": "Solapa con patchwork de estampados animales y bolsillos laterales.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre o monograma Cacharel legible en la pieza o su etiqueta.",
    "sourceRecord": "LYSA-030",
    "reference": "LYSA-084",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-085",
    "name": "Bandolera patchwork pequeña",
    "brand": "cacharel",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Multicolor",
    "swatch": "#c88a2c",
    "images": [
      {
        "src": "assets/products/lysa-085.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.24 (1).jpeg",
        "alt": "Bandolera patchwork pequeña",
        "crop": [
          0.35,
          0.48,
          0.36,
          0.22
        ]
      }
    ],
    "description": "Formato pequeño con solapa de patchwork animal print y base de cuadros.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre o monograma Cacharel legible en la pieza o su etiqueta.",
    "sourceRecord": "LYSA-030",
    "reference": "LYSA-085",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-086",
    "name": "Bolso bronce de leopardo con asas",
    "brand": "cacharel",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Bronce",
    "swatch": "#6e5338",
    "images": [
      {
        "src": "assets/products/lysa-086.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.24 (3).jpeg",
        "alt": "Bolso bronce de leopardo con asas",
        "crop": [
          0,
          0.11,
          0.48,
          0.54
        ]
      }
    ],
    "description": "Leopardo metalizado, asas doradas anudadas y monograma frontal.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre o monograma Cacharel legible en la pieza o su etiqueta.",
    "sourceRecord": "LYSA-032",
    "reference": "LYSA-086",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-087",
    "name": "Bolso negro de leopardo en relieve",
    "brand": "cacharel",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Negro",
    "swatch": "#1f1d1d",
    "images": [
      {
        "src": "assets/products/lysa-087.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.24 (3).jpeg",
        "alt": "Bolso negro de leopardo en relieve",
        "crop": [
          0.47,
          0,
          0.5,
          0.56
        ]
      }
    ],
    "description": "Leopardo tono sobre tono, asas redondas y monograma frontal.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre o monograma Cacharel legible en la pieza o su etiqueta.",
    "sourceRecord": "LYSA-032",
    "reference": "LYSA-087",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-088",
    "name": "Bolso plateado de leopardo",
    "brand": "cacharel",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Plata envejecida",
    "swatch": "#8f8a7a",
    "images": [
      {
        "src": "assets/products/lysa-088.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.24 (3).jpeg",
        "alt": "Bolso plateado de leopardo",
        "crop": [
          0.22,
          0.52,
          0.52,
          0.31
        ]
      }
    ],
    "description": "Bolso pequeño metalizado con leopardo y monograma frontal.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre o monograma Cacharel legible en la pieza o su etiqueta.",
    "sourceRecord": "LYSA-032",
    "reference": "LYSA-088",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-089",
    "name": "Bolso beige de asas plateadas",
    "brand": "cacharel",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Beige y plata",
    "swatch": "#c4a78a",
    "images": [
      {
        "src": "assets/products/lysa-089.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.24.jpeg",
        "alt": "Bolso beige de asas plateadas",
        "crop": [
          0,
          0.13,
          0.48,
          0.52
        ]
      }
    ],
    "description": "Bolso de mano con asas plateadas y monograma en relieve.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre o monograma Cacharel legible en la pieza o su etiqueta.",
    "sourceRecord": "LYSA-029",
    "reference": "LYSA-089",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-090",
    "name": "Bolso negro de asas metalizadas",
    "brand": "cacharel",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Negro",
    "swatch": "#1c1c1c",
    "images": [
      {
        "src": "assets/products/lysa-090.webp",
        "original": "assets/products/WhatsApp Image 2026-11-05 at 19.21.24.jpeg",
        "alt": "Bolso negro de asas metalizadas",
        "crop": [
          0.53,
          0.24,
          0.45,
          0.54
        ]
      }
    ],
    "description": "Bolso de mano con asas metalizadas y monograma en relieve.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre o monograma Cacharel legible en la pieza o su etiqueta.",
    "sourceRecord": "LYSA-029",
    "reference": "LYSA-090",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-091",
    "name": "Maleta rígida turquesa",
    "brand": "bienoti",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "maletas"
    ],
    "color": "Turquesa",
    "swatch": "#3cc7c8",
    "images": [
      {
        "src": "assets/products/lysa-091.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.42.58 (1).jpeg",
        "alt": "Maleta rígida turquesa",
        "crop": [
          0.1,
          0.09,
          0.42,
          0.83
        ]
      }
    ],
    "description": "Carcasa con relieve, asa granate y ruedas dobles. Se muestra en tres tamaños.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Etiqueta y nombre Bienoti en la carcasa.",
    "sourceRecord": "LYSA-047",
    "reference": "LYSA-091",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-092",
    "name": "Maleta rígida lila con ruedas naranjas",
    "brand": "bienoti",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "maletas"
    ],
    "color": "Lila",
    "swatch": "#7a5c78",
    "images": [
      {
        "src": "assets/products/lysa-092.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.42.58 (1).jpeg",
        "alt": "Maleta rígida lila con ruedas naranjas",
        "crop": [
          0.52,
          0.09,
          0.42,
          0.83
        ]
      }
    ],
    "description": "Carcasa con relieve, asa y ruedas naranjas. Se muestra en tres tamaños.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Etiqueta y nombre Bienoti en la carcasa.",
    "sourceRecord": "LYSA-047",
    "reference": "LYSA-092",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-093",
    "name": "Bolsa de viaje naranja con ruedas",
    "brand": "bienoti",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "maletas"
    ],
    "color": "Naranja",
    "swatch": "#d9622b",
    "images": [
      {
        "src": "assets/products/lysa-093.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.42.58 (2).jpeg",
        "alt": "Bolsa de viaje naranja con ruedas",
        "crop": [
          0.09,
          0.04,
          0.43,
          0.58
        ]
      },
      {
        "src": "assets/products/lysa-093-2.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.42.58 (2).jpeg",
        "alt": "Bolsa de viaje naranja con ruedas, otra vista",
        "crop": [
          0.3,
          0.45,
          0.67,
          0.49
        ]
      }
    ],
    "description": "Asa telescópica, ruedas y correas de compresión. Se muestra en tres tamaños.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Etiqueta Bienoti en las bolsas.",
    "sourceRecord": "LYSA-048",
    "reference": "LYSA-093",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-094",
    "name": "Bolsa de viaje rosa",
    "brand": "totto",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "maletas"
    ],
    "color": "Rosa",
    "swatch": "#d9b9cb",
    "images": [
      {
        "src": "assets/products/lysa-094.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.42.58.jpeg",
        "alt": "Bolsa de viaje rosa",
        "crop": [
          0.04,
          0.07,
          0.47,
          0.27
        ]
      }
    ],
    "description": "Bolsillos frontales con cremallera, asas y etiqueta de la marca.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Logotipo Totto en la pieza y en la etiqueta.",
    "sourceRecord": "LYSA-050",
    "reference": "LYSA-094",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-095",
    "name": "Bolso shopper rosa",
    "brand": "totto",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "bolsos"
    ],
    "color": "Rosa",
    "swatch": "#d6b6c7",
    "images": [
      {
        "src": "assets/products/lysa-095.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.42.58.jpeg",
        "alt": "Bolso shopper rosa",
        "crop": [
          0.5,
          0.21,
          0.45,
          0.23
        ]
      }
    ],
    "description": "Asas largas, bolsillo frontal con cremallera y correa.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Etiqueta Totto colgada del bolso.",
    "sourceRecord": "LYSA-050",
    "reference": "LYSA-095",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-096",
    "name": "Mochila rosa",
    "brand": "totto",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "mochilas"
    ],
    "color": "Rosa",
    "swatch": "#d3a9bd",
    "images": [
      {
        "src": "assets/products/lysa-096.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.42.58.jpeg",
        "alt": "Mochila rosa",
        "crop": [
          0.24,
          0.28,
          0.36,
          0.35
        ]
      }
    ],
    "description": "Varios compartimentos, placa frontal y llavero de pompón.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Placa Totto en el frontal.",
    "sourceRecord": "LYSA-050",
    "reference": "LYSA-096",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-097",
    "name": "Maleta rígida rosa",
    "brand": "totto",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "maletas"
    ],
    "color": "Rosa",
    "swatch": "#d8b5c4",
    "images": [
      {
        "src": "assets/products/lysa-097.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.42.58.jpeg",
        "alt": "Maleta rígida rosa",
        "crop": [
          0.21,
          0.58,
          0.42,
          0.36
        ]
      }
    ],
    "description": "Polipropileno con relieve horizontal y ruedas dobles.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Etiqueta Totto Travel con el material en la maleta.",
    "sourceRecord": "LYSA-050",
    "reference": "LYSA-097",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-098",
    "name": "Maleta Neon Lux roja",
    "brand": "gladiator",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "maletas"
    ],
    "color": "Rojo",
    "swatch": "#9e1d22",
    "images": [
      {
        "src": "assets/products/lysa-098.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.53.02 (3).jpeg",
        "alt": "Maleta Neon Lux roja",
        "crop": [
          0,
          0.43,
          0.37,
          0.345
        ]
      }
    ],
    "description": "Policarbonato con relieve vertical y ruedas dobles.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "media",
    "evidence": "Captura de una historia: texto «Maletas Gladiator en policarbonato» y rótulo Neon Lux. Calidad de imagen limitada.",
    "sourceRecord": "LYSA-054",
    "reference": "LYSA-098",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-099",
    "name": "Maleta Neon Lux rosa dorado",
    "brand": "gladiator",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "maletas"
    ],
    "color": "Rosa dorado",
    "swatch": "#c08f78",
    "images": [
      {
        "src": "assets/products/lysa-099.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.53.02 (3).jpeg",
        "alt": "Maleta Neon Lux rosa dorado",
        "crop": [
          0.35,
          0.43,
          0.31,
          0.345
        ]
      }
    ],
    "description": "Policarbonato con relieve vertical y ruedas dobles.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "media",
    "evidence": "Captura de una historia: texto «Maletas Gladiator en policarbonato» y rótulo Neon Lux. Calidad de imagen limitada.",
    "sourceRecord": "LYSA-054",
    "reference": "LYSA-099",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-100",
    "name": "Maleta Neon Lux azul",
    "brand": "gladiator",
    "observedBrand": null,
    "brandStatus": "visually-identified",
    "categories": [
      "maletas"
    ],
    "color": "Azul",
    "swatch": "#5d7fb5",
    "images": [
      {
        "src": "assets/products/lysa-100.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.53.02 (3).jpeg",
        "alt": "Maleta Neon Lux azul",
        "crop": [
          0.64,
          0.43,
          0.33,
          0.345
        ]
      }
    ],
    "description": "Policarbonato con relieve vertical y ruedas dobles.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "media",
    "evidence": "Captura de una historia: texto «Maletas Gladiator en policarbonato» y rótulo Neon Lux. Calidad de imagen limitada.",
    "sourceRecord": "LYSA-054",
    "reference": "LYSA-100",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-101",
    "name": "Maleta roja con relieve horizontal",
    "brand": null,
    "observedBrand": null,
    "brandStatus": "pending-commercial-confirmation",
    "categories": [
      "maletas"
    ],
    "color": "Rojo",
    "swatch": "#d2342a",
    "images": [
      {
        "src": "assets/products/lysa-101.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.53.02 (2).jpeg",
        "alt": "Maleta roja con relieve horizontal",
        "crop": [
          0.05,
          0.53,
          0.3,
          0.28
        ]
      }
    ],
    "description": "Carcasa rígida con relieve horizontal, neceser a juego y ruedas dobles.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "media",
    "evidence": "Captura de una historia. Solo el rótulo de la pared dice Gladiator; la pieza no muestra marca legible. Sin marca.",
    "sourceRecord": "LYSA-053",
    "reference": "LYSA-101",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-102",
    "name": "Maleta beige con relieve horizontal",
    "brand": null,
    "observedBrand": null,
    "brandStatus": "pending-commercial-confirmation",
    "categories": [
      "maletas"
    ],
    "color": "Beige",
    "swatch": "#cbb59a",
    "images": [
      {
        "src": "assets/products/lysa-102.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.53.02 (2).jpeg",
        "alt": "Maleta beige con relieve horizontal",
        "crop": [
          0.3,
          0.54,
          0.4,
          0.29
        ]
      }
    ],
    "description": "Carcasa rígida con relieve horizontal, neceser a juego y ruedas dobles.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "media",
    "evidence": "Captura de una historia. Solo el rótulo de la pared dice Gladiator; la pieza no muestra marca legible. Sin marca.",
    "sourceRecord": "LYSA-053",
    "reference": "LYSA-102",
    "commercialStatus": "pending"
  },
  {
    "id": "lysa-product-103",
    "name": "Maleta verde con relieve horizontal",
    "brand": null,
    "observedBrand": null,
    "brandStatus": "pending-commercial-confirmation",
    "categories": [
      "maletas"
    ],
    "color": "Verde botella",
    "swatch": "#2f4d43",
    "images": [
      {
        "src": "assets/products/lysa-103.webp",
        "original": "assets/products/WhatsApp Image 2026-11-07 at 11.53.02 (2).jpeg",
        "alt": "Maleta verde con relieve horizontal",
        "crop": [
          0.59,
          0.56,
          0.39,
          0.32
        ]
      }
    ],
    "description": "Carcasa rígida con relieve horizontal y ruedas dobles.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "media",
    "evidence": "Captura de una historia. Solo el rótulo de la pared dice Gladiator; la pieza no muestra marca legible. Sin marca.",
    "sourceRecord": "LYSA-053",
    "reference": "LYSA-103",
    "commercialStatus": "pending"
  }
];
