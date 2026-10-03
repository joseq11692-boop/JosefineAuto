/* Josefine Gestión: app del fundador. Todo se guarda en este dispositivo (localStorage). */
(function () {
  "use strict";

  var CLAVE = "josefine-gestion-v1";
  var BASE = window.JA_BASE;
  var CHECK = window.JA_CHECKLIST;

  var ESTADOS = [
    { id: "visto", t: "Visto" },
    { id: "contactado", t: "Contactado" },
    { id: "inspeccion", t: "Inspección" },
    { id: "oferta", t: "Oferta" },
    { id: "comprado", t: "Comprado" },
    { id: "venta", t: "En venta" },
    { id: "vendido", t: "Vendido" },
    { id: "descartado", t: "Descartado" }
  ];
  var EN_STOCK = { comprado: 1, venta: 1 };
  var GASTOS = [
    ["inspeccion", "Inspección en taller"],
    ["reparaciones", "Reparaciones / mantenimiento"],
    ["detallado", "Detallado / estética"],
    ["papeles", "Traspaso, revisado y papeles"],
    ["publicidad", "Publicidad"],
    ["otros", "Otros gastos"]
  ];

  /* ---------- Estado ---------- */
  function copia(o) { return JSON.parse(JSON.stringify(o)); }
  function nuevoEstado() {
    return { version: 1, reglas: copia(BASE.reglas), carros: [], precios: copia(BASE.precios), evaluar: carroVacio() };
  }
  function carroVacio() {
    return {
      titulo: "", enlace: "", telefono: "", fuente: "", tipo: "propio",
      compra: null, venta: null, dias: 30, precioPedido: null,
      gastos: { inspeccion: 60, reparaciones: 0, detallado: 100, papeles: 150, publicidad: 30, otros: 0 },
      comisionPct: 0.05, comisionMin: 500,
      fechaCompra: "", fechaVenta: "", ventaReal: null,
      checklist: {}, notas: ""
    };
  }
  var S;
  try { S = JSON.parse(localStorage.getItem(CLAVE)); } catch (e) { S = null; }
  if (!S || !S.reglas) S = nuevoEstado();
  if (!S.evaluar) S.evaluar = carroVacio();

  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(S)); } catch (e) { aviso("No se pudo guardar en este dispositivo"); }
  }

  /* ---------- Utilidades ---------- */
  var fmt$ = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  function d(n) { return n == null || isNaN(n) ? "—" : fmt$.format(n); }
  function pct(n) { return n == null || !isFinite(n) ? "—" : (n * 100).toFixed(1) + "%"; }
  function num(v) { if (v === "" || v == null) return null; var n = Number(String(v).replace(/[^0-9.\-]/g, "")); return isNaN(n) ? null : n; }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function id() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function hoy() { return new Date().toISOString().slice(0, 10); }
  function diasEntre(a, b) { if (!a) return null; var f = b ? new Date(b) : new Date(); return Math.max(0, Math.round((f - new Date(a)) / 86400000)); }
  function estadoT(e) { for (var i = 0; i < ESTADOS.length; i++) if (ESTADOS[i].id === e) return ESTADOS[i].t; return e; }
  function suma(o) { var s = 0; for (var k in o) s += Number(o[k]) || 0; return s; }

  var $vista = document.getElementById("vista");
  var $titulo = document.getElementById("titulo");
  var $aviso = document.getElementById("aviso");
  var tAviso;
  function aviso(t) {
    $aviso.textContent = t; $aviso.hidden = false;
    clearTimeout(tAviso); tAviso = setTimeout(function () { $aviso.hidden = true; }, 2200);
  }

  /* ---------- Cálculos (mismas fórmulas que la calculadora Excel) ---------- */
  function capital() {
    var r = S.reglas, ganado = 0, invertido = 0;
    S.carros.forEach(function (c) {
      if (c.estado === "vendido") ganado += resultadoReal(c);
      else if (EN_STOCK[c.estado] && c.tipo !== "consignacion") invertido += calcular(c, Infinity).coste;
    });
    var total = (Number(r.capital) || 0) + ganado;
    return { total: total, ganado: ganado, invertido: invertido, disponible: total - invertido - (Number(r.reserva) || 0) };
  }

  function calcular(c, capDisp) {
    var r = S.reglas;
    var gastos = suma(c.gastos);
    if (c.tipo === "consignacion") {
      var venta = Number(c.venta) || 0;
      var com = Math.max(venta * (Number(c.comisionPct) || 0), Number(c.comisionMin) || 0);
      var gan = com - gastos;
      return { consignacion: true, gastos: gastos, comision: com, ganancia: gan, porDia: c.dias ? gan / c.dias : null, dueno: venta - com, decision: gan > 0 ? "ACEPTAR" : "NO ACEPTAR", ok: gan > 0, motivos: gan > 0 ? [] : ["La comisión no cubre tus gastos"] };
    }
    var compra = Number(c.compra) || 0, v = Number(c.venta) || 0;
    var colchon = compra * r.colchon;
    var coste = compra + gastos + colchon;
    var ganancia = v - coste;
    var margen = v ? ganancia / v : 0;
    var retorno = coste ? ganancia / coste : 0;
    var maximo = Math.min(v - gastos - r.gananciaMin, v * (1 - r.margenMin) - gastos) / (1 + r.colchon);
    // Un carro ya comprado no compite consigo mismo por el capital.
    if (capDisp == null) capDisp = capital().disponible + (EN_STOCK[c.estado] && c.tipo !== "consignacion" ? coste : 0);
    var motivos = [];
    if (ganancia < r.gananciaMin) motivos.push("Ganancia menor que " + d(r.gananciaMin));
    if (margen < r.margenMin) motivos.push("Margen menor que " + pct(r.margenMin));
    if ((Number(c.dias) || 0) > r.diasMax) motivos.push("Tardaría más de " + r.diasMax + " días en venderse");
    if (coste > capDisp) motivos.push("No cabe en tu capital disponible (" + d(capDisp) + ")");
    var listo = compra > 0 && v > 0;
    return {
      gastos: gastos, colchon: colchon, coste: coste, ganancia: ganancia, margen: margen, retorno: retorno,
      anual: c.dias ? retorno * 365 / c.dias : 0, porDia: c.dias ? ganancia / c.dias : null,
      maximo: maximo, listo: listo, ok: listo && motivos.length === 0,
      decision: !listo ? "FALTAN DATOS" : motivos.length ? "NO COMPRAR" : "COMPRAR", motivos: listo ? motivos : []
    };
  }

  function resultadoReal(c) {
    if (c.tipo === "consignacion") {
      var v = Number(c.ventaReal || c.venta) || 0;
      return Math.max(v * (Number(c.comisionPct) || 0), Number(c.comisionMin) || 0) - suma(c.gastos);
    }
    return (Number(c.ventaReal || c.venta) || 0) - (Number(c.compra) || 0) - suma(c.gastos);
  }

  function checklistResumen(c) {
    var total = 0, ok = 0, mal = 0, criticosMal = [];
    CHECK.forEach(function (f) { f.items.forEach(function (it) {
      total++;
      var v = c.checklist && c.checklist[it.id];
      if (v === "ok" || v === "na") ok++;
      if (v === "mal") { mal++; if (it.c) criticosMal.push(it.t); }
    }); });
    return { total: total, ok: ok, mal: mal, hechos: ok + mal, criticosMal: criticosMal };
  }

  function preciosPorModelo() {
    var g = {};
    S.precios.forEach(function (p) {
      var k = (p.modelo || "").trim(); if (!k) return;
      (g[k] = g[k] || []).push(Number(p.precio) || 0);
    });
    return Object.keys(g).sort().map(function (k) {
      var arr = g[k].filter(function (x) { return x > 0; });
      var media = arr.reduce(function (a, b) { return a + b; }, 0) / (arr.length || 1);
      return { modelo: k, n: arr.length, media: media, min: Math.min.apply(null, arr), max: Math.max.apply(null, arr), realista: media * (1 - S.reglas.descuentoVenta) };
    });
  }

  /* ---------- Componentes ---------- */
  function campo(nombre, etiqueta, valor, opts) {
    opts = opts || {};
    var tipo = opts.tipo || "num";
    var attrs = 'name="' + nombre + '" id="f-' + nombre.replace(/\./g, "-") + '"';
    var input;
    if (tipo === "num") input = '<input ' + attrs + ' inputmode="decimal" autocomplete="off" value="' + (valor == null ? "" : esc(valor)) + '" placeholder="' + esc(opts.ph || "0") + '">';
    else if (tipo === "texto") input = '<input ' + attrs + ' autocomplete="off" value="' + esc(valor) + '" placeholder="' + esc(opts.ph || "") + '">';
    else if (tipo === "fecha") input = '<input ' + attrs + ' type="date" value="' + esc(valor) + '">';
    else if (tipo === "area") input = '<textarea ' + attrs + ' rows="4" placeholder="' + esc(opts.ph || "") + '">' + esc(valor) + '</textarea>';
    else if (tipo === "select") input = '<select ' + attrs + '>' + opts.opciones.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (o[0] === valor ? " selected" : "") + ">" + esc(o[1]) + "</option>"; }).join("") + "</select>";
    return '<label class="campo' + (opts.ancho ? " campo--ancho" : "") + '"><span>' + esc(etiqueta) + (opts.pre ? ' <em>' + esc(opts.pre) + '</em>' : "") + "</span>" + input + "</label>";
  }

  function formNumeros(c) {
    var h = '<div class="campos">';
    h += campo("titulo", "Carro", c.titulo, { tipo: "texto", ph: "Mazda3 2010 · 150.000 km", ancho: true });
    h += campo("tipo", "Tipo", c.tipo, { tipo: "select", opciones: [["propio", "Compra propia"], ["consignacion", "A comisión"]] });
    h += campo("dias", "Días estimados para vender", c.dias);
    if (c.tipo === "consignacion") {
      h += campo("venta", "Precio de venta acordado", c.venta, { pre: "USD" });
      h += campo("comisionPct", "Comisión (%)", c.comisionPct != null ? Math.round(c.comisionPct * 1000) / 10 : "", { ph: "5" });
      h += campo("comisionMin", "Comisión mínima", c.comisionMin, { pre: "USD" });
    } else {
      h += campo("compra", "Precio de compra (tu oferta)", c.compra, { pre: "USD" });
      h += campo("venta", "Precio de venta realista", c.venta, { pre: "USD" });
    }
    h += "</div><h3 class=\"sub\">Gastos</h3><div class=\"campos\">";
    GASTOS.forEach(function (g) { h += campo("gastos." + g[0], g[1], c.gastos[g[0]], { pre: "USD" }); });
    h += "</div>";
    var sugerencia = sugerirVenta(c.titulo);
    if (sugerencia && c.tipo !== "consignacion") h += '<p class="pista">Según tu Mapa de precios, un <strong>' + esc(sugerencia.modelo) + "</strong> se vende de forma realista por unos <strong>" + d(sugerencia.realista) + '</strong> (' + sugerencia.n + ' anuncios). <button type="button" class="enlace" data-usar-venta="' + Math.round(sugerencia.realista) + '">Usar este precio</button></p>';
    return h;
  }

  function sugerirVenta(titulo) {
    if (!titulo) return null;
    var t = titulo.toLowerCase(), mejor = null;
    preciosPorModelo().forEach(function (m) { if (t.indexOf(m.modelo.toLowerCase()) >= 0 && (!mejor || m.modelo.length > mejor.modelo.length)) mejor = m; });
    return mejor;
  }

  function panelResultado(c) {
    var r = calcular(c);
    var clase = r.ok ? "si" : (r.decision === "FALTAN DATOS" ? "neutro" : "no");
    var h = '<section class="resultado resultado--' + clase + '" aria-live="polite"><p class="resultado__decision">' + r.decision + "</p>";
    if (r.consignacion) {
      h += '<dl class="cifras"><div><dt>Comisión</dt><dd>' + d(r.comision) + "</dd></div><div><dt>Tu ganancia</dt><dd>" + d(r.ganancia) + "</dd></div><div><dt>Por día</dt><dd>" + d(r.porDia) + "</dd></div><div><dt>Recibe el dueño</dt><dd>" + d(r.dueno) + "</dd></div></dl>";
    } else {
      h += '<p class="resultado__max">Precio máximo de compra: <strong>' + (r.maximo > 0 ? d(r.maximo) : "—") + "</strong></p>";
      h += '<dl class="cifras"><div><dt>Ganancia neta</dt><dd>' + d(r.ganancia) + "</dd></div><div><dt>Margen</dt><dd>" + pct(r.margen) + "</dd></div><div><dt>Coste total</dt><dd>" + d(r.coste) + "</dd></div><div><dt>Colchón 8%</dt><dd>" + d(r.colchon) + "</dd></div><div><dt>Retorno</dt><dd>" + pct(r.retorno) + "</dd></div><div><dt>Ganancia por día</dt><dd>" + d(r.porDia) + "</dd></div></dl>";
    }
    if (r.motivos.length) h += '<ul class="motivos">' + r.motivos.map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("") + "</ul>";
    return h + "</section>";
  }

  function leerForm(form, c) {
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name) return;
      var v = el.value;
      if (el.name.indexOf("gastos.") === 0) { c.gastos[el.name.slice(7)] = num(v) || 0; return; }
      if (el.name === "comisionPct") { var p = num(v); c.comisionPct = p == null ? null : p / 100; return; }
      if (["compra", "venta", "dias", "comisionMin", "ventaReal", "precioPedido"].indexOf(el.name) >= 0) { c[el.name] = num(v); return; }
      c[el.name] = v;
    });
  }

  /* ---------- Vistas ---------- */
  var vistas = {};

  vistas.resumen = function () {
    $titulo.textContent = "Resumen";
    var cap = capital();
    var vendidos = S.carros.filter(function (c) { return c.estado === "vendido"; });
    var stock = S.carros.filter(function (c) { return EN_STOCK[c.estado]; });
    var diasMed = vendidos.length ? vendidos.reduce(function (a, c) { return a + (diasEntre(c.fechaCompra, c.fechaVenta) || 0); }, 0) / vendidos.length : null;
    var ganMed = vendidos.length ? cap.ganado / vendidos.length : null;
    var semana = S.carros.filter(function (c) { return diasEntre(c.creado) <= 7; }).length;
    var insp = S.carros.filter(function (c) { return checklistResumen(c).hechos >= 10; }).length;

    var h = '<section class="tarjeta tarjeta--hero"><p class="etq">Capital disponible para comprar</p><p class="grande">' + d(cap.disponible) + '</p><p class="suave">Total ' + d(cap.total) + " · en stock " + d(cap.invertido) + " · reserva " + d(S.reglas.reserva) + "</p></section>";
    h += '<div class="kpis">' +
      '<div class="kpi"><span>Ganancia realizada</span><strong>' + d(cap.ganado) + "</strong></div>" +
      '<div class="kpi"><span>Carros vendidos</span><strong>' + vendidos.length + "</strong></div>" +
      '<div class="kpi"><span>Ganancia media</span><strong>' + d(ganMed) + "</strong></div>" +
      '<div class="kpi"><span>Días medios en stock</span><strong>' + (diasMed == null ? "—" : Math.round(diasMed)) + "</strong></div></div>";

    h += '<section class="tarjeta"><h2>Embudo</h2><ul class="embudo">';
    ESTADOS.forEach(function (e) {
      var n = S.carros.filter(function (c) { return c.estado === e.id; }).length;
      h += '<li><a href="#carros/' + e.id + '"><span class="pill pill--' + e.id + '">' + e.t + "</span><strong>" + n + "</strong></a></li>";
    });
    h += "</ul></section>";

    h += '<section class="tarjeta"><h2>Esta semana</h2><ul class="metas">' +
      meta("Carros anotados", semana, 8) + meta("Inspecciones (10+ puntos)", insp, 2) + "</ul>" +
      '<p class="suave">Meta del plan: 20 anuncios revisados, 8 contactos y 2 inspecciones por semana.</p></section>';

    if (stock.length) {
      h += '<section class="tarjeta"><h2>En stock</h2>' + stock.map(filaCarro).join("") + "</section>";
    }
    h += '<a class="boton boton--bloque" href="#evaluar">Evaluar un carro</a>';
    $vista.innerHTML = h;
  };

  function meta(t, n, m) {
    var p = Math.min(100, Math.round(n / m * 100));
    return '<li><div class="meta__fila"><span>' + t + "</span><strong>" + n + " / " + m + '</strong></div><div class="barra"><span style="width:' + p + '%"></span></div></li>';
  }

  function filaCarro(c) {
    var r = calcular(c), extra;
    if (c.estado === "vendido") extra = "Ganó " + d(resultadoReal(c));
    else if (EN_STOCK[c.estado]) extra = (diasEntre(c.fechaCompra) || 0) + " días en stock";
    else extra = r.consignacion ? "Comisión " + d(r.comision) : (r.listo ? "Máx. " + d(r.maximo) : "Sin números");
    var ck = checklistResumen(c);
    return '<a class="fila" href="#carro/' + c.id + '"><div class="fila__txt"><strong>' + esc(c.titulo || "Sin nombre") + "</strong><span>" + esc(extra) + (ck.hechos ? " · checklist " + ck.hechos + "/" + ck.total : "") + (ck.criticosMal.length ? ' · <b class="rojo">crítico</b>' : "") + '</span></div><span class="pill pill--' + c.estado + '">' + estadoT(c.estado) + "</span></a>";
  }

  vistas.carros = function (filtro) {
    $titulo.textContent = "Carros";
    var h = '<div class="filtros" role="tablist"><a href="#carros" class="chip' + (!filtro ? " activo" : "") + '">Activos</a>';
    ESTADOS.forEach(function (e) { h += '<a href="#carros/' + e.id + '" class="chip' + (filtro === e.id ? " activo" : "") + '">' + e.t + "</a>"; });
    h += "</div>";
    var lista = S.carros.filter(function (c) { return filtro ? c.estado === filtro : (c.estado !== "vendido" && c.estado !== "descartado"); })
      .sort(function (a, b) { return (b.actualizado || 0) - (a.actualizado || 0); });
    h += lista.length ? '<section class="tarjeta lista">' + lista.map(filaCarro).join("") + "</section>"
      : '<section class="vacio"><h2>Sin carros aquí</h2><p>Cuando veas un anuncio interesante, anótalo para no perderle la pista. Así se llena tu embudo.</p></section>';
    h += '<button class="boton boton--bloque" id="nuevo">+ Anotar un carro</button>';
    $vista.innerHTML = h;
    document.getElementById("nuevo").onclick = function () { var c = crearCarro(carroVacio()); location.hash = "#carro/" + c.id; };
  };

  function crearCarro(base) {
    var c = copia(base); c.id = id(); c.estado = "visto"; c.creado = hoy(); c.actualizado = Date.now();
    S.carros.push(c); guardar(); return c;
  }

  var pestanaCarro = "numeros";
  vistas.carro = function (cid, pest) {
    var c = S.carros.filter(function (x) { return x.id === cid; })[0];
    if (!c) { location.hash = "#carros"; return; }
    if (pest) pestanaCarro = pest;
    $titulo.textContent = c.titulo || "Carro";
    var ck = checklistResumen(c);
    var h = '<a class="volver" href="#carros">← Carros</a>';
    h += '<label class="campo campo--estado"><span>Estado</span><select id="estado">' + ESTADOS.map(function (e) { return '<option value="' + e.id + '"' + (c.estado === e.id ? " selected" : "") + ">" + e.t + "</option>"; }).join("") + "</select></label>";
    if (ck.criticosMal.length) h += '<p class="alerta">⛔ Falla crítica en el checklist: ' + esc(ck.criticosMal[0]) + (ck.criticosMal.length > 1 ? " y " + (ck.criticosMal.length - 1) + " más" : "") + ". Regla: se descarta.</p>";
    h += '<div class="pestanas" role="tablist">' +
      tab("numeros", "Números") + tab("checklist", "Checklist " + ck.hechos + "/" + ck.total) + tab("mensajes", "Mensajes") + tab("datos", "Datos") + "</div>";
    h += '<div id="contenido"></div>';
    $vista.innerHTML = h;

    document.getElementById("estado").onchange = function (e) {
      var nuevo = e.target.value;
      if (nuevo === "comprado" && !c.fechaCompra) c.fechaCompra = hoy();
      if (nuevo === "vendido" && !c.fechaVenta) c.fechaVenta = hoy();
      c.estado = nuevo; c.actualizado = Date.now(); guardar(); aviso("Estado: " + estadoT(nuevo));
      vistas.carro(cid);
    };
    Array.prototype.forEach.call($vista.querySelectorAll("[data-tab]"), function (b) {
      b.onclick = function () { vistas.carro(cid, b.getAttribute("data-tab")); };
    });
    var $c = document.getElementById("contenido");
    if (pestanaCarro === "numeros") pintarNumeros($c, c, true);
    else if (pestanaCarro === "checklist") pintarChecklist($c, c);
    else if (pestanaCarro === "mensajes") pintarMensajes($c, c);
    else pintarDatos($c, c);
  };
  function tab(id, t) { return '<button type="button" role="tab" data-tab="' + id + '" class="chip' + (pestanaCarro === id ? " activo" : "") + '" aria-selected="' + (pestanaCarro === id) + '">' + t + "</button>"; }

  function pintarNumeros($c, c, esCarro) {
    $c.innerHTML = '<form class="tarjeta" id="form-num" autocomplete="off">' + formNumeros(c) + "</form><div id=\"res\">" + panelResultado(c) + "</div>";
    var form = document.getElementById("form-num");
    function refrescar() {
      leerForm(form, c); c.actualizado = Date.now(); guardar();
      document.getElementById("res").innerHTML = panelResultado(c);
      if (esCarro) $titulo.textContent = c.titulo || "Carro";
    }
    form.addEventListener("input", refrescar);
    form.addEventListener("change", function (e) {
      if (e.target.name === "tipo") { refrescar(); pintarNumeros($c, c, esCarro); }
      if (e.target.name === "titulo") pintarNumeros($c, c, esCarro);
    });
    form.addEventListener("click", function (e) {
      var v = e.target.getAttribute && e.target.getAttribute("data-usar-venta");
      if (v) { c.venta = Number(v); guardar(); pintarNumeros($c, c, esCarro); aviso("Precio de venta actualizado"); }
    });
  }

  function pintarChecklist($c, c) {
    c.checklist = c.checklist || {};
    var h = '<p class="suave">Toca cada punto: <b class="verde">bien</b>, <b class="rojo">mal</b> o <b>no aplica</b>. Los marcados con ⛔ son críticos.</p>';
    CHECK.forEach(function (f) {
      h += '<section class="tarjeta"><h3 class="sub">' + esc(f.fase) + "</h3>";
      f.items.forEach(function (it) {
        var v = c.checklist[it.id] || "";
        h += '<div class="check" data-item="' + it.id + '"><p>' + (it.c ? "⛔ " : "") + esc(it.t) + '</p><div class="seg">' +
          seg(it.id, "ok", "Bien", v) + seg(it.id, "mal", "Mal", v) + seg(it.id, "na", "N/A", v) + "</div></div>";
      });
      h += "</section>";
    });
    $c.innerHTML = h;
    $c.onclick = function (e) {
      var b = e.target.closest("[data-v]"); if (!b) return;
      var item = b.getAttribute("data-i"), val = b.getAttribute("data-v");
      c.checklist[item] = c.checklist[item] === val ? "" : val;
      c.actualizado = Date.now(); guardar();
      var tabla = CHECK.reduce(function (a, f) { return a.concat(f.items); }, []).filter(function (x) { return x.id === item; })[0];
      if (val === "mal" && tabla && tabla.c && c.checklist[item] === "mal") aviso("Falla crítica: la regla dice descartar");
      vistas.carro(c.id, "checklist");
      var el = document.querySelector('[data-item="' + item + '"]'); if (el) el.scrollIntoView({ block: "center" });
    };
  }
  function seg(i, v, t, actual) { return '<button type="button" data-i="' + i + '" data-v="' + v + '" class="seg__b seg__b--' + v + (actual === v ? " on" : "") + '" aria-pressed="' + (actual === v) + '">' + t + "</button>"; }

  function pintarMensajes($c, c) {
    var r = calcular(c);
    var modelo = c.titulo || "[modelo]";
    var oferta = r.maximo > 0 ? Math.floor(r.maximo * 0.87 / 50) * 50 : null;
    var msgs = [
      ["Primer contacto", "Hola, buenas. Vi tu " + modelo + (c.fuente ? " en " + c.fuente : "") + ". ¿Sigue disponible? ¿Eres el dueño registrado? Gracias."],
      ["Filtro", "Gracias. Unas preguntas rápidas: ¿cuánto tiempo lo tienes? ¿Ha tenido choques o inundación? ¿Tiene revisado y paz y salvo al día? ¿Está financiado? ¿Me compartes el VIN para revisar el historial?"],
      ["Cita", "Me interesa verlo. ¿Te queda bien [día/hora]? Te pido que el carro esté con el motor frío. Si me gusta, lo llevaríamos a revisar a un taller cercano; la inspección corre por mi cuenta."],
      ["Oferta", "Gracias por la paciencia. Con lo que encontró el mecánico ([defectos], presupuesto de " + d(c.gastos.reparaciones || null) + "), mi oferta es de " + (oferta ? d(oferta) : "$[X]") + ", con pago por transferencia al firmar el traspaso. Puedo cerrar [hoy/mañana]."],
      ["Retirada amable", "Entiendo perfectamente, gracias por tu tiempo. Si más adelante te funciona mi oferta, aquí estoy. Éxitos con la venta."]
    ];
    var tel = (c.telefono || "").replace(/\D/g, "");
    if (tel && tel.length <= 8) tel = "507" + tel;
    var h = "";
    if (oferta) h += '<p class="pista">Oferta inicial sugerida: <strong>' + d(oferta) + "</strong> (un 13% por debajo de tu máximo de " + d(r.maximo) + "). Sube en pasos de $100–150 y nunca pases del máximo.</p>";
    if (!tel) h += '<p class="pista">Añade el teléfono del vendedor en la pestaña Datos para abrir WhatsApp directo con su chat.</p>';
    msgs.forEach(function (m, i) {
      h += '<section class="tarjeta msg"><h3 class="sub">' + (i + 1) + ". " + m[0] + '</h3><p class="msg__t" id="m' + i + '">' + esc(m[1]) + '</p><div class="acciones"><button type="button" class="boton boton--chico" data-copiar="m' + i + '">Copiar</button><a class="boton boton--chico boton--borde" target="_blank" rel="noopener" href="https://wa.me/' + tel + "?text=" + encodeURIComponent(m[1]) + '">Abrir en WhatsApp</a></div></section>';
    });
    $c.innerHTML = h;
  }

  function pintarDatos($c, c) {
    var h = '<form class="tarjeta" id="form-datos"><div class="campos">' +
      campo("enlace", "Enlace del anuncio", c.enlace, { tipo: "texto", ph: "https://...", ancho: true }) +
      campo("fuente", "Fuente", c.fuente, { tipo: "texto", ph: "Encuentra24, Marketplace..." }) +
      campo("telefono", "Teléfono del vendedor", c.telefono, { tipo: "texto", ph: "6000-0000" }) +
      campo("precioPedido", "Precio que pide", c.precioPedido, { pre: "USD" }) +
      campo("fechaCompra", "Fecha de compra", c.fechaCompra, { tipo: "fecha" }) +
      campo("fechaVenta", "Fecha de venta", c.fechaVenta, { tipo: "fecha" }) +
      campo("ventaReal", "Precio final de venta", c.ventaReal, { pre: "USD" }) +
      campo("notas", "Notas", c.notas, { tipo: "area", ph: "Defectos, lo que dijo el mecánico, negociación...", ancho: true }) +
      "</div></form>";
    if (c.enlace && /^https?:\/\//i.test(c.enlace)) h += '<a class="boton boton--borde boton--bloque" target="_blank" rel="noopener" href="' + esc(c.enlace) + '">Abrir anuncio</a>';
    if (c.precioPedido && c.titulo) h += '<button type="button" class="boton boton--borde boton--bloque" id="al-mapa">Añadir su precio al Mapa de precios</button>';
    h += '<button type="button" class="boton boton--peligro boton--bloque" id="borrar">Borrar este carro</button><div id="confirmar"></div>';
    $c.innerHTML = h;
    var form = document.getElementById("form-datos");
    form.addEventListener("input", function () { leerForm(form, c); c.actualizado = Date.now(); guardar(); });
    var am = document.getElementById("al-mapa");
    if (am) am.onclick = function () {
      var m = sugerirVenta(c.titulo);
      S.precios.push({ modelo: m ? m.modelo : c.titulo, anio: null, km: null, trans: "", precio: c.precioPedido, fuente: c.fuente || "", fecha: hoy() });
      guardar(); aviso("Añadido al Mapa de precios");
    };
    document.getElementById("borrar").onclick = function () {
      document.getElementById("confirmar").innerHTML = '<p class="alerta">¿Seguro? No se puede deshacer.</p><div class="acciones"><button class="boton boton--peligro" id="si-borrar">Sí, borrar</button><button class="boton boton--borde" id="no-borrar">Cancelar</button></div>';
      document.getElementById("si-borrar").onclick = function () { S.carros = S.carros.filter(function (x) { return x.id !== c.id; }); guardar(); aviso("Carro borrado"); location.hash = "#carros"; };
      document.getElementById("no-borrar").onclick = function () { document.getElementById("confirmar").innerHTML = ""; };
    };
  }

  vistas.evaluar = function () {
    $titulo.textContent = "Evaluar";
    $vista.innerHTML = '<p class="suave">Mete los números de cualquier anuncio y te digo si comprarlo y cuánto ofrecer como máximo.</p><div id="contenido"></div><button class="boton boton--bloque" id="guardar-eval">Guardar en mis carros</button><button class="boton boton--borde boton--bloque" id="limpiar-eval">Empezar de cero</button>';
    pintarNumeros(document.getElementById("contenido"), S.evaluar, false);
    document.getElementById("guardar-eval").onclick = function () {
      var c = crearCarro(S.evaluar); S.evaluar = carroVacio(); guardar(); aviso("Guardado en tus carros"); location.hash = "#carro/" + c.id;
    };
    document.getElementById("limpiar-eval").onclick = function () { S.evaluar = carroVacio(); guardar(); vistas.evaluar(); };
  };

  vistas.precios = function () {
    $titulo.textContent = "Precios";
    var g = preciosPorModelo();
    var h = '<section class="tarjeta"><h2>Precio por modelo</h2><p class="suave">Venta realista = precio pedido medio − ' + Math.round(S.reglas.descuentoVenta * 100) + '%.</p><div class="tabla-env"><table><thead><tr><th>Modelo</th><th>Anuncios</th><th>Medio</th><th>Mín–máx</th><th>Venta realista</th></tr></thead><tbody>';
    g.forEach(function (m) { h += "<tr><td>" + esc(m.modelo) + "</td><td>" + m.n + "</td><td>" + d(m.media) + "</td><td>" + d(m.min) + "–" + d(m.max) + "</td><td><strong>" + d(m.realista) + "</strong></td></tr>"; });
    h += "</tbody></table></div></section>";
    h += '<form class="tarjeta" id="form-precio"><h2>Añadir anuncio</h2><div class="campos">' +
      campo("modelo", "Modelo", "", { tipo: "texto", ph: "Mazda3" }) + campo("anio", "Año", "", { ph: "2010" }) +
      campo("km", "Km", "", { ph: "150000" }) + campo("precio", "Precio pedido", "", { pre: "USD", ph: "5200" }) +
      campo("fuente", "Fuente", "", { tipo: "texto", ph: "Encuentra24" }) +
      '</div><datalist id="modelos">' + g.map(function (m) { return '<option value="' + esc(m.modelo) + '">'; }).join("") + '</datalist><button class="boton boton--bloque" type="submit">Añadir</button></form>';
    h += '<section class="tarjeta"><h2>Anuncios anotados (' + S.precios.length + ")</h2>";
    S.precios.slice().reverse().forEach(function (p, iRev) {
      var i = S.precios.length - 1 - iRev;
      h += '<div class="fila fila--plana"><div class="fila__txt"><strong>' + esc(p.modelo) + (p.anio ? " " + p.anio : "") + " · " + d(p.precio) + "</strong><span>" + [p.km ? Number(p.km).toLocaleString("es-PA") + " km" : "", p.trans, p.fuente, p.ref ? "referencia web" : p.fecha].filter(Boolean).map(esc).join(" · ") + '</span></div><button class="icono" data-borrar-precio="' + i + '" aria-label="Borrar anuncio">✕</button></div>';
    });
    h += "</section>";
    $vista.innerHTML = h;
    document.getElementById("f-modelo").setAttribute("list", "modelos");
    document.getElementById("form-precio").onsubmit = function (e) {
      e.preventDefault(); var f = e.target;
      var p = num(f.precio.value);
      if (!f.modelo.value.trim() || !p) { aviso("Escribe al menos el modelo y el precio"); return; }
      S.precios.push({ modelo: f.modelo.value.trim(), anio: num(f.anio.value), km: num(f.km.value), trans: "", precio: p, fuente: f.fuente.value.trim(), fecha: hoy() });
      guardar(); aviso("Anuncio añadido"); vistas.precios();
    };
    $vista.onclick = function (e) {
      var b = e.target.closest("[data-borrar-precio]"); if (!b) return;
      S.precios.splice(Number(b.getAttribute("data-borrar-precio")), 1); guardar(); vistas.precios();
    };
  };

  vistas.mas = function () {
    $titulo.textContent = "Ajustes";
    var r = S.reglas;
    var h = '<form class="tarjeta" id="form-reglas"><h2>Tus reglas de compra</h2><div class="campos">' +
      campo("gananciaMin", "Ganancia mínima por carro", r.gananciaMin, { pre: "USD" }) +
      campo("margenMin", "Margen mínimo (%)", Math.round(r.margenMin * 1000) / 10) +
      campo("diasMax", "Días máximos para vender", r.diasMax) +
      campo("colchon", "Colchón para imprevistos (%)", Math.round(r.colchon * 1000) / 10) +
      campo("capital", "Capital inicial", r.capital, { pre: "USD" }) +
      campo("reserva", "Reserva que nunca se invierte", r.reserva, { pre: "USD" }) +
      campo("descuentoVenta", "Descuento sobre precio pedido (%)", Math.round(r.descuentoVenta * 1000) / 10) +
      '</div><p class="suave">Primer carro: si en 30 días no aparece ninguno, el plan permite bajar la ganancia mínima a $450.</p></form>';
    h += '<section class="tarjeta"><h2>Copia de seguridad</h2><p class="suave">Tus datos viven solo en este celular. Guarda una copia de vez en cuando (por ejemplo, mándatela por WhatsApp).</p>' +
      '<div class="acciones">' + (window.JA_SIN_DESCARGA ? "" : '<button class="boton boton--chico" id="exportar">Descargar copia</button>') + '<button class="boton boton--chico boton--borde" id="copiar-copia">Copiar copia</button><label class="boton boton--chico boton--borde">Restaurar copia<input type="file" id="importar" accept="application/json,.json" hidden></label></div></section>';
    h += '<section class="tarjeta"><h2>Documentos del plan</h2><ul class="enlaces">' +
      doc("01-plan-estrategico.md", "Plan estratégico") + doc("02-checklist-compra-panama.md", "Checklist completo") + doc("05-plan-primera-compra.md", "Plan de 30 días") +
      doc("06-contrato-compraventa.md", "Contrato de compraventa") + doc("07-contrato-consignacion.md", "Contrato de consignación") + "</ul></section>";
    h += '<section class="tarjeta"><h2>Instalar en el celular</h2><p class="suave"><strong>Android (Chrome):</strong> menú ⋮ → "Instalar app" o "Agregar a pantalla principal".<br><strong>iPhone (Safari):</strong> botón Compartir → "Agregar a inicio".</p></section>';
    h += '<button class="boton boton--peligro boton--bloque" id="reiniciar">Borrar todos los datos</button><div id="confirmar"></div>';
    $vista.innerHTML = h;

    var form = document.getElementById("form-reglas");
    form.addEventListener("input", function () {
      var g = function (n) { return num(form[n].value); };
      r.gananciaMin = g("gananciaMin") || 0; r.margenMin = (g("margenMin") || 0) / 100; r.diasMax = g("diasMax") || 0;
      r.colchon = (g("colchon") || 0) / 100; r.capital = g("capital") || 0; r.reserva = g("reserva") || 0; r.descuentoVenta = (g("descuentoVenta") || 0) / 100;
      guardar();
    });
    var json = function () { return JSON.stringify(S, null, 1); };
    var $exp = document.getElementById("exportar");
    if ($exp) $exp.onclick = function () {
      try {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([json()], { type: "application/json" }));
        a.download = "josefine-gestion-" + hoy() + ".json"; document.body.appendChild(a); a.click(); a.remove();
        aviso("Copia descargada");
      } catch (e) { aviso("No se pudo descargar; usa Copiar copia"); }
    };
    document.getElementById("copiar-copia").onclick = function () {
      try { navigator.clipboard.writeText(json()).then(function () { aviso("Copia copiada: pégala en un chat contigo"); }, function () { aviso("No se pudo copiar"); }); } catch (e) { aviso("No se pudo copiar"); }
    };
    document.getElementById("importar").onchange = function (e) {
      var f = e.target.files[0]; if (!f) return;
      var lector = new FileReader();
      lector.onload = function () {
        try { var n = JSON.parse(lector.result); if (!n.reglas || !n.carros) throw 0; S = n; if (!S.evaluar) S.evaluar = carroVacio(); guardar(); aviso("Copia restaurada"); location.hash = "#resumen"; }
        catch (err) { aviso("Ese archivo no es una copia válida"); }
      };
      lector.readAsText(f);
    };
    document.getElementById("reiniciar").onclick = function () {
      document.getElementById("confirmar").innerHTML = '<p class="alerta">Se borran todos tus carros y precios de este celular. ¿Seguro?</p><div class="acciones"><button class="boton boton--peligro" id="si">Sí, borrar todo</button><button class="boton boton--borde" id="no">Cancelar</button></div>';
      document.getElementById("si").onclick = function () { S = nuevoEstado(); guardar(); aviso("Datos borrados"); location.hash = "#resumen"; };
      document.getElementById("no").onclick = function () { document.getElementById("confirmar").innerHTML = ""; };
    };
  };
  function doc(f, t) { return '<li><a target="_blank" rel="noopener" href="https://github.com/joseq11692-boop/JosefineAuto/blob/claude/vibrant-dijkstra-gm1tot/docs/' + f + '">' + t + " ↗</a></li>"; }

  /* Copiar mensajes (delegado global) */
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-copiar]"); if (!b) return;
    var el = document.getElementById(b.getAttribute("data-copiar"));
    function seleccionar() { var r = document.createRange(); r.selectNodeContents(el); var s = getSelection(); s.removeAllRanges(); s.addRange(r); aviso("Texto seleccionado: cópialo"); }
    try { navigator.clipboard.writeText(el.textContent).then(function () { aviso("Copiado"); }, seleccionar); } catch (err) { seleccionar(); }
  });

  /* ---------- Router ---------- */
  function ir() {
    var partes = (location.hash || "#resumen").slice(1).split("/");
    var v = partes[0] || "resumen";
    $vista.onclick = null;
    if (!vistas[v]) v = "resumen";
    Array.prototype.forEach.call(document.querySelectorAll(".nav a"), function (a) {
      var activo = a.getAttribute("href") === "#" + (v === "carro" ? "carros" : v);
      a.classList.toggle("activo", activo);
      if (activo) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    vistas[v](partes[1], partes[2]);
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", ir);
  ir();

  if ("serviceWorker" in navigator && location.protocol === "https:") {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }
})();
