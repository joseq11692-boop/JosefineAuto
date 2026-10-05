# Pendiente del dueño

Solo lo que únicamente puedes hacer tú (tu sesión, tu tarjeta, tu teléfono). Todo lo demás lo hace Claude.
Marca `[x]` cuando lo hagas (o dile "hecho" a Claude): la siguiente sesión lo lee al empezar.
Versión visual con botones: https://claude.ai/artifact/5RDfy3zfV5AY6sxEmkVG4P

## Ahora

- [ ] **DUENO-05 · Candado de seguridad (HTTPS) en josefineauto.com** · 2 min + esperar
  GitHub aún no creó el certificado porque el dominio se guardó antes que el DNS. Se arregla volviéndolo a guardar.
  GitHub no deja que Claude ni una tarea automática lo hagan (probado: error 403).
  1. Abre el enlace (cuenta **joseq11692-boop**).
  2. Junto a josefineauto.com toca **Remove**.
  3. Escribe otra vez `josefineauto.com` en **Custom domain** y toca **Save**.
  4. Espera a ver ✔ "DNS check successful" (unos minutos).
  5. Cuando se pueda (hasta 1 hora), marca **Enforce HTTPS**. Si no se deja, vuelve en 30 min.
  Enlace: https://github.com/joseq11692-boop/JosefineAuto/settings/pages

- [ ] **DUENO-06 · Poner el dominio nuevo en tu Instagram** · 1 min
  Instagram → Editar perfil → Enlaces → cambia el enlace por: https://josefineauto.com/
  Enlace: https://www.instagram.com/accounts/edit/

- [ ] **DUENO-07 · Pasar los datos de tu app al dominio nuevo** · 3 min · solo si ya guardaste carros en la app
  La app guarda todo en tu celular, atado a la dirección vieja. En josefineauto.com/panel arranca vacía.
  1. Pon el celular en **modo avión** y abre la app Josefine Gestión que tienes instalada.
  2. Ve a **Ajustes** → **Descargar copia** (se guarda en Archivos).
  3. Quita el modo avión. Abre https://josefineauto.com/panel/ → **Ajustes** → **Restaurar copia** → elige ese archivo.
  4. Instala la app nueva (Compartir → "Agregar a inicio") y borra la vieja.
  Enlace: https://josefineauto.com/panel/

## Esta semana

- [ ] **DUENO-03 · Datos del cliente del GLE 53 AMG Coupé** · 10 min con el cliente
  Llena la ficha y mándale a Claude una foto o los datos.
  Enlace: https://josefineauto.com/kit/ficha-consignacion.html

- [ ] **DUENO-04 · Reglas diamante en todos tus proyectos** · 2 min en tu computadora
  Claude solo puede escribir en este proyecto. Para que las reglas valgan en todos:
  1. En tu Mac abre la Terminal.
  2. Pega: `mkdir -p ~/.claude && open -e ~/.claude/CLAUDE.md` (si dice que no existe: `touch ~/.claude/CLAUDE.md` y repite).
  3. Copia dentro el bloque de `docs/reglas/CLAUDE-global.md` y guarda.
  Enlace: https://github.com/joseq11692-boop/JosefineAuto/blob/claude/vibrant-dijkstra-gm1tot/docs/reglas/CLAUDE-global.md

## Hecho

- [x] DUENO-01 y DUENO-02 · DNS de josefineauto.com creado por el dueño (2026-10-05).

- [x] Comprar josefineauto.com en Cloudflare (2026-10-05).
- [x] Activar GitHub Pages con "GitHub Actions".
