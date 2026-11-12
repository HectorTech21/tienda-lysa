# Identidad de las siete marcas de Tienda Lysa

Investigación realizada el 2 de noviembre de 2026. La relación comercial con estas siete firmas procede de la información facilitada por Tienda Lysa. Las familias de productos facilitadas describen a las marcas, no el inventario de la tienda.

## Archivos incorporados

Actualización del 4 de noviembre de 2026: el cliente ha proporcionado y solicitado expresamente utilizar los siguientes seis archivos. Se inspeccionaron sus nombres, extensiones, dimensiones y contenido visual antes de integrarlos. Se utilizan sin filtros, sin deformaciones y sin modificar los originales. El logo principal de Tienda Lysa se conserva intacto.

| Marca | Archivo proporcionado | Dimensiones |
| --- | --- | --- |
| Gladiator | `gladiator-logo.png` | 1880 × 108 |
| Cacharel | `cacharel-logo.jpg` | 566 × 241 |
| Anekke | `anneke-logo.png` | 300 × 192 |
| Totto | `totto-logo.jpg` | 800 × 445 |
| Pepe Moll | `pepemoll-logo.jpg` | 826 × 270 |
| Gabol | `gabol-logo.png` | 577 × 346 |

`anneke-logo.png` corresponde a **Anekke**; se conserva el nombre de archivo recibido. El archivo de Gladiator tiene grandes márgenes grises a los lados: un encuadre CSS oculta solo esos márgenes y mantiene completos el símbolo y el nombre, sin alterar el archivo. Cada marca dispone de un tamaño visual propio con `object-fit: contain`.

En `BRANDS`, estos seis archivos tienen `logoStatus: "approved"` por la incorporación expresamente solicitada por el cliente; no significa que se haya obtenido una autorización independiente del fabricante. **Torrens sigue pendiente** y utiliza texto editorial provisional, sin imitar su logotipo. La franja usa los archivos reales; el desplegable conserva los nombres y su composición existente.

## Investigación previa (2 de noviembre de 2026)

La tabla siguiente conserva el resultado histórico de la investigación anterior a la entrega de archivos por el cliente. Los pendientes gráficos de seis marcas han sido cubiertos por esa entrega; Torrens continúa pendiente.

Se buscaron recursos en webs oficiales y se revisaron las condiciones disponibles. La descarga HTTP desde el entorno local fue rechazada por conectividad (`curl` contra la web oficial de Gladiator no pudo conectar). La búsqueda web sí permitió consultar las páginas y avisos indicados abajo. No se puede confundir una página pública con una autorización de reutilización comercial.

## Fuentes y recursos pendientes

| Marca | Fuente de referencia | Resultado y pendiente |
| --- | --- | --- |
| Gladiator | [Web oficial de maletas](https://maletasgladiator.com/) y [aviso legal](https://maletasgladiator.com/aviso-legal/) | Identidad de equipaje confirmada. El aviso limita las descargas a uso personal y privado y condiciona la reproducción a autorización escrita. Falta un SVG/PNG autorizado para la tienda. |
| Cacharel | [Cacharel Bags](https://cacharelbags.com/), [aviso legal](https://cacharelbags.com/aviso-legal) y [condiciones generales, apartado 4](https://cacharelbags.com/condiciones-generales) | Se verificó la web de bolsos de NN Quality Bags. Sus condiciones no ceden derechos generales de reproducción. Falta su archivo autorizado; se descartaron resultados de perfumes y vectores cuya correspondencia con esta identidad no estaba confirmada. |
| Anekke | [Web oficial](https://anekke.com/) y [Legal Notice](https://anekke.com/pages/legal-notice) | El aviso restringe el uso comercial de contenidos y el uso de logos sin autorización. Falta el archivo y permiso correspondiente para el punto de venta. |
| Totto | [Totto España](https://www.totto.es/) y [términos del servicio, apartado 18](https://www.totto.es/policies/terms-of-service) | Se identificó la web española actual. Sus términos requieren autorización escrita para la explotación de contenidos. Falta el logo de la identidad vigente y autorización para utilizarlo. |
| Pepe Moll | [Web oficial](https://pepemoll.es/) y [aviso legal](https://pepemoll.es/aviso-legal/) | La web de bolsos y complementos se pudo consultar; el aviso legal devolvió timeout. No se confirmó un recurso corporativo reutilizable. Falta SVG/PNG y confirmación de uso. |
| Torrens | [Dominio de referencia de Torrens Hermanos](https://www.torrenshermanos.com/) | El dominio devolvió 502. Su vinculación histórica con la empresa de marroquinería consta en el [directorio de la Cámara de Zaragoza](https://www.camarazaragoza.com/wp-content/uploads/2017/12/directorio-de-empresas-espa%C3%83%C2%B1olas-implantadas-en-vietnam.pdf); la [ficha de marroquinería de Adana](https://adanashopping.com/es/brand/64-torrens) también identifica a Torrens Hermanos. El dominio histórico no se presenta como web actual verificada. Se descartó `torrens.com`, que corresponde a otra actividad. Falta confirmar el canal oficial actual y obtener el archivo autorizado. |
| Gabol | [Web oficial](https://gabol.com/) y [aviso legal](https://gabol.com/en/p/2-legal-notice) | Se identificó la marca de equipaje, su web y área profesional. No se confirmó una autorización pública de reutilización de su logo. Falta el archivo autorizado del proveedor. |

No se utilizaron repositorios de logos de terceros como prueba de autorización ni logotipos de campañas de perfumes, empresas homónimas, capturas recortadas o versiones dibujadas a mano. No se han enviado mensajes a ninguna marca.

## Cómo incorporar o sustituir archivos en el futuro

La información funcional vive exclusivamente en `BRANDS`, al principio de `script.js`. No mantener una segunda lista de marcas en HTML o en otro archivo de datos.

1. Guardar el archivo oficial y autorizado en esta carpeta, por ejemplo `assets/marcas/gladiator.svg`.
2. Establecer la ruta local en `logo` y `logoStatus: "approved"` en esa marca. Los valores `null` y `pending-*` de Torrens evitan solicitudes a imágenes inexistentes. Se admiten SVG, PNG, JPG/JPEG y WebP.
3. Anotar aquí procedencia exacta del archivo, fecha y autorización proporcionada por el cliente/proveedor, respetando sus normas de identidad. No dar por verificado un archivo solo por su nombre.
4. Comprobar proporción, contraste, transparencia, lectura en móvil y ausencia de scripts o referencias externas en un SVG.
5. La franja utiliza el recurso; el menú mantiene nombres tipográficos. `object-fit: contain` conserva las proporciones; si la carga falla se muestra el nombre. Las copias del carrusel conservan ese fallback y quedan fuera del orden de Tab y de lectores de pantalla.

Este registro documenta comprobaciones y pendientes; no pretende dar una opinión jurídica ni sustituye las condiciones de cada proveedor.
