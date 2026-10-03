/* Funciona sin conexión: guarda la app en el celular. Sube VERSION al cambiar archivos. */
var VERSION = "josefine-gestion-v3";
var ARCHIVOS = ["./", "index.html", "estilos.css", "app.js", "datos-base.js", "manifest.webmanifest", "icono.svg", "logo-firma.svg", "icono-192.png", "icono-512.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(ARCHIVOS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
/* Primero la red (para recibir mejoras); si no hay conexión, la copia guardada. */
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(function (r) {
    var copia = r.clone();
    caches.open(VERSION).then(function (c) { c.put(e.request, copia); });
    return r;
  }).catch(function () { return caches.match(e.request).then(function (r) { return r || caches.match("index.html"); }); }));
});
