"use strict";

/* ÚNICA FUENTE DE MARCAS. Confirmadas por Tienda Lysa.
 * Sus familias de productos no describen las existencias de la tienda.
 * Activar un logo solo con archivo local autorizado: logo + logoStatus: "approved".
 * Fuentes, investigación y recursos pendientes: assets/marcas/README.md.
 */
// Marcas y catálogo en catalog-data.js, cargado antes de este archivo.

/* CATÁLOGO REAL: editar los registros en catalog-data.js.
 * brand debe coincidir con un id de BRANDS. No inferir disponibilidad por marca.
 * No se incluyen precios, existencias, descuentos ni productos oficiales ficticios.
 */


/* EJEMPLOS VISUALES: conservan las fotografías y los favoritos del MVP original.
 * No pertenecen a ninguna de las siete marcas. Nunca coinciden con un filtro de marca.
 * Se muestran mientras no haya un catálogo real; permanecen separados de sus datos.
 * Script clásico, compatible con file:// y sin dependencias.
 */
const DEMO_CATALOG = {
  products: [
    { id: "demo-curva", name: "Bolso Curva", brand: null, isExample: true, category: "bolsos", image: "assets/photos/bag.jpg", alt: "Bolso chocolate de muestra con asa redondeada", tone: "Chocolate", swatch: "#503127", description: "Una silueta de líneas suaves y un tono chocolate para imaginar tus próximos looks." },
    { id: "demo-pausa", name: "Mochila Pausa", brand: null, isExample: true, category: "mochilas", image: "assets/photos/backpack.jpg", alt: "Mochila de muestra en color arena con correas caramelo", tone: "Arena", swatch: "#c3ad8b", description: "Tonos arena y caramelo en una mochila que inspira días en movimiento." },
    { id: "demo-rumbo", name: "Maleta Rumbo", brand: null, isExample: true, category: "maletas", image: "assets/photos/suitcase.jpg", alt: "Maleta de muestra color marfil con relieve horizontal y ruedas", tone: "Marfil", swatch: "#dcd4c5", description: "Una invitación a imaginar tu próxima escapada, en un luminoso tono marfil." },
    { id: "demo-ritual", name: "Estuche Ritual", brand: null, isExample: true, category: "complementos", image: "assets/photos/accessory.jpg", alt: "Estuche de muestra color chocolate con un pañuelo rosa a su lado", tone: "Chocolate", swatch: "#53372c", description: "Pequeños detalles en chocolate y rosa empolvado que ponen el acento en lo cotidiano." },
    { id: "demo-luz", name: "Bandolera Luz", brand: null, isExample: true, category: "bolsos", image: "assets/photos/hero.jpg", alt: "Bolso bandolera de muestra color caramelo sobre una silla de madera", tone: "Caramelo", swatch: "#b37b4c", description: "El tono cálido y las formas sencillas de nuestro editorial, para llevar tu esencia contigo." }
  ]
};

(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const categories = Object.fromEntries([["all", "Todas las categorías"], ...CATALOG_CATEGORIES.map(item => [item.id, item.name])]);
  const products = CATALOG_PRODUCTS.length ? CATALOG_PRODUCTS.map(product => ({ ...product, image: product.images[0].src, alt: product.images[0].alt, tone: product.color, category: product.categories[0] })) : DEMO_CATALOG.products;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopMenu = window.matchMedia("(min-width: 851px)");
  const hoverPointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const track = $("#product-track");
  const brandToggle = $("#brands-toggle");
  const brandPanel = $("#brands-panel");
  const brandSelect = $("#brand-select");
  const navigation = $("#main-navigation");
  const mobileToggle = $(".mobile-toggle");
  const prev = $("#products-prev");
  const next = $("#products-next");
  const filterState = { category: "all", brand: "all", favorites: false };
  const storageKey = "lysa-demo-favorites-v1";
  let favorites = new Set();
  let filteredProducts = [];
  let toastTimer;
  let renderTimer;
  let hoverTimer;
  let lastOpener;
  let inquiryText = "";

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (Array.isArray(saved)) favorites = new Set(saved.filter(id => products.some(product => product.id === id)));
  } catch { /* La navegación privada o el almacenamiento bloqueado no impiden usar favoritos. */ }

  function brandName(id) {
    return BRANDS.find(brand => brand.id === id)?.name || "Inspiración Lysa";
  }

  function announce(message) {
    const toast = $("#toast");
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3000);
  }

  function setBrandsOpen(open, returnFocus = false) {
    clearTimeout(hoverTimer);
    brandToggle.setAttribute("aria-expanded", String(open));
    brandPanel.hidden = !open;
    if (returnFocus) brandToggle.focus();
  }

  function setMobileOpen(open, returnFocus = false) {
    mobileToggle.setAttribute("aria-expanded", String(open));
    $(".mobile-menu-label").textContent = open ? "Cerrar" : "Menú";
    navigation.classList.toggle("is-open", open);
    if (!open) setBrandsOpen(false);
    if (returnFocus) mobileToggle.focus();
  }

  function focusCatalog() {
    const heading = $("#selection-title");
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
    $("#seleccion").scrollIntoView({ behavior: reducedMotion.matches ? "instant" : "smooth", block: "start" });
  }

  function setBrand(brand, moveFocus = false) {
    if (brand !== "all" && !BRANDS.some(item => item.id === brand)) return;
    filterState.brand = brand;
    filterState.favorites = false;
    setBrandsOpen(false);
    setMobileOpen(false);
    renderProducts();
    if (moveFocus) focusCatalog();
  }

  function createBrandIdentity(brand, useLogo = true) {
    const identity = document.createElement("span");
    identity.className = `brand-identity brand-identity--${brand.id}`;
    const text = document.createElement("span");
    text.className = "brand-text";
    text.textContent = brand.name;
    identity.append(text);
    // No se solicitan imágenes externas ni rutas pendientes. El nombre es el fallback.
    if (useLogo && brand.logoStatus === "approved" && /^assets\/marcas\/[^/]+\.(svg|png|jpe?g|webp)$/i.test(brand.logo || "")) {
      const image = document.createElement("img");
      image.src = brand.logo;
      image.alt = ""; // El botón ya tiene un nombre accesible; evita repetir la marca.
      image.decoding = "async";
      image.width = 160;
      image.height = 54;
      image.addEventListener("load", () => { text.hidden = true; identity.classList.add("has-logo"); });
      image.addEventListener("error", () => { image.remove(); text.hidden = false; identity.classList.remove("has-logo"); }, { once: true });
      identity.prepend(image);
    }
    return identity;
  }

  function createBrandControls() {
    const menu = $("#brands-menu");
    const marquee = $("#marquee-track");
    const group = document.createElement("div");
    group.className = "marquee-group";
    const sequence = document.createElement("div");
    sequence.className = "marquee-sequence";
    group.append(sequence);
    BRANDS.forEach(brand => {
      const option = new Option(brand.name, brand.id);
      brandSelect.add(option);
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.brand = brand.id;
      button.setAttribute("aria-pressed", "false");
      const label = document.createElement("span");
      label.className = "brand-menu-label";
      // Conserva el menú editorial y su geometría; los archivos gráficos protagonizan la franja.
      label.append(createBrandIdentity(brand, false));
      const family = document.createElement("span");
      family.className = "brand-menu-family";
      family.textContent = brand.identity || brand.families.slice(0, 2).join(" · ");
      label.append(family);
      button.append(label);
      const arrow = document.createElement("span");
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "↗";
      button.append(arrow);
      menu.append(button);
      const word = document.createElement("button");
      word.type = "button";
      word.className = "brand-item";
      word.dataset.brand = brand.id;
      word.setAttribute("aria-label", `Ver la selección de ${brand.name}`);
      word.setAttribute("aria-pressed", "false");
      word.append(createBrandIdentity(brand));
      sequence.append(word);
      const separator = document.createElement("span");
      separator.className = "brand-separator";
      separator.textContent = "·";
      separator.setAttribute("aria-hidden", "true");
      sequence.append(separator);
    });
    const allButton = document.createElement("button");
    allButton.type = "button";
    allButton.className = "all-brands";
    allButton.dataset.brand = "all";
    allButton.textContent = "Todas las marcas →";
    allButton.setAttribute("aria-pressed", "true");
    menu.append(allButton);
    marquee.append(group);
    const duplicate = document.createElement("div");
    duplicate.className = "marquee-group";
    duplicate.setAttribute("aria-hidden", "true");
    marquee.append(duplicate);
    const marqueeWindow = $(".marquee-window");
    function copySequence() {
      const copy = sequence.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      // Las copias admiten clic/tap, pero nunca duplican los siete destinos accesibles.
      $$("button", copy).forEach(button => {
        button.tabIndex = -1;
        button.replaceChildren(createBrandIdentity(BRANDS.find(brand => brand.id === button.dataset.brand)));
      });
      return copy;
    }
    let repetitions = 0;
    function sizeMarquee() {
      const sequenceWidth = sequence.getBoundingClientRect().width;
      if (!sequenceWidth) return;
      const count = Math.max(1, Math.ceil(marqueeWindow.clientWidth / sequenceWidth));
      if (count === repetitions) return;
      repetitions = count;
      $$(".marquee-sequence[aria-hidden]", group).forEach(copy => copy.remove());
      duplicate.replaceChildren();
      for (let index = 1; index < count; index++) group.append(copySequence());
      for (let index = 0; index < count; index++) duplicate.append(copySequence());
      // Cada mitad incluye las mismas secuencias, gaps y padding. La velocidad no cambia.
      marquee.style.animationDuration = `${75 * count}s`;
    }
    sizeMarquee();
    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(sizeMarquee);
      observer.observe(marqueeWindow);
      observer.observe(sequence);
    } else window.addEventListener("resize", sizeMarquee);
    marqueeWindow.addEventListener("focusin", event => {
      if (!event.target.matches(":focus-visible")) return;
      marqueeWindow.classList.add("is-keyboard-navigation");
      requestAnimationFrame(() => {
        if (marqueeWindow.contains(document.activeElement)) event.target.scrollIntoView({ behavior: "instant", block: "nearest", inline: "center" });
      });
    });
    marqueeWindow.addEventListener("focusout", event => {
      if (!marqueeWindow.contains(event.relatedTarget)) {
        marqueeWindow.classList.remove("is-keyboard-navigation");
        marqueeWindow.scrollLeft = 0;
      }
    });
  }

  function favoriteSvg() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>';
  }

  function createProductCard(product, index) {
    const card = document.createElement("article");
    card.className = "product-card" + (product.isExample ? "" : " product-card--real");
    card.style.animationDelay = `${index * 35}ms`;
    card.setAttribute("aria-label", `${index + 1} de ${filteredProducts.length}: ${product.name}`);
    const imageBox = document.createElement("div");
    imageBox.className = "product-image";
    const view = document.createElement("a");
    view.href = "#pieza-" + product.id;
    view.dataset.product = product.id;
    view.setAttribute("aria-label", `Ver ${product.name}${product.isExample ? ", ejemplo de estilo" : ""}`);
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.alt;
    image.width = 1024;
    image.height = 1280;
    image.loading = "lazy";
    image.decoding = "async";
    image.draggable = false;
    const viewLabel = document.createElement("span");
    viewLabel.className = "product-view";
    viewLabel.textContent = product.recordType === "review" ? "Ver fotografía pendiente ↗" : "Ver detalles ↗";
    view.append(image, viewLabel);
    const favoriteButton = document.createElement("button");
    favoriteButton.type = "button";
    favoriteButton.className = "product-favorite";
    favoriteButton.dataset.favorite = product.id;
    favoriteButton.innerHTML = favoriteSvg();
    updateFavoriteButton(favoriteButton, product);
    imageBox.append(view, favoriteButton);
    const info = document.createElement("div");
    info.className = "product-info";
    const brand = document.createElement("p");
    brand.className = "product-brand";
    brand.textContent = product.isExample ? "Inspiración Lysa" : product.brand ? brandName(product.brand) : product.observedBrand ? `${product.observedBrand} · confirmación comercial pendiente` : "Marca por confirmar";
    const name = document.createElement("a");
    name.className = "product-name";
    name.dataset.product = product.id;
    name.href = "#pieza-" + product.id;
    name.textContent = product.name;
    const note = document.createElement("p");
    note.className = "product-note";
    const tone = document.createElement("span");
    const swatch = document.createElement("span");
    swatch.className = "color-swatch";
    swatch.setAttribute("aria-hidden", "true");
    swatch.style.setProperty("--swatch", product.swatch);
    tone.append(swatch, document.createTextNode(" " + product.tone));
    const demo = document.createElement("span");
    demo.textContent = product.isExample ? "Ejemplo de estilo" : (product.categories || [product.category]).map(id => categories[id]).join(" · ");
    note.append(tone, demo);
    const description = document.createElement("p");
    description.className = "product-description";
    description.textContent = product.description;
    const discover = document.createElement("a");
    discover.className = "text-link product-discover";
    discover.href = view.href;
    discover.dataset.product = product.id;
    discover.textContent = product.recordType === "review" ? "Revisar fotografía ↗" : "Consultar producto ↗";
    const status = document.createElement("p");
    status.className = "product-catalog-status";
    status.textContent = product.recordType === "review" ? "Fotografía pendiente de revisión · varios artículos" : "Consultar precio · disponibilidad por confirmar";
    info.append(brand, name, note, status, description, discover);
    card.append(imageBox, info);
    return card;
  }

  function updateFavoriteButton(button, product) {
    const saved = favorites.has(product.id);
    button.setAttribute("aria-pressed", String(saved));
    button.setAttribute("aria-label", `${saved ? "Quitar" : "Guardar"} ${product.name} ${saved ? "de" : "en"} favoritos`);
  }

  function syncFavoriteCount() {
    $(".favorites-count").textContent = String(favorites.size);
    const button = $(".favorites-toggle");
    button.classList.toggle("is-active", filterState.favorites);
    button.setAttribute("aria-label", `Ver mis piezas guardadas: ${favorites.size}`);
    button.setAttribute("aria-pressed", String(filterState.favorites));
  }

  function syncFilterUI() {
    brandSelect.value = filterState.brand;
    $$("[data-filter-category]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.filterCategory === filterState.category)));
    $$("[data-brand]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.brand === filterState.brand)));
    brandToggle.classList.toggle("has-selection", filterState.brand !== "all");
    brandToggle.setAttribute("aria-label", `Marcas: ${filterState.brand === "all" ? "Todas las marcas" : brandName(filterState.brand)}`);
    $("#brand-selection-label").textContent = filterState.brand === "all" ? "Siete firmas para encontrar tu estilo." : `Tu selección: ${brandName(filterState.brand)}`;
    let text = categories[filterState.category] + " / " + (filterState.brand === "all" ? "Todas las marcas" : brandName(filterState.brand));
    if (filterState.favorites) text = "Tus piezas guardadas / " + text;
    $("#filter-description").textContent = text + ` · ${filteredProducts.length} registros`;
    $(".reset-filters").hidden = filterState.category === "all" && filterState.brand === "all" && !filterState.favorites;
    syncFavoriteCount();
  }

  function renderProducts(animate = true) {
    clearTimeout(renderTimer);
    if (animate && !reducedMotion.matches) track.classList.add("is-updating");
    const render = () => {
      filteredProducts = products.filter(product =>
        (filterState.category === "all" || (product.categories || [product.category]).includes(filterState.category)) &&
        (filterState.brand === "all" || product.brand === filterState.brand) &&
        (!filterState.favorites || favorites.has(product.id))
      );
      track.replaceChildren(...filteredProducts.map(createProductCard));
      track.scrollLeft = 0;
      track.hidden = filteredProducts.length === 0;
      $(".empty-state").hidden = filteredProducts.length > 0;
      const hasBrand = filterState.brand !== "all";
      $("#empty-title").textContent = hasBrand ? `${brandName(filterState.brand)}, a tu estilo.` : "Tu próxima pieza está por descubrir.";
      $("#empty-description").textContent = hasBrand
        ? `Todavía no hay piezas de ${brandName(filterState.brand)}${filterState.category !== "all" ? " en «" + categories[filterState.category] + "»" : ""} incorporadas al catálogo online. Consulta con la tienda para conocer su selección.`
        : filterState.favorites && favorites.size === 0 ? "Toca el corazón de una pieza para guardarla y volver a encontrarla aquí." : "No hay piezas con esta combinación. Prueba otra categoría o vuelve a toda la selección.";
      $("#catalog-note").textContent = CATALOG_PRODUCTS.length ? "Fotografías reales de la tienda. Catálogo en preparación: consulta precio y disponibilidad. Las fotografías pendientes muestran varios artículos y no representan conjuntos a la venta." : "Imágenes de ejemplo sin asociación a las marcas. El catálogo de la tienda está pendiente de incorporar.";
      syncFilterUI();
      track.classList.remove("is-updating");
      requestAnimationFrame(updateCarousel);
    };
    if (animate && !reducedMotion.matches) renderTimer = setTimeout(render, 130);
    else render();
  }

  function updateCarousel() {
    const cards = $$(".product-card", track);
    const columns = parseInt(getComputedStyle(track).getPropertyValue("--catalog-columns"), 10) || 4;
    const isCarousel = cards.length > columns;
    track.classList.toggle("is-carousel", isCarousel);
    track.classList.toggle("is-single", cards.length === 1);
    track.classList.toggle("is-compact", cards.length > 1 && cards.length < columns);
    track.style.setProperty("--result-columns", String(Math.max(1, Math.min(cards.length, columns))));
    $(".carousel-controls").hidden = !isCarousel;
    track.setAttribute("role", isCarousel ? "region" : "list");
    track.setAttribute("aria-label", isCarousel ? "Piezas de la selección; usa las flechas para desplazarte" : "Piezas de la selección");
    if (isCarousel) { track.setAttribute("aria-roledescription", "carrusel"); track.tabIndex = 0; }
    else { track.removeAttribute("aria-roledescription"); track.removeAttribute("tabindex"); }
    cards.forEach(card => { if (isCarousel) card.removeAttribute("role"); else card.setAttribute("role", "listitem"); });
    const maxScroll = track.scrollWidth - track.clientWidth;
    prev.disabled = !cards.length || track.scrollLeft < 3;
    next.disabled = !cards.length || track.scrollLeft >= maxScroll - 3;
    const status = $("#carousel-status");
    if (!cards.length) { status.textContent = `${filterState.brand === "all" ? "Esta selección" : brandName(filterState.brand)}: sin resultados${filterState.category !== "all" ? " en " + categories[filterState.category] : ""}`; return; }
    if (!isCarousel) { status.textContent = `${cards.length} ${cards.length === 1 ? "pieza en esta selección" : "piezas en esta selección"}`; return; }
    const bounds = track.getBoundingClientRect();
    const visible = cards.map((card, index) => ({ rect: card.getBoundingClientRect(), index })).filter(({ rect }) => rect.left < bounds.right - 25 && rect.right > bounds.left + 25);
    if (visible.length) status.textContent = `Viendo ${visible[0].index + 1}–${visible[visible.length - 1].index + 1} de ${cards.length} piezas`;
  }

  function moveCarousel(direction) {
    const card = $(".product-card", track);
    if (!card) return;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    track.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: reducedMotion.matches ? "instant" : "smooth" });
  }

  function resetFilters() {
    Object.assign(filterState, { category: "all", brand: "all", favorites: false });
    renderProducts();
  }

  function openDialog(dialog, opener) {
    lastOpener = opener || document.activeElement;
    $$('dialog[open]').forEach(open => open.close());
    document.body.classList.add("modal-open");
    dialog.showModal();
  }

  function openProduct(id, opener) {
    const product = products.find(item => item.id === id);
    if (!product) return;
    const content = $("#product-detail");
    content.replaceChildren();
    const layout = document.createElement("div");
    layout.className = "product-detail-layout";
    const image = document.createElement("img");
    image.className = "product-detail-image";
    image.src = product.image;
    image.alt = product.alt;
    image.draggable = false;
    const gallery = document.createElement("div");
    gallery.className = "product-gallery";
    gallery.append(image);
    const photos = (product.images || [{ src: product.image, alt: product.alt }]).filter((photo, index, all) => all.findIndex(item => item.src === photo.src) === index);
    if (photos.length > 1) {
      let current = 0;
      const controls = document.createElement("div");
      controls.className = "product-gallery-controls";
      const previous = document.createElement("button");
      const nextImage = document.createElement("button");
      const position = document.createElement("span");
      position.setAttribute("aria-live", "polite");
      previous.type = nextImage.type = "button";
      previous.textContent = "← Anterior";
      nextImage.textContent = "Siguiente →";
      function showPhoto(index) {
        current = index;
        image.src = photos[current].src;
        image.alt = photos[current].alt;
        position.textContent = `Foto ${current + 1} de ${photos.length}`;
        previous.disabled = current === 0;
        nextImage.disabled = current === photos.length - 1;
      }
      previous.addEventListener("click", () => showPhoto(current - 1));
      nextImage.addEventListener("click", () => showPhoto(current + 1));
      showPhoto(0);
      controls.append(previous, position, nextImage);
      gallery.append(controls);
    }
    const copy = document.createElement("div");
    copy.className = "product-detail-copy";
    const brand = document.createElement("p");
    brand.className = "eyebrow";
    brand.textContent = product.isExample ? "Inspiración Lysa" : product.brand ? brandName(product.brand) : product.observedBrand ? `${product.observedBrand} · confirmación comercial pendiente` : "Marca por confirmar";
    const title = document.createElement("h2");
    title.id = "product-dialog-title";
    title.textContent = product.name;
    const label = document.createElement("span");
    label.className = "detail-demo-label";
    label.textContent = "Ejemplo de estilo";
    label.hidden = !product.isExample;
    const description = document.createElement("p");
    description.textContent = product.description;
    const note = document.createElement("p");
    note.className = "product-example-note";
    note.textContent = product.isExample ? "Imagen generada de un ejemplo sin marca, ajeno al catálogo comercial." : product.recordType === "review" ? "Fotografía pendiente de revisión: aparecen varios artículos independientes. No se ofrece como conjunto. Consulta con la tienda para identificar el artículo que te interesa." : "Consultar precio. Disponibilidad pendiente de confirmar. Catálogo en preparación.";
    if (product.observedBrand) note.textContent += ` Marca observada: ${product.observedBrand}; confirmación comercial pendiente.`;
    const category = document.createElement("p");
    category.textContent = `${(product.categories || [product.category]).map(id => categories[id]).join(" · ")} · ${product.tone}`;
    const contact = document.createElement("button");
    contact.type = "button";
    contact.className = "button button-dark";
    contact.dataset.contact = "";
    contact.dataset.inquiry = product.name;
    contact.textContent = product.recordType === "review" ? "Consultar esta fotografía ↗" : "Consultar este producto ↗";
    copy.append(brand, title, label, category, description, note, contact);
    layout.append(gallery, copy);
    content.append(layout);
    openDialog($("#product-dialog"), opener);
  }

  function openContact(opener) {
    const originalOpener = lastOpener;
    const fromProduct = !!opener?.dataset.inquiry;
    $("#contact-form").hidden = false;
    $("#contact-result").hidden = true;
    if (fromProduct) $("textarea[name=message]").value = `Hola, me interesa «${opener.dataset.inquiry}», que aparece en las fotografías de la tienda. ¿Podríais confirmar sus detalles, precio y disponibilidad?`;
    else if (opener?.closest(".empty-state") && filterState.brand !== "all") $("textarea[name=message]").value = `Hola, me gustaría conocer la selección de ${brandName(filterState.brand)}${filterState.category !== "all" ? " en " + categories[filterState.category].toLowerCase() : ""} en Tienda Lysa. ¿Podríais orientarme?`;
    openDialog($("#contact-dialog"), fromProduct ? originalOpener : opener);
  }

  const policies = {
    legal: { title: "Sobre esta demostración", html: "<p>Esta página es un MVP visual de Tienda Lysa. El cliente ha aportado la identidad gráfica de la tienda, una fotografía real de su establecimiento y los logotipos de seis de las siete marcas con las que trabaja. Torrens se identifica temporalmente mediante su nombre.</p><p>Las familias de productos de cada firma no indican disponibilidad en Tienda Lysa. Las imágenes generadas y los ejemplos de estilo no pertenecen a esas marcas ni representan su inventario.</p><p>No se ofrece venta online, no hay precios ni información de existencias, y no se aceptan pagos ni pedidos.</p><h3>Antes de publicar</h3><p>La tienda deberá facilitar su razón social, identificación fiscal, domicilio, datos de contacto y catálogo autorizado. El aviso legal definitivo deberá recoger esos datos. No se ha inventado información del negocio.</p>" },
    privacy: { title: "Tu privacidad", html: "<p>Esta demostración no utiliza analítica, publicidad, cookies de seguimiento ni servicios externos. Las imágenes y los estilos se sirven desde el propio proyecto.</p><h3>Tus favoritos</h3><p>Al guardar una pieza se conserva únicamente su identificador en el almacenamiento local de tu navegador. Puedes retirarla con el mismo corazón. Eliminar todos los favoritos borra ese registro. Si el navegador bloquea el almacenamiento, los favoritos funcionan durante la visita.</p><h3>Tus consultas</h3><p>Los datos del formulario permanecen en memoria durante esta visita. No se envían a ningún servidor ni se guardan en el navegador. Solo se genera un archivo de texto en tu dispositivo cuando pulsas «Guardar consulta .txt».</p><p>La política definitiva deberá actualizarse cuando la tienda incorpore sus datos de contacto y servicios reales.</p>" }
  };

  document.addEventListener("click", event => {
    if (!event.target.closest(".brand-dropdown")) setBrandsOpen(false);
    if (!event.target.closest(".site-header")) setMobileOpen(false);
    const brand = event.target.closest("[data-brand]");
    if (brand) { setBrand(brand.dataset.brand, true); return; }
    const category = event.target.closest("a[data-category]");
    if (category) {
      event.preventDefault();
      filterState.category = category.dataset.category;
      filterState.favorites = false;
      if (category.dataset.category === "all") filterState.brand = "all";
      setMobileOpen(false);
      renderProducts();
      focusCatalog();
      return;
    }
    const categoryFilter = event.target.closest("[data-filter-category]");
    if (categoryFilter) { filterState.category = categoryFilter.dataset.filterCategory; renderProducts(); return; }
    if (event.target.closest(".reset-filters, [data-reset]")) { resetFilters(); focusCatalog(); return; }
    const productLink = event.target.closest("[data-product]");
    if (productLink) { event.preventDefault(); openProduct(productLink.dataset.product, productLink); return; }
    const favoriteButton = event.target.closest("[data-favorite]");
    if (favoriteButton) {
      const id = favoriteButton.dataset.favorite;
      const product = products.find(item => item.id === id);
      const wasSaved = favorites.has(id);
      if (wasSaved) favorites.delete(id); else favorites.add(id);
      try {
        if (favorites.size) localStorage.setItem(storageKey, JSON.stringify([...favorites]));
        else localStorage.removeItem(storageKey);
      } catch { /* Conserva favoritos en memoria si el almacenamiento no está disponible. */ }
      updateFavoriteButton(favoriteButton, product);
      syncFavoriteCount();
      announce(wasSaved ? "Pieza retirada de tus favoritos" : "Pieza guardada en tus favoritos");
      if (filterState.favorites) {
        const index = $$("[data-favorite]", track).indexOf(favoriteButton);
        renderProducts(false);
        const remaining = $$("[data-favorite]", track);
        if (remaining.length) remaining[Math.min(index, remaining.length - 1)].focus();
        else $("[data-reset]").focus();
      }
      return;
    }
    const contact = event.target.closest("[data-contact]");
    if (contact) { openContact(contact); return; }
    const closeButton = event.target.closest("[data-close]");
    if (closeButton) { closeButton.closest("dialog").close(); return; }
    const policyButton = event.target.closest("[data-policy]");
    if (policyButton) {
      const policy = policies[policyButton.dataset.policy];
      $("#policy-title").textContent = policy.title;
      $("#policy-content").innerHTML = policy.html;
      openDialog($("#policy-dialog"), policyButton);
      return;
    }
    if (event.target.closest("#main-navigation a")) setMobileOpen(false);
  });

  mobileToggle.addEventListener("click", () => setMobileOpen(mobileToggle.getAttribute("aria-expanded") !== "true"));
  brandToggle.addEventListener("click", () => setBrandsOpen(brandToggle.getAttribute("aria-expanded") !== "true"));
  $(".brand-dropdown").addEventListener("mouseenter", () => { if (desktopMenu.matches && hoverPointer.matches) setBrandsOpen(true); });
  $(".brand-dropdown").addEventListener("mouseleave", () => {
    if (desktopMenu.matches && hoverPointer.matches) hoverTimer = setTimeout(() => { if (!$(".brand-dropdown").contains(document.activeElement)) setBrandsOpen(false); }, 150);
  });
  $(".brand-dropdown").addEventListener("focusout", event => { if (!event.currentTarget.contains(event.relatedTarget)) setBrandsOpen(false); });
  brandToggle.addEventListener("keydown", event => {
    if (event.key === "ArrowDown") { event.preventDefault(); setBrandsOpen(true); $("button", brandPanel).focus(); }
  });
  brandPanel.addEventListener("keydown", event => {
    if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const buttons = $$("button", brandPanel);
    const current = buttons.indexOf(document.activeElement);
    const index = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (current + (["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1) + buttons.length) % buttons.length;
    buttons[index].focus();
  });
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape" || $("dialog[open]")) return;
    if (!brandPanel.hidden) { event.preventDefault(); setBrandsOpen(false, true); }
    else if (navigation.classList.contains("is-open")) { event.preventDefault(); setMobileOpen(false, true); }
  });
  desktopMenu.addEventListener("change", () => setMobileOpen(false));
  brandSelect.addEventListener("change", () => setBrand(brandSelect.value));
  $(".favorites-toggle").addEventListener("click", () => {
    Object.assign(filterState, { favorites: !filterState.favorites, category: "all", brand: "all" });
    setMobileOpen(false);
    renderProducts();
    focusCatalog();
  });
  prev.addEventListener("click", () => moveCarousel(-1));
  next.addEventListener("click", () => moveCarousel(1));
  let scrollTimer;
  track.addEventListener("scroll", () => { clearTimeout(scrollTimer); scrollTimer = setTimeout(updateCarousel, 100); }, { passive: true });
  track.addEventListener("keydown", event => {
    if (event.target !== track || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home" || event.key === "End") track.scrollTo({ left: event.key === "Home" ? 0 : track.scrollWidth, behavior: reducedMotion.matches ? "instant" : "smooth" });
    else moveCarousel(event.key === "ArrowRight" ? 1 : -1);
  });
  track.addEventListener("focusin", event => {
    const card = event.target.closest(".product-card");
    if (card && track.classList.contains("is-carousel")) card.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
  });
  if ("ResizeObserver" in window) new ResizeObserver(updateCarousel).observe(track);
  else window.addEventListener("resize", updateCarousel);

  const marqueeToggle = $("#marquee-toggle");
  function syncMarqueePreference() {
    marqueeToggle.hidden = reducedMotion.matches;
    if (reducedMotion.matches) $("#marquee-track").classList.add("is-paused");
    else $("#marquee-track").classList.toggle("is-paused", marqueeToggle.getAttribute("aria-pressed") === "true");
  }
  marqueeToggle.addEventListener("click", () => {
    const paused = marqueeToggle.getAttribute("aria-pressed") !== "true";
    marqueeToggle.setAttribute("aria-pressed", String(paused));
    marqueeToggle.textContent = paused ? "Reanudar movimiento ▷" : "Pausar movimiento Ⅱ";
    $("#marquee-track").classList.toggle("is-paused", paused);
  });
  reducedMotion.addEventListener("change", syncMarqueePreference);

  $$("dialog").forEach(dialog => {
    dialog.addEventListener("click", event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener("close", () => {
      if ($$("dialog[open]").length) return;
      document.body.classList.remove("modal-open");
      if (lastOpener?.isConnected) lastOpener.focus({ preventScroll: true });
    });
  });

  $("#contact-form").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.elements.namedItem("name").value.trim();
    const email = form.elements.namedItem("email").value.trim();
    const message = form.elements.namedItem("message").value.trim();
    if (!name || message.length < 10) { announce("Escribe tu nombre y una consulta de al menos 10 caracteres."); return; }
    inquiryText = `CONSULTA PARA TIENDA LYSA\n\nNombre: ${name}\nEmail: ${email}\n\n${message}\n\nConsulta preparada desde el MVP de demostración. No enviada.`;
    $("#contact-summary").textContent = inquiryText;
    form.hidden = true;
    $("#contact-result").hidden = false;
    $("#download-inquiry").focus();
  });
  $("#edit-inquiry").addEventListener("click", () => {
    $("#contact-result").hidden = true;
    $("#contact-form").hidden = false;
    $("textarea[name=message]").focus();
  });
  $("#download-inquiry").addEventListener("click", () => {
    const url = URL.createObjectURL(new Blob(["\uFEFF" + inquiryText], { type: "text/plain;charset=utf-8" }));
    const download = document.createElement("a");
    download.href = url;
    download.download = "consulta-tienda-lysa.txt";
    document.body.append(download);
    download.click();
    download.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce("Consulta preparada para guardar en tu dispositivo");
  });

  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.remove("is-pending"); entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: .08, rootMargin: "0px 0px -25px 0px" });
    $$(".reveal").forEach(element => { element.classList.add("is-pending"); observer.observe(element); });
  }
  $("#current-year").textContent = String(new Date().getFullYear());
  createBrandControls();
  renderProducts(false);
  syncMarqueePreference();
})();
