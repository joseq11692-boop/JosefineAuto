"""Empaqueta web/panel en un solo HTML (sin manifest ni service worker) para publicarlo como página de Claude."""
import re, pathlib
raiz = pathlib.Path(__file__).resolve().parents[2]
panel = raiz / "web" / "panel"
html = (panel / "index.html").read_text(encoding="utf-8")
cuerpo = re.search(r"<body>(.*)</body>", html, re.S).group(1)
cuerpo = re.sub(r'<script src="[^"]+"></script>\s*', "", cuerpo)
import base64
logo = base64.b64encode((panel / "logo-firma.svg").read_bytes()).decode()
cuerpo = cuerpo.replace('src="logo-firma.svg"', f'src="data:image/svg+xml;base64,{logo}"')
css = (panel / "estilos.css").read_text(encoding="utf-8")
js = (panel / "datos-base.js").read_text(encoding="utf-8") + "\n" + (panel / "app.js").read_text(encoding="utf-8")
salida = (
    "<title>Josefine Gestión</title>\n"
    '<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">\n'
    f"<style>\n{css}\n</style>\n{cuerpo.strip()}\n<script>\nwindow.JA_SIN_DESCARGA = true;\n{js}\n</script>\n"
)
destino = raiz / "companion" / "app.html"
destino.write_text(salida, encoding="utf-8")
print("Escrito", destino, len(salida), "bytes")
