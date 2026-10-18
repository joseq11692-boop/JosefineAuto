"""En la web pública se dice "auto", no "carro" (norma N16 del dueño, 2026-10-18).

Cambia "carro(s)" por "auto(s)" solo en el texto que se lee: no toca clases CSS (carro__foto),
ids (#carro-), rutas (img/carros/, guias/carro-inundado-panama.html), nombres de campos
ni código. Lo usa el guardián 11 de herramientas/check.py.
Uso: python3 herramientas/build/idioma_auto.py <archivos...>   (corrige en el sitio)
"""
import re
import sys
W=re.compile(r'(?<![\w/#\-.])(carro|Carro|CARRO)(s|S)?(?![\w/\-]|\.\w|__)')
def rep(m):
    w,s=m.group(1),m.group(2) or ''
    return {'carro':'auto','Carro':'Auto','CARRO':'AUTO'}[w]+('s' if s=='s' else 'S' if s=='S' else '')
def txt(t): return W.sub(rep,t)
ATTR=re.compile(r'((?:alt|title|content|placeholder|aria-label|data-wa)=)(["\'])(.*?)\2',re.S)
def html(s):
    out=[];pos=0
    for m in re.finditer(r'<script\b.*?</script>|<style\b.*?</style>|<[^>]+>',s,re.S):
        out.append(txt(s[pos:m.start()])); tag=m.group(0)
        if tag.startswith('<script'):
            # JSON-LD and inline scripts: only string literals
            tag=js(tag)
        elif not tag.startswith('<style'):
            tag=ATTR.sub(lambda a:a.group(1)+a.group(2)+txt(a.group(3))+a.group(2),tag)
        out.append(tag); pos=m.end()
    out.append(txt(s[pos:])); return ''.join(out)
STR=re.compile(r'"(?:\\.|[^"\\\n])*"|\'(?:\\.|[^\'\\\n])*\'|`(?:\\.|[^`\\])*`|//[^\n]*|/\*.*?\*/',re.S)
def skip(lit):
    b=lit[1:-1]
    return ('--' in b or '__' in b or re.fullmatch(r'[a-z]+',b) is not None)
def js(s):
    return STR.sub(lambda m: m.group(0) if (m.group(0).startswith(('//','/*')) or skip(m.group(0))) else txt(m.group(0)), s)
def convertir(f, s):
    return html(s) if f.endswith(".html") else js(s) if f.endswith(".js") else txt(s)


if __name__ == "__main__":
  for f in sys.argv[1:]:
    s=open(f).read()
    n = html(s) if f.endswith('.html') else js(s) if f.endswith('.js') else txt(s)
    if n!=s: open(f,'w').write(n); print('cambiado',f)
