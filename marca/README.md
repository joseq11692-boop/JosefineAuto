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
| `marca/logo-original-instagram.jpg` | Original de Instagram (150 px), referencia |

El vector se genera con `python3 herramientas/build/vectorizar-logo.py 0.33` (la firma se traza con potrace; las franjas se redibujan como vectores).

## Colores

| Nombre | Hex | Uso |
|---|---|---|
| Papel | `#fbfbf9` | Fondo |
| Tinta | `#121316` | Texto, botones, la firma |
| Índigo | `#3438b8` | Franja 1, palabras destacadas, enlaces |
| Rojo | `#c8202b` | Franja 3, "vendido", alertas |
| Oro | `#d9a62a` | Franja 4, "reservado" |
| Gris suave | `#62656d` | Textos secundarios |

## Letra

- **Archivo** (Google Fonts), ancha (`font-stretch: 115–118%`) y en mayúsculas para títulos; normal para textos. Contrasta con la firma manuscrita.
- **IBM Plex Mono** para datos técnicos: km, etiquetas, fichas.

## La franja

Las cuatro líneas del logo (índigo, tinta, rojo, oro), escalonadas, se usan como sello: bajo los titulares, en la cabecera de la app y en los pasos del método.
