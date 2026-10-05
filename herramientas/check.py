#!/usr/bin/env python3
"""Gate de Josefine Auto: todo tiene que salir en verde antes de dar algo por hecho.

Uso:  python3 herramientas/check.py ; echo EXIT=$?
(Nunca con un pipe: el código de salida tiene que ser el de este script.)

Cada comprobación falla cerrado: si no encuentra nada que revisar, también es rojo,
para que "no encontré nada" no pueda querer decir "no miré".
"""
import json
import re
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse

RAIZ = Path(__file__).resolve().parent.parent
WEB = RAIZ / "web"
fallos = []


def ok(nombre, n, extra=""):
    print(f"  ✔ {nombre}: {n} revisados{extra}")


def fallo(nombre, detalle):
    fallos.append(f"{nombre}: {detalle}")
    print(f"  ✘ {nombre}: {detalle}")


def exige(nombre, n):
    if n == 0:
        fallo(nombre, "no encontró nada que revisar (falla cerrado)")
        return False
    return True


# 1. Sintaxis de todos los JS
def js():
    archivos = sorted(list(WEB.rglob("*.js")) + list((RAIZ / "herramientas/build").glob("*.js")))
    if not exige("Sintaxis JS", len(archivos)):
        return
    malos = []
    for f in archivos:
        r = subprocess.run(["node", "--check", str(f)], capture_output=True, text=True)
        if r.returncode != 0:
            malos.append(f"{f.relative_to(RAIZ)}: {r.stderr.strip().splitlines()[-1] if r.stderr.strip() else r.returncode}")
    for m in malos:
        fallo("Sintaxis JS", m)
    if not malos:
        ok("Sintaxis JS", len(archivos))


# 2. JSON válidos
def jsons():
    archivos = sorted(list(WEB.rglob("*.webmanifest")) + list(WEB.rglob("*.json")) + list(RAIZ.glob(".claude/**/*.json")))
    if not exige("JSON", len(archivos)):
        return
    malos = 0
    for f in archivos:
        try:
            json.loads(f.read_text(encoding="utf-8"))
        except Exception as e:  # noqa: BLE001
            malos += 1
            fallo("JSON", f"{f.relative_to(RAIZ)}: {e}")
    if not malos:
        ok("JSON", len(archivos))


# 3. Enlaces y recursos locales de cada HTML existen
class Refs(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []

    def handle_starttag(self, tag, attrs):
        for k, v in attrs:
            if k in ("src", "href") and v:
                self.refs.append(v)


def enlaces():
    paginas = sorted(p for p in WEB.rglob("*.html"))
    if not exige("Enlaces locales", len(paginas)):
        return
    total, rotos = 0, []
    for pag in paginas:
        p = Refs()
        p.feed(pag.read_text(encoding="utf-8"))
        for ref in p.refs:
            u = urlparse(ref)
            if u.scheme or ref.startswith(("#", "//", "mailto:", "tel:", "data:", "javascript:")) or "${" in ref:
                continue
            ruta = unquote(u.path)
            if not ruta:
                continue
            destino = (WEB / ruta.lstrip("/")) if ruta.startswith("/") else (pag.parent / ruta)
            if ruta.endswith("/"):
                destino = destino / "index.html"
            total += 1
            if not destino.exists():
                rotos.append(f"{pag.relative_to(RAIZ)} → {ref}")
    for r in rotos:
        fallo("Enlaces locales", r)
    if exige("Enlaces locales", total) and not rotos:
        ok("Enlaces locales", total, f" en {len(paginas)} páginas")


# 4. Guardián de idioma: en Panamá se dice "carro" o "auto", nunca "coche"
def coche():
    archivos = [f for f in list(WEB.rglob("*.html")) + list(WEB.rglob("*.js")) + list((RAIZ / "herramientas/guias").glob("*.md"))]
    if not exige("Guardián «carro, no coche»", len(archivos)):
        return
    patron = re.compile(r"\bcoches?\b", re.IGNORECASE)
    malos = []
    for f in archivos:
        for i, linea in enumerate(f.read_text(encoding="utf-8").splitlines(), 1):
            if patron.search(linea):
                malos.append(f"{f.relative_to(RAIZ)}:{i}")
    for m in malos:
        fallo("Guardián «carro, no coche»", m)
    if not malos:
        ok("Guardián «carro, no coche»", len(archivos))


# 5. Cada guía en markdown tiene su página generada
def guias():
    md = sorted((RAIZ / "herramientas/guias").glob("*.md"))
    if not exige("Guías generadas", len(md)):
        return
    faltan = [m.stem for m in md if not (WEB / "guias" / f"{m.stem}.html").exists()]
    for f in faltan:
        fallo("Guías generadas", f"falta web/guias/{f}.html: ejecuta python3 herramientas/build/generar-guias.py")
    if not faltan:
        ok("Guías generadas", len(md))


# 6. La app sin conexión: todo lo que el service worker guarda existe
def service_worker():
    sw = WEB / "panel" / "sw.js"
    m = re.search(r"ARCHIVOS\s*=\s*\[(.*?)\]", sw.read_text(encoding="utf-8"), re.S)
    lista = re.findall(r'"([^"]+)"', m.group(1)) if m else []
    if not exige("Archivos de la app sin conexión", len(lista)):
        return
    faltan = [a for a in lista if a != "./" and not (WEB / "panel" / a).exists()]
    for f in faltan:
        fallo("Archivos de la app sin conexión", f"web/panel/{f} no existe")
    if not faltan:
        ok("Archivos de la app sin conexión", len(lista))


# 7. Inventario: cada carro tiene título y todas sus fotos existen
def inventario():
    script = (
        "global.window={};require(process.argv[1]);"
        "console.log(JSON.stringify({inv:window.INVENTARIO||[],pro:window.PROYECTOS||[],cfg:window.CONFIG||{}}))"
    )
    r = subprocess.run(["node", "-e", script, str(WEB / "datos.js")], capture_output=True, text=True)
    if r.returncode != 0:
        fallo("Inventario", f"datos.js no carga: {r.stderr.strip()[:200]}")
        return
    d = json.loads(r.stdout)
    carros = d["inv"] + d["pro"]
    if not exige("Inventario", len(carros)):
        return
    malos, fotos = [], 0
    for c in carros:
        nombre = c.get("titulo") or c.get("nombre") or " ".join(str(c.get(k, "")) for k in ("marca", "modelo", "anio")).strip()
        if not nombre:
            malos.append(f"carro sin nombre: {json.dumps(c)[:80]}")
        for f in c.get("fotos", []):
            fotos += 1
            if not (WEB / f).exists():
                malos.append(f"{nombre}: falta web/{f}")
    if not re.fullmatch(r"507\d{8}", d["cfg"].get("whatsapp", "")):
        malos.append(f"CONFIG.whatsapp no es un número de Panamá válido: {d['cfg'].get('whatsapp')!r}")
    for m in malos:
        fallo("Inventario", m)
    if not malos:
        ok("Inventario", len(carros), f" carros y proyectos, {fotos} fotos")


# 8. Guardián de dominio: la web vive en https://josefineauto.com/ (nada de rutas de github.io)
def dominio():
    archivos = [f for d in (WEB, RAIZ / "companion") for f in d.rglob("*")
                if f.suffix in (".html", ".xml", ".txt", ".js", ".json", ".webmanifest")]
    if not exige("Guardián de dominio", len(archivos)):
        return
    patron = re.compile(r"github\.io/JosefineAuto|[\"'(]/JosefineAuto/")
    malos = [f"{f.relative_to(RAIZ)}:{i}" for f in archivos
             for i, l in enumerate(f.read_text(encoding="utf-8").splitlines(), 1) if patron.search(l)]
    for m in malos:
        fallo("Guardián de dominio", f"{m} usa la dirección vieja; usa https://josefineauto.com/ o rutas relativas")
    if not malos:
        ok("Guardián de dominio", len(archivos))


def main():
    print("Gate Josefine Auto")
    for paso in (js, jsons, enlaces, coche, guias, service_worker, inventario, dominio):
        try:
            paso()
        except Exception as e:  # noqa: BLE001  (si una comprobación revienta, el gate falla cerrado)
            fallo(paso.__name__, f"la comprobación no pudo ejecutarse: {e}")
    if fallos:
        print(f"ROJO: {len(fallos)} fallo(s)")
        return 1
    print("VERDE")
    return 0


if __name__ == "__main__":
    sys.exit(main())
