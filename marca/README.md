# Identidad Josefine Auto: "Firma"

La identidad nace del logo de Instagram (@josefineauto): la firma "Josefine" a mano en tinta negra, con cuatro franjas de velocidad debajo.

## Logo

| Archivo | Uso |
|---|---|
| `web/img/logo-firma.svg` | Logo vectorial, tinta negra, fondo transparente. **Usar siempre que se pueda** (nítido a cualquier tamaño) |
| `web/img/logo-firma-blanco.svg` | Versión para fondos oscuros (firma en blanco) |
| `marca/logo-firma-fondo-blanco.svg` | Con fondo blanco, para imprimir |
| `web/img/logo-firma.png` / `-blanco.png` | 2400 px, transparente, para redes y documentos |
| `web/img/compartir.png` | 1200×630, imagen al compartir la web en WhatsApp o redes |
| `marca/logo-perfil-instagram-320.jpg` | Foto de perfil de Instagram (320 px): **fuente del vector actual** |
| `marca/logo-original-instagram.jpg` | Primera versión recibida (150 px), referencia |

El vector se genera con `python3 herramientas/build/vectorizar-logo.py 0.42` (la firma se traza con potrace; las franjas se redibujan como vectores).

## Colores (elegidos en el estudio de diseño)

| Nombre | Hex | Uso |
|---|---|---|
| Blanco taller | `#f6f7f8` | Fondo de la web y la app (tarjetas en `#ffffff`) |
| Tinta | `#14161a` | Texto, la firma, pie de página |
| Rojo carrera | `#e11d2e` | Acento: botones, palabras destacadas (hover `#b3121f`) |
| Índigo / Rojo / Oro | `#3438b8` / `#c8202b` / `#d9a62a` | Solo en las franjas del logo y los sellos |
| Gris suave | `#5b6270` | Textos secundarios |

## Letra

- **Chakra Petch** (600/700), en mayúsculas, para títulos y botones: angulosa y técnica, contrasta con la firma manuscrita.
- **Inter** para textos.
- **IBM Plex Mono** para datos técnicos: km, etiquetas, fichas.

## Estilo

- Esquinas suaves (tarjetas 22 px, botones 16 px), fondo liso.
- Botones rojos con flecha →.
- Portada centrada con tono premium: "Selección Josefine. Pocos carros. Elegidos uno a uno."
- Tarjetas de carro tipo galería: foto grande con título, km y precio encima.
- App: menú inferior con el botón central "Evaluar" en rojo.

## La franja

Las cuatro líneas del logo (índigo, tinta, rojo, oro), escalonadas, se usan como sello: bajo los titulares, en la cabecera de la app y en los pasos del método.
