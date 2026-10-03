"""Genera las guías (web/guias/), la página 404 y el sitemap a partir de herramientas/guias/*.md.

Formato de cada .md:
    ---
    titulo: ...
    descripcion: ...
    fecha: 2026-10-03
    ---
    Texto en Markdown sencillo: ## subtítulos, párrafos, listas con "- " o "1. ", **negrita**.
"""
import html, json, pathlib, re

RAIZ = pathlib.Path(__file__).resolve().parents[2]
WEB = RAIZ / "web"
FUENTES = RAIZ / "herramientas" / "guias"
BASE = "https://joseq11692-boop.github.io/JosefineAuto/"
WA = "50766989569"

FRANJA = '<div class="franja franja--chica" aria-hidden="true"><span></span><span></span><span></span><span></span></div>'


def inline(t):
    t = html.escape(t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"\*(.+?)\*", r"<em>\1</em>", t)
    t = re.sub(r"\[(.+?)\]\((.+?)\)", r'<a href="\2">\1</a>', t)
    return t


def md(texto):
    out, lista = [], None
    for linea in texto.strip().splitlines():
        l = linea.rstrip()
        m_ul, m_ol = re.match(r"^- (.*)", l), re.match(r"^\d+\. (.*)", l)
        tipo = "ul" if m_ul else "ol" if m_ol else None
        if lista and tipo != lista:
            out.append(f"</{lista}>"); lista = None
        if tipo:
            if not lista:
                out.append(f"<{tipo}>"); lista = tipo
            out.append(f"<li>{inline((m_ul or m_ol).group(1))}</li>")
        elif l.startswith("## "):
            out.append(f"<h2>{inline(l[3:])}</h2>")
        elif l.startswith("> "):
            out.append(f'<p class="destacado">{inline(l[2:])}</p>')
        elif l:
            out.append(f"<p>{inline(l)}</p>")
    if lista:
        out.append(f"</{lista}>")
    return "\n".join(out)


def leer(f):
    crudo = f.read_text(encoding="utf-8")
    _, cab, cuerpo = crudo.split("---", 2)
    meta = dict(re.findall(r"^(\w+):\s*(.+)$", cab, re.M))
    meta["slug"] = f.stem
    meta["cuerpo"] = cuerpo
    return meta


def pagina(titulo, descripcion, url, cuerpo, raiz="../", extra_head=""):
    return f"""<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(titulo)}</title>
  <meta name="description" content="{html.escape(descripcion)}">
  <link rel="canonical" href="{url}">
  <meta property="og:site_name" content="Josefine Auto">
  <meta property="og:title" content="{html.escape(titulo)}">
  <meta property="og:description" content="{html.escape(descripcion)}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{BASE}img/compartir.png">
  <meta property="og:locale" content="es_PA">
  <link rel="icon" href="{raiz}img/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="{raiz}img/icono-180.png">
  <meta name="theme-color" content="#ffffff">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{raiz}estilos.css">
{extra_head}</head>
<body>
  <header class="barra">
    <div class="contenedor barra__in">
      <a href="{raiz}" class="logo" aria-label="Josefine Auto, inicio"><img src="{raiz}img/logo-firma.svg" alt="Josefine Auto" width="116" height="82"></a>
      <nav class="menu" aria-label="Principal">
        <a href="{raiz}#inventario">Inventario</a>
        <a href="{raiz}#vende">Vende tu carro</a>
        <a href="{raiz}guias/">Guías</a>
      </nav>
      <a class="boton boton--chico" href="https://wa.me/{WA}?text={html.escape('Hola Josefine Auto, quiero información.')}" target="_blank" rel="noopener">WhatsApp</a>
    </div>
  </header>
  <main>
{cuerpo}
  </main>
  <footer class="pie">
    <div class="contenedor pie__in">
      <div>
        <a href="{raiz}" class="logo"><img src="{raiz}img/logo-firma-blanco.svg" alt="Josefine Auto" width="116" height="82"></a>
        <p>Deportivos y japoneses seleccionados · Ciudad de Panamá</p>
      </div>
      <div class="pie__enlaces">
        <a href="https://wa.me/{WA}" target="_blank" rel="noopener">WhatsApp</a>
        <a href="https://instagram.com/josefineauto" target="_blank" rel="noopener">Instagram</a>
        <a href="{raiz}guias/">Guías</a>
      </div>
      <p class="pie__legal">© 2026 Josefine Auto. Guías informativas; confirma requisitos vigentes con la ATTT y tu municipio.</p>
    </div>
  </footer>
</body>
</html>
"""


def cta():
    return f"""      <aside class="guia__cta">
        <h2>¿Buscas carro sin sorpresas?</h2>
        <p>Cada carro de Josefine Auto pasa papeles, prueba anti-inundación, escáner y taller antes de publicarse.</p>
        <div class="hero__acciones">
          <a class="boton" href="../#inventario">Ver inventario</a>
          <a class="boton boton--borde" href="https://wa.me/{WA}?text={html.escape('Hola Josefine Auto, leí su guía y quiero información.')}" target="_blank" rel="noopener">Escríbenos</a>
        </div>
      </aside>"""


guias = sorted((leer(f) for f in FUENTES.glob("*.md")), key=lambda g: g["fecha"], reverse=True)
(WEB / "guias").mkdir(exist_ok=True)
for g in guias:
    url = f"{BASE}guias/{g['slug']}.html"
    ld = {"@context": "https://schema.org", "@type": "Article", "headline": g["titulo"], "description": g["descripcion"],
          "datePublished": g["fecha"], "inLanguage": "es-PA", "image": BASE + "img/compartir.png",
          "author": {"@type": "Organization", "name": "Josefine Auto"},
          "publisher": {"@type": "Organization", "name": "Josefine Auto", "logo": {"@type": "ImageObject", "url": BASE + "img/logo-firma.png"}},
          "mainEntityOfPage": url}
    cuerpo = f"""    <article class="seccion guia">
      <div class="contenedor guia__in">
        <a class="guia__volver" href="./">← Todas las guías</a>
        <p class="etiqueta">Guía · {g['fecha']}</p>
        <h1>{inline(g['titulo'])}</h1>
        {FRANJA}
        <p class="guia__entrada">{inline(g['descripcion'])}</p>
        <div class="guia__texto">
{md(g['cuerpo'])}
        </div>
{cta()}
      </div>
    </article>"""
    extra = f'  <script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>\n'
    (WEB / "guias" / f"{g['slug']}.html").write_text(pagina(f"{g['titulo']} | Josefine Auto", g["descripcion"], url, cuerpo, extra_head=extra), encoding="utf-8")

tarjetas = "\n".join(
    f"""          <a class="paso guia__tarjeta" href="{g['slug']}.html"><span>{g['fecha']}</span><h3>{inline(g['titulo'])}</h3><p>{inline(g['descripcion'])}</p></a>"""
    for g in guias)
indice = f"""    <section class="seccion">
      <div class="contenedor">
        <div class="seccion__cab"><h1>Guías</h1>{FRANJA}<p class="seccion__sub">Lo que revisamos antes de comprar un carro, contado para que tú también lo puedas hacer.</p></div>
        <div class="rejilla">
{tarjetas}
        </div>
      </div>
    </section>"""
(WEB / "guias" / "index.html").write_text(pagina("Guías para comprar y vender carros en Panamá | Josefine Auto",
    "Guías prácticas para comprar un carro usado en Panamá sin sorpresas: papeles, inundación, inspección y cómo vender tu deportivo.",
    BASE + "guias/", indice), encoding="utf-8")

# Datos para la portada (últimas guías)
(WEB / "guias.js").write_text("window.GUIAS = " + json.dumps(
    [{"titulo": g["titulo"], "descripcion": g["descripcion"], "url": f"guias/{g['slug']}.html", "fecha": g["fecha"]} for g in guias],
    ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")

# 404
error = f"""    <section class="seccion">
      <div class="contenedor" style="display:grid;gap:18px;justify-items:center;text-align:center">
        <img src="/JosefineAuto/img/logo-firma.svg" alt="" width="220" height="155">
        <h1>Esta página no existe</h1>
        {FRANJA}
        <p class="seccion__sub">Puede que el carro ya se haya vendido o que el enlace esté mal escrito.</p>
        <div class="hero__acciones"><a class="boton" href="/JosefineAuto/#inventario">Ver inventario</a><a class="boton boton--borde" href="https://wa.me/{WA}" target="_blank" rel="noopener">Escríbenos</a></div>
      </div>
    </section>"""
(WEB / "404.html").write_text(pagina("Página no encontrada | Josefine Auto", "Esta página no existe.", BASE + "404.html", error, raiz="/JosefineAuto/"), encoding="utf-8")

# Sitemap
urls = [BASE, BASE + "guias/"] + [f"{BASE}guias/{g['slug']}.html" for g in guias]
(WEB / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    "".join(f"  <url><loc>{u}</loc></url>\n" for u in urls) + "</urlset>\n", encoding="utf-8")
print("Guías:", len(guias), "· sitemap:", len(urls), "URLs")
