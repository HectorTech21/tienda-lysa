# Tienda Lysa · instrucciones y decisiones

Web de una tienda multimarca de bolsos, mochilas, maletas y accesorios. Es un catálogo: no hay venta online, carrito, registro ni formularios; las consultas van por WhatsApp. Este documento describe el estado actual. Lo anterior (despliegue en Vercel, catálogo en `catalog-data.js`, carrusel de productos, formulario descargable, diálogos legales) ya no existe y se ha retirado de aquí; está en el historial de git.

## Estructura

- **Worker de Cloudflare** (`src/`, `wrangler.jsonc`) con archivos estáticos en `public/` (web pública y panel), base de datos D1 (`DB`) e imágenes en R2 (`BUCKET`).
- La web y el panel son HTML, CSS y JavaScript nativo, sin frameworks ni librerías. La única dependencia es `wrangler` (desarrollo). No añadir paquetes.
- `public/index.html`, `styles.css`, `script.js`: web pública. `public/brands-data.js`: `BRANDS` y `CATALOG_CATEGORIES`. `public/store-config.js`: contactos y datos de la titular.
- `public/aviso-legal.html`, `privacidad.html`, `cookies.html` y `legal.js`: páginas legales.
- `public/admin/`: panel. `src/index.js` (rutas y seguridad), `src/auth.js` (sesión), `src/api.js` (API), `src/validacion.js` (validación).
- `migrations/`: esquema de D1. `scripts/`: migración, copia de seguridad y pruebas.
- `datos/catalogo-original.js`: archivo interno, origen de la carga inicial y de los 23 registros `review` que no se publican. `public/assets/products/` es el origen de las imágenes migradas; `public/.assetsignore` impide publicarlo (las fotos se sirven desde R2), igual que los `.md` y las fotos originales `WhatsApp Image…`. `node scripts/lista-revision.mjs` genera `REVISION_PENDIENTE.html` para repasar los `review` con la dueña.

## Trabajar en local

1. `npm install` (solo instala `wrangler`).
2. Esquema: `npx wrangler d1 migrations apply tienda-lysa --local`. Hay que repetirlo cada vez que se añade un archivo a `migrations/`.
3. Carga inicial del catálogo, solo con la base de datos vacía: `node scripts/migrar-catalogo.mjs --local`.
4. Servidor: `npx wrangler dev` (puerto 8787; `.claude/launch.json` ya lo usa). D1 y R2 locales viven en `.wrangler/` (fuera de git).
5. El panel local necesita `DEV_BYPASS_AUTH=true` en `.dev.vars` (ver «Autenticación»).

La web no funciona abriendo el archivo con `file://`: necesita el servidor.

**No ejecutar `wrangler login`, `deploy` ni nada con `--remote` sin que el usuario lo pida.** Nada está desplegado todavía.

## Pruebas

- `npm test`: autenticación (15), rutas privadas y API sin red (112) y validación (8). No usan la red.
  - `node scripts/probar-auth.mjs`: JWT de Access y salto de desarrollo.
  - `node scripts/probar-rutas.mjs`: variantes de `/admin` y `/api/admin` (`//admin`, `/ADMIN`, `/%61dmin`, `/admin/./`, `/api//admin`…), comprobación de `Origin` y borrado con fallo de R2.
  - `node scripts/probar-validacion.mjs`: precios y longitud de textos; comprueba que el panel y el servidor interpretan igual el precio.
- `npm run test:panel` (`scripts/probar-panel.mjs`): 17 pruebas contra el servidor local en marcha. Crea un producto de prueba, simula fallos al cambiar fotos, reintentos y altas simultáneas, y lo borra. Consume referencias `LYSA-NNN` de la base de datos local.
- Lo visual se revisa en un navegador real, a 375 px y en escritorio. No confundir comprobación estática con revisión visual ni afirmar pruebas que no se hayan ejecutado. No instalar paquetes para probar.

## Dominio y SEO

- El dominio principal es `tienda-lysa.com`, sin `www` (`routes` con `custom_domain`). `workers_dev: false` y `preview_urls: false`: la web solo se sirve desde el dominio propio. `www` redirige con 301 (regla de redirección de Cloudflare y, por si llegara al Worker, también en `src/index.js`).
- `dev.host: "localhost"` es necesario: sin él, `wrangler dev` se presenta como `tienda-lysa.com` y el panel local responde 401. Efecto secundario: en local, wrangler reescribe la URL y la cabecera `Origin` antes de que lleguen al Worker.
- `canonical`, `og:url` y `og:image` absolutos con `https://tienda-lysa.com`. `public/assets/og-image.jpg` (1200×630) se generó con el logo de 150 px ampliado: sustituir si la clienta aporta el logo en alta resolución.
- `public/sitemap.xml` lista la portada y las tres páginas legales (sin `.html`); categorías y fichas no tienen dirección propia. `robots.txt` enlaza el sitemap y NO bloquea `/api/`: la portada necesita `/api/productos`.
- El panel y la API no se indexan (`noindex` en `public/admin/index.html` y cabecera `X-Robots-Tag` en todo `/api/*` y `/admin*`, errores, redirecciones y 401 incluidos). `/img/` sí es indexable.
- Cabeceras de seguridad: `public/_headers` (estáticos) y `src/index.js` (todo lo que pasa por el Worker).

## Seguridad del panel

- **Todas las peticiones pasan primero por el Worker** (`run_worker_first: true`). No sustituirlo por una lista de rutas ni añadir excepciones: con una excepción como `/assets/*`, una ruta del tipo `/assets/%2e%2e/admin/` podría llegar a los archivos sin pasar por el Worker.
- `src/index.js` normaliza la ruta antes de decidir (`normalizarRuta`: decodifica `%xx` aunque venga codificado varias veces, trata `\` como `/`, une barras repetidas y resuelve `.` y `..`) y compara sin distinguir mayúsculas (`rutaPrivada`). Todo lo que, normalizado, sea `/admin`, `/admin/…` o `/api/admin/…` exige la sesión **antes** de llamar a `ASSETS.fetch`. Si la forma recibida no es la canónica, se redirige a ella con 308 (conserva método y cuerpo). Una ruta que no se puede decodificar responde 400.
- **Autenticación (`src/auth.js`).** Se valida el JWT de Cloudflare Access (`Cf-Access-Jwt-Assertion`: firma RS256 con las claves del equipo, emisor, audiencia y caducidad). Por defecto se bloquea con 401, también si faltan las variables. El salto solo existe con `DEV_BYPASS_AUTH=true` en `.dev.vars` (en `.gitignore`, nunca en `wrangler.jsonc`) y además solo en `localhost` o red privada. No relajar ninguna de las dos condiciones.
- **Origin.** Toda escritura en `/api/admin` (lo que no sea GET o HEAD) exige la cabecera `Origin` y que coincida entera con el origen de la petición (esquema, nombre y puerto). Sin ella, o con otra, 403.
- La aplicación de Access debe cubrir `/admin` y `/api/admin` en los dos nombres, con y sin `www`.

## Datos

- `migrations/0001_productos.sql`: `productos` (id, referencia, titulo, slug, descripcion, precio_centimos, categoria, marca, marca_slug, color, visible, destacado, fechas), `imagenes` (clave de R2 y orden; orden 0 = principal) y `contadores`.
- `migrations/0002_subidas.sql`: `subidas`, las fotos subidas desde el panel que todavía no pertenecen a ningún producto. Al guardar, la foto pasa a `imagenes` con el mismo id; la fila de `subidas` se conserva.
- `migrations/0003_operaciones.sql`: columna `operacion` (única) en `productos` y `subidas`, para no repetir un alta o una subida al reintentar.
- La referencia `LYSA-NNN` sale del contador, que solo sube: no se edita ni se reutiliza. Es una referencia interna, no un código del fabricante.
- La categoría «Accesorios» conserva el identificador `complementos`. `marca` guarda el nombre visible (lista fija o texto de «Otra marca…»); `marca_slug` es el filtro. Precio vacío = «Consultar precio».
- Orden público: destacados primero y después los más recientes.
- **Longitud de textos:** se mide en caracteres (puntos de código Unicode, un emoji cuenta como 1) en los tres sitios: `largo()` en `src/validacion.js`, `largo()` en `public/admin/admin.js` y `length()` en los `CHECK` de D1. Los textos se normalizan a NFC. Los campos del panel no llevan `maxlength` (cuenta de otra manera): el tope lo pone `admin.js` al escribir. Límites: nombre 2–120, marca 60, color 60, descripción 1000.
- **Precio:** `precioEnCentimos` (en `src/validacion.js`, con una copia idéntica en `admin.js`: cambiar las dos; `probar-validacion.mjs` comprueba que coinciden). Admite `39`, `39,90`, `39.90` y `1.234,56`, con `€` opcional al final. No se quitan espacios de en medio: `1 2` es un error, no 12. Máximo 99.999,99 €.

## API (`src/api.js`)

- Pública: `GET /api/productos?categoria=&marca=` (solo visibles y con foto; `Cache-Control: no-cache` para que los cambios del panel se vean al momento) e imágenes en `/img/productos/…` (caché larga: las claves no se reutilizan).
- Panel: `GET /api/admin/sesion`, `GET/POST /api/admin/productos`, `GET/PATCH/DELETE /api/admin/productos/:id` y `POST /api/admin/imagenes`.
- **Guardar fotos sin riesgo.** Orden obligatorio:
  1. `POST /api/admin/imagenes` (cuerpo binario; JPG, PNG o WebP comprobados por contenido, máximo 5 MB) guarda la foto en R2 y en `subidas`. No pertenece a ningún producto y la tienda no cambia.
  2. `POST /api/admin/productos` o `PATCH /api/admin/productos/:id` reciben los datos y `imagenes`: la lista final de identificadores, en orden (fotos que el producto ya tiene y fotos subidas). Un solo `batch` de D1 guarda datos, altas, bajas y orden de fotos: o todo o nada. Al crear, la referencia y el contador van en el mismo `batch`.
  3. Solo después se borran de R2 las fotos que sobran.
  Si algo falla a mitad, el producto sigue visible con sus fotos anteriores. Máximo 12 fotos en la lista final, así que sustituir una foto funciona también con un producto lleno. `PATCH` sin `imagenes` no toca las fotos (lo usa «Ocultar/Mostrar»).
- **Reintentos sin duplicados.** El panel envía `X-Operacion` (un identificador por formulario de producto nuevo y uno por foto). Si llega repetido, también a la vez, el servidor devuelve el resultado de la primera vez (`repetida: true`) en lugar de crear otro.
- **Borrado.** Si D1 borra bien y R2 falla, la respuesta es de éxito y el fallo se anota en el registro (`borrarDeR2`). Las fotos huérfanas en R2 no son un problema; no hay limpieza automática de subidas abandonadas.

## Panel (`public/admin/`)

- Pensado para móvil y para una persona no técnica: textos en español llano, controles de 48 px y letra de 16 px.
- Las fotos se reducen en el navegador a 1600 px y WebP (JPEG si el navegador no crea WebP) respetando la orientación EXIF. Un archivo ilegible (por ejemplo HEIC fuera de Safari) muestra «Esta foto no se puede subir, prueba a hacer una captura o a cambiar el formato».
- Cada compresión pertenece al formulario que la inició (`edicion`): si la dueña sale o cambia de producto, el resultado se descarta. El contador `edicion.procesando` se libera siempre en un `finally`. «Guardar» se desactiva mientras se preparan o suben fotos.
- Una foto nueva lleva la marca «Sin guardar» hasta que el producto se guarda. Si el guardado falla, el formulario se queda como está y «Guardar» lo retoma sin duplicar nada.
- **Sesión caducada.** Las peticiones llevan `X-Requested-With: XMLHttpRequest` para que Access responda 401 en lugar de redirigir. Ante un 401, una redirección o un error de red con la sesión caída, aparece el aviso fijo «Tu sesión ha caducado. Vuelve a entrar para guardar», con un botón que abre `/admin/` en otra pestaña. El formulario y las fotos se conservan; al volver a la pestaña el aviso se quita solo.
- Aviso al salir con cambios sin guardar o con fotos preparándose.

## Scripts

- `scripts/migrar-catalogo.mjs` (`--local` por defecto, `--remote`): carga inicial. **Se niega a ejecutarse si la base de datos de destino ya tiene productos**; `--forzar` lo permite avisando (los existentes no se sobrescriben, pero los borrados desde el panel reaparecen). Primero sube las fotos a R2 y comprueba una a una que lo guardado es idéntico al archivo; solo entonces inserta las filas. `--solo-datos` no sube pero comprueba; `--solo-imagenes` no toca la base de datos. Solo pasa los registros `product`.
- `scripts/backup.mjs` (`--local` por defecto, `--remote`): copia completa en `backups/tienda-lysa-<origen>-<fecha>-<hora>-<sufijo>/` (fuera de git), con `datos.json` (productos, imágenes, subidas y contador) y `imagenes/` con los archivos de R2. La lectura de D1 se repite si algo cambia entre medias. Si falta una imagen, lo indica en `datos.json` y termina con error.

## Web pública

- `public/script.js` carga los productos con `fetch("/api/productos")` (`loadCatalog`) y los adapta con `toProduct`. Mientras carga se indica «Cargando la selección…»; si la API falla se muestra el estado vacío con un mensaje y «Volver a intentarlo». Con precio se muestra «39,90 €»; sin precio, «Consultar precio».
- **Secuencia de la página:** introducción editorial, categorías, marcas, catálogo, colección editorial, tienda, contacto y footer.
- **Listado:** cuadrícula CSS Grid vertical (`#product-grid`), 2 columnas en móvil, 3 desde 768 px y 4 desde 1024 px. Imagen 3:4 con `object-fit: contain`, nombre a dos líneas y botón de WhatsApp compacto en móvil. No hay carrusel ni scroll horizontal.
- **«Ver más productos»:** solo con «Todas las categorías». Carga dos filas completas (4 / 6 / 8 tarjetas según las columnas) y añade una tanda igual por pulsación, sin mover la página. Las categorías concretas muestran todo. Las tarjetas no mostradas no se crean.
- **Filtros:** estado inicial «Todas las marcas» y «Todas las categorías». Elegir marca (menú, selector o franja) conserva la categoría, y al revés. «Limpiar filtros» restablece todo. Una marca escrita con «Otra marca…» se añade al selector como texto, sin logo, menú ni franja. Los filtros vacíos siempre ofrecen una salida.
- **Favoritos:** en `localStorage` (`lysa-demo-favorites-v1`), con respaldo en memoria. Quitar el último borra la clave. Es el único almacenamiento del navegador que usa la web.
- **Fichas** en `dialog`, con foco modal, Escape, botón de cierre y cierre por fondo.
- **Menú móvil** (hasta 850 px): panel fijo que bloquea el scroll con `body.menu-open`; se cierra al pulsar un enlace, fuera o con Escape. **Marcas:** desplegable de navegación (no `role=menu`) con hover de puntero preciso, clic, teclado y Escape.
- **Franja de marcas:** marquee con dos mitades idénticas (la segunda `aria-hidden`, con botones fuera del orden de tabulación pero clicables) y `@keyframes marquee` de 0 a -50 %. `script.js` calcula `--marquee-duration` en px/s (`MARQUEE_SPEED` 40) para que la velocidad sea igual en todos los anchos.
  - **Con `prefers-reduced-motion` la franja se queda quieta.**
  - Botón accesible «Pausar el movimiento» / «Reanudar el movimiento» (`.marquee-toggle`, bajo la franja). Su estado se mantiene hasta que se vuelve a pulsar: no lo cambian el ratón, el foco ni el tamaño de la ventana. No se guarda entre visitas (no se añade almacenamiento). Con movimiento reducido, quien pulse «Reanudar» la ve moverse más despacio (`MARQUEE_SPEED_REDUCED` 20).
  - El estado está en `data-marquee` (`playing` / `paused`) de `.marquee-window`. En pausa, la franja se puede recorrer con el dedo o con scroll horizontal. En marcha, además se pausa con hover de puntero preciso y mientras un logo tiene el foco; al tabular, la línea de tiempo se ajusta para que el logo enfocado quede visible.
- **Logos:** caja común `--logo-h`/`--logo-w` (44×170 escritorio, 38×145 tablet, 34×120 móvil), `object-fit: contain` y `--logo-scale` por marca. Gladiator recorta su banda con `--gh`. Fundido lateral con `mask-image`.
- **Botones** (variables en `:root`: `--tap` 44 px, `--btn-h`, `--btn-font`, `--btn-radius` 0): `.button.button-dark` (primario), `.text-link` (enlace) y `.circle-button` (icono). Todos los controles tienen 44 px de zona táctil. No existe variante secundaria.
- **Imágenes:** portada, categorías y escaparate en WebP con `srcset` (dos tamaños) y JPG de respaldo. Las inferiores cargan de forma diferida; el hero tiene prioridad alta.
- **Breakpoints:** 580, 850 y 1100 px; la cuadrícula cambia a 768 y 1024. Comprobar también 320 px y las zonas de cambio.
- `404.html` usa rutas desde la raíz porque se muestra en cualquier dirección.

## Contacto

- `public/store-config.js` centraliza `WHATSAPP_NUMBER`, `WHATSAPP_GENERAL_MESSAGE` e `INSTAGRAM_URL`, confirmados por la clienta. No duplicarlos en otros archivos.
- `buildWhatsAppUrl` en `script.js` construye todos los enlaces con `encodeURIComponent`. Tarjetas y fichas consultan su artículo, marca y referencia; el contacto general usa un mensaje sin productos. No se envía nada automáticamente. Enlaces externos con `_blank` y `noopener noreferrer`.

## Páginas legales

- `public/aviso-legal.html`, `privacidad.html` y `cookies.html`, con rutas desde la raíz. Cloudflare las sirve sin extensión (`/aviso-legal`; `.html` redirige). Cabecera reducida (`.legal-nav`) porque no cargan `script.js`; estilos en el bloque «Páginas legales» de `styles.css`. La tabla de cookies pasa a fichas por debajo de 580 px.
- **Datos de la titular:** único sitio, el objeto `LEGAL` de `public/store-config.js`. `public/legal.js` coloca cada valor en los `<span data-legal="CLAVE">`. Marcadores: `[[NOMBRE_TITULAR]]`, `[[NIF]]`, `[[DOMICILIO]]`, `[[EMAIL_LEGAL]]`, `[[TELEFONO]]`, `[[DATOS_REGISTRALES]]`, `[[FECHA_ACTUALIZACION]]`. Un valor vacío (`""`) elimina su línea: es lo que hay que hacer con `DATOS_REGISTRALES` si la titular es autónoma. No inventar estos datos.
- Portada, páginas legales y `404.html` enlazan las tres páginas en el pie. El panel no.
- **Cookies y terceros:** la web no crea cookies ni usa `sessionStorage`; `localStorage` solo guarda favoritos. No hay fuentes remotas, mapas, iframes, analítica, píxeles ni CDN. Por eso no hay banner de consentimiento. Si se añade cualquier recurso de terceros, cookie no técnica o almacenamiento nuevo, hay que actualizar `cookies.html` y `privacidad.html` y valorar el banner.

## Dirección artística

Boutique editorial cálida, femenina y comercial. Marfil `#FAF6F1`, chocolate `#4B2A21`, rosa empolvado `#E2B9CB`. Tipografía serif del sistema para titulares y Segoe UI/Arial para navegación y textos. Sin fuentes remotas, iconos emoji, librerías, gradientes decorativos, sombras grandes ni tarjetas con esquinas redondeadas. El único degradado es el velo de contraste sobre la fotografía del hero.

El logo circular real aparece en header, footer y favicon; la sección de tienda usa el banner corporativo y la fotografía real del escaparate, completos y sin alterar. No sustituirlos por un logotipo generado. Conservar la composición, fotografía, titular y estilos del hero, las cuatro categorías y el editorial «Menos prisa. Más esencia». Evolucionar el código existente sin sustituir la hoja de estilos ni reorganizar el proyecto.

## Datos reales: qué no inventar

- **Marcas confirmadas:** Gladiator, Cacharel, Anekke, Totto, Pepe Moll, Torrens (Torrens Hermanos, marroquinería) y Gabol. Nicole Lee USA y Bienoti aparecen solo en fichas (`catalogOnly`), sin menú ni franja. Sin marca legible en la pieza, la línea de marca no se muestra.
- **Logos:** seis aportados por la clienta (`logoStatus: "approved"`; Anekke usa el archivo `anneke-logo.png`). Torrens usa texto provisional hasta tener un archivo oficial autorizado. Detalle en `public/assets/marcas/README.md`. No usar un logo por el mero hecho de ser descargable, ni logos de empresas homónimas o de perfumes Cacharel.
- **Imágenes:** las de `public/assets/photos/` (hero, categorías, editorial) son generadas e ilustrativas; no presentarlas como productos reales. Las fotos de producto son reales.
- No inventar productos, precios, stock, promociones, reseñas, garantías, envíos ni datos de contacto o de la titular.

## Accesibilidad

Mantener `lang=es`, enlace para saltar al contenido, landmarks, títulos jerárquicos, nombres accesibles, `aria-expanded`, `aria-pressed`, estados `aria-live`, alt descriptivos y foco visible. Los diálogos devuelven el foco al control original. `IntersectionObserver` revela contenido progresivamente; sin JavaScript el contenido editorial sigue visible. Con `prefers-reduced-motion` no hay animaciones de entrada, movimiento continuo ni scroll suave. No introducir autoplay en productos ni interacciones que dependan solo del hover.

## Pendiente

- **Cloudflare** (marcado con `TODO` en `wrangler.jsonc`): `database_id` real, bucket real, `ACCESS_TEAM_DOMAIN` y `ACCESS_AUD`. Al cambiar `database_id` la D1 local empieza vacía: volver a aplicar esquema y migración en local. En remoto hay que aplicar las tres migraciones antes del primer despliegue.
- **Titular:** rellenar `LEGAL`. Dirección, horario y zona para título, descripción y datos estructurados `LocalBusiness`. El plazo de conservación de doce meses de `privacidad.html` es una propuesta que debe confirmar la titular. Los textos legales no los ha revisado un profesional jurídico.
- **Tras desplegar:** comprobar qué cookies pone Cloudflare de verdad (`__cf_bm`, `cf_clearance`, `CF_Authorization`) y ajustar la tabla de `cookies.html`.
- **Sin probar:** un móvil físico; Cloudflare Access real (sesión caducada incluida, que en local se ha simulado); `prefers-reduced-motion` con el ajuste real del sistema (se ha comprobado la cascada de CSS); los scripts con `--remote`.

## Estado · 13 de noviembre de 2026

Probado en local: `npm test` (135 pruebas) y `npm run test:panel` (17). En el navegador, a 375 px: crear un producto con foto, aviso de sesión caducada y vuelta a guardar sin perder el formulario, cambiar la foto con un fallo de subida simulado (el producto sigue en la tienda con su foto anterior) y reintento correcto, precio con espacios rechazado, `1.234,56` aceptado, nombre con emoji, borrado; pausa y reanudación de la franja de marcas. Copia de seguridad local completa (datos y 83 imágenes) y migración local: rechazo con la base de datos llena y ejecución con `--forzar`. Páginas legales a 375 px y escritorio. Nada desplegado.
