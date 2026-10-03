(function () {
  "use strict";

  var config = window.CONFIG || {};
  var inventario = window.INVENTARIO || [];
  var proyectos = window.PROYECTOS || [];

  var SILUETA = '<svg viewBox="0 0 300 110" aria-hidden="true"><path fill="#4a4e57" d="M14 80c0-12 6-20 22-23l48-6c16-15 34-25 62-25h40c22 0 36 9 52 24l30 5c12 2 20 10 20 22v6H14z"/><path fill="#c9ccd3" d="M96 52c14-12 28-18 48-18h18v18zm72-18h18c16 0 26 6 38 18h-56z"/><rect x="14" y="70" width="18" height="6" fill="#e11d2e"/><circle cx="76" cy="86" r="18" fill="#fff"/><circle cx="76" cy="86" r="11" fill="#9a9ea8"/><circle cx="232" cy="86" r="18" fill="#fff"/><circle cx="232" cy="86" r="11" fill="#9a9ea8"/></svg>';
  var dinero = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  var numero = new Intl.NumberFormat("es-PA");

  function enlaceWhatsApp(texto) {
    return "https://wa.me/" + (config.whatsapp || "") + "?text=" + encodeURIComponent(texto);
  }

  function escapar(texto) {
    var div = document.createElement("div");
    div.textContent = texto == null ? "" : String(texto);
    return div.innerHTML;
  }

  // Todos los enlaces con data-wa abren WhatsApp con su mensaje.
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    el.href = enlaceWhatsApp(el.getAttribute("data-wa"));
    el.target = "_blank";
    el.rel = "noopener";
  });

  // Inventario
  var lista = document.getElementById("lista-inventario");
  var orden = { disponible: 0, reservado: 1, vendido: 2 };
  var carros = inventario.slice().sort(function (a, b) {
    return (orden[a.estado] || 0) - (orden[b.estado] || 0);
  });
  var hayDisponibles = carros.some(function (c) { return c.estado !== "vendido"; });

  carros.forEach(function (c) {
    var titulo = c.marca + " " + c.modelo + " " + c.anio;
    var foto = c.fotos && c.fotos[0];
    var vendido = c.estado === "vendido";
    var tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta carro" + (vendido ? " carro--vendido" : "");
    tarjeta.innerHTML =
      '<div class="carro__foto"' + (foto ? ' style="background-image:url(\'' + encodeURI(foto) + '\')"' : "") + ">" +
        (foto ? "" : '<span class="carro__vacia" aria-label="Foto próximamente">' + SILUETA + "</span>") +
        '<span class="carro__estado estado--' + escapar(c.estado) + '">' + escapar(c.estado) + "</span>" +
        '<div class="carro__sobre">' +
          "<h3>" + escapar(titulo) + (c.tipo === "consignacion" ? '<span class="etiqueta-tipo">A comisión</span>' : "") + "</h3>" +
          '<ul class="carro__datos">' +
            "<li>" + numero.format(c.km) + " km</li>" +
            "<li>" + escapar(c.transmision) + "</li>" +
          "</ul>" +
          '<p class="carro__precio">' + (vendido ? "Vendido" : dinero.format(c.precio)) + "</p>" +
        "</div>" +
      "</div>" +
      ((c.destacado || c.defectos || !vendido) ? '<div class="carro__cuerpo">' +
        (c.destacado ? '<p class="carro__destacado">' + escapar(c.destacado) + "</p>" : "") +
        (c.defectos ? '<p class="carro__defectos"><strong>Defectos a la vista:</strong> ' + escapar(c.defectos) + "</p>" : "") +
        (vendido ? "" :
          '<div class="carro__acciones">' +
            '<a class="boton boton--chico" target="_blank" rel="noopener" href="' +
              enlaceWhatsApp("Hola Josefine Auto, me interesa el " + titulo + ". ¿Sigue disponible?") + '">Me interesa</a>' +
            (c.informe ? '<a class="boton boton--chico boton--borde" target="_blank" rel="noopener" href="' + encodeURI(c.informe) + '">Informe de inspección</a>' : "") +
          "</div>") +
      "</div>" : "");
    lista.appendChild(tarjeta);
  });

  if (!hayDisponibles) {
    (window.BUSCANDO || []).forEach(function (b) {
      var art = document.createElement("article");
      art.className = "tarjeta carro carro--buscando";
      art.innerHTML =
        '<div class="carro__foto"><span class="carro__vacia">' + SILUETA + "</span>" +
          '<span class="carro__estado estado--buscando">En búsqueda</span>' +
          '<div class="carro__sobre">' +
            "<h3>" + escapar(b.modelo) + " " + escapar(b.anios) + "</h3>" +
            '<ul class="carro__datos"><li>' + escapar(b.nota) + "</li></ul>" +
            '<p class="carro__precio carro__precio--chico">Próximo ingreso</p>' +
          "</div>" +
        "</div>" +
        '<div class="carro__cuerpo"><div class="carro__acciones">' +
          '<a class="boton boton--chico" target="_blank" rel="noopener" href="' +
            enlaceWhatsApp("Hola Josefine Auto, avísenme cuando entre un " + b.modelo + " " + b.anios + ".") + '">Avísame</a>' +
        "</div></div>";
      lista.appendChild(art);
    });
    document.getElementById("inventario-vacio").hidden = false;
  }

  // Formulario "Busco carro"
  document.getElementById("form-busco").addEventListener("submit", function (e) {
    e.preventDefault();
    var d = new FormData(e.target);
    var texto = "Hola Josefine Auto, estoy buscando carro.\n" +
      "• Modelo: " + d.get("modelo") + "\n" +
      "• Presupuesto: " + (d.get("presupuesto") ? "$" + d.get("presupuesto") : "por definir") + "\n" +
      "• Transmisión: " + d.get("transmision") + "\n" +
      "Avísenme cuando entre uno.";
    window.open(enlaceWhatsApp(texto), "_blank", "noopener");
  });

  // Formulario "Vende tu carro"
  document.getElementById("form-vende").addEventListener("submit", function (e) {
    e.preventDefault();
    var d = new FormData(e.target);
    var texto = "Hola Josefine Auto, quiero vender mi carro a comisión.\n" +
      "• Carro: " + d.get("modelo") + " " + d.get("anio") + "\n" +
      "• Km: " + (d.get("km") || "por confirmar") + "\n" +
      "• Precio esperado: " + (d.get("precio") ? "$" + d.get("precio") : "por definir") + "\n" +
      "• Modificaciones: " + (d.get("mods") || "ninguna") + "\n" +
      "Les envío fotos por aquí.";
    window.open(enlaceWhatsApp(texto), "_blank", "noopener");
  });

  // Proyectos
  var listaProyectos = document.getElementById("lista-proyectos");
  proyectos.forEach(function (p) {
    var art = document.createElement("article");
    art.className = "tarjeta";
    art.innerHTML =
      '<div class="proyecto__foto"' + (p.foto ? ' style="background-image:url(\'' + encodeURI(p.foto) + '\')"' : "") + ">" +
        (p.foto ? "" : "Fotos muy pronto") +
      "</div>" +
      '<div class="carro__cuerpo">' +
        "<h3>" + escapar(p.nombre) + '<span class="etiqueta-tipo">' + escapar(p.estado) + "</span></h3>" +
        '<p class="carro__defectos">' + escapar(p.descripcion) + "</p>" +
        '<a class="boton boton--chico boton--borde" target="_blank" rel="noopener" href="https://instagram.com/' +
          encodeURIComponent(config.instagram || "") + '">Ver en Instagram</a>' +
      "</div>";
    listaProyectos.appendChild(art);
  });

  // Pie
  document.getElementById("zona").textContent = config.zona || "Panamá";
  document.getElementById("anio").textContent = new Date().getFullYear();
  document.getElementById("enlace-ig").href = "https://instagram.com/" + encodeURIComponent(config.instagram || "");
  if (config.correo) {
    var correo = document.getElementById("enlace-correo");
    correo.href = "mailto:" + config.correo;
    correo.hidden = false;
  }
})();
