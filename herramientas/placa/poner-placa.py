"""Tapa una placa real con la de Josefine Auto (herramientas/placa/placa.png).
Uso: python3 herramientas/placa/poner-placa.py foto.jpg salida.jpg x1,y1 x2,y2 x3,y3 x4,y4
     (esquinas de la placa: arriba-izq, arriba-der, abajo-der, abajo-izq). Deja también salida_cmp.png (antes | después)."""
import cv2, numpy as np, sys, os
PLACA = os.path.join(os.path.dirname(os.path.abspath(__file__)), "placa.png")

def poner(src, dst_pts, out):
    im = cv2.imread(src); pl = cv2.imread(PLACA)[6:-6, 6:-6]
    h, w = pl.shape[:2]; d = np.float32(dst_pts)
    c = d.mean(0); d = c + (d - c) * 1.06  # un poco más grande para tapar el borde
    M = cv2.getPerspectiveTransform(np.float32([[0, 0], [w, 0], [w, h], [0, h]]), d)
    war = cv2.warpPerspective(pl, M, (im.shape[1], im.shape[0]), flags=cv2.INTER_AREA)
    mask = cv2.warpPerspective(np.full((h, w), 255, np.uint8), M, (im.shape[1], im.shape[0]))
    # tono: según el blanco de la placa original (o la luz de la zona si la placa es oscura)
    reg = im[mask > 0]; hsv = cv2.cvtColor(reg.reshape(-1, 1, 3), cv2.COLOR_BGR2HSV).reshape(-1, 3)
    wht = reg[(hsv[:, 2] > 140) & (hsv[:, 1] < 60)]
    g = (wht.mean(0) / 244.0) if len(wht) > 50 else np.array([.85, .85, .85])
    war = cv2.GaussianBlur(war, (0, 0), 0.7)
    war = np.clip(war.astype(np.float32) * np.clip(g, 0.78, 1.0), 0, 255)
    m = cv2.GaussianBlur(mask, (0, 0), 0.7).astype(np.float32)[..., None] / 255
    o = (im * (1 - m) + war * m).astype(np.uint8); cv2.imwrite(out, o, [cv2.IMWRITE_JPEG_QUALITY, 95])
    x0, y0 = np.maximum(d.min(0).astype(int) - 60, 0); x1, y1 = d.max(0).astype(int) + 60
    cv2.imwrite(out.rsplit(".", 1)[0] + "_cmp.png", np.hstack([cv2.resize(im[y0:y1, x0:x1], None, fx=3, fy=3), cv2.resize(o[y0:y1, x0:x1], None, fx=3, fy=3)]))
    print(out, "tono", g.round(2))

if __name__ == "__main__":
    poner(sys.argv[1], [tuple(map(float, a.split(","))) for a in sys.argv[3:7]], sys.argv[2])
