"use strict";

const BRANDS = [
  { id: "gladiator", name: "Gladiator", families: ["Maletas", "Mochilas de viaje", "Bolsas de viaje"], website: "https://maletasgladiator.com/", logo: "assets/marcas/gladiator-logo.png", logoStatus: "approved" },
  { id: "cacharel", name: "Cacharel", families: ["Bolsos", "Mochilas", "Carteras", "Complementos"], website: "https://cacharelbags.com/", logo: "assets/marcas/cacharel-logo.jpg", logoStatus: "approved" },
  { id: "anekke", name: "Anekke", families: ["Bolsos", "Mochilas", "Monederos", "Complementos"], website: "https://anekke.com/", logo: "assets/marcas/anneke-logo.png", logoStatus: "approved" },
  { id: "totto", name: "Totto", families: ["Mochilas", "Maletas", "Bolsos", "Accesorios"], website: "https://www.totto.es/", logo: "assets/marcas/totto-logo.jpg", logoStatus: "approved" },
  { id: "pepe-moll", name: "Pepe Moll", families: ["Bolsos", "Mochilas", "Complementos"], website: "https://pepemoll.es/", logo: "assets/marcas/pepemoll-logo.jpg", logoStatus: "approved" },
  { id: "torrens", name: "Torrens", identity: "Torrens Hermanos · marroquinería", families: ["Bolsos", "Bandoleras", "Mochilas", "Carteras"], website: "https://www.torrenshermanos.com/", logo: null, logoStatus: "pending-verification" },
  { id: "gabol", name: "Gabol", families: ["Maletas", "Mochilas", "Estuches", "Neceseres", "Complementos"], website: "https://gabol.com/", logo: "assets/marcas/gabol-logo.png", logoStatus: "approved" }
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
    "name": "Complementos"
  },
  {
    "id": "unclassified",
    "name": "Por clasificar"
  }
];

/* Un registro review representa una fotografía pendiente, nunca un conjunto en venta.
 * brand: id confirmado visualmente de BRANDS o null. observedBrand no crea filtros.
 * price y availability siguen pendientes. Los IDs se conservan al editar registros. */
const CATALOG_PRODUCTS = [
  {
    "id": "lysa-photo-001",
    "name": "Bolso fruncido topo",
    "brand": null,
    "observedBrand": "Nicole Lee USA",
    "brandStatus": "pending-commercial-confirmation",
    "categories": [
      "bolsos"
    ],
    "color": "Topo",
    "swatch": "#8b8571",
    "images": [
      {
        "src": "assets/products/photo-001.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.51.jpeg",
        "alt": "Bolso fruncido topo"
      }
    ],
    "description": "Cuerpo fruncido, asa con piezas metálicas y adornos colgantes.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Distintivos Nicole Lee USA legibles en el frontal y medallón."
  },
  {
    "id": "lysa-photo-002",
    "name": "Bolso de hombro rosa",
    "brand": null,
    "observedBrand": "Nicole Lee USA",
    "brandStatus": "pending-commercial-confirmation",
    "categories": [
      "bolsos"
    ],
    "color": "Rosa",
    "swatch": "#b88c89",
    "images": [
      {
        "src": "assets/products/photo-002.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.52 (1).jpeg",
        "alt": "Bolso de hombro rosa"
      }
    ],
    "description": "Silueta curva, cierre superior y asa con eslabones dorados.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre Nicole Lee USA legible en el frontal. Es un artículo distinto del bolso topo."
  },
  {
    "id": "lysa-photo-003",
    "name": "Maleta marrón ilustrada",
    "brand": null,
    "observedBrand": "Nicole Lee USA",
    "brandStatus": "pending-commercial-confirmation",
    "categories": [
      "maletas"
    ],
    "color": "Marrón",
    "swatch": "#60412e",
    "images": [
      {
        "src": "assets/products/photo-003.webp",
        "original": "assets/photos/WhatsApp Image 2026-11-04 at 22.19.52 (2).jpeg",
        "alt": "Maleta marrón ilustrada"
      }
    ],
    "description": "Maleta con ruedas, asa superior y dibujo de una mujer con flores.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Placa Nicole Lee USA y tiradores rotulados."
  },
  {
    "id": "lysa-photo-007",
    "name": "Bolso negro con asas menta",
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
        "alt": "Bolso negro con asas menta"
      }
    ],
    "description": "Asas largas verde menta, cordones laterales y borde superior fruncido.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Etiqueta unida al bolso y nombre Pepe Moll en el frontal."
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
    "evidence": "Emblema oscuro no suficientemente legible; no atribuir por similitud."
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
        "alt": "Bolso negro con bolsillo frontal"
      }
    ],
    "description": "Dos asas cortas, bolsillo con cremallera y adorno de flecos.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre Pepe Moll visible en el bolsillo del propio bolso."
  },
  {
    "id": "lysa-photo-013",
    "name": "Bolso negro de dos bolsillos",
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
        "alt": "Bolso negro de dos bolsillos"
      }
    ],
    "description": "Asas largas, banda horizontal gris y dos bolsillos delanteros con cremallera.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Logotipo Pepe Moll en la esquina inferior. Se repite al fondo de 53 (5)."
  },
  {
    "id": "lysa-photo-016",
    "name": "Bolso de hombro animal print",
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
        "alt": "Bolso de hombro animal print"
      }
    ],
    "description": "Estampado de manchas, asas negras y borde superior fruncido.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Etiqueta Pepe Moll unida al artículo y placa frontal."
  },
  {
    "id": "lysa-photo-018",
    "name": "Bolso gris de dos bolsillos",
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
        "alt": "Bolso gris de dos bolsillos"
      }
    ],
    "description": "Asa ancha regulable y dos bolsillos delanteros con botones.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre Pepe Moll en el parche del producto."
  },
  {
    "id": "lysa-photo-020",
    "name": "Bolso verde de asas cortas",
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
        "alt": "Bolso verde de asas cortas"
      }
    ],
    "description": "Dos asas cortas, cordones laterales y bolsillo frontal verde claro.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Nombre Pepe Moll en el frontal. No hay prueba suficiente de uso como mochila."
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
        "alt": "Mochila verde y negra"
      }
    ],
    "description": "Asa superior, cierre de cremallera y bolsillo frontal negro.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "alta",
    "evidence": "Placa Pepe Moll en el producto; el soporte Anekke no identifica la mochila."
  },
  {
    "id": "lysa-photo-024",
    "name": "Bolso de mano animal print",
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
        "alt": "Bolso de mano animal print"
      }
    ],
    "description": "Dos asas negras, pequeñas hebillas y estampado de manchas.",
    "availability": "pending",
    "price": null,
    "featured": false,
    "recordType": "product",
    "confidence": "media",
    "evidence": "Monograma circular no inequívoco. El expositor Pepe Moll no basta. También aparece en 53 (6)."
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
    "evidence": "Texto Nikky by Nicole Lee USA en las asas. Dos artículos: bolso de asas y bandolera; no son un lote confirmado."
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
    "evidence": "Nombre Pepe Moll visible en ambos. Bolso de hombro trasero y bolso de asas delantero: dos artículos."
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
    "evidence": "Placas Pepe Moll legibles en ambos productos."
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
    "evidence": "Pepe Moll visible en los cuatro artículos de 53 (1). Dos bolsos y dos carteras; venta conjunta sin confirmar. 53 (2) es duplicado binario de 52 (5)."
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
    "evidence": "Pepe Moll confirmado solo en el bolso beige delantero. Bolso camel trasero con R: marca sin confirmar."
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
    "evidence": "Pepe Moll visible en la bandolera delantera. El bolso trasero ya está registrado en 53 (4)."
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
    "evidence": "Se ven etiquetas Pepe Moll en parte de la imagen, no en todos. Incluye el bolso de 54; comparar colores con 53 (7) y 54 (2) antes de crear variantes."
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
    "evidence": "Placas Pepe Moll en ambos artículos. Posible relación con la composición 53 (6); confirmar variantes."
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
    "evidence": "Pepe Moll visible en ambas. El soporte Anekke es ajeno a la identificación."
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
    "evidence": "Nombre Pepe Moll legible en ambos productos. Dos artículos independientes."
  }
];
