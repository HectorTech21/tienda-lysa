# Tienda Lysa · instrucciones y decisiones

## Panel de administración y Cloudflare · 13 de noviembre de 2026

Sustituye lo que se diga más abajo sobre Vercel, «sin npm ni backend», la ubicación de los archivos en la raíz y el servidor local con Python.

- **Estructura.** Un Worker de Cloudflare (`src/`, `wrangler.jsonc`) con archivos estáticos en `public/` (web pública y panel), base de datos D1 (`DB`) e imágenes en R2 (`BUCKET`). La web y el panel siguen siendo HTML, CSS y JavaScript nativo, sin frameworks ni librerías. La única dependencia es `wrangler` (desarrollo). `vercel.json` y `.vercelignore` se han eliminado; las cabeceras de seguridad están en `public/_headers` (estáticos) y en `src/index.js` (API, panel e imágenes). `public/.assetsignore` deja fuera los `.md` y las fotos originales `WhatsApp Image…`.
- **Local.** `npx wrangler dev` (puerto 8787; `.claude/launch.json` ya lo usa). D1 y R2 locales viven en `.wrangler/` (fuera de git). Esquema: `npx wrangler d1 migrations apply tienda-lysa --local`. Datos: `node scripts/migrar-catalogo.mjs --local`. No ejecutar `wrangler login`, `deploy` ni nada con `--remote` sin que el usuario lo pida.
- **Dominio.** El principal es `tienda-lysa.com`, sin `www` (`routes` con `custom_domain` en `wrangler.jsonc`). `workers_dev: false` y `preview_urls: false`: la web solo se sirve desde el dominio propio. `www.tienda-lysa.com` redirige con 301 al principal mediante una regla de redirección de Cloudflare (los archivos estáticos no pasan por el Worker); `src/index.js` hace la misma redirección si `www` llegara al Worker. `dev.host: "localhost"` es necesario: sin él, `wrangler dev` se presenta como `tienda-lysa.com` y el panel local responde 401. La aplicación de Access debe cubrir `/admin` y `/api/admin` en los dos nombres, con y sin `www`.
- **Pendiente en Cloudflare (marcado con `TODO` en `wrangler.jsonc`):** `database_id` real, bucket real, `ACCESS_TEAM_DOMAIN` y `ACCESS_AUD`. Al cambiar `database_id` la D1 local empieza vacía: volver a aplicar esquema y migración en local.
- **Autenticación (`src/auth.js`).** `/admin` y `/api/admin/*` validan el JWT de Cloudflare Access (`Cf-Access-Jwt-Assertion`: firma RS256 con las claves del equipo, emisor, audiencia y caducidad). Por defecto se bloquea con 401, también si faltan las variables. El salto solo existe con `DEV_BYPASS_AUTH=true` en `.dev.vars` (en `.gitignore`, nunca en `wrangler.jsonc`) y además solo en `localhost` o red privada. No relajar ninguna de las dos condiciones. Pruebas: `node scripts/probar-auth.mjs`.
- **Datos (`migrations/0001_productos.sql`).** `productos` (id, referencia, titulo, slug, descripcion, precio_centimos, categoria, marca, marca_slug, color, visible, destacado, fechas), `imagenes` (clave de R2 y orden; orden 0 = principal) y `contadores`. La referencia `LYSA-NNN` sale del contador, que solo sube: no se edita ni se reutiliza. La categoría «Accesorios» conserva el identificador `complementos` que ya usa la web. `marca` guarda el nombre visible (lista fija o texto de «Otra marca…»); `marca_slug` es el filtro. Precio vacío = «Consultar precio». Orden público: destacados primero y después los más recientes; la migración conserva el orden original con la fecha de creación.
- **API (`src/api.js`, validación en `src/validacion.js`).** Pública: `GET /api/productos?categoria=&marca=` (solo visibles y con foto) e imágenes en `/img/productos/…`. Panel: `GET/POST /api/admin/productos`, `GET/PATCH/DELETE /api/admin/productos/:id`, `POST /api/admin/productos/:id/imagenes` (cuerpo binario; JPG, PNG o WebP comprobados por contenido, máximo 5 MB y 12 por producto), `PUT …/imagenes/orden`, `DELETE /api/admin/imagenes/:id`. Los cambios se rechazan si el `Origin` es de otro sitio.
- **Panel (`public/admin/`).** Pensado para móvil y para una persona no técnica: textos en español llano, controles de 48 px y letra de 16 px. Las fotos se reducen en el navegador a 1600 px y WebP (JPEG si el navegador no crea WebP) respetando la orientación EXIF; un archivo ilegible (por ejemplo HEIC fuera de Safari) muestra «Esta foto no se puede subir, prueba a hacer una captura o a cambiar el formato». Guardar se desactiva mientras se preparan o suben fotos; si la subida falla, el producto ya creado se retoma sin duplicarse. Aviso al salir con cambios sin guardar.
- **Scripts.** `scripts/migrar-catalogo.mjs` y `scripts/backup.mjs` aceptan `--local` (por defecto) y `--remote`. La migración no sobrescribe productos existentes y solo pasa los registros `product`; los 23 `review` se quedan en el archivo original, que no se migra.
- **Web pública.** `public/script.js` carga los productos con `fetch("/api/productos")` (`loadCatalog`) y los adapta a la forma que ya usaban tarjetas y fichas (`toProduct`); cuadrícula, «Ver más», filtros, WhatsApp y favoritos no cambian. Con precio se muestra «39,90 €»; sin precio, «Consultar precio». `public/brands-data.js` contiene solo `BRANDS` y `CATALOG_CATEGORIES`. Una marca escrita con «Otra marca…» se añade al selector de marcas como texto, sin logo, menú ni franja. Mientras carga se indica «Cargando la selección…»; si la API falla se muestra el estado vacío con un mensaje. La lista pública se sirve con `Cache-Control: no-cache` para que los cambios del panel se vean al momento. La web ya no funciona abriendo el archivo con `file://`.
- **Catálogo original.** `datos/catalogo-original.js` (antes `catalog-data.js`) queda como archivo interno: origen de la migración y de los 23 registros `review`. `public/assets/products/` sigue en el repositorio como origen de las imágenes migradas, pero `.assetsignore` impide publicarlo: las fotos se sirven desde R2. `node scripts/lista-revision.mjs` genera `REVISION_PENDIENTE.html` para repasar los `review` con la dueña.
- **Estado.** Probado en local el 13 de noviembre en viewport de 375 px: crear con fotos, editar, ocultar, mostrar y borrar desde el panel, con la web pública actualizada en cada paso; 60 combinaciones de categoría y marca frente a la API; 401 en todas las rutas de administración sin `DEV_BYPASS_AUTH`. No se ha probado en un móvil físico, ni contra Cloudflare Access real. El estado de error de la web pública se probó a 375 px con una instancia sin base de datos (API en 500): mensaje visible y botón «Volver a intentarlo». Nada desplegado.

## Preparación para producción · 12 de noviembre de 2026

- Despliegue previsto en Vercel como sitio estático, sin build. `vercel.json` añade cabeceras de seguridad y caché de `/assets/`; `.vercelignore` deja fuera los `.md`, `.claude` y las fotos originales `WhatsApp Image…` (15 MB), que siguen en el repositorio. Las fichas públicas usan `lysa-NNN.webp` y también `photo-0NN.webp`: no excluir estos últimos.
- `404.html` usa rutas desde la raíz (`/styles.css`) porque el servidor la muestra en cualquier dirección. `robots.txt` permite todo; falta `sitemap.xml`, canonical, `og:url` y `og:image`, que necesitan el dominio definitivo.
- Portada, categorías y escaparate se sirven en WebP con `srcset` (dos tamaños); el JPG original queda en `src` como respaldo. Los logos de la franja cargan con `loading="lazy"`. Las tarjetas son `div role="listitem"`.
- Pendiente de datos de la clienta antes de publicar: titular, NIF, domicilio y correo para el aviso legal y la privacidad; dirección, horario y zona para título, descripción y datos estructurados `LocalBusiness`. No inventarlos.
- Lighthouse sobre la copia de producción (Inicio): móvil 98/100/100/100, escritorio 100/100/100/100. Se ejecutó con `npx lighthouse` fuera del proyecto, a petición expresa; no se añadió ninguna dependencia.

## Catálogo completo y cuadrícula · 11 de noviembre de 2026

Sustituye lo que se diga más abajo sobre el carrusel de productos, la composición de una pieza y el número de fichas.

- La clienta pidió publicar todos los productos de las fotos. `catalog-data.js` tiene **76 fichas públicas** (antes 26): 48 altas `LYSA-056` a `LYSA-103`, recortadas de las composiciones colectivas, y dos registros `review` convertidos en ficha con su ID y referencia (`LYSA-014`, `LYSA-051`). Los `review` restantes se conservan como fuente y enlazan sus fichas en `publishedItems`; cada ficha nueva indica su origen en `sourceRecord`.
- Recortes en `assets/products/lysa-NNN.webp` (galería: `lysa-NNN-2.webp`), WebP 0,90, máximo 1200 px, con `original` y `crop` en cada imagen. Sin marca legible en la pieza, `brand: null` y la línea de marca no se muestra; un cartel del expositor no basta. Bienoti se añade a `BRANDS` como `catalogOnly`, igual que Nicole Lee USA.
- «Ver más productos»: solo con «Todas las categorías» (Inicio), con o sin filtro de marca o favoritos. Carga dos filas completas (4 / 6 / 8 tarjetas según 2 / 3 / 4 columnas, con los mismos cortes `matchMedia` que la cuadrícula) y añade una tanda igual por pulsación, sin mover la página (`overflow-anchor: none`). Al cambiar de columnas se completa la última fila. Cambiar de filtro vuelve a la carga inicial. Las categorías concretas muestran todo, sin botón. Las tarjetas no mostradas no se crean, así que sus imágenes no se descargan.
- Listado de productos: cuadrícula CSS Grid vertical (`#product-grid`), 2 columnas en móvil (hueco de 10 px), 3 desde 768 px y 4 desde 1024 px. No hay carrusel, flechas, indicador de posición ni scroll horizontal. Imagen 3:4 con `object-fit: contain`, nombre limitado a dos líneas y botón de WhatsApp compacto en móvil (icono + «Consultar»; el nombre accesible conserva la frase completa).

## Auditoría responsive · 7 de noviembre de 2026

Esta sección sustituye las descripciones anteriores de la franja de marcas (botón de pausa, modo teclado con scroll manual y animación desactivada con movimiento reducido).

- Franja de marcas: marquee infinito con dos mitades idénticas (la segunda `aria-hidden`, botones con `tabindex=-1` pero clicables) y `@keyframes marquee` de 0 a -50 %. `script.js` calcula `--marquee-duration` en px/s (`MARQUEE_SPEED` 40, `MARQUEE_SPEED_REDUCED` 20) para que la velocidad sea igual en todos los anchos. No hay botón de pausa. Pausa solo con hover de puntero preciso y mientras un logo tiene el foco; al tabular, la línea de tiempo se ajusta para que el logo enfocado quede visible.
- `prefers-reduced-motion` NO detiene la franja: solo la ralentiza. Windows activa esa preferencia al apagar «Efectos de animación», y era la causa de que no se moviera en escritorio. La regla global `*{animation:none!important}` tiene una excepción explícita para `.marquee-track`.
- Logos: caja común `--logo-h`/`--logo-w` (44×170 escritorio, 38×145 tablet, 34×120 móvil), `object-fit: contain` y `--logo-scale` por marca para compensar el margen en blanco de cada archivo. Gladiator recorta su banda de 1880×108 px con `--gh`. Fundido lateral con `mask-image`.
- Sistema de botones en `:root` (`--tap` 44 px, `--btn-h`, `--btn-font`, `--btn-radius` 0): `.button.button-dark` (primario), `.text-link` (enlace) y `.circle-button` (icono). Todos los controles tienen 44 px de zona táctil, sin `appearance` nativa ni tap highlight. No existe variante secundaria.
- Menú móvil: panel fijo hasta el borde inferior, bloquea el scroll con `body.menu-open` y se cierra al pulsar un enlace o con Escape.
- Ritmo vertical con `--section-y`; titulares con `clamp()`; texto mínimo de 9 px en eyebrows y de 11 px en textos auxiliares.

## Contacto vigente · 6 de noviembre de 2026

Esta sección sustituye las referencias históricas al teléfono vacío y al formulario local de las auditorías anteriores.

- La clienta ha confirmado el WhatsApp y el Instagram oficiales. `store-config.js` centraliza `WHATSAPP_NUMBER`, `WHATSAPP_GENERAL_MESSAGE` e `INSTAGRAM_URL`; no duplicar los contactos en otros archivos de código.
- `buildWhatsAppUrl` en `script.js` construye todos los enlaces con `encodeURIComponent`. Tarjetas y fichas consultan su artículo, marca identificada y referencia inmutable; el contacto general usa un mensaje sin productos. No se envían mensajes automáticamente.
- «Hablemos», «Consultar a la tienda», «Contacto» y el icono de WhatsApp del footer abren la consulta general. El formulario local y su descarga se han sustituido por el canal real. El footer conserva sus columnas e incorpora «Síguenos y contacta» con SVG locales de WhatsApp e Instagram. Enlaces externos con `_blank` y `noopener noreferrer`.
- Mantener los avisos sobre titularidad, identificación fiscal, domicilio y URL pública pendientes. Hero, marcas, catálogo, filtros, favoritos, fotografías y editorial se conservan.

## Estado vigente · presentación del 5 de noviembre de 2026

Las decisiones de esta sección actualizan las referencias históricas al catálogo vacío y a ejemplos públicos que aparecen más abajo. La web mantiene su diseño y usa exclusivamente HTML, CSS y JavaScript nativo.

- `catalog-data.js` es la única fuente de `BRANDS`, categorías y `CATALOG_PRODUCTS`. Contiene 14 productos individuales públicos y 16 registros `review` internos. El renderizado filtra `recordType === "product"` antes de filtros, fichas, favoritos y recuentos; no hay catálogo demo alternativo.
- Conservar los IDs existentes y las referencias `LYSA-NNN`, únicas e inmutables. No reutilizarlas ni calcularlas por posición al renderizar. Las referencias son internas, no códigos oficiales de fabricantes.
- Las ocho fotos nuevas del día 5 están en `assets/products/`, con copias completas `photo-025.webp` a `photo-032.webp` para el inventario interno. Dos carteras Cacharel se han aislado mediante recortes revisados, `lysa-033.webp` y `lysa-034.webp`. Original y coordenadas relativas están en cada imagen del catálogo. No publicar las composiciones colectivas como productos ni lotes.
- Las tres piezas Nicole Lee USA tienen marca identificada visualmente en `observedBrand` y `brandStatus: "visually-identified"`; `brand` sigue a null. Se muestra el nombre observado en esas fichas, sin añadir marcas al menú principal. Las marcas desconocidas se omiten. Precio, disponibilidad y confirmación comercial permanecen en datos internos y `REVISION_PRODUCTOS.md`; las tarjetas muestran «Consultar precio».
- `store-config.js` contiene `WHATSAPP_NUMBER`, entregado vacío. Solo un teléfono real en formato internacional, sin símbolos, activa enlaces `wa.me` con mensaje codificado, nombre, marca identificada y referencia. Cada tarjeta y ficha tiene su acción. Sin número válido se muestra un botón desactivado y una explicación visible; nunca enlaces ficticios. Enlaces activos con `_blank` y `noopener noreferrer`.
- Las fotografías ilustrativas del hero, categorías y editorial se mantienen, sin aparecer como productos reales. No hay checkout, backend ni Supabase. El formulario general sigue siendo una consulta local descargable, sin envío.
- Activación del teléfono y recorrido de demostración en `PRESENTACION.md`. Comprobación en Edge headless sin paquetes: 14 fichas, 40 combinaciones de filtros, 12 anchos de 320 a 1920 px, alineación, favoritos, carrusel, menús, foco/Escape, descarga real del `.txt`, carga `file://` y 28 enlaces de WhatsApp con configuración temporal solo en memoria. No se enviaron mensajes ni se probó un dispositivo físico.

## Proyecto y ejecución

MVP local de una home de ecommerce multimarca. Abrir `index.html` directamente en un navegador moderno. No requiere servidor, instalación, compilación ni conexión a Internet.

- Usar únicamente HTML5, CSS3 y JavaScript nativo.
- No añadir npm, frameworks, paquetes, backend ni archivos de configuración de herramientas de compilación.
- `index.html`: estructura semántica, navegación, contenido editorial y diálogos.
- `styles.css`: identidad visual, composición, responsive y animaciones.
- `script.js`: datos de demostración e interacciones.
- `assets/logo.jpg`: copia idéntica del logo original, que se conserva en `assets/images/logo.jpg`.
- `assets/photos/`: cinco imágenes locales de demostración. Procedencia y prompts en `assets/README.md`.
- `assets/images/escaparate.jpg` y `assets/images/banner.jpg`: fotografía real e identidad corporativa aportadas por la tienda. Se utilizan completas y sin alteraciones en «Conoce Tienda Lysa».

## Dirección artística

Boutique editorial cálida, femenina y comercial. Marfil `#FAF6F1`, chocolate `#4B2A21`, rosa empolvado `#E2B9CB`. La franja rosa usa una variación suave para separar la historia de marca. Tipografía serif del sistema para titulares, contrastada con Segoe UI/Arial para navegación y textos. Sin fuentes remotas, iconos emoji, librerías, gradientes decorativos, sombras grandes ni tarjetas con esquinas redondeadas. El único degradado es un velo de contraste sobre la fotografía del hero para facilitar la lectura.

La secuencia de la página es: introducción editorial, categorías, marcas, catálogo, colección editorial, tienda, contacto y footer. El logo circular real aparece en header, footer y favicon; la sección de tienda utiliza el banner corporativo original, junto al escaparate real. No sustituirlos por un logotipo tipográfico generado. Conservar la composición, fotografía, titular y estilos del hero, las cuatro categorías y el editorial «Menos prisa. Más esencia». Evolucionar el código existente sin sustituir la hoja de estilos ni reorganizar el proyecto.

## Datos reales y datos de muestra

El cliente ha aportado el logo y ha confirmado siete marcas: Gladiator, Cacharel, Anekke, Totto, Pepe Moll, Torrens (Torrens Hermanos, marroquinería) y Gabol. No añadir otras. No se ha facilitado catálogo real, dirección, teléfono, email comercial, razón social ni condiciones de venta.

Al inicio de `script.js` hay tres estructuras deliberadamente separadas:

1. `BRANDS`: única lista funcional de marcas, con `id`, `name`, familias de productos, web de referencia y estado de logo. Alimenta menú, selector, franja y selección activa. Las familias no se convierten en disponibilidad de productos.
2. `CATALOG_PRODUCTS`: array vacío, reservado al catálogo confirmado del cliente. Añadir productos con un `brand` que coincida con un `id` de `BRANDS`, identificadores únicos, categoría existente, ruta local, alt, tono, color y descripción verificados. No asignar `isExample: true` a productos reales.
3. `DEMO_CATALOG.products`: ejemplos visuales existentes, cada uno con `brand: null` e `isExample: true`. No asignarlos a marcas reales. Mientras `CATALOG_PRODUCTS` esté vacío se muestran estos ejemplos sin marca; en cuanto haya catálogo real, este sustituye a los ejemplos en la selección. Los ejemplos nunca coinciden con un filtro de marca.

No inventar productos de marcas reales, precios, stock, promociones, reseñas, antigüedad, garantías, envíos ni datos de contacto. Incorporar el contacto y los textos legales verificados del negocio antes de publicar como tienda real. Las etiquetas de marca ficticias del MVP original se han eliminado. La indicación de ejemplo es discreta en las tarjetas y se explica en las fichas y en una nota de catálogo.

La investigación de logos, fuentes oficiales, restricciones y recursos pendientes está en `assets/marcas/README.md`. Se han incorporado los seis logos que el cliente ha proporcionado y solicitado utilizar: Gladiator, Cacharel, Anekke (archivo `anneke-logo.png`), Totto, Pepe Moll y Gabol. Tienen `logoStatus: "approved"` en `BRANDS`. La franja muestra esos archivos sin filtros y con tamaños individuales; el menú conserva los nombres tipográficos y su estructura. Torrens utiliza texto editorial provisional. Para activar su futuro archivo oficial autorizado, guardarlo en `assets/marcas/` y cambiar `logo` y `logoStatus: "approved"` en `BRANDS`. No utilizar un recurso por el mero hecho de ser descargable. La referencia de Torrens es el dominio histórico de Torrens Hermanos; su web actual no se pudo verificar. Nunca utilizar logos de empresas homónimas ni de campañas de perfumes de Cacharel.

Las cinco imágenes de `assets/photos/` son generadas y se identifican como ilustrativas. Se buscaron imágenes reutilizables de Unsplash y se consultó su licencia, pero las descargas HTTP desde este entorno estaban bloqueadas. No se utilizó ninguna foto de stock sin descargar ni ninguna imagen de Instagram. No presentar las imágenes generadas como fotos de productos reales. La fotografía real del escaparate es un recurso separado, aportado por la tienda.

## Interacciones

- Menú móvil por clic/tap; cierra al elegir destino, al pulsar Escape o al pulsar fuera.
- Marcas por hover con puntero de escritorio, clic, Enter/Espacio, flechas, Inicio/Fin y Escape. Tab mantiene la navegación normal. No usar `role=menu`: es un desplegable de navegación con botones de filtro.
- El estado inicial es «Todas las marcas» y «Todas las categorías». Elegir marca en menú, selector o franja conserva la categoría y actualiza todas las representaciones de selección. Elegir una categoría concreta desde navegación o catálogo conserva la marca. Los accesos «Ver toda la selección» con categoría `all` y «Limpiar filtros» restablecen la selección completa. «Todas las marcas» conserva la categoría y solo elimina el filtro de marca. Una marca sin productos muestra un estado vacío sin ejemplos atribuidos a ella.
- Cuadrícula para los resultados que caben en pantalla; una única pieza adopta una composición editorial con imagen, descripción y enlace. Si se supera el número de columnas (4 en escritorio, 3 en tablet, 2 en móvil), se activa el carrusel nativo con scroll snap, flechas y teclado. Los controles se ocultan sin desbordamiento y los extremos se desactivan. Los roles accesibles cambian entre lista y carrusel.
- Favoritos funcionales en almacenamiento local (`lysa-demo-favorites-v1`), con fallback en memoria si el navegador lo bloquea. La cabecera permite filtrarlos. Quitar el último favorito elimina la clave de almacenamiento.
- Fichas de producto en `dialog`, con foco modal, Escape, botón de cierre y cierre por fondo. No hay carrito ni checkout.
- Contacto: formulario con validación nativa, resumen editable y descarga de un `.txt`. No envía datos, no crea pedidos, no simula que la tienda haya recibido la consulta y no persiste datos personales. Sustituir por un canal real cuando exista un contacto confirmado.
- Aviso legal y privacidad abren información honesta del MVP, sin atribuir datos ficticios al negocio.
- Franja de marcas después de las categorías, con dos grupos idénticos y desplazamiento `translateX(-50%)` en 75 segundos. Pausa al pasar el ratón, al recibir foco o mediante botón. Original y copia admiten clic/tap; la copia está oculta a lectores de pantalla y fuera del orden de Tab. El acceso por teclado pasa a desplazamiento manual y permite recorrer las siete marcas visibles, sin enfocar nombres que hayan quedado fuera del área recortada. Movimiento reducido desactiva la animación, oculta la copia y permite desplazamiento manual.

## Accesibilidad y rendimiento

Mantener `lang=es`, enlace para saltar al contenido, landmarks, títulos jerárquicos, nombres accesibles, `aria-expanded`, `aria-pressed`, estado `aria-live`, alt descriptivos y foco visible. Los filtros vacíos siempre ofrecen una salida. Los diálogos devuelven el foco al control original. Las imágenes inferiores cargan de forma diferida; el hero tiene prioridad alta.

`IntersectionObserver` revela contenido progresivamente; sin JavaScript el contenido editorial sigue visible. Respetar `prefers-reduced-motion`: sin animaciones de entrada, movimiento continuo ni scroll suave. El carrusel de marcas puede recorrerse horizontalmente en ese modo. No introducir timers de autoplay en productos ni interacciones que dependan exclusivamente del hover.

Breakpoints principales: 580, 850 y 1100 px. La cabecera cambia a menú móvil a 850 px. Comprobar también 320 px y las zonas de cambio, no solo tamaños de dispositivos habituales.

## Verificación

No instalar paquetes para comprobar este sitio. Se puede verificar sintaxis con `node --check script.js`. Para revisar funcionalidad utilizar un navegador real y las herramientas ya disponibles en el entorno. No confundir comprobación estática con revisión visual ni afirmar pruebas que no se hayan ejecutado.

Checklist de entrega: carga local del logo y las cinco imágenes; destinos de enlaces; menú por teclado y móvil; marcas y categorías combinadas; estado vacío y restauración; flechas del carrusel; favoritos y borrado del último; fichas; consulta y descarga; cierre y foco de diálogos; movimiento reducido; ausencia de overflow horizontal y de errores de JavaScript.

### Resultado de la revisión de este MVP

Verificado en Microsoft Edge headless mediante su protocolo de depuración y Node nativo, sin instalar paquetes:

- Revisión visual por secciones a 1440 × 1000 y 390 × 844 px.
- Sin desbordamiento horizontal a 320, 360, 390, 580, 768, 850, 851, 1024, 1440 y 1920 px.
- Logo e imágenes locales correctamente cargados; destinos de anclas presentes.
- Menú de marcas con flechas y Escape; selección por tap en móvil y cierre del menú.
- Filtros combinados, selección vacía y vuelta a todas las piezas.
- Carrusel con flechas, desplazamiento nativo y gesto táctil real emulado.
- Favoritos, filtro de guardados y borrado del último favorito.
- Diálogos de producto, contacto y privacidad; foco y cierre con Escape.
- Formulario, edición del resumen y descarga efectiva de `consulta-tienda-lysa.txt`, cuyo contenido se verificó.
- Movimiento reducido y pausa manual de marcas.
- Sin excepciones de JavaScript durante las pruebas del sitio; `node --check script.js` correcto.

Las comprobaciones móviles se realizaron mediante emulación de viewport y eventos táctiles; no se ha probado un dispositivo físico. Se utilizaron capturas de viewport por secciones: la captura de página completa de Edge no respondía en este entorno. Los perfiles y archivos temporales de las pruebas no forman parte de la entrega.

### Revisión de la evolución multimarca

- Comprobación de preservación: markup de hero, categorías y editorial idéntico al original; reglas principales y breakpoints del hero, fotografías de categorías y editorial conservados.
- Doce anchos, incluidos ambos lados de los cambios de navegación y filtros: 320, 360, 390, 580, 581, 768, 850, 851, 1024, 1100, 1440 y 1920 px, sin desbordamiento horizontal.
- Siete marcas exactas, ocho opciones de selector/menú contando «Todas las marcas», valores iniciales sincronizados y ausencia de atribuciones ficticias en los ejemplos.
- Combinación marca/categoría en ambos sentidos, selección activa, siete estados vacíos y restauración de filtros.
- Registros sintéticos temporales solo en memoria del navegador para verificar coincidencias positivas; se eliminaron después de la prueba y no forman parte del catálogo entregado.
- Composición de una pieza y cuadrícula de pocas piezas sin controles vacíos; carrusel al superar las columnas.
- Franja en movimiento normal: avance real, geometría idéntica de los dos grupos y comprobación del reinicio sin salto. Pausa, copias clicables, modo teclado y movimiento reducido.
- Revisión visual de menú, marcas, catálogo, ficha única y estado vacío en escritorio y móvil; navegación táctil real emulada, favoritos y fichas sin errores de JavaScript ni imágenes rotas.
- Comprobación adicional con eventos reales de puntero y Tab: apertura/cierre por hover, pausa al pasar el ratón y recorrido de las siete firmas de la franja con foco visible. Consulta desde estado vacío precompletada con marca/categoría, validación y descarga `.txt` comprobadas sin enviar datos.

### Integración de recursos reales · 4 de noviembre de 2026

- Seis logos locales aportados por el cliente en la franja, con proporciones y colores conservados. Torrens mantiene texto provisional. Anekke usa la ruta real `assets/marcas/anneke-logo.png`.
- Se ha evolucionado el bloque existente `#esencia`, sin añadir otra sección: fotografía completa del escaparate, contenido «Más que una tienda» y banner corporativo secundario. Cabecera, hero, categorías y editorial conservados; comparación automática del markup y de las reglas CSS de las tres secciones protegidas.
- Revisión visual de marcas y tienda en Edge headless a 1440, 768, 390 y 320 px. Doce anchos entre 320 y 1920 px sin desbordamiento horizontal; ninguna barra visible en la franja, tampoco al navegar por teclado o con movimiento reducido.
- Avance automático real, pausa con ratón y botón, grupos de igual anchura y coincidencia de posiciones antes/después del reinicio de los 75 segundos. Los duplicados son clicables, están ocultos a lectores de pantalla y fuera de Tab. Recorrido por teclado de las siete marcas con cada botón completamente visible.
- Selección de las siete marcas comprobada con eventos de puntero: categoría conservada, estados sincronizados y vacíos correctos sin atribuir ejemplos. Tap táctil emulado en móvil comprobado, incluida la continuación automática del movimiento después de seleccionar. El hover se limita a punteros precisos para evitar pausas pegadas al tocar.
- Preferencia de movimiento reducido comprobada: sin animación ni copia visible, desplazamiento manual disponible con barra oculta. Escaparate y banner cargados localmente, completos y sin deformación.
- Regresión de filtros, restauración, favoritos y borrado de la última clave, ficha con Escape y retorno del foco, menú móvil y teclado de marcas, flechas de productos y destinos de anclas. Formulario, edición del resumen y descarga efectiva del `.txt` con contenido verificado.
- Carga mediante `file://` y HTTP local comprobada (servidor temporal con Node nativo, equivalente al servicio estático de Live Server). Sin paquetes, frameworks ni backend. `node --check script.js` correcto y sin excepciones de JavaScript durante la revisión. Las pruebas móviles son emuladas; no se ha utilizado un dispositivo físico. Perfiles, capturas, scripts y descargas temporales de prueba no forman parte de la entrega.
