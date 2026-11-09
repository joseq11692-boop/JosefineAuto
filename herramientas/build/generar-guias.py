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
BASE = "https://josefineauto.com/"
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


# Textos de la plantilla por idioma. Las guías en inglés están en herramientas/guias/en/ (mismo nombre de archivo)
# y se publican en web/en/guias/. Al añadir una guía en español, añade su traducción (el gate lo exige).
T = {
    "es": dict(lang="es", locale="es_PA", inlang="es-PA", carpeta="guias/", inicio="", otro="en", otro_txt="EN", otro_aria="View in English",
               menu=[("#inventario", "Inventario"), ("#vende", "Vende tu auto")],
               movil=[("#inventario", "Inventario"), ("#vendidos", "Vendidos"), ("#consigue", "Te lo conseguimos"), ("#vende", "Vende tu auto"),
                      ("#metodo", "Cómo trabajamos"), ("#referidos", "Referidos"), ("#proyectos", "Proyectos")],
               guias="Guías", wa="Hola Josefine Auto, quiero información.", logo_aria="Josefine Auto, inicio", nav="Principal", secciones="Secciones",
               pie="Deportivos y japoneses seleccionados · Ciudad de Panamá",
               legal="© 2026 Josefine Auto. Guías informativas; confirma requisitos vigentes con la ATTT y tu municipio.",
               cta_t="¿Buscas auto sin sorpresas?", cta_p="Cada auto de Josefine Auto pasa papeles, prueba anti-inundación, escáner y taller antes de publicarse.",
               cta_inv="Ver inventario", cta_wa_txt="Escríbenos", cta_wa="Hola Josefine Auto, leí su guía y quiero información.",
               volver="← Todas las guías", etiqueta="Guía",
               idx_t="Guías para comprar y vender autos en Panamá | Josefine Auto",
               idx_d="Guías prácticas para comprar un auto usado en Panamá sin sorpresas: papeles, inundación, inspección y cómo vender tu deportivo.",
               idx_sub="Lo que revisamos antes de comprar un auto, contado para que tú también lo puedas hacer."),
    "en": dict(lang="en", locale="en_US", inlang="en", carpeta="en/guias/", inicio="en/", otro="es", otro_txt="ES", otro_aria="Ver en español",
               menu=[("#inventario", "Inventory"), ("#vende", "Sell your car")],
               movil=[("#inventario", "Inventory"), ("#vendidos", "Sold"), ("#consigue", "We find it for you"), ("#vende", "Sell your car"),
                      ("#metodo", "How we work"), ("#referidos", "Referrals"), ("#proyectos", "Projects")],
               guias="Guides", wa="Hi Josefine Auto, I'd like some information.", logo_aria="Josefine Auto, home", nav="Main", secciones="Sections",
               pie="Hand-picked sports and Japanese cars · Panama City",
               legal="© 2026 Josefine Auto. Informational guides; confirm current requirements with the ATTT and your municipality.",
               cta_t="Looking for a car with no surprises?", cta_p="Every Josefine Auto car goes through a paperwork check, flood check, scanner and shop inspection before it's listed.",
               cta_inv="See inventory", cta_wa_txt="Message us", cta_wa="Hi Josefine Auto, I read your guide and I'd like some information.",
               volver="← All guides", etiqueta="Guide",
               idx_t="Guides to buying and selling cars in Panama | Josefine Auto",
               idx_d="Practical guides to buying a used car in Panama with no surprises: paperwork, floods, inspection and how to sell your sports car.",
               idx_sub="What we check before buying a car, explained so you can do it too."),
}


def pagina(titulo, descripcion, url, cuerpo, raiz="../", extra_head="", idioma="es", alterna=None):
    t = T[idioma]
    inicio = raiz + t["inicio"]
    otro = alterna or (raiz + T[t["otro"]]["inicio"])
    menu = "\n".join(f'        <a href="{inicio}{h}">{n}</a>' for h, n in t["menu"])
    movil = "\n".join(f'      <a href="{inicio}{h}">{n}</a>' for h, n in t["movil"])
    return f"""<!doctype html>
<html lang="{t['lang']}">
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
  <meta property="og:locale" content="{t['locale']}">
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
      <a href="{inicio}" class="logo" aria-label="{t['logo_aria']}"><img src="{raiz}img/logo-firma.svg" alt="Josefine Auto" width="116" height="82"></a>
      <nav class="menu" aria-label="{t['nav']}">
{menu}
        <a href="{raiz}{t['carpeta']}">{t['guias']}</a>
      </nav>
      <div class="barra__acciones">
        <a class="idioma" href="{otro}" hreflang="{t['otro']}" lang="{t['otro']}" aria-label="{t['otro_aria']}">{t['otro_txt']}</a>
        <a class="boton boton--chico" href="https://wa.me/{WA}?text={html.escape(t['wa'])}" target="_blank" rel="noopener">WhatsApp</a>
      </div>
    </div>
    <nav class="menu-movil" aria-label="{t['secciones']}">
{movil}
      <a href="{raiz}{t['carpeta']}">{t['guias']}</a>
    </nav>
  </header>
  <main>
{cuerpo}
  </main>
  <footer class="pie">
    <div class="contenedor pie__in">
      <div>
        <a href="{inicio}" class="logo"><img src="{raiz}img/logo-firma-blanco.svg" alt="Josefine Auto" width="116" height="82"></a>
        <p>{t['pie']}</p>
      </div>
      <div class="pie__enlaces">
        <a href="https://wa.me/{WA}" target="_blank" rel="noopener">WhatsApp</a>
        <a href="https://instagram.com/josefineauto" target="_blank" rel="noopener">Instagram</a>
        <a href="{raiz}{t['carpeta']}">{t['guias']}</a>
      </div>
      <p class="pie__legal">{t['legal']}</p>
    </div>
  </footer>
  <!-- Cloudflare Web Analytics --><script type='module' src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{{"token": "ce12b2c5f1284fa1a7534bff02f331ad"}}'></script><!-- End Cloudflare Web Analytics -->
</body>
</html>
"""


def cta(t, inicio):
    return f"""      <aside class="guia__cta">
        <h2>{t['cta_t']}</h2>
        <p>{t['cta_p']}</p>
        <div class="hero__acciones">
          <a class="boton" href="{inicio}#inventario">{t['cta_inv']}</a>
          <a class="boton boton--borde" href="https://wa.me/{WA}?text={html.escape(t['cta_wa'])}" target="_blank" rel="noopener">{t['cta_wa_txt']}</a>
        </div>
      </aside>"""


def alternas(ruta):
    return (f'  <link rel="alternate" hreflang="es" href="{BASE}guias/{ruta}">\n'
            f'  <link rel="alternate" hreflang="en" href="{BASE}en/guias/{ruta}">\n'
            f'  <link rel="alternate" hreflang="x-default" href="{BASE}guias/{ruta}">\n')


def construir(idioma, fuentes, destino, raiz):
    t = T[idioma]
    guias = sorted((leer(f) for f in fuentes.glob("*.md")), key=lambda g: g["fecha"], reverse=True)
    destino.mkdir(parents=True, exist_ok=True)
    otro_dir = "../en/guias/" if idioma == "es" else "../../guias/"
    for g in guias:
        url = f"{BASE}{t['carpeta']}{g['slug']}.html"
        ld = {"@context": "https://schema.org", "@type": "Article", "headline": g["titulo"], "description": g["descripcion"],
              "datePublished": g["fecha"], "inLanguage": t["inlang"], "image": BASE + "img/compartir.png",
              "author": {"@type": "Organization", "name": "Josefine Auto"},
              "publisher": {"@type": "Organization", "name": "Josefine Auto", "logo": {"@type": "ImageObject", "url": BASE + "img/logo-firma.png"}},
              "mainEntityOfPage": url}
        cuerpo = f"""    <article class="seccion guia">
      <div class="contenedor guia__in">
        <a class="guia__volver" href="./">{t['volver']}</a>
        <p class="etiqueta">{t['etiqueta']} · {g['fecha']}</p>
        <h1>{inline(g['titulo'])}</h1>
        {FRANJA}
        <p class="guia__entrada">{inline(g['descripcion'])}</p>
        <div class="guia__texto">
{md(g['cuerpo'])}
        </div>
{cta(t, raiz + t['inicio'])}
      </div>
    </article>"""
        extra = alternas(f"{g['slug']}.html") + f'  <script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>\n'
        (destino / f"{g['slug']}.html").write_text(pagina(f"{g['titulo']} | Josefine Auto", g["descripcion"], url, cuerpo, raiz=raiz,
            extra_head=extra, idioma=idioma, alterna=f"{otro_dir}{g['slug']}.html"), encoding="utf-8")
    tarjetas = "\n".join(
        f"""          <a class="paso guia__tarjeta" href="{g['slug']}.html"><span>{g['fecha']}</span><h3>{inline(g['titulo'])}</h3><p>{inline(g['descripcion'])}</p></a>"""
        for g in guias)
    indice = f"""    <section class="seccion">
      <div class="contenedor">
        <div class="seccion__cab"><h1>{t['guias']}</h1>{FRANJA}<p class="seccion__sub">{t['idx_sub']}</p></div>
        <div class="rejilla">
{tarjetas}
        </div>
      </div>
    </section>"""
    (destino / "index.html").write_text(pagina(t["idx_t"], t["idx_d"], BASE + t["carpeta"], indice, raiz=raiz,
        extra_head=alternas(""), idioma=idioma, alterna=otro_dir), encoding="utf-8")
    return guias


guias = construir("es", FUENTES, WEB / "guias", "../")
guias_en = construir("en", FUENTES / "en", WEB / "en" / "guias", "../../")

# Datos para la portada (últimas guías)
(WEB / "guias.js").write_text("window.GUIAS = " + json.dumps(
    [{"titulo": g["titulo"], "descripcion": g["descripcion"], "url": f"guias/{g['slug']}.html", "fecha": g["fecha"]} for g in guias],
    ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")
(WEB / "en" / "guias-en.js").write_text("window.GUIAS_EN = " + json.dumps(
    [{"titulo": g["titulo"], "descripcion": g["descripcion"], "url": f"en/guias/{g['slug']}.html", "fecha": g["fecha"]} for g in guias_en],
    ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")

# 404
error = f"""    <section class="seccion">
      <div class="contenedor" style="display:grid;gap:18px;justify-items:center;text-align:center">
        <img src="/img/logo-firma.svg" alt="" width="220" height="155">
        <h1>Esta página no existe</h1>
        {FRANJA}
        <p class="seccion__sub">Puede que el auto ya se haya vendido o que el enlace esté mal escrito.</p>
        <div class="hero__acciones"><a class="boton" href="/#inventario">Ver inventario</a><a class="boton boton--borde" href="https://wa.me/{WA}" target="_blank" rel="noopener">Escríbenos</a></div>
      </div>
    </section>"""
(WEB / "404.html").write_text(pagina("Página no encontrada | Josefine Auto", "Esta página no existe.", BASE + "404.html", error, raiz="/"), encoding="utf-8")

# Sitemap
urls = [BASE, BASE + "en/", BASE + "guias/", BASE + "en/guias/"] + [f"{BASE}guias/{g['slug']}.html" for g in guias] + [f"{BASE}en/guias/{g['slug']}.html" for g in guias_en]
(WEB / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    "".join(f"  <url><loc>{u}</loc></url>\n" for u in urls) + "</urlset>\n", encoding="utf-8")
print("Guías:", len(guias), "· sitemap:", len(urls), "URLs")
