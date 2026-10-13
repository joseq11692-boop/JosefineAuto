/* Post de agradecimiento: 100 seguidores en @josefineauto (dato dado por el dueño, 2026-10-13). Feed 1080x1350 + historia 1080x1920.
   Fondo (pedido del dueño): carros de sus historias de racing y car spotting. Racing: fotos que mandó el dueño
   (placa tapada con la de Josefine) en herramientas/build/fotos-post-100/ + proyectos; car spotting: web/img/escena/.
   Uso: NODE_PATH=<node_modules con playwright> node herramientas/build/generar-post-100.js [chakra-petch-700.ttf]
   (el .ttf opcional se incrusta si Google Fonts no carga)
   Salida: web/kit/img/post6-100-01.png (feed) y web/kit/img/post6-100-historia.png (historia) */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const RAIZ = path.resolve(__dirname, "../..");
const OUT = path.join(RAIZ, "web", "kit", "img");
const FONDOS = [ // racing y los más llamativos en las columnas laterales; el centro queda tapado por el texto
  "herramientas/build/fotos-post-100/integra-type-r.jpg", "web/img/escena/lexus-santa-maria/02.jpg", "herramientas/build/fotos-post-100/bmw-m3.jpg",
  "web/img/proyectos/lancer-evo-vi-gsr-1999.jpg", "web/img/escena/lexus-santa-maria/04.jpg", "herramientas/build/fotos-post-100/civic-si.jpg",
  "web/img/escena/the-collection-mexico/02.jpg", "web/img/escena/lexus-santa-maria/03.jpg", "web/img/escena/the-collection-mexico/03.jpg",
  "web/img/escena/jetour-g700/02.jpg", "web/img/escena/the-collection-mexico/01.jpg", "web/img/escena/the-collection-mexico/04.jpg",
];
const foto = (f) => "data:image/jpeg;base64," + fs.readFileSync(path.join(RAIZ, f)).toString("base64");
const FIRMA_B = "data:image/svg+xml;base64," + fs.readFileSync(path.join(RAIZ, "web/img/logo-firma-blanco.svg")).toString("base64");

const TTF = process.argv[2] ? `@font-face{font-family:'Chakra Petch';font-weight:700;src:url(data:font/ttf;base64,${fs.readFileSync(process.argv[2]).toString("base64")})}` : "";
const CSS = TTF + `
*{box-sizing:border-box;margin:0}
body{width:1080px;height:100vh;font-family:Inter,sans-serif;overflow:hidden;background:#14161a;color:#fff}
.s{position:relative;width:1080px;height:100vh;overflow:hidden}
.historia .top{top:230px}.historia .pie{bottom:270px}.historia .centro{gap:14px}
.mosaico{position:absolute;inset:0;display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:1fr;gap:6px;filter:grayscale(.35) brightness(.55)}
.mosaico div{background-size:cover;background-position:center}
.velo{position:absolute;inset:0;background:radial-gradient(ellipse 70% 52% at 50% 50%,rgba(20,22,26,.94) 0%,rgba(20,22,26,.82) 55%,rgba(20,22,26,.35) 100%)}
.top{position:absolute;top:60px;left:70px;right:70px;display:flex;justify-content:center;z-index:3}
.top img{height:104px}
.centro{position:absolute;inset:0;display:grid;place-content:center;justify-items:center;text-align:center;gap:6px;z-index:2}
.gracias{font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:64px;letter-spacing:.24em;text-transform:uppercase;margin-left:.24em}
.cien{font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:400px;line-height:.82;color:#e11d2e;letter-spacing:-.02em}
.seg{font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:62px;letter-spacing:.1em;text-transform:uppercase}
.f{display:grid;gap:10px;width:380px;margin:26px 0 30px}.f span{display:block;height:9px;border-radius:9px}
.f span:nth-child(1){background:#3438b8}.f span:nth-child(2){background:#fff;width:88%;margin-left:12%}
.f span:nth-child(3){background:#c8202b;width:62%;margin-left:30%}.f span:nth-child(4){background:#d9a62a;width:40%;margin-left:42%}
.msg{font-size:38px;line-height:1.35;max-width:780px;font-weight:600}
.msg em{font-style:normal;color:#e11d2e}
.pie{position:absolute;bottom:56px;left:70px;right:70px;display:flex;justify-content:space-between;font-family:'IBM Plex Mono',monospace;font-size:26px;letter-spacing:.08em;opacity:.9;z-index:3}
`;
const html = (clase) => `<div class="s ${clase}"><div class="mosaico">${FONDOS.map((c) => `<div style="background-image:url('${foto(c)}')"></div>`).join("")}</div><div class="velo"></div>
<div class="top"><img src="${FIRMA_B}"></div>
<div class="centro"><div class="gracias">¡Gracias!</div><div class="cien">100</div><div class="seg">seguidores</div>
<div class="f"><span></span><span></span><span></span><span></span></div>
<p class="msg">Gracias por cada like,<br>cada comentario y cada DM.<br>Esto apenas <em>arranca</em>. 🏁</p></div>
<div class="pie"><span>@josefineauto</span><span>JOSEFINEAUTO.COM</span></div></div>`;

(async () => {
  const b = await chromium.launch();
  for (const [alto, clase, nombre] of [[1350, "", "post6-100-01.png"], [1920, "historia", "post6-100-historia.png"]]) {
    const p = await b.newPage({ viewport: { width: 1080, height: alto }, ignoreHTTPSErrors: true });
    await p.setContent(`<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Inter:wght@400;600&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet"><style>${CSS}</style></head><body>${html(clase)}</body></html>`, { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(OUT, nombre) });
    console.log("Lista:", nombre, `1080x${alto}`, "· fotos en el mosaico:", FONDOS.length);
  }
  await b.close();
})();
