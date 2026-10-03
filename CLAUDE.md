# Josefine Auto: instrucciones para Claude

## Preferencias del usuario (obligatorias)

- **Toda pregunta al usuario debe ser de opción múltiple** (usar la herramienta de preguntas con opciones). Si la pregunta es abierta, igualmente ofrecer opciones, porque el usuario siempre puede elegir "Otro" para explicar. Nunca hacer preguntas solo en texto libre.
- Responder en español.

## Reglas diamante (prioridad máxima)

1. **Nunca pedir al usuario algo que Claude pueda hacer por sí mismo.** Si algo *inevitablemente* solo lo puede hacer el usuario (llamadas, pagos, cuentas personales, ajustes de GitHub que requieren su sesión, acciones físicas), se entrega una **guía visual paso a paso, nivel niño, con enlaces directos** (el "Visual Companion": https://claude.ai/artifact/5RDfy3zfV5AY6sxEmkVG4P, con fuente en `companion/index.html`; se republica desde ese archivo). Se actualiza cada vez que aparece una tarea nueva para el usuario.
2. **No preguntar lo obvio.** Si una idea, mejora u opción tiene más de un 70% de adecuación al proyecto, se implementa directamente sin preguntar. Solo se pregunta (con opciones) cuando la decisión es genuinamente del usuario y no hay una opción claramente mejor.

## Contexto del proyecto

- Negocio de compraventa de autos seminuevos en **Panamá** (moneda USD), más contenido automotriz y proyectos propios (autos modificados y colección).
- El fundador vende como particular, tiene menos de $5.000 de capital y dedica entre 10 y 25 horas por semana.
- Modelo de dos partes: **Caja** (compras propias de japoneses accesibles, que se venden rápido) y **Marca** (deportivos y modificados a comisión, más los proyectos propios).
- Historial real (Instagram @josefineauto, "JoseFine Automotive"): vendidos Ford Edge 2016, Range Rover Sport 2019, BMW 320i 2006, BMW X6 M50i, Maserati Ghibli SQ4 2019, Honda Pilot Elite 2022; proyectos: Lancer Evolution VI GSR 1999 y Honda Civic Si 2008. Fotos en `web/img/carros/`, `web/img/proyectos/`, `web/img/escena/`. La API pública de perfil de Instagram (`i.instagram.com/api/v1/users/web_profile_info/?username=josefineauto` con cabecera `x-ig-app-id: 936619743392459`) a veces responde sin login; el feed completo pide login.
- Marca **sin cara**: el fundador no aparece en cámara. Ritmo de **1 publicación principal por semana** en Instagram.
- En el contenido para la audiencia panameña, usar "carro" o "auto" (no "coche").
- Estrategia y herramientas en `docs/` y `herramientas/` (ver `README.md`).
- Estudio de diseño: https://claude.ai/artifact/GUpr5eq9LWSqNRen7RePha (fuente `companion/estudio.html`). Las elecciones del usuario están en su base de datos, colección `decisiones`, documento `estudio` (incluye `logo`: id del archivo subido y colores extraídos); leerlas con ArtifactData antes de aplicar estilos. El logo se descarga con Artifact read (`path` = id del asset). La identidad visual ("Firma") se basa en el logo del usuario: ver `marca/README.md`.
- Vista previa de la web publicada en https://claude.ai/artifact/LtVvPGkCcAbXdzLRL96FfF (regenerar con `python3 herramientas/build/empaquetar-web.py` y republicar `companion/web.html`).
- Web en línea (GitHub Pages, se publica sola con cada push a la rama por defecto): https://joseq11692-boop.github.io/JosefineAuto/ · app: /panel/. WhatsApp del negocio: 6698-9569 (50766989569), Instagram @josefineauto.
- Guías: `herramientas/guias/*.md` → `python3 herramientas/build/generar-guias.py`. Kit de Instagram en `web/kit/` (imágenes con `herramientas/build/generar-posts.js`). Para añadir un carro: fotos en `web/img/carros/` y bloque en `INVENTARIO` de `web/datos.js`.
- Web pública en `web/`; app del fundador (PWA) en `web/panel/`. Tras cambiar la app, regenerar `companion/app.html` con `python3 herramientas/build/empaquetar-app.py` y republicarla en https://claude.ai/artifact/CjZb1UgEMyL12v2fLHZQfB. Subir `VERSION` en `web/panel/sw.js` al cambiar archivos de la app.
