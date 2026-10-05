# Referencia del proyecto Josefine Auto

Detalle que no va en `CLAUDE.md`. Consúltalo cuando toques esa área, no por defecto.
Trasladado desde `CLAUDE.md` el 2026-10-05, sin borrar nada (regla: al podar se traslada).

## Negocio

- Compraventa de autos seminuevos en **Panamá** (USD), más contenido automotriz y proyectos propios (modificados y colección).
- El fundador vende como particular, tiene menos de $5.000 de capital y dedica entre 10 y 25 horas por semana.
- Modelo de dos partes: **Caja** (compras propias de japoneses accesibles que se venden rápido) y **Marca** (deportivos y modificados a comisión, más los proyectos propios).
- Marca **sin cara**: el fundador no aparece en cámara. **1 publicación principal por semana** en Instagram.
- Lenguaje para Panamá: "carro" o "auto", nunca "coche" (guardián en el gate).
- WhatsApp del negocio: 6698-9569 (`50766989569`). Instagram: @josefineauto.

## Historial real (Instagram @josefineauto, "JoseFine Automotive")

- En la web como vendidos (los 12 posts "VENDIDO" de Instagram): Ford Edge 2016, Range Rover Sport 2019, BMW 320i 2006, BMW X6 M50i, Maserati Ghibli SQ4 2019, Honda Pilot Elite 2022, Mazda 2 2016, Mini Countryman 2012, Suzuki Vitara Turbo Allgrip 2019, Audi A3 2014, Lexus LX450 1997, Range Rover Sport HSE 2006.
- Proyectos: Lancer Evolution VI GSR 1999 y Honda Civic Si 2008.
- Fotos en `web/img/carros/`, `web/img/proyectos/`, `web/img/escena/`, `web/img/conocenos/`.
- Datos de Instagram: el endpoint público `i.instagram.com/api/v1/users/web_profile_info/?username=josefineauto` (cabecera `x-ig-app-id: 936619743392459`) y `www.instagram.com/api/v1/feed/user/josefineauto/username/` se usaron para leer el propio perfil. **Desde 2026-10-05 rige la norma "solo APIs oficiales"** (ver `docs/normas.md`): no volver a usarlos sin el OK del dueño.

## Web y app

- Web pública en `web/` (GitHub Pages; se publica sola con cada push a la rama por defecto `claude/vibrant-dijkstra-gm1tot`): https://josefineauto.com/ · app del fundador (PWA) en `/panel/` · kit privado de Instagram en `/kit/`.
- Dominio propio comprado en Cloudflare el 2026-10-05: **josefineauto.com** (vence 2027-10-05). DNS creado por el dueño el 2026-10-05 (4 A a 185.199.108-111.153 + CNAME www); falta HTTPS (DUENO-05). El workflow `.github/workflows/dominio.yml` lo conecta o desconecta según el DNS.
- Añadir un carro: fotos en `web/img/carros/<slug>/NN.jpg` y bloque en `INVENTARIO` de `web/datos.js`.
- Guías: `herramientas/guias/*.md` → `python3 herramientas/build/generar-guias.py` (genera `web/guias/`, `web/guias.js`, `web/404.html`, `web/sitemap.xml`).
- Kit de Instagram en `web/kit/`; imágenes con `herramientas/build/generar-posts.js`, `generar-post-vendidos.js` y `generar-post-nosotros.js` (Playwright).
- App: tras cambiarla, subir `VERSION` en `web/panel/sw.js`, regenerar `companion/app.html` con `python3 herramientas/build/empaquetar-app.py` y republicarla en https://claude.ai/artifact/CjZb1UgEMyL12v2fLHZQfB.
- Vista previa de la web: https://claude.ai/artifact/LtVvPGkCcAbXdzLRL96FfF (regenerar con `python3 herramientas/build/empaquetar-web.py` y republicar `companion/web.html`).

## Diseño

- Estudio de diseño: https://claude.ai/artifact/GUpr5eq9LWSqNRen7RePha (fuente `companion/estudio.html`). Las elecciones del dueño están en su base de datos, colección `decisiones`, documento `estudio` (incluye `logo`: id del archivo subido y colores extraídos). Leerlas con ArtifactData antes de aplicar estilos. El logo se descarga con Artifact read (`path` = id del asset).
- Identidad "Firma" basada en el logo del dueño: ver `marca/README.md`.

## Guía visual del dueño

- Visual Companion: https://claude.ai/artifact/5RDfy3zfV5AY6sxEmkVG4P, fuente `companion/index.html` (se republica desde ese archivo). Es la versión visual de `PENDIENTE-DUENO.md`.

## Documentos

- Estrategia y herramientas en `docs/` y `herramientas/` (índice en `README.md`).
- Contratos modelo: `docs/06-contrato-compraventa.md`, `docs/07-contrato-consignacion.md` (revisar con abogado panameño antes de usar).
- Plan de compra con precios reales: `docs/08-plan-compra-10-carros.*`. Ficha de consignación del GLE 53: `docs/09-ficha-consignacion-gle53.*`.
