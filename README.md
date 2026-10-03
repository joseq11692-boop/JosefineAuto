# Josefine Auto

Compraventa de autos seminuevos en Panamá, especializada en deportivos y japoneses, más contenido automotriz.

## Documentos

| Archivo | Contenido |
|---|---|
| [docs/01-plan-estrategico.md](docs/01-plan-estrategico.md) | Diagnóstico, modelo de dos partes (caja + marca), reglas, metas y plan de 90 días |
| [docs/02-checklist-compra-panama.md](docs/02-checklist-compra-panama.md) | Inspección y verificación legal antes de comprar |
| [docs/03-plan-contenido-y-web.md](docs/03-plan-contenido-y-web.md) | Formatos sin cara, calendario, Instagram y estructura web |
| [docs/04-primeros-4-posts.md](docs/04-primeros-4-posts.md) | Guiones, láminas, textos y rutina del primer ciclo de Instagram |
| [docs/05-plan-primera-compra.md](docs/05-plan-primera-compra.md) | Plan de 30 días para comprar el primer carro, venderlo y escalar |
| [herramientas/calculadora-rentabilidad.xlsx](herramientas/calculadora-rentabilidad.xlsx) | Decide si comprar, precio máximo, comisiones, mapa de precios y registro de operaciones |

## Web

La web está en `web/`. Para el día a día solo se edita `web/datos.js` (WhatsApp, inventario y proyectos); los colores de la marca, al principio de `web/estilos.css`. Cada cambio en `web/` se publica solo en GitHub Pages mediante `.github/workflows/publicar-web.yml`.

Dirección prevista: https://joseq11692-boop.github.io/JosefineAuto/

## Contratos

- [docs/06-contrato-compraventa.md](docs/06-contrato-compraventa.md): compraventa de carro usado, con anexo de defectos
- [docs/07-contrato-consignacion.md](docs/07-contrato-consignacion.md): venta a comisión

## Guía del fundador (Visual Companion)

Pasos que solo puede hacer el fundador, con enlaces y casillas: `companion/index.html`, publicada como página privada en https://claude.ai/artifact/5RDfy3zfV5AY6sxEmkVG4P

## App Josefine Gestión

App instalable (PWA) para el fundador, en `web/panel/`: evaluar carros, embudo de compra y venta, checklist de inspección, mapa de precios, mensajes de WhatsApp y capital. Funciona sin conexión y guarda los datos en el propio celular.

- Instalable: https://joseq11692-boop.github.io/JosefineAuto/panel/ (cuando GitHub Pages esté activo)
- Uso inmediato: https://claude.ai/artifact/CjZb1UgEMyL12v2fLHZQfB (versión en un solo archivo: `companion/app.html`, generada con `python3 herramientas/build/empaquetar-app.py`)
