# Continuar aquí

Para retomar el trabajo en una sesión nueva. Se actualiza al cerrar cada sesión.

## Estado (2026-10-05)
- **Web caída**: redirige a josefineauto.com, que aún no tiene DNS. Arreglo inmediato: DUENO-01 en `PENDIENTE-DUENO.md` (botón Remove en GitHub Pages).
- Dominio josefineauto.com comprado en Cloudflare (NS de Cloudflare, sin registros). Falta DNS: DUENO-02 (token) o que el dueño cree los 5 registros.
- Workflow `.github/workflows/dominio.yml` subido; su primera ejecución quedó en cola sin arrancar (comprobar en Actions).
- Reglas del dueño aplicadas al proyecto (N06 en `docs/normas.md`).
- Cliente con Mercedes-AMG GLE 53 Coupé 2020–2021 a consignación: esperando ficha (DUENO-03).

## Siguiente paso
1. Leer `PENDIENTE-DUENO.md` y actuar según lo marcado.
2. Cuando josefineauto.com resuelva a 185.199.108-111.153: cambiar en `web/` las rutas absolutas `/JosefineAuto/` (están en `web/404.html` y lo genera `herramientas/build/generar-guias.py`) y las URLs canónicas, sitemap, JSON-LD, kit y app al dominio nuevo.

## Lecciones
- **patron_dominio-antes-dns** (2026-10-05): poner el dominio propio en GitHub Pages antes de que el DNS apunte tumba la web, porque github.io redirige al dominio. Causa: las instrucciones permitían hacer el paso de GitHub antes de confirmar el DNS. Prevención: el workflow `dominio.yml` solo pone el dominio cuando el DNS ya apunta, y en la lista del dueño el paso de GitHub ya no se le pide.
- **gotcha_scraping-portales** (2026-10-04): Encuentra24, Marketplace, CarroCarros y Locanto bloquean la lectura automática (Cloudflare o login). No se fuerzan los captchas; los datos de mercado salen de agregadores públicos (Cari Autos) y los teléfonos se piden al dueño.
