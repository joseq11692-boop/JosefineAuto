"""Vectoriza el logo de firma de Josefine Auto (marca/logo-original-instagram.jpg) a SVG.
La firma se traza con potrace; las cuatro franjas se redibujan como vectores con sus colores."""
import pathlib, sys
import numpy as np
from PIL import Image, ImageFilter
import potrace

RAIZ = pathlib.Path(__file__).resolve().parents[2]
ESC = 12          # factor de ampliación antes de trazar
UMBRAL = float(sys.argv[1]) if len(sys.argv) > 1 else 0.30

# Fuente: foto de perfil de Instagram (320 px). Las coordenadas se trabajan en unidades de 150 px.
img = Image.open(RAIZ / "marca/logo-perfil-instagram-320.jpg").convert("RGB")
w = h = 150
grande = img.resize((w * ESC, h * ESC), Image.LANCZOS).filter(ImageFilter.GaussianBlur(ESC * 0.18))
a = np.asarray(grande).astype(float)
oscuridad = (255 - a.min(2)) / 255.0
# Quitar las franjas (se redibujan como vectores): filas 92.6–107.4 a la derecha de x=28.5
y0, y1, x0 = int(92.6 * ESC), int(107.4 * ESC), int(28.5 * ESC)
oscuridad[y0:y1, x0:] = 0
mapa = oscuridad > UMBRAL
traza = potrace.Bitmap(~mapa).trace(turdsize=int(ESC * ESC * 0.6), alphamax=1.1, opticurve=True, opttolerance=0.25)

def num(v): return f"{v / ESC:.2f}".rstrip("0").rstrip(".")
partes = []
for curva in traza:
    s = curva.start_point
    d = [f"M{num(s.x)} {num(s.y)}"]
    for seg in curva.segments:
        if seg.is_corner:
            d.append(f"L{num(seg.c.x)} {num(seg.c.y)}L{num(seg.end_point.x)} {num(seg.end_point.y)}")
        else:
            d.append(f"C{num(seg.c1.x)} {num(seg.c1.y)} {num(seg.c2.x)} {num(seg.c2.y)} {num(seg.end_point.x)} {num(seg.end_point.y)}")
    partes.append("".join(d) + "Z")
firma = "".join(partes)

# Franjas (coordenadas medidas sobre el original de 150 px)
FRANJAS = [  # color, y, x inicio, x fin, grosor
    ("#3b3fa8", 94.6, 30, 114, 1.15),
    ("tinta",   97.6, 50, 123, 1.15),
    ("#c0262d", 101.6, 68, 117, 1.15),
    ("#e2b23a", 105.6, 84, 112, 1.05),
]

def svg(tinta, fondo=None):
    defs, rects = [], []
    for i, (color, y, xa, xb, g) in enumerate(FRANJAS):
        c = tinta if color == "tinta" else color
        defs.append(f'<linearGradient id="f{i}" x1="{xa}" x2="{xb}" gradientUnits="userSpaceOnUse">'
                    f'<stop offset="0" stop-color="{c}" stop-opacity="0"/><stop offset=".22" stop-color="{c}"/>'
                    f'<stop offset=".8" stop-color="{c}"/><stop offset="1" stop-color="{c}" stop-opacity="0"/></linearGradient>')
        rects.append(f'<rect x="{xa}" y="{y - g / 2:.2f}" width="{xb - xa}" height="{g}" rx="{g / 2:.2f}" fill="url(#f{i})"/>')
    vb = "14 30 116 82"
    bg = f'<rect x="14" y="30" width="116" height="82" fill="{fondo}"/>' if fondo else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="Josefine Auto">'
            f'<title>Josefine Auto</title><defs>{"".join(defs)}</defs>{bg}'
            f'<path fill="{tinta}" fill-rule="evenodd" d="{firma}"/>{"".join(rects)}</svg>')

salida = RAIZ / "web" / "img"
(salida / "logo-firma.svg").write_text(svg("#121316"), encoding="utf-8")
(salida / "logo-firma-blanco.svg").write_text(svg("#ffffff"), encoding="utf-8")
(RAIZ / "marca" / "logo-firma-fondo-blanco.svg").write_text(svg("#121316", "#ffffff"), encoding="utf-8")
print("curvas:", len(partes), "bytes:", len(firma))
