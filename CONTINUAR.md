# Continuar aquí

Para retomar el trabajo en una sesión nueva. Se actualiza al cerrar cada sesión.

## Estado (2026-10-05, noche)
- josefineauto.com: DNS creado por el dueño (4 A a 185.199.108-111.153 + CNAME www). Dominio puesto en GitHub Pages. Falta HTTPS (DUENO-05).
- Web pasada al dominio: canonical, og, JSON-LD, sitemap, robots, 404 y guías usan https://josefineauto.com/. Guardián de dominio en el gate.
- Desde esta máquina no se puede abrir josefineauto.com (allowlist de red): verificar por DNS (dns.google) y por la redirección de github.io.
- Reglas del dueño aplicadas (N06 en `docs/normas.md`).
- Cliente con Mercedes-AMG GLE 53 Coupé 2020–2021 a consignación: esperando ficha (DUENO-03).

## Siguiente paso
1. Leer `PENDIENTE-DUENO.md` y actuar según lo marcado.
2. Cuando HTTPS esté activo: confirmar que github.io redirige a https://josefineauto.com/.
3. Proponer al dueño quitar la rama "quitar dominio" de `.github/workflows/dominio.yml` (🔴): un fallo momentáneo de DNS quitaría el dominio una hora.

## Lecciones
- **gotcha_pages-token-403** (2026-10-05): el GITHUB_TOKEN de Actions puede LEER la configuración de Pages pero no cambiarla (PUT → 403 "Resource not accessible by integration", ejecución 37391234867). Dominio, certificado y Enforce HTTPS los cambia el dueño (DUENO-05). `dominio.yml` quedó como vigilante de solo lectura cada hora. El guardián del gate rechaza recursos por http://.
- **gotcha_certificado-sin-pedir** (2026-10-05): si el dominio se guarda en Pages antes de que exista el DNS, GitHub no pide el certificado: hay que quitarlo y volver a ponerlo con el DNS ya correcto.
- **patron_sellos-por-carro** (2026-10-05): la ficha de cada carro afirmaba "Papeles verificados / Prueba anti-inundación / Revisado en taller" en todos, sin comprobarlo. Causa: sellos fijos en `web/app.js`. Prevención: ahora solo salen si el carro trae `sellos` en `web/datos.js` (nada se afirma por defecto).
- **patron_cambio-de-origen** (2026-10-05): cambiar de dominio cambia el origen del navegador y la PWA pierde su localStorage. Causa: los datos de la app viven solo en el celular. Prevención: antes de cambiar de dominio, tarea de migración con copia de seguridad (DUENO-07); el guardián de dominio impide rutas viejas.
- **patron_dominio-antes-dns** (2026-10-05): poner el dominio propio en GitHub Pages antes de que el DNS apunte tumba la web, porque github.io redirige al dominio. Causa: las instrucciones permitían hacer el paso de GitHub antes de confirmar el DNS. Prevención: el workflow `dominio.yml` solo pone el dominio cuando el DNS ya apunta, y en la lista del dueño el paso de GitHub ya no se le pide.
- **gotcha_scraping-portales** (2026-10-04): Encuentra24, Marketplace, CarroCarros y Locanto bloquean la lectura automática (Cloudflare o login). No se fuerzan los captchas; los datos de mercado salen de agregadores públicos (Cari Autos) y los teléfonos se piden al dueño.
