# Presentación y auditoría final de Tienda Lysa

## Contacto definitivo · 6 de noviembre de 2026

La web está lista para enseñar el MVP a la clienta en una demostración local o con Live Server. Conserva el diseño, las fotografías, las siete marcas principales y los 14 artículos. No está preparada todavía para un lanzamiento comercial definitivo ni se ha publicado desde esta tarea.

WhatsApp e Instagram están activos con los datos oficiales facilitados por la clienta, centralizados en `store-config.js`. El número es `34644016917` y el perfil es `https://www.instagram.com/tienda.lysa/`. Sigue pendiente la URL pública definitiva del proyecto.

## Recorrido breve · 4 minutos

1. Mostrar el hero y las categorías. Recorrer la franja de marcas y la historia de la tienda con escaparate y banner reales.
2. Entrar en el catálogo: 14 productos, nombres sencillos, fotos reales y «Consultar precio». Usar una flecha para ver más piezas.
3. Elegir Pepe Moll y Bolsos; después Mochilas para enseñar la composición de una pieza. Abrir la ficha: fotografía completa, referencia y acción de WhatsApp.
4. Limpiar filtros; elegir Cacharel y Complementos para mostrar las dos carteras. Las fotos colectivas pendientes permanecen fuera del catálogo público.
5. Guardar una pieza con el corazón y abrir favoritos desde la cabecera. Mostrar también el menú móvil.
6. Mostrar «Hablemos» y «Síguenos y contacta» en el footer. Preparan una consulta general en WhatsApp; Instagram abre @tienda.lysa. Las tarjetas y fichas preparan exclusivamente la consulta de su artículo. El visitante revisa y decide enviar el mensaje en WhatsApp.

## Configuración de contacto

`WHATSAPP_NUMBER` ya contiene el teléfono oficial, con prefijo internacional y solo dígitos. `WHATSAPP_GENERAL_MESSAGE` define la consulta general e `INSTAGRAM_URL` el perfil oficial. Modificar únicamente esta configuración si la tienda cambia sus contactos y recargar.

`buildWhatsAppUrl` es la única función que construye las URLs y codifica el mensaje con `encodeURIComponent`. Las tarjetas y fichas usan nombre, marca identificada y referencia inmutable del registro. El contacto general usa otro mensaje, sin producto. Todos los enlaces externos abren una nueva pestaña con `noopener noreferrer`. Se ha sustituido el formulario de descarga local por el contacto real; no se envían mensajes automáticamente.

Las secciones de auditoría anteriores que siguen documentan el estado histórico del MVP. La activación de contacto de esta sección sustituye sus referencias al teléfono vacío y al formulario local.

## Verificación de contacto · 6 de noviembre de 2026

- Edge headless con Live Server 5.7.10 ya instalado y carga directa `file://`, sin instalar paquetes. Teléfono exacto comprobado en configuración y URLs.
- Los 28 enlaces de las 14 tarjetas y 14 fichas coinciden con nombre, marca identificada y referencia del catálogo. Mensajes decodificados y codificación `encodeURIComponent` comprobados, incluidas tildes, signos y comillas. Marcas desconocidas omitidas.
- Los cuatro accesos generales usan el mensaje general exacto, sin referencias a productos. Instagram dirige al perfil oficial. Enlaces con nombres accesibles, nueva pestaña y `noopener noreferrer`; clics de ficha, contacto y redes interceptados localmente antes de navegar, sin abrir servicios externos ni enviar mensajes.
- Revisión visual del footer a 1440 y 320 px, del contacto y ficha en móvil y de la ficha en escritorio. Geometría comprobada a 1440, 768, 390 y 320 px: sin desbordamiento horizontal, iconos alineados y enlaces sociales de 44 × 44 px. Preferencia de movimiento reducido respetada. Móviles emulados; sin prueba en dispositivo físico.
- Regresión breve de filtro con estado vacío y consulta general, restauración, favoritos y eliminación del último, cierre de fichas con Escape y diálogo de privacidad. Sin errores JavaScript ni recursos HTTP fallidos en el recorrido. Sintaxis de los tres JavaScript y `git diff --check` correctos.
- Comparación automática: HTML del hero, categorías, marcas, editorial y tienda idéntico al original; `catalog-data.js` intacto. Sin frameworks, backend ni cambios en precios o disponibilidad.

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

**Instagram y WhatsApp.** Confirmados por la clienta e integrados el 6 de noviembre. No quedan pendientes de configuración.

**Datos del negocio.** Siguen pendientes dirección, horarios y datos identificativos del titular. El WhatsApp comercial ya lo ha confirmado la clienta.

**Legal y privacidad.** Los diálogos explican el uso de favoritos y los enlaces externos de WhatsApp e Instagram. Antes del lanzamiento comercial, completar el aviso con los datos reales del titular; confirmar responsable y canal de privacidad; adaptar los textos al alojamiento, canales y tratamiento de datos que efectivamente se utilicen. Revisar los textos definitivos con el negocio. No hay carrito, pagos ni condiciones de venta simuladas.

El MVP puede demostrarse con el contacto activo. Cerrar metadatos con el dominio público y completar la información del negocio siguen pendientes.
