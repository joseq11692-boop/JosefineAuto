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
  var listaVendidos = document.getElementById("lista-vendidos");
  function tituloDe(c) { return [c.marca, c.modelo, c.anio].filter(Boolean).join(" "); }
  function datosDe(c) {
    return [c.km ? numero.format(c.km) + " km" : "", c.motor || "", c.transmision || ""].filter(Boolean);
  }

  function ruta(u) { return /^(data:|https?:)/.test(u) ? u : encodeURI(u); }
  function slug(c) {
    return (c.id || tituloDe(c)).toString().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  var porSlug = {};

  carros.forEach(function (c) {
    var titulo = tituloDe(c);
    porSlug[slug(c)] = c;
    var foto = c.fotos && c.fotos[0];
    var vendido = c.estado === "vendido";
    var tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta carro carro--abrible" + (vendido ? " carro--vendido" : "");
    tarjeta.setAttribute("data-slug", slug(c));
    tarjeta.tabIndex = 0;
    tarjeta.setAttribute("role", "button");
    tarjeta.setAttribute("aria-label", "Ver ficha del " + titulo);
    tarjeta.innerHTML =
      '<div class="carro__foto"' + (foto ? ' style="background-image:url(\'' + ruta(foto) + '\')"' : "") + ">" +
        (foto ? "" : '<span class="carro__vacia" aria-label="Foto próximamente">' + SILUETA + "</span>") +
        '<span class="carro__estado estado--' + escapar(c.estado) + '">' + escapar(c.estado) + "</span>" +
        '<div class="carro__sobre">' +
          "<h3>" + escapar(titulo) + (c.tipo === "consignacion" ? '<span class="etiqueta-tipo">A comisión</span>' : "") + "</h3>" +
          '<ul class="carro__datos">' + datosDe(c).map(function (d) { return "<li>" + escapar(d) + "</li>"; }).join("") + "</ul>" +
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
    (vendido && listaVendidos ? listaVendidos : lista).appendChild(tarjeta);
  });
  if (listaVendidos && !listaVendidos.children.length) document.getElementById("vendidos").hidden = true;

  /* ---------- Ficha de cada carro (con enlace propio: #carro-<slug>) ---------- */
  var $ficha = document.getElementById("ficha");
  function urlCarro(c) { return location.href.split("#")[0] + "#carro-" + slug(c); }
  function abrirFicha(c) {
    var titulo = tituloDe(c);
    var fotos = (c.fotos || []).filter(Boolean);
    var vendido = c.estado === "vendido";
    var $foto = document.getElementById("ficha-foto");
    function verFoto(i) {
      $foto.innerHTML = fotos.length ? '<img src="' + ruta(fotos[i]) + '" alt="' + escapar(titulo) + ', foto ' + (i + 1) + '">' : '<span class="carro__vacia">' + SILUETA + "</span>";
      Array.prototype.forEach.call(document.querySelectorAll("#ficha-miniaturas button"), function (b, k) { b.setAttribute("aria-current", String(k === i)); });
    }
    document.getElementById("ficha-miniaturas").innerHTML = fotos.length > 1 ? fotos.map(function (f, i) {
      return '<button type="button" data-i="' + i + '" aria-label="Foto ' + (i + 1) + '"><img src="' + ruta(f) + '" alt="" loading="lazy"></button>';
    }).join("") : "";
    verFoto(0);
    document.getElementById("ficha-miniaturas").onclick = function (e) { var b = e.target.closest("button"); if (b) verFoto(Number(b.getAttribute("data-i"))); };
    var compartir = "Mira este " + titulo + " en Josefine Auto: " + urlCarro(c);
    document.getElementById("ficha-info").innerHTML =
      '<span class="carro__estado estado--' + escapar(c.estado) + ' ficha-carro__estado">' + escapar(c.estado) + "</span>" +
      '<h2 id="ficha-titulo">' + escapar(titulo) + "</h2>" +
      '<p class="carro__precio">' + (vendido ? "Vendido" : dinero.format(c.precio)) + "</p>" +
      '<dl class="ficha-carro__datos">' +
        [["Año", c.anio], ["Kilometraje", c.km ? numero.format(c.km) + " km" : ""], ["Motor", c.motor], ["Transmisión", c.transmision],
         ["Venta", c.tipo === "consignacion" ? "A comisión" : (c.tipo === "propio" ? "Josefine Auto" : "")]]
          .filter(function (d) { return d[1]; })
          .map(function (d) { return "<div><dt>" + d[0] + "</dt><dd>" + escapar(d[1]) + "</dd></div>"; }).join("") +
      "</dl>" +
      (c.destacado ? '<p class="carro__destacado">' + escapar(c.destacado) + "</p>" : "") +
      (c.defectos ? '<p class="carro__defectos"><strong>Defectos a la vista:</strong> ' + escapar(c.defectos) + "</p>" : "") +
      '<ul class="ficha-carro__sellos"><li>Papeles verificados</li><li>Prueba anti-inundación</li><li>Revisado en taller</li></ul>' +
      '<div class="carro__acciones">' +
        (vendido
          ? '<a class="boton" target="_blank" rel="noopener" href="' + enlaceWhatsApp("Hola Josefine Auto, vi que vendieron el " + titulo + ". Busco algo parecido.") + '">Busco uno parecido</a>'
          : '<a class="boton" target="_blank" rel="noopener" href="' + enlaceWhatsApp("Hola Josefine Auto, me interesa el " + titulo + ". ¿Sigue disponible? " + urlCarro(c)) + '">Me interesa</a>') +
        (c.informe ? '<a class="boton boton--borde" target="_blank" rel="noopener" href="' + encodeURI(c.informe) + '">Informe de inspección</a>' : "") +
        '<a class="boton boton--borde boton--chico" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(compartir) + '">Compartir</a>' +
      "</div>";
    if (!$ficha.open) { try { $ficha.showModal(); } catch (e) { $ficha.setAttribute("open", ""); } }
    if (location.hash !== "#carro-" + slug(c)) history.replaceState(null, "", "#carro-" + slug(c));
  }
  function cerrarFicha() {
    if ($ficha.open) $ficha.close();
    if (/^#carro-/.test(location.hash)) history.replaceState(null, "", "#inventario");
  }
  document.getElementById("ficha-cerrar").onclick = cerrarFicha;
  $ficha.addEventListener("click", function (e) { if (e.target === $ficha) cerrarFicha(); });
  $ficha.addEventListener("close", function () { if (/^#carro-/.test(location.hash)) history.replaceState(null, "", "#inventario"); });
  [lista, listaVendidos].forEach(function (cont) {
    if (!cont) return;
    cont.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
      var t = e.target.closest("[data-slug]"); if (t && porSlug[t.getAttribute("data-slug")]) abrirFicha(porSlug[t.getAttribute("data-slug")]);
    });
    cont.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var t = e.target.closest("[data-slug]"); if (t && e.target === t) { e.preventDefault(); abrirFicha(porSlug[t.getAttribute("data-slug")]); }
    });
  });
  function desdeEnlace() {
    var m = location.hash.match(/^#carro-(.+)$/);
    if (m && porSlug[m[1]]) abrirFicha(porSlug[m[1]]);
  }
  window.addEventListener("hashchange", desdeEnlace);
  desdeEnlace();

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

  // Guías
  var listaGuias = document.getElementById("lista-guias");
  if (listaGuias) {
    (window.GUIAS || []).slice(0, 3).forEach(function (g) {
      var a = document.createElement("a");
      a.className = "paso guia__tarjeta"; a.href = g.url;
      a.innerHTML = "<span>GUÍA</span><h3>" + escapar(g.titulo) + "</h3><p>" + escapar(g.descripcion) + "</p>";
      listaGuias.appendChild(a);
    });
    if (!listaGuias.children.length) document.getElementById("guias").hidden = true;
  }

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

  // En la escena (eventos y car spotting)
  var listaEscena = document.getElementById("lista-escena");
  if (listaEscena) {
    (window.ESCENA || []).forEach(function (e) {
      var art = document.createElement("article");
      art.className = "escena";
      art.innerHTML = '<div class="escena__fotos">' + (e.fotos || []).map(function (f) {
          return '<img src="' + ruta(f) + '" alt="' + escapar(e.titulo) + '" loading="lazy">';
        }).join("") + "</div>" +
        '<div class="escena__txt"><span class="etiqueta">' + escapar(e.fecha) + "</span><h3>" + escapar(e.titulo) + "</h3><p>" + escapar(e.texto) + "</p></div>";
      listaEscena.appendChild(art);
    });
    if (!listaEscena.children.length) document.getElementById("escena").hidden = true;
  }

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
