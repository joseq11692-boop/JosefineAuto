# Pendiente del dueño

Solo lo que únicamente puedes hacer tú (tu sesión, tu tarjeta, tu teléfono). Todo lo demás lo hace Claude.
Marca `[x]` cuando lo hagas (o dile "hecho" a Claude): la siguiente sesión lo lee al empezar.
Versión visual con botones: https://claude.ai/artifact/5RDfy3zfV5AY6sxEmkVG4P

## 🔥 Urgente

- [ ] **DUENO-01 · Volver a poner la web en línea** · 30 segundos
  La web redirige a josefineauto.com y ese dominio aún no tiene DNS, así que no abre.
  1. Abre el enlace (entra con la cuenta **joseq11692-boop**).
  2. Junto a `josefineauto.com` toca el botón rojo **Remove**.
  3. Listo: la web vuelve a abrir en la dirección de siempre.
  Enlace: https://github.com/joseq11692-boop/JosefineAuto/settings/pages

## Esta semana

- [ ] **DUENO-02 · Permiso de DNS para que Claude conecte josefineauto.com** · 2 min
  Cloudflare solo deja crear este permiso con tu sesión. Con él, Claude crea el DNS, comprueba y conecta el dominio solo.
  1. Abre el enlace → **Create Token**.
  2. En **Edit zone DNS** toca **Use template**.
  3. **Zone Resources** → **Specific zone** → **josefineauto.com**.
  4. **Continue to summary** → **Create Token** → **Copy**, y pégalo en el chat.
  Enlace: https://dash.cloudflare.com/profile/api-tokens
  ⚠️ No vuelvas a escribir el dominio en GitHub: lo hará el workflow `dominio.yml` cuando el DNS esté listo.

- [ ] **DUENO-03 · Datos del cliente del GLE 53 AMG Coupé** · 10 min con el cliente
  Llena la ficha y mándale a Claude una foto o los datos.
  Enlace: https://joseq11692-boop.github.io/JosefineAuto/kit/ficha-consignacion.html

- [ ] **DUENO-04 · Reglas diamante en todos tus proyectos** · 2 min en tu computadora
  Claude solo puede escribir en este proyecto. Para que las reglas valgan en todos:
  1. En tu Mac abre la Terminal.
  2. Pega: `mkdir -p ~/.claude && open -e ~/.claude/CLAUDE.md` (si dice que no existe: `touch ~/.claude/CLAUDE.md` y repite).
  3. Copia dentro el bloque de `docs/reglas/CLAUDE-global.md` y guarda.
  Enlace: https://github.com/joseq11692-boop/JosefineAuto/blob/claude/vibrant-dijkstra-gm1tot/docs/reglas/CLAUDE-global.md

## Hecho

- [x] Comprar josefineauto.com en Cloudflare (2026-10-05).
- [x] Activar GitHub Pages con "GitHub Actions".
