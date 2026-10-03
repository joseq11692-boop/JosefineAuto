"""Empaqueta web/ en un solo HTML (CSS, JS y logos incluidos) para verla como página de Claude."""
import re, base64, pathlib
raiz = pathlib.Path(__file__).resolve().parents[2]
web = raiz / "web"
html = (web / "index.html").read_text(encoding="utf-8")
titulo = "<title>Josefine Auto</title>"
fuentes = "\n".join(re.findall(r'<link href="https://fonts.googleapis.com[^>]+>', html))
cuerpo = re.search(r"<body>(.*)</body>", html, re.S).group(1)
cuerpo = re.sub(r'<script src="[^"]+"></script>\s*', "", cuerpo)
for f in ["logo-firma.svg", "logo-firma-blanco.svg"]:
    uri = "data:image/svg+xml;base64," + base64.b64encode((web / "img" / f).read_bytes()).decode()
    cuerpo = cuerpo.replace(f'src="img/{f}"', f'src="{uri}"')
css = (web / "estilos.css").read_text(encoding="utf-8")
js = (web / "datos.js").read_text(encoding="utf-8") + "\n" + (web / "guias.js").read_text(encoding="utf-8").replace('"url": "guias/', '"url": "https://joseq11692-boop.github.io/JosefineAuto/guias/') + "\n" + (web / "app.js").read_text(encoding="utf-8")
salida = f"{titulo}\n{fuentes}\n<style>\n{css}\n</style>\n{cuerpo.strip()}\n<script>\n{js}\n</script>\n"
destino = raiz / "companion" / "web.html"
destino.write_text(salida, encoding="utf-8")
print("Escrito", destino, len(salida), "bytes")
