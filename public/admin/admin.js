"use strict";
// Panel de Tienda Lysa. JavaScript nativo, sin librerías.

(() => {
  const CATEGORIAS = [
    { id: "bolsos", nombre: "Bolsos" },
    { id: "mochilas", nombre: "Mochilas" },
    { id: "maletas", nombre: "Maletas" },
    { id: "complementos", nombre: "Accesorios" },
    { id: "zapatillas", nombre: "Zapatillas" }
  ];
  // Marcas con logo en la tienda. Las demás se escriben con «Otra marca…».
  const MARCAS_FIJAS = ["Gladiator", "Cacharel", "Anekke", "Totto", "Pepe Moll", "Torrens", "Gabol"];
  const OTRA = "__otra__";
  const LADO_MAXIMO = 1600;
  const MAX_FOTOS = 12;
  const MAX_BYTES = 5 * 1024 * 1024;
  const MENSAJE_FOTO_ILEGIBLE = "Esta foto no se puede subir, prueba a hacer una captura o a cambiar el formato";

  const $ = id => document.getElementById(id);
  const vistaLista = $("vista-lista");
  const vistaFormulario = $("vista-formulario");
  const formulario = $("formulario");
  const campos = { titulo: $("titulo"), categoria: $("categoria"), marca: $("marca"), marcaOtra: $("marca-otra"), precio: $("precio"), color: $("color"), descripcion: $("descripcion"), visible: $("visible"), destacado: $("destacado") };

  let productos = [];
  let cargado = false;
  // Estado del formulario abierto.
  let edicion = null; // { id | null, fotos: [{ clave, id | null, url, blob | null }] } · con blob = foto aún sin guardar
  let sucio = false;
  let guardando = false;
  let procesandoFotos = 0;
  let rutaActual = "";
  let restaurandoRuta = false;
  let contadorFotos = 0;

  const sinAcentos = texto => String(texto || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const nombreCategoria = id => CATEGORIAS.find(item => item.id === id)?.nombre || id;

  /* ---------- Avisos ---------- */

  function avisar(texto, tipo = "exito") {
    const aviso = document.createElement("div");
    aviso.className = `aviso ${tipo === "error" ? "error" : ""}`;
    if (tipo === "error") aviso.setAttribute("role", "alert");
    const mensaje = document.createElement("span");
    mensaje.textContent = texto;
    const cerrar = document.createElement("button");
    cerrar.type = "button";
    cerrar.setAttribute("aria-label", "Cerrar aviso");
    cerrar.textContent = "×";
    cerrar.addEventListener("click", () => aviso.remove());
    aviso.append(mensaje, cerrar);
    const zona = $("avisos");
    while (zona.children.length >= 3) zona.firstElementChild.remove();
    zona.append(aviso);
    // Los errores se quedan hasta que se cierran; los de éxito se van solos.
    if (tipo !== "error") setTimeout(() => aviso.remove(), 5000);
  }

  function confirmar({ titulo, texto, aceptar }) {
    return new Promise(resolver => {
      const dialogo = $("dialogo");
      $("dialogo-titulo").textContent = titulo;
      $("dialogo-texto").textContent = texto;
      $("dialogo-aceptar").textContent = aceptar;
      const terminar = valor => {
        $("dialogo-aceptar").onclick = $("dialogo-cancelar").onclick = dialogo.onclose = null;
        if (dialogo.open) dialogo.close();
        resolver(valor);
      };
      $("dialogo-aceptar").onclick = () => terminar(true);
      $("dialogo-cancelar").onclick = () => terminar(false);
      dialogo.onclose = () => terminar(false);
      dialogo.showModal();
      $("dialogo-cancelar").focus();
    });
  }

  /* ---------- Comunicación con el servidor ---------- */

  class ErrorApi extends Error {
    constructor(mensaje, estado = 0, campo = null) { super(mensaje); this.estado = estado; this.campo = campo; }
  }

  function mensajeDeEstado(estado, datos) {
    if (estado === 401) return "Tu sesión ha caducado. Recarga la página para volver a entrar.";
    if (datos && typeof datos.error === "string") return datos.error;
    if (estado === 413) return "La foto pesa demasiado.";
    return "No se ha podido completar. Inténtalo de nuevo en un momento.";
  }

  async function pedir(ruta, { metodo = "GET", datos } = {}) {
    let respuesta;
    try {
      respuesta = await fetch(`/api/admin/${ruta}`, {
        method: metodo,
        headers: datos === undefined ? {} : { "Content-Type": "application/json" },
        body: datos === undefined ? undefined : JSON.stringify(datos),
        cache: "no-store"
      });
    } catch {
      throw new ErrorApi("No hay conexión. Comprueba el wifi o los datos del móvil e inténtalo de nuevo.");
    }
    let cuerpo = null;
    try { cuerpo = await respuesta.json(); } catch { /* respuesta sin JSON */ }
    if (!respuesta.ok) throw new ErrorApi(mensajeDeEstado(respuesta.status, cuerpo), respuesta.status, cuerpo?.campo || null);
    return cuerpo;
  }

  /** Sube una foto con XMLHttpRequest para poder mostrar el avance. */
  function subirFoto(blob, alAvanzar) {
    return new Promise((resolver, rechazar) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/admin/imagenes");
      xhr.setRequestHeader("Content-Type", blob.type);
      xhr.responseType = "json";
      xhr.upload.onprogress = evento => { if (evento.lengthComputable) alAvanzar(evento.loaded); };
      xhr.onerror = () => rechazar(new ErrorApi("No hay conexión. Comprueba el wifi o los datos del móvil e inténtalo de nuevo."));
      xhr.ontimeout = () => rechazar(new ErrorApi("La subida ha tardado demasiado. Inténtalo de nuevo."));
      xhr.timeout = 120000;
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300 && xhr.response?.imagen) resolver(xhr.response.imagen);
        else rechazar(new ErrorApi(mensajeDeEstado(xhr.status, xhr.response), xhr.status));
      };
      xhr.send(blob);
    });
  }

  /* ---------- Listado ---------- */

  function rellenarSelect(select, opciones) {
    select.replaceChildren(...opciones.map(([valor, texto]) => Object.assign(document.createElement("option"), { value: valor, textContent: texto })));
  }

  function productosFiltrados() {
    const busqueda = sinAcentos($("buscar").value.trim());
    const categoria = $("filtro-categoria").value;
    const estado = $("filtro-estado").value;
    return productos.filter(producto => {
      if (categoria && producto.categoria !== categoria) return false;
      if (estado === "visibles" && !producto.visible) return false;
      if (estado === "ocultos" && producto.visible) return false;
      if (!busqueda) return true;
      return sinAcentos(`${producto.titulo} ${producto.marca || ""} ${producto.referencia} ${producto.color || ""}`).includes(busqueda);
    });
  }

  function crearFila(producto) {
    const fila = document.createElement("li");
    fila.className = `producto ${producto.visible ? "" : "es-oculto"}`;

    const abrir = document.createElement("button");
    abrir.type = "button";
    abrir.className = "producto-abrir";
    abrir.setAttribute("aria-label", `Abrir ${producto.titulo}`);
    abrir.addEventListener("click", () => irA(`#/editar/${producto.id}`));

    let miniatura;
    if (producto.imagenes.length) {
      miniatura = Object.assign(document.createElement("img"), { className: "producto-foto", src: producto.imagenes[0].url, alt: "", loading: "lazy", decoding: "async", width: 72, height: 96 });
    } else {
      miniatura = Object.assign(document.createElement("span"), { className: "producto-sin-foto", textContent: "Sin foto" });
    }

    const texto = document.createElement("span");
    const nombre = Object.assign(document.createElement("span"), { className: "producto-nombre", textContent: producto.titulo });
    const detalles = [producto.referencia, nombreCategoria(producto.categoria), producto.marca, producto.precio === null ? "Consultar precio" : formatoPrecio(producto.precio)].filter(Boolean).join(" · ");
    const datos = Object.assign(document.createElement("span"), { className: "producto-datos", textContent: detalles });
    texto.append(nombre, datos);
    const insignias = document.createElement("span");
    insignias.className = "producto-insignias";
    if (!producto.visible) insignias.append(Object.assign(document.createElement("span"), { className: "insignia oculto", textContent: "Oculto" }));
    if (producto.destacado) insignias.append(Object.assign(document.createElement("span"), { className: "insignia destacado", textContent: "★ Destacado" }));
    if (!producto.imagenes.length) insignias.append(Object.assign(document.createElement("span"), { className: "insignia aviso", textContent: "No se ve: falta la foto" }));
    if (insignias.children.length) texto.append(insignias);
    abrir.append(miniatura, texto);

    const acciones = document.createElement("div");
    acciones.className = "producto-acciones";
    const alternar = Object.assign(document.createElement("button"), { type: "button", className: "boton pequeno", textContent: producto.visible ? "Ocultar" : "Mostrar" });
    alternar.setAttribute("aria-label", `${producto.visible ? "Ocultar" : "Mostrar"} ${producto.titulo}`);
    alternar.addEventListener("click", () => cambiarVisibilidad(producto, alternar));
    const editar = Object.assign(document.createElement("button"), { type: "button", className: "boton pequeno", textContent: "Editar" });
    editar.setAttribute("aria-label", `Editar ${producto.titulo}`);
    editar.addEventListener("click", () => irA(`#/editar/${producto.id}`));
    acciones.append(editar, alternar);

    fila.append(abrir, acciones);
    return fila;
  }

  const formatoPrecio = precio => `${precio.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

  function pintarLista() {
    const lista = $("lista");
    if (!cargado) return;
    const visibles = productosFiltrados();
    lista.replaceChildren(...visibles.map(crearFila));
    const ocultos = productos.filter(producto => !producto.visible).length;
    $("recuento").textContent = visibles.length === productos.length
      ? `${productos.length} ${productos.length === 1 ? "producto" : "productos"}${ocultos ? ` · ${ocultos} ${ocultos === 1 ? "oculto" : "ocultos"}` : ""}`
      : `${visibles.length} de ${productos.length} productos`;
    const vacio = visibles.length === 0;
    $("lista-vacia").hidden = !vacio;
    if (vacio) {
      const sinNada = productos.length === 0;
      $("lista-vacia-texto").textContent = sinNada ? "Todavía no hay productos. Pulsa «Añadir producto» para crear el primero." : "No hay ningún producto con esos filtros.";
      $("limpiar-filtros").hidden = sinNada;
    }
  }

  async function cargarProductos() {
    $("recuento").textContent = "Cargando productos…";
    try {
      productos = (await pedir("productos")).productos;
      cargado = true;
      pintarLista();
    } catch (fallo) {
      $("recuento").textContent = "No se han podido cargar los productos.";
      avisar(fallo.message, "error");
    }
  }

  async function cambiarVisibilidad(producto, boton) {
    boton.disabled = true;
    try {
      const { producto: actualizado } = await pedir(`productos/${encodeURIComponent(producto.id)}`, { metodo: "PATCH", datos: { visible: !producto.visible } });
      productos = productos.map(item => (item.id === actualizado.id ? actualizado : item));
      pintarLista();
      avisar(actualizado.visible ? `«${actualizado.titulo}» vuelve a verse en la tienda.` : `«${actualizado.titulo}» ya no se ve en la tienda.`);
    } catch (fallo) {
      boton.disabled = false;
      avisar(fallo.message, "error");
      if (fallo.estado === 404) cargarProductos();
    }
  }

  /* ---------- Fotos: compresión en el navegador ---------- */

  function cargarConImg(archivo) {
    return new Promise((resolver, rechazar) => {
      const url = URL.createObjectURL(archivo);
      const imagen = new Image();
      imagen.onload = () => { URL.revokeObjectURL(url); resolver(imagen); };
      imagen.onerror = () => { URL.revokeObjectURL(url); rechazar(new Error("ilegible")); };
      imagen.src = url;
    });
  }

  const aBlob = (lienzo, tipo, calidad) => new Promise(resolver => lienzo.toBlob(resolver, tipo, calidad));

  /**
   * Reduce la foto a 1600 px de lado como máximo y la convierte a WebP (o JPEG si el
   * navegador no sabe crear WebP). El elemento <img> ya aplica la orientación EXIF,
   * así que las fotos del móvil no salen giradas. Si el navegador no puede leer el
   * archivo (por ejemplo un HEIC fuera de Safari), se lanza un error.
   */
  async function comprimir(archivo) {
    let fuente;
    try {
      fuente = await cargarConImg(archivo);
    } catch {
      if (typeof createImageBitmap !== "function") throw new Error("ilegible");
      try { fuente = await createImageBitmap(archivo, { imageOrientation: "from-image" }); } catch { throw new Error("ilegible"); }
    }
    const ancho = fuente.naturalWidth || fuente.width;
    const alto = fuente.naturalHeight || fuente.height;
    if (!ancho || !alto) throw new Error("ilegible");
    const escala = Math.min(1, LADO_MAXIMO / Math.max(ancho, alto));
    const lienzo = document.createElement("canvas");
    lienzo.width = Math.max(1, Math.round(ancho * escala));
    lienzo.height = Math.max(1, Math.round(alto * escala));
    const contexto = lienzo.getContext("2d");
    if (!contexto) throw new Error("ilegible");
    contexto.fillStyle = "#FFFFFF"; // fondo blanco para fotos con transparencia
    contexto.fillRect(0, 0, lienzo.width, lienzo.height);
    contexto.imageSmoothingQuality = "high";
    contexto.drawImage(fuente, 0, 0, lienzo.width, lienzo.height);
    if (typeof fuente.close === "function") fuente.close();
    let blob = await aBlob(lienzo, "image/webp", 0.82);
    if (!blob || blob.type !== "image/webp") blob = await aBlob(lienzo, "image/jpeg", 0.85);
    lienzo.width = lienzo.height = 0; // libera memoria en el móvil
    if (!blob || blob.size === 0) throw new Error("ilegible");
    if (blob.size > MAX_BYTES) throw new Error("grande");
    return blob;
  }

  async function anadirFotos(archivos) {
    if (!edicion || !archivos.length) return;
    const hueco = MAX_FOTOS - edicion.fotos.length;
    if (hueco <= 0) { avisar(`Un producto puede tener como máximo ${MAX_FOTOS} fotos.`, "error"); return; }
    const elegidos = archivos.slice(0, hueco);
    if (archivos.length > hueco) avisar(`Solo se han añadido ${hueco} fotos: el máximo por producto es ${MAX_FOTOS}.`, "error");

    procesandoFotos += elegidos.length;
    actualizarBotones();
    let ilegibles = 0;
    let hechas = 0;
    for (const archivo of elegidos) {
      $("estado-fotos").textContent = `Preparando foto ${hechas + 1} de ${elegidos.length}…`;
      try {
        const blob = await comprimir(archivo);
        if (!edicion) return;
        edicion.fotos.push({ clave: `nueva-${++contadorFotos}`, id: null, url: URL.createObjectURL(blob), blob });
        sucio = true;
        pintarFotos();
      } catch (fallo) {
        if (fallo.message === "grande") avisar("Esta foto pesa demasiado incluso después de reducirla. Prueba con otra.", "error");
        else ilegibles += 1;
      }
      hechas += 1;
      procesandoFotos -= 1;
    }
    $("estado-fotos").textContent = "";
    actualizarBotones();
    if (ilegibles === 1) avisar(`${MENSAJE_FOTO_ILEGIBLE}.`, "error");
    else if (ilegibles > 1) avisar(`${ilegibles} fotos no se pueden subir, prueba a hacer una captura o a cambiar el formato.`, "error");
  }

  function pintarFotos() {
    const lista = $("fotos");
    const total = edicion.fotos.length;
    lista.replaceChildren(...edicion.fotos.map((foto, indice) => {
      const item = document.createElement("li");
      item.className = "foto";
      const imagen = Object.assign(document.createElement("img"), { src: foto.url, alt: `Foto ${indice + 1} de ${total}` });
      item.append(imagen);
      if (indice === 0) item.append(Object.assign(document.createElement("span"), { className: "foto-principal", textContent: "Principal" }));
      if (foto.blob) item.append(Object.assign(document.createElement("span"), { className: "foto-nueva", textContent: "Sin guardar" }));

      const botones = document.createElement("div");
      botones.className = "foto-botones";
      const boton = (texto, etiqueta, accion, clase = "") => {
        const elemento = Object.assign(document.createElement("button"), { type: "button", textContent: texto, className: clase });
        elemento.setAttribute("aria-label", `${etiqueta} (foto ${indice + 1})`);
        elemento.addEventListener("click", accion);
        return elemento;
      };
      const antes = boton("← Antes", "Mover antes", () => moverFoto(indice, indice - 1));
      antes.disabled = indice === 0;
      const despues = boton("Después →", "Mover después", () => moverFoto(indice, indice + 1));
      despues.disabled = indice === total - 1;
      botones.append(antes, despues);
      if (indice > 0) botones.append(boton("Poner como principal", "Poner como principal", () => moverFoto(indice, 0), "ancho"));
      botones.append(boton("Quitar foto", "Quitar", () => quitarFoto(indice), "ancho quitar"));
      item.append(botones);
      return item;
    }));
    if (total) mostrarError("fotos", "");
  }

  function moverFoto(desde, hasta) {
    if (guardando || hasta < 0 || hasta >= edicion.fotos.length) return;
    const [foto] = edicion.fotos.splice(desde, 1);
    edicion.fotos.splice(hasta, 0, foto);
    sucio = true;
    pintarFotos();
    // El foco sigue a la foto movida para poder pulsar varias veces seguidas.
    const destino = $("fotos").children[hasta]?.querySelector(hasta < desde ? "button:not(:disabled)" : "button:nth-of-type(2):not(:disabled)") || $("fotos").children[hasta]?.querySelector("button:not(:disabled)");
    destino?.focus();
  }

  function quitarFoto(indice) {
    if (guardando) return;
    const [foto] = edicion.fotos.splice(indice, 1);
    if (foto.blob) URL.revokeObjectURL(foto.url);
    sucio = true;
    pintarFotos();
  }

  /* ---------- Formulario ---------- */

  function mostrarError(campo, mensaje) {
    const elemento = $(`error-${campo}`);
    if (!elemento) return;
    elemento.textContent = mensaje;
    elemento.hidden = !mensaje;
    const control = { titulo: campos.titulo, categoria: campos.categoria, marca: campos.marcaOtra, precio: campos.precio, color: campos.color, descripcion: campos.descripcion }[campo];
    if (control) {
      if (mensaje) { control.setAttribute("aria-invalid", "true"); control.setAttribute("aria-describedby", elemento.id); }
      else { control.removeAttribute("aria-invalid"); control.removeAttribute("aria-describedby"); }
    }
  }

  function limpiarErrores() {
    ["fotos", "titulo", "categoria", "marca", "precio", "color", "descripcion"].forEach(campo => mostrarError(campo, ""));
  }

  function rellenarMarcas(seleccionada) {
    const usadas = productos.map(producto => producto.marca).filter(Boolean);
    const nombres = [...MARCAS_FIJAS];
    for (const marca of [...usadas, seleccionada].filter(Boolean)) {
      if (!nombres.some(nombre => sinAcentos(nombre) === sinAcentos(marca))) nombres.push(marca);
    }
    rellenarSelect(campos.marca, [["", "Sin marca"], ...nombres.map(nombre => [nombre, nombre]), [OTRA, "Otra marca…"]]);
    campos.marca.value = seleccionada ? nombres.find(nombre => sinAcentos(nombre) === sinAcentos(seleccionada)) : "";
    campos.marcaOtra.value = "";
    $("campo-marca-otra").hidden = true;
  }

  function leerFormulario() {
    const marca = campos.marca.value === OTRA ? campos.marcaOtra.value.trim() : campos.marca.value;
    return {
      titulo: campos.titulo.value.trim(),
      categoria: campos.categoria.value,
      marca: marca || null,
      precio: campos.precio.value.trim() ? normalizarPrecio(campos.precio.value) ?? campos.precio.value.trim() : null,
      color: campos.color.value.trim() || null,
      descripcion: campos.descripcion.value.trim(),
      visible: campos.visible.checked,
      destacado: campos.destacado.checked
    };
  }

  /** "39.9", "39,9" o "39,90 €" pasan a "39.90". Devuelve null si no es un precio. */
  function normalizarPrecio(texto) {
    const limpio = String(texto).replace(/\s|€/g, "").replace(",", ".");
    return /^\d{1,5}(\.\d{1,2})?$/.test(limpio) ? Number(limpio).toFixed(2) : null;
  }

  function validarEnNavegador(datos) {
    limpiarErrores();
    const errores = [];
    if (!edicion.fotos.length) errores.push(["fotos", "Añade al menos una foto.", $("elegir-fotos")]);
    if (datos.titulo.length < 2) errores.push(["titulo", "El nombre es obligatorio (al menos 2 letras).", campos.titulo]);
    if (!datos.categoria) errores.push(["categoria", "La categoría es obligatoria: elige una.", campos.categoria]);
    if (campos.marca.value === OTRA && !datos.marca) errores.push(["marca", "Escribe el nombre de la marca o elige «Sin marca».", campos.marcaOtra]);
    if (datos.precio !== null && normalizarPrecio(datos.precio) === null) errores.push(["precio", "Escribe solo el número, por ejemplo 39,90.", campos.precio]);
    errores.forEach(([campo, mensaje]) => mostrarError(campo, mensaje));
    if (errores.length) {
      errores[0][2].focus();
      // Sin aviso flotante: el error está junto al campo y la pantalla se desplaza hasta él.
      errores[0][2].scrollIntoView({ block: "center" });
    }
    return errores.length === 0;
  }

  function actualizarBotones() {
    const ocupado = guardando || procesandoFotos > 0;
    $("boton-guardar").disabled = ocupado;
    $("boton-guardar").textContent = guardando ? "Guardando…" : procesandoFotos > 0 ? "Preparando fotos…" : edicion?.id ? "Guardar cambios" : "Guardar producto";
    $("boton-cancelar").disabled = guardando;
    $("boton-borrar").disabled = ocupado;
    $("boton-volver").disabled = guardando;
    for (const control of [$("elegir-fotos"), $("hacer-foto")]) {
      control.disabled = ocupado;
      control.closest("label").setAttribute("aria-disabled", String(ocupado));
    }
  }

  function mostrarProgreso(texto, porcentaje) {
    $("progreso").hidden = texto === null;
    if (texto !== null) {
      $("progreso-texto").textContent = texto;
      $("progreso-barra").value = porcentaje;
    }
  }

  function liberarFotos() {
    edicion?.fotos.forEach(foto => { if (foto.blob) URL.revokeObjectURL(foto.url); });
  }

  function abrirFormulario(producto) {
    liberarFotos();
    edicion = {
      id: producto?.id || null,
      fotos: (producto?.imagenes || []).map(imagen => ({ clave: imagen.id, id: imagen.id, url: imagen.url, blob: null }))
    };
    formulario.reset();
    limpiarErrores();
    campos.titulo.value = producto?.titulo || "";
    campos.categoria.value = producto?.categoria || "";
    rellenarMarcas(producto?.marca || "");
    campos.precio.value = producto?.precio === null || producto?.precio === undefined ? "" : producto.precio.toFixed(2).replace(".", ",");
    campos.color.value = producto?.color || "";
    campos.descripcion.value = producto?.descripcion || "";
    campos.visible.checked = producto ? producto.visible : true;
    campos.destacado.checked = producto ? producto.destacado : false;
    $("titulo-formulario").textContent = producto ? "Editar producto" : "Nuevo producto";
    $("referencia-producto").hidden = !producto;
    $("referencia-producto").textContent = producto ? `Referencia ${producto.referencia} (no se puede cambiar)` : "";
    $("zona-borrar").hidden = !producto;
    $("estado-fotos").textContent = "";
    mostrarProgreso(null);
    pintarFotos();
    sucio = false;
    guardando = false;
    actualizarBotones();
    vistaLista.hidden = true;
    vistaFormulario.hidden = false;
    window.scrollTo(0, 0);
    $("titulo-formulario").focus({ preventScroll: true });
  }

  function mostrarLista() {
    liberarFotos();
    edicion = null;
    sucio = false;
    vistaFormulario.hidden = true;
    vistaLista.hidden = false;
    pintarLista();
  }

  /**
   * Guarda sin riesgo para lo que ya está en la tienda:
   * 1) se suben las fotos nuevas (todavía no pertenecen al producto y la tienda no cambia);
   * 2) el servidor guarda de una vez los datos, el orden y el conjunto final de fotos.
   * Si algo falla en cualquier punto, el producto sigue como estaba y «Guardar» lo retoma.
   */
  async function guardar() {
    if (guardando || procesandoFotos > 0 || !edicion) return; // evita duplicados por pulsar dos veces
    const datos = leerFormulario();
    if (!validarEnNavegador(datos)) return;

    guardando = true;
    actualizarBotones();
    const eraNuevo = !edicion.id;
    try {
      const pendientes = edicion.fotos.filter(foto => !foto.id);
      const totalBytes = pendientes.reduce((suma, foto) => suma + foto.blob.size, 0) || 1;
      let bytesHechos = 0;
      for (let i = 0; i < pendientes.length; i++) {
        const foto = pendientes[i];
        const texto = `Subiendo foto ${i + 1} de ${pendientes.length}…`;
        mostrarProgreso(texto, 5 + Math.round((bytesHechos / totalBytes) * 85));
        const imagen = await subirFoto(foto.blob, cargados => mostrarProgreso(texto, 5 + Math.round(((bytesHechos + Math.min(cargados, foto.blob.size)) / totalBytes) * 85)));
        bytesHechos += foto.blob.size;
        // Subida, pero sin guardar todavía: se conserva la vista previa local y la marca «Sin guardar».
        foto.id = imagen.id;
      }

      mostrarProgreso("Guardando el producto…", 95);
      const ruta = edicion.id ? `productos/${encodeURIComponent(edicion.id)}` : "productos";
      const { producto } = await pedir(ruta, { metodo: edicion.id ? "PATCH" : "POST", datos: { ...datos, imagenes: edicion.fotos.map(foto => foto.id) } });

      const posicion = productos.findIndex(item => item.id === producto.id);
      if (posicion >= 0) productos[posicion] = producto; else productos.unshift(producto);
      sucio = false;
      guardando = false;
      mostrarProgreso(null);
      avisar(eraNuevo ? `«${producto.titulo}» se ha creado con la referencia ${producto.referencia}.` : `Los cambios de «${producto.titulo}» se han guardado.`);
      irA("#/", { forzar: true });
      cargarProductos(); // orden y datos tal como quedan en el servidor
    } catch (fallo) {
      guardando = false;
      mostrarProgreso(null);
      actualizarBotones();
      if (fallo.campo) {
        mostrarError(fallo.campo, fallo.message);
        ({ titulo: campos.titulo, categoria: campos.categoria, marca: campos.marcaOtra, precio: campos.precio, color: campos.color, descripcion: campos.descripcion }[fallo.campo])?.focus();
      }
      const consuelo = eraNuevo ? "No se ha guardado. " : "No se ha guardado: el producto sigue en la tienda como estaba. ";
      avisar(`${consuelo}${fallo.message} Pulsa «Guardar» para volver a intentarlo.`, "error");
    }
  }

  async function borrar() {
    if (!edicion?.id || guardando) return;
    const producto = productos.find(item => item.id === edicion.id);
    const nombre = producto?.titulo || campos.titulo.value;
    const aceptado = await confirmar({
      titulo: `¿Borrar «${nombre}»?`,
      texto: "Se borrará con todas sus fotos y no se podrá recuperar. Si solo quieres que no se vea en la tienda, cancela y desmarca «Visible en la tienda».",
      aceptar: "Sí, borrar"
    });
    if (!aceptado) return;
    guardando = true;
    actualizarBotones();
    try {
      await pedir(`productos/${encodeURIComponent(edicion.id)}`, { metodo: "DELETE" });
      productos = productos.filter(item => item.id !== edicion.id);
      sucio = false;
      guardando = false;
      avisar(`«${nombre}» se ha borrado.`);
      irA("#/", { forzar: true });
    } catch (fallo) {
      guardando = false;
      actualizarBotones();
      avisar(fallo.message, "error");
    }
  }

  /* ---------- Navegación entre listado y formulario ---------- */

  function puedeSalir() {
    if (guardando) return false;
    return !sucio || window.confirm("Hay cambios sin guardar. Si sales ahora se perderán.\n\n¿Salir sin guardar?");
  }

  function irA(ruta, { forzar = false } = {}) {
    if (forzar) sucio = false;
    if (location.hash === ruta || (ruta === "#/" && !location.hash)) aplicarRuta();
    else location.hash = ruta;
  }

  async function aplicarRuta() {
    if (restaurandoRuta) { restaurandoRuta = false; return; }
    const ruta = location.hash || "#/";
    if (ruta === rutaActual && (edicion || ruta === "#/")) { if (ruta === "#/") mostrarLista(); return; }
    if (edicion && !puedeSalir()) {
      // El usuario prefiere quedarse: se devuelve la dirección al formulario.
      restaurandoRuta = true;
      location.hash = rutaActual;
      return;
    }
    rutaActual = ruta;
    if (ruta === "#/nuevo") { abrirFormulario(null); return; }
    const coincidencia = ruta.match(/^#\/editar\/([A-Za-z0-9-]{1,64})$/);
    if (coincidencia) {
      if (!cargado) await cargarProductos();
      const producto = productos.find(item => item.id === coincidencia[1]);
      if (producto) { abrirFormulario(producto); return; }
      if (cargado) avisar("Este producto ya no existe.", "error");
      rutaActual = "#/";
      history.replaceState(null, "", "#/");
    }
    mostrarLista();
  }

  /* ---------- Arranque ---------- */

  rellenarSelect($("filtro-categoria"), [["", "Todas las categorías"], ...CATEGORIAS.map(item => [item.id, item.nombre])]);
  rellenarSelect(campos.categoria, [["", "Elige una categoría"], ...CATEGORIAS.map(item => [item.id, item.nombre])]);

  $("boton-nuevo").addEventListener("click", () => irA("#/nuevo"));
  $("boton-volver").addEventListener("click", () => irA("#/"));
  $("boton-cancelar").addEventListener("click", () => irA("#/"));
  $("boton-borrar").addEventListener("click", borrar);
  $("buscar").addEventListener("input", pintarLista);
  $("filtro-categoria").addEventListener("change", pintarLista);
  $("filtro-estado").addEventListener("change", pintarLista);
  $("limpiar-filtros").addEventListener("click", () => { $("buscar").value = ""; $("filtro-categoria").value = ""; $("filtro-estado").value = ""; pintarLista(); $("buscar").focus(); });

  formulario.addEventListener("submit", evento => { evento.preventDefault(); guardar(); });
  formulario.addEventListener("input", evento => { if (evento.target.type !== "file") sucio = true; });
  campos.marca.addEventListener("change", () => {
    const otra = campos.marca.value === OTRA;
    $("campo-marca-otra").hidden = !otra;
    if (otra) campos.marcaOtra.focus(); else mostrarError("marca", "");
  });
  for (const control of [$("elegir-fotos"), $("hacer-foto")]) {
    control.addEventListener("change", () => {
      const archivos = [...control.files];
      control.value = ""; // permite volver a elegir la misma foto
      anadirFotos(archivos);
    });
  }

  // Al salir del campo, el precio se muestra ya normalizado (39.9 → 39,90).
  campos.precio.addEventListener("blur", () => {
    const normalizado = campos.precio.value.trim() ? normalizarPrecio(campos.precio.value) : null;
    if (normalizado !== null) { campos.precio.value = normalizado.replace(".", ","); mostrarError("precio", ""); }
  });

  // «Cerrar sesión» es de Cloudflare Access; en desarrollo local no hay sesión que cerrar.
  let enDesarrollo = false;
  pedir("sesion").then(sesion => { enDesarrollo = Boolean(sesion?.desarrollo); }).catch(() => {});
  $("cerrar-sesion").addEventListener("click", evento => {
    if (!enDesarrollo) return;
    evento.preventDefault();
    avisar("En este ordenador no hay sesión que cerrar. En la web real, este botón cierra la sesión.");
  });

  window.addEventListener("hashchange", aplicarRuta);
  window.addEventListener("beforeunload", evento => {
    if (sucio || guardando) { evento.preventDefault(); evento.returnValue = ""; }
  });

  cargarProductos().then(aplicarRuta);
})();
