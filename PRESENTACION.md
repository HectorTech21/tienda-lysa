# Presentación y auditoría final de Tienda Lysa

## Estado para mañana

La web está lista para enseñar el MVP a la clienta en una demostración local o con Live Server. Conserva el diseño, las fotografías, las siete marcas principales y los 14 artículos. No está preparada todavía para un lanzamiento comercial definitivo ni se ha publicado desde esta tarea.

Faltan tres datos para cerrar la presentación con contacto y vista previa externos: teléfono real de WhatsApp, Instagram oficial confirmado y URL pública definitiva de este proyecto. No se han inventado ni tomado teléfonos de directorios.

## Recorrido breve · 4 minutos

1. Mostrar el hero y las categorías. Recorrer la franja de marcas y la historia de la tienda con escaparate y banner reales.
2. Entrar en el catálogo: 14 productos, nombres sencillos, fotos reales y «Consultar precio». Usar una flecha para ver más piezas.
3. Elegir Pepe Moll y Bolsos; después Mochilas para enseñar la composición de una pieza. Abrir la ficha: fotografía completa, referencia y acción de WhatsApp.
4. Limpiar filtros; elegir Cacharel y Complementos para mostrar las dos carteras. Las fotos colectivas pendientes permanecen fuera del catálogo público.
5. Guardar una pieza con el corazón y abrir favoritos desde la cabecera. Mostrar también el menú móvil.
6. Si el número sigue pendiente, explicar que WhatsApp está preparado y desactivado. El formulario general solo prepara, edita y descarga una consulta; no envía mensajes.

## Activar WhatsApp

Editar `store-config.js`, línea 5: rellenar `WHATSAPP_NUMBER` entre comillas con el teléfono **real y verificado**, incluido el prefijo internacional, solo dígitos, sin `+`, espacios ni guiones. Guardar y recargar.

Sin número o con formato inválido no hay enlaces a WhatsApp; los botones están desactivados con aviso visible. Con número válido, las acciones pasan a chocolate y abren otra pestaña con el nombre, marca identificada, referencia y pregunta sobre precio y disponibilidad. El usuario revisa el mensaje y decide enviarlo. Comprobar mañana el destinatario real: la prueba controlada valida la URL, no la titularidad de una cuenta de WhatsApp.

## Problemas encontrados y correcciones

- No había metadatos Open Graph. Se añadieron título, descripción, tipo de web, nombre de tienda e idioma; se hizo más descriptivo el título de la pestaña. Se mantienen el favicon real, el idioma español y el viewport.
- Algunos controles táctiles eran pequeños: corazones de 29 px en móvil, flechas de 34 px y filtros de 31 px de alto. Ahora favoritos, flechas y cierres tienen 44 × 44 px en móvil/tablet; filtros y selector alcanzan 44 px de alto.
- Los enlaces legales del footer usaban 8 px. Se elevaron a 12 px; los enlaces de sus columnas también se hicieron más legibles en móvil, con zonas de pulsación mayores.
- No se encontraron imágenes rotas, solapamientos persistentes, desbordamiento horizontal ni errores JavaScript en los recorridos probados. No se cambió lo que ya funcionaba.

Se comparó el resultado con una copia del inicio de esta auditoría: hero, categorías, franja de marcas, editorial y sección de tienda mantienen idéntico HTML. `catalog-data.js`, `script.js` y `store-config.js` no se han modificado durante la auditoría. No se han añadido funcionalidades ni dependencias al proyecto.

## Comprobaciones finales ejecutadas

Edge headless y Node nativo, sin instalar paquetes:

- Revisión visual por secciones a 1440, 768, 390 y 320 px; catálogo completo revisado en una hoja de las 14 fotografías. Fichas, menú móvil y footer revisados tras los ajustes.
- Nueve anchos en la revisión final: 320, 390, 580, 581, 768, 850, 851, 1100 y 1440 px, sin desbordamiento horizontal. Las pruebas móviles son emuladas; no se ha probado un dispositivo físico.
- Carga con **Live Server 5.7.10 ya instalado**, servido temporalmente por su propio módulo a través de HTTP local. No se sustituyó esta prueba por una comprobación estática. También se comprobó `file://`.
- Catorce IDs y referencias únicos; categorías válidas, precio sin inventar, marcas desconocidas omitidas y «Consultar precio» con acción preparada. Los registros colectivos siguen fuera de tarjetas, fichas y recuentos. Cada ficha pública actual tiene una fotografía; no se inventaron vistas adicionales para probar una galería.
- Fotografías locales cargadas, alt presentes, anclas editoriales con destino, un único H1, jerarquía de encabezados, favicon y metadatos correctos. Las tarjetas se abren mediante sus manejadores de ficha.
- Marcas: avance automático real, dos grupos de igual anchura, pausa y reanudación, siete destinos de teclado visibles y movimiento reducido sin animación ni copia duplicada visible.
- Filtros combinados, estado vacío y restauración, favoritos y eliminación de la última clave, ficha con Escape y retorno del foco. Selección de marca mediante evento táctil real emulado y cierre del menú móvil.
- Los 28 enlaces de WhatsApp (14 tarjetas y 14 fichas) se verificaron con configuración temporal **solo en memoria del navegador**. Mensajes, codificación, referencias, destino, nueva pestaña y `noopener noreferrer` correctos. Siete valores ausentes o inválidos no generaron enlaces. No se abrió WhatsApp ni se enviaron mensajes. El archivo entregado sigue vacío.
- Aviso legal y privacidad abren contenido real en diálogo y cierran con Escape. El formulario y la descarga efectiva del `.txt` ya se comprobaron en la revisión anterior; no han cambiado.
- Sin errores de consola ni excepciones JavaScript durante esta revisión; sin recursos con respuesta HTTP de error. `node --check` correcto en los tres archivos JavaScript; `git diff --check` correcto.

Las 14 fotos públicas reutilizan los WebP existentes: unos 665 KiB en total, máximo 82 KiB por foto. Las fotos editoriales existentes pesan entre 248 y 345 KiB. Se conservan originales y encuadres; las imágenes inferiores mantienen lazy loading y el hero `fetchpriority="high"`. No se ha realizado una medición de Core Web Vitals en producción ni en una red móvil real.

## Pendientes para compartir y publicar

**URL pública y Open Graph.** No hay un dominio de despliegue confirmado en el proyecto. Al disponer de él, añadir en el HTML estático `canonical`, `og:url` y `og:image` con las URLs definitivas. Imagen prevista: el banner corporativo original `assets/images/banner.jpg`; acompañarlo de sus dimensiones 1320 × 633, tipo JPEG y alt descriptivo. No se han puesto URLs de localhost, rutas de imagen relativas en Open Graph ni un sitemap ficticio. La vista previa con imagen no puede darse por terminada hasta publicar y verificar las URLs. Referencia: [protocolo Open Graph](https://ogp.me/). No basta con modificar estos metadatos desde JavaScript, porque los robots pueden leer únicamente el HTML inicial.

**Instagram.** El proyecto no contiene enlace de Instagram. La búsqueda encontró como candidato `https://www.instagram.com/tienda.lysa/` en un [directorio del negocio](https://www.paginasamarillas.es/f/madrid/tienda-lysa-moda-y-complementos_234300606_000000001.html), pero no se pudo verificar el perfil directamente. Está pendiente de confirmación de la tienda; no se ha añadido al footer un enlace cuya titularidad no está confirmada.

**Datos del negocio.** Confirmar teléfono comercial, dirección, horarios y datos identificativos del titular. Siguen pendientes; no se ha atribuido a la tienda información encontrada en directorios.

**Legal y privacidad.** Los diálogos actuales explican honestamente el alcance del MVP y el uso de favoritos, formulario local y WhatsApp. Antes del lanzamiento comercial, completar el aviso con los datos reales del titular y contacto; confirmar responsable y canal de privacidad; adaptar los textos al alojamiento, canales y tratamiento de datos que efectivamente se utilicen. Revisar los textos definitivos con el negocio. No hay carrito, pagos ni condiciones de venta simuladas.

El MVP puede demostrarse con estas limitaciones explícitas. Activar WhatsApp, verificar Instagram, cerrar metadatos con el dominio público y completar la información del negocio son pasos distintos de la revisión visual y funcional ya terminada.
