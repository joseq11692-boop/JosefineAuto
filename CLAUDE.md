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
- Marca **sin cara**: el fundador no aparece en cámara. Ritmo de **1 publicación principal por semana** en Instagram.
- En el contenido para la audiencia panameña, usar "carro" o "auto" (no "coche").
- Estrategia y herramientas en `docs/` y `herramientas/` (ver `README.md`).
- Web pública en `web/`; app del fundador (PWA) en `web/panel/`. Tras cambiar la app, regenerar `companion/app.html` con `python3 herramientas/build/empaquetar-app.py` y republicarla en https://claude.ai/artifact/CjZb1UgEMyL12v2fLHZQfB. Subir `VERSION` en `web/panel/sw.js` al cambiar archivos de la app.
