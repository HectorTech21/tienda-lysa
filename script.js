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


(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const categories = Object.fromEntries([["all", "Todas las categorías"], ...CATALOG_CATEGORIES.map(item => [item.id, item.name])]);
  const products = CATALOG_PRODUCTS.filter(product => product.recordType === "product").map(product => ({ ...product, image: product.images[0].src, alt: product.images[0].alt, tone: product.color, category: product.categories[0] }));
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

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (Array.isArray(saved)) favorites = new Set(saved.filter(id => products.some(product => product.id === id)));
  } catch { /* La navegación privada o el almacenamiento bloqueado no impiden usar favoritos. */ }

  function brandName(id) {
    return BRANDS.find(brand => brand.id === id)?.name || "Inspiración Lysa";
  }

  function productBrandName(product) {
    if (!["visually-identified", "confirmed"].includes(product.brandStatus)) return "";
    return BRANDS.find(brand => brand.id === product.brand)?.name || product.observedBrand || "";
  }

  function whatsAppReady() {
    return typeof WHATSAPP_NUMBER === "string" && /^[1-9]\d{7,14}$/.test(WHATSAPP_NUMBER);
  }

  // La misma construcción sirve para tarjetas, fichas y contacto general.
  // Usar siempre la referencia del registro, nunca la posición en la selección.
  function buildWhatsAppUrl(product = null) {
    if (!whatsAppReady()) return "";
    const brand = product ? productBrandName(product) : "";
    const message = product
      ? `¡Hola! He visto en la web de Tienda Lysa el artículo «${product.name}»${brand ? " de " + brand : ""} (ref. ${product.reference}) y me gustaría conocer su precio y disponibilidad. ¡Gracias!`
      : WHATSAPP_GENERAL_MESSAGE;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  function createWhatsAppAction(product) {
    const wrapper = document.createElement("div");
    wrapper.className = "product-actions";
    const ready = whatsAppReady();
    const action = document.createElement(ready ? "a" : "button");
    action.className = "button button-dark whatsapp-button";
    action.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#icon-whatsapp"/></svg><span>Consultar por WhatsApp</span>';
    if (ready) {
      action.href = buildWhatsAppUrl(product);
      action.target = "_blank";
      action.rel = "noopener noreferrer";
      action.setAttribute("aria-label", `Consultar por WhatsApp: ${product.name}, ref. ${product.reference} (abre una nueva pestaña)`);
    } else {
      action.type = "button";
      action.disabled = true;
      action.setAttribute("aria-label", "Consulta por WhatsApp no disponible");
    }
    wrapper.append(action);
    if (!ready) {
      const note = document.createElement("p");
      note.className = "whatsapp-unavailable";
      note.textContent = "Las consultas por WhatsApp no están disponibles en este momento.";
      wrapper.append(note);
    }
    return wrapper;
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
    if (open) navigation.style.setProperty("--nav-top", `${Math.max(0, $(".site-header").getBoundingClientRect().bottom)}px`);
    mobileToggle.setAttribute("aria-expanded", String(open));
    $(".mobile-menu-label").textContent = open ? "Cerrar" : "Menú";
    navigation.classList.toggle("is-open", open);
    // Bloquea el scroll del fondo mientras el panel móvil está abierto.
    document.body.classList.toggle("menu-open", open && !desktopMenu.matches);
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
      brandSelect.add(new Option(brand.name, brand.id));
      if (brand.catalogOnly) return;
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
    // Marquee infinito: el track contiene dos mitades idénticas y la animación CSS
    // lo desplaza de 0 a -50 %. Cada mitad repite la secuencia las veces necesarias
    // para cubrir la ventana, y la duración se calcula en px/s para que la velocidad
    // percibida sea la misma en móvil, tablet y escritorio.
    const MARQUEE_SPEED = 40; // px/s
    const MARQUEE_SPEED_REDUCED = 20; // px/s con «movimiento reducido»: más lento, nunca parado
    let repetitions = 0;
    function sizeMarquee() {
      const sequenceWidth = sequence.getBoundingClientRect().width;
      if (!sequenceWidth) return;
      const count = Math.max(1, Math.ceil(marqueeWindow.clientWidth / sequenceWidth));
      if (count !== repetitions) {
        repetitions = count;
        $$(".marquee-sequence[aria-hidden]", group).forEach(copy => copy.remove());
        duplicate.replaceChildren();
        for (let index = 1; index < count; index++) group.append(copySequence());
        for (let index = 0; index < count; index++) duplicate.append(copySequence());
      }
      const speed = reducedMotion.matches ? MARQUEE_SPEED_REDUCED : MARQUEE_SPEED;
      marquee.style.setProperty("--marquee-duration", `${(sequenceWidth * count / speed).toFixed(2)}s`);
    }
    sizeMarquee();
    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(sizeMarquee);
      observer.observe(marqueeWindow);
      observer.observe(sequence);
    } else window.addEventListener("resize", sizeMarquee);
    reducedMotion.addEventListener("change", sizeMarquee);
    // Teclado: la animación se pausa con :focus-within y se lleva su línea de tiempo
    // al punto en que el logo enfocado queda dentro de la zona visible (fuera del
    // fundido). Al salir, el movimiento continúa desde ahí, sin saltos.
    marqueeWindow.addEventListener("focusin", event => {
      const item = event.target.closest(".brand-item");
      const animation = marquee.getAnimations?.()[0];
      marqueeWindow.scrollLeft = 0;
      if (!item || !animation) return;
      const half = group.getBoundingClientRect().width;
      const itemLeft = item.getBoundingClientRect().left - marquee.getBoundingClientRect().left;
      const offset = Math.max(-half, Math.min(0, marqueeWindow.clientWidth * .35 - itemLeft));
      animation.currentTime = (-offset / half) * animation.effect.getComputedTiming().duration;
      requestAnimationFrame(() => { marqueeWindow.scrollLeft = 0; });
    });
  }

  function favoriteSvg() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>';
  }

  function createProductCard(product, index) {
    const card = document.createElement("article");
    card.className = "product-card product-card--real";
    card.style.animationDelay = `${index * 35}ms`;
    card.setAttribute("aria-label", `${index + 1} de ${filteredProducts.length}: ${product.name}`);
    const imageBox = document.createElement("div");
    imageBox.className = "product-image";
    const view = document.createElement("a");
    view.href = "#pieza-" + product.id;
    view.dataset.product = product.id;
    view.setAttribute("aria-label", `Ver ${product.name}`);
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
    viewLabel.textContent = "Ver detalles ↗";
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
    brand.textContent = productBrandName(product);
    const name = document.createElement("a");
    name.className = "product-name";
    name.dataset.product = product.id;
    name.href = "#pieza-" + product.id;
    name.textContent = product.name;
    const title = document.createElement("h3");
    title.className = "product-title";
    title.append(name);
    const note = document.createElement("p");
    note.className = "product-note";
    note.textContent = product.categories.map(id => categories[id]).join(" · ");
    const description = document.createElement("p");
    description.className = "product-description";
    description.textContent = product.description;
    const discover = document.createElement("a");
    discover.className = "text-link product-discover";
    discover.href = view.href;
    discover.dataset.product = product.id;
    discover.textContent = "Ver detalles ↗";
    const status = document.createElement("p");
    status.className = "product-catalog-status";
    status.textContent = "Consultar precio";
    if (brand.textContent) info.append(brand);
    info.append(title, note, status, description, discover, createWhatsAppAction(product));
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
    $("#filter-description").textContent = text + ` · ${filteredProducts.length} ${filteredProducts.length === 1 ? "artículo" : "artículos"}`;
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
      $("#catalog-note").textContent = "Fotografías reales de nuestra selección. Consulta el precio de tu favorito.";
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
    image.width = 1024;
    image.height = 1280;
    image.decoding = "async";
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
    brand.textContent = productBrandName(product);
    const title = document.createElement("h2");
    title.id = "product-dialog-title";
    title.textContent = product.name;
    const description = document.createElement("p");
    description.textContent = product.description;
    const category = document.createElement("p");
    category.textContent = product.categories.map(id => categories[id]).join(" · ") + " · " + product.tone;
    const reference = document.createElement("p");
    reference.className = "product-reference";
    reference.textContent = "Ref. " + product.reference;
    const price = document.createElement("p");
    price.className = "product-detail-price";
    price.textContent = "Consultar precio";
    if (brand.textContent) copy.append(brand);
    copy.append(title, category, description, reference, price, createWhatsAppAction(product));
    layout.append(gallery, copy);
    content.append(layout);
    openDialog($("#product-dialog"), opener);
  }

  const policies = {
    legal: { title: "Información de esta web", html: "<p>Esta web presenta una selección fotografiada en Tienda Lysa. Los nombres de los artículos son descriptivos y las referencias LYSA sirven para identificarlos en las consultas; no son referencias oficiales del fabricante.</p><p>El precio y la disponibilidad se consultan con la tienda. No se realizan pagos ni pedidos desde esta página. Las imágenes del hero, las categorías y el editorial son ilustrativas y no representan artículos del catálogo.</p><h3>Contacto con la tienda</h3><p>Puedes contactar por WhatsApp desde las fichas de producto, la sección de contacto o el pie de página. El perfil oficial de Instagram también está enlazado en el pie de página.</p><h3>Información del negocio</h3><p>Los datos de titularidad, identificación fiscal y domicilio están pendientes de incorporar. El aviso legal definitivo deberá completarse con los datos verificados de la tienda antes de publicar.</p>" },
    privacy: { title: "Tu privacidad", html: "<p>Esta página no utiliza analítica, publicidad ni cookies de seguimiento. Las imágenes y los estilos se cargan desde el propio proyecto.</p><h3>Tus favoritos</h3><p>Al guardar una pieza se conserva únicamente su identificador en el almacenamiento local de tu navegador. Puedes retirarla con el mismo corazón. Eliminar todos los favoritos borra ese registro. Si el navegador bloquea el almacenamiento, los favoritos funcionan durante la visita.</p><h3>Consultas por WhatsApp</h3><p>«Consultar por WhatsApp» abre una nueva pestaña con el nombre, la marca identificada y la referencia del artículo. Los enlaces de contacto general preparan una consulta sin mencionar productos. El mensaje no se envía automáticamente: puedes revisarlo y decidir si lo envías en WhatsApp.</p><h3>Enlaces sociales</h3><p>Los enlaces de WhatsApp e Instagram te llevan a servicios externos, donde se aplican sus condiciones y políticas de privacidad. Esta web no recoge datos personales mediante un formulario ni envía mensajes por ti.</p><p>La política definitiva deberá completarse con los datos del responsable del negocio antes de publicar.</p>" }
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

  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.remove("is-pending"); entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: .08, rootMargin: "0px 0px -25px 0px" });
    $$(".reveal").forEach(element => { element.classList.add("is-pending"); observer.observe(element); });
  }
  $("#current-year").textContent = String(new Date().getFullYear());
  CATALOG_CATEGORIES.filter(category => !category.internalOnly).forEach(category => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.filterCategory = category.id;
    button.setAttribute("aria-pressed", "false");
    button.textContent = category.name;
    $(".category-filters").append(button);
  });
  createBrandControls();
  const generalWhatsAppUrl = buildWhatsAppUrl();
  $$("[data-contact]").forEach(link => {
    if (generalWhatsAppUrl) {
      link.href = generalWhatsAppUrl;
      if (!link.hasAttribute("aria-label")) link.setAttribute("aria-label", `${link.textContent.replace("↗", "").trim()}: WhatsApp de Tienda Lysa (abre una nueva pestaña)`);
    } else {
      link.removeAttribute("href");
      link.setAttribute("aria-disabled", "true");
    }
  });
  $$("[data-instagram]").forEach(link => { link.href = INSTAGRAM_URL; });
  if (generalWhatsAppUrl) $("#contact-phone").textContent = " al +" + WHATSAPP_NUMBER.replace(/^(34)(\d{3})(\d{2})(\d{2})(\d{2})$/, "$1 $2 $3 $4 $5");
  renderProducts(false);
})();
