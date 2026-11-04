# Assets de Tienda Lysa

## Logo del cliente

`images/logo.jpg` es el logo circular original. `logo.jpg` es una copia sin alteraciones, utilizada en cabecera, footer y favicon. Ambos miden 150 × 150 px y se conservan intactos.

## Recursos reales aportados por la tienda

Integración: 4 de noviembre de 2026. Archivos inspeccionados físicamente y utilizados localmente, sin modificar sus colores ni su proporción.

| Archivo local | Dimensiones | Uso |
| --- | --- | --- |
| `images/escaparate.jpg` | 1600 × 1200 | Fotografía real y completa del establecimiento en «Conoce Tienda Lysa» |
| `images/banner.jpg` | 1320 × 633 | Pieza corporativa secundaria dentro de ese mismo bloque |

Los seis logos de proveedores aportados están documentados en [marcas/README.md](marcas/README.md). No se ha encontrado otro logo circular en `marcas/`; se mantiene el original existente. Los recursos reales se distinguen de las imágenes generadas del catálogo de muestra.

## Imágenes de demostración

Fecha: 2 de noviembre de 2026. Herramienta: generación de imágenes integrada `image_gen.imagegen`, siguiendo la skill `imagegen`; no se utilizó la alternativa CLI/API. Todas las imágenes son ilustraciones fotorrealistas de piezas ficticias sin marca, no fotografías del inventario del cliente. Los originales PNG se conservaron en el directorio de imágenes generadas de Codex y se exportaron a JPEG de calidad 88 para reducir el peso, sin cambiar su composición.

| Archivo local | Dimensiones | Uso |
| --- | --- | --- |
| `photos/hero.jpg` | 1536 × 1024 | Hero, editorial y bandolera de muestra |
| `photos/bag.jpg` | 1122 × 1402 | Categoría bolsos y Bolso Curva |
| `photos/backpack.jpg` | 1122 × 1402 | Categoría mochilas y Mochila Pausa |
| `photos/suitcase.jpg` | 1122 × 1402 | Categoría maletas y Maleta Rumbo |
| `photos/accessory.jpg` | 1122 × 1402 | Categoría complementos y Estuche Ritual |

La búsqueda previa se realizó en Unsplash/Pexels y se consultó la [licencia de Unsplash](https://unsplash.com/es/licencia). La descarga intentada desde `images.unsplash.com` fue bloqueada por la conectividad del entorno. Por ello no se incluye ni se atribuye a Unsplash ninguna fotografía. Las imágenes generadas no tienen una supuesta licencia de banco de imágenes ni se presentan como CC0. Sustituirlas por fotografía autorizada de la tienda para el catálogo comercial definitivo.

No hay hotlinks, URLs temporales, fuentes remotas, imágenes de Instagram ni recursos de terceros descargados sin verificar. La franja utiliza seis logos aportados por el cliente y texto provisional para Torrens; el menú conserva sus nombres tipográficos. Las imágenes de ejemplo no se atribuyen a esas marcas. La investigación y el recurso pendiente de Torrens se documentan en [marcas/README.md](marcas/README.md).

## Prompts finales utilizados

### Hero

> Use case: photorealistic-natural. Asset type: fashion boutique editorial website hero photograph, landscape aspect ratio 3:2. Primary request: beautiful premium fashion accessories still life. A single caramel cognac brown leather shoulder handbag with curved flap and subtle brushed brass closure, completely unbranded, sits on a honey colored wooden chair. A cream linen blouse is draped on the left side of the chair, a tiny leafy branch creates natural organic shadow on a pale ivory plaster wall. Sunlit Mediterranean apartment, beautiful afternoon light, authentic leather grain and linen texture. Warm muted ivory cream and caramel with dark brown details, tasteful magazine photography, deep rich realistic shadows, fine analog film texture. Bag is main protagonist and occupies center-right, shown completely with comfortable breathing room. High quality photographic realism. No people, no typography, no letters, no logos, no watermarks. This is a fictional demonstration bag, not any real brand product.

### Bolso

> Use case: product-mockup. A single completely unbranded dark chocolate brown leather sculptural handbag with elegant rounded top handle and understated small brass buckle. Centered on a matte sand-colored pedestal against a pale warm beige plaster wall, subtle natural light and fine leather texture, high-end fashion magazine product photograph, full bag visible with negative space, portrait 4:5. No text, no logos, no watermark. Fictional demo product.

### Mochila

> Use case: product-mockup. Editorial fashion product photograph for a premium boutique. One completely unbranded compact sand beige canvas backpack with caramel brown straps on a cream plaster pedestal, warm ivory studio backdrop with natural window shadow, delicate fabric texture, quiet luxury, realistic photography, centered whole bag, portrait 4:5 framing, no text, no logos, no watermark.

### Maleta

> Use case: product-mockup. Premium editorial fashion photography of one completely unbranded cream ivory hard shell carry on suitcase, subtle horizontal ribs, brown handle, on a warm limestone floor near a pale plaster wall. Mediterranean sunlight, soft natural shadows, realistic photography, restrained boutique aesthetic, full suitcase visible including wheels, portrait 4:5 crop. No people, no text, no logos, no watermark.

### Complementos

> Use case: product-mockup. Premium fashion editorial still life of a chocolate brown completely unbranded small leather zip pouch with a muted dusty rose silk scarf loosely arranged beside it on a warm ivory travertine surface, clean natural sunlight and beautiful soft shadows, tactile texture, editorial magazine photography, portrait 4:5, elegant restrained boutique composition, no text, no logos, no watermark.
