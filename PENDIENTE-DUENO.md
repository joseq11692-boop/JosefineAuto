# Pendiente del dueño

Solo lo que únicamente puedes hacer tú (tu sesión, tu tarjeta, tu teléfono). Todo lo demás lo hace Claude.
Marca `[x]` cuando lo hagas (o dile "hecho" a Claude): la siguiente sesión lo lee al empezar.
Versión visual con botones: https://claude.ai/artifact/5RDfy3zfV5AY6sxEmkVG4P

## Ahora

- [ ] **DUENO-11 · Crear el correo hola@josefineauto.com (gratis, llega a tu Gmail)** · 5 min
  1. Abre el enlace (tu cuenta de Cloudflare) → **Onboard Domain** → elige **josefineauto.com** → **Done**. (Solo añade registros de correo; la web no se toca.)
  2. Pestaña **Destination Addresses**: escribe tu Gmail y envíalo. Abre tu Gmail y toca **Verify email address**.
  3. Vuelve, toca **josefineauto.com** → pestaña **Routing Rules** → **Create routing rule**:
     Email pattern `hola` · Action **Send to an email** · Destination tu Gmail → **Save**.
  4. Dile "correo listo" a Claude: comprueba que funciona.
  Enlace: https://dash.cloudflare.com/?to=/:account/email-service/routing
  Guía oficial: https://developers.cloudflare.com/email-service/get-started/route-emails/

- [ ] **DUENO-12 · Abrir la cuenta de TikTok @josefineauto** · 5 min · después de DUENO-11
  1. Descarga TikTok y toca **Registrarte** → **Usar correo** → `hola@josefineauto.com`. El código te llega a tu Gmail.
  2. Usuario: `josefineauto`. Nombre: `Josefine Auto`.
  3. Foto de perfil: guárdala desde el enlace de abajo.
  4. Biografía (cópiala): `Carros seleccionados en Panamá 🇵🇦 Compra, venta y car culture 🏁`
  5. Ajustes → Cuenta → **Cambiar a cuenta de empresa** (categoría Automotriz). Si te deja, en **Sitio web** pon `josefineauto.com`.
  Foto: https://josefineauto.com/kit/img/perfil-tiktok.png
- [ ] **DUENO-07 · Pasar los datos de tu app al dominio nuevo** · 3 min · solo si ya guardaste carros en la app
  La app guarda todo en tu celular, atado a la dirección vieja. En josefineauto.com/panel arranca vacía.
  1. Pon el celular en **modo avión** y abre la app Josefine Gestión que tienes instalada.
  2. Ve a **Ajustes** → **Descargar copia** (se guarda en Archivos).
  3. Quita el modo avión. Abre https://josefineauto.com/panel/ → **Ajustes** → **Restaurar copia** → elige ese archivo.
  4. Instala la app nueva (Compartir → "Agregar a inicio") y borra la vieja.
  Enlace: https://josefineauto.com/panel/

## Esta semana

- [ ] **DUENO-03 · Firmar la consignación del GLE 53 con el cliente** · 15 min
  En la web y el kit con "Precio por DM" (el mínimo del cliente lo tienes tú, no se escribe aquí: el repo es público). Antes de mostrarlo a compradores:
  1. Firmen el contrato de consignación (3 %, mínimo $1.500; la comisión sale del precio de venta).
  2. Pide al cliente el **VIN** y mándaselo a Claude. Claude hace gratis la consulta de robo/pérdida total (NICB VINCheck). El historial completo de USA (Carfax) tiene costo: solo si tú lo decides.
  Enlace: https://josefineauto.com/kit/ficha-consignacion.html

- [ ] **DUENO-08 · Publicar el carrusel del GLE 53 en Instagram** · 5 min
  En el kit: guarda las 7 imágenes en orden, toca "Copiar texto" y publícalo como carrusel. Fija el post en tu perfil.
  Enlace: https://josefineauto.com/kit/

- [ ] **DUENO-04 · Reglas diamante en todos tus proyectos** · 2 min en tu computadora
  Claude solo puede escribir en este proyecto. Para que las reglas valgan en todos:
  1. En tu Mac abre la Terminal.
  2. Pega: `mkdir -p ~/.claude && open -e ~/.claude/CLAUDE.md` (si dice que no existe: `touch ~/.claude/CLAUDE.md` y repite).
  3. Copia dentro el bloque de `docs/reglas/CLAUDE-global.md` y guarda.
  Enlace: https://github.com/joseq11692-boop/JosefineAuto/blob/claude/vibrant-dijkstra-gm1tot/docs/reglas/CLAUDE-global.md

## Hecho

- [x] DUENO-06 · josefineauto.com puesto en el perfil de @josefineauto (2026-10-14). El dueño mantiene su Instagram personal separado "por ahora".
- [x] DUENO-09 · Llave de Cloudflare "Edit zone DNS" borrada por el dueño (2026-10-14). Queda "josefineauto build token" (de Cloudflare, no tocar).
- [x] DUENO-10 · Contador de visitas de Cloudflare activado (2026-10-14). Las visitas se ven en https://dash.cloudflare.com/?to=/:account/web-analytics
- [x] DUENO-05 · Enforce HTTPS marcado (2026-10-13). Verificado: monitor `dominio.yml` ejecución 38348672493 → "certificado: approved · HTTPS forzado: true".
- [x] DUENO-01 y DUENO-02 · DNS de josefineauto.com creado por el dueño (2026-10-05).

- [x] Comprar josefineauto.com en Cloudflare (2026-10-05).
- [x] Activar GitHub Pages con "GitHub Actions".
