/* Carrusel de venta: Mercedes-AMG GLE 53 Coupé (consignación). 7 láminas 1080x1350.
   Solo datos visibles en las fotos o dados por el dueño; precio fijado por el dueño del carro ($65,000, 2026-10-06).
   Uso: NODE_PATH=<node_modules con playwright> node herramientas/build/generar-post-gle53.js
   Salida: web/kit/img/post5-gle53-XX.png */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const RAIZ = path.resolve(__dirname, "../..");
const OUT = path.join(RAIZ, "web", "kit", "img");
const foto = (n) => "data:image/jpeg;base64," + fs.readFileSync(path.join(RAIZ, "web/img/carros/mercedes-amg-gle-53-coupe", `${String(n).padStart(2, "0")}.jpg`)).toString("base64");
const svg = (f) => "data:image/svg+xml;base64," + fs.readFileSync(path.join(RAIZ, "web/img", f)).toString("base64");
const FIRMA_B = svg("logo-firma-blanco.svg");

const CSS = `
*{box-sizing:border-box;margin:0}
body{width:1080px;height:1350px;font-family:Inter,sans-serif;overflow:hidden;background:#14161a;color:#fff}
.s{position:relative;width:1080px;height:1350px;overflow:hidden}
h1,h2{font-family:'Chakra Petch',sans-serif;font-weight:700;text-transform:uppercase;line-height:.98;letter-spacing:.01em}
h1{font-size:104px}h2{font-size:72px}
em{font-style:normal;color:#e11d2e}
.mono{font-family:'IBM Plex Mono',monospace;letter-spacing:.12em;text-transform:uppercase}
.f{display:grid;gap:9px;width:300px}.f span{display:block;height:7px;border-radius:7px}
.f span:nth-child(1){background:#3438b8;width:100%}.f span:nth-child(2){background:#fff;width:88%;margin-left:12%}
.f span:nth-child(3){background:#c8202b;width:62%;margin-left:30%}.f span:nth-child(4){background:#d9a62a;width:40%;margin-left:42%}
.top{position:absolute;top:60px;left:70px;right:70px;display:flex;justify-content:space-between;align-items:center;z-index:3}
.top img{height:92px}.top span{font-family:'IBM Plex Mono',monospace;font-size:26px;letter-spacing:.1em;opacity:.85}
.pie{position:absolute;bottom:56px;left:70px;right:70px;display:flex;justify-content:space-between;font-family:'IBM Plex Mono',monospace;font-size:26px;letter-spacing:.08em;opacity:.85;z-index:3}
.bg{position:absolute;inset:0;background-size:cover;background-position:center}
.velo{position:absolute;inset:0;background:linear-gradient(180deg,rgba(20,22,26,.7) 0%,rgba(20,22,26,0) 22%,rgba(20,22,26,0) 48%,rgba(20,22,26,.92) 74%,#14161a 100%);z-index:1}
.txt{position:absolute;left:70px;right:70px;bottom:130px;z-index:2;display:grid;gap:22px}
.tag{justify-self:start;background:#e11d2e;color:#fff;font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:34px;letter-spacing:.08em;padding:10px 26px;border-radius:14px;text-transform:uppercase}
.chips{display:flex;flex-wrap:wrap;gap:12px}
.chips span{font-family:'IBM Plex Mono',monospace;font-size:28px;border:2px solid rgba(255,255,255,.7);border-radius:99px;padding:9px 24px;background:rgba(20,22,26,.35)}
.dos{position:absolute;left:0;right:0;top:0;height:1000px;display:grid;grid-template-columns:1fr 1fr;gap:8px}
.dos div{background-size:cover;background-position:center}
.ancha{position:absolute;left:0;right:0;top:170px;height:610px;background-size:cover;background-position:center}
.cta{background:#e11d2e}
.cta .f span:nth-child(3){background:#14161a}.cta em{color:#14161a}
.cta .txt{bottom:auto;top:260px;gap:34px}
.comenta{justify-self:start;background:#fff;color:#14161a;font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:120px;padding:4px 44px;border-radius:24px;letter-spacing:.04em}
.cta p{font-size:44px;line-height:1.3}
.lista{display:grid;gap:16px;font-size:38px;font-weight:600}
`;
const top = (n) => `<div class="top"><img src="${FIRMA_B}"><span>${n}</span></div>`;
const pie = `<div class="pie"><span>@josefineauto</span><span>JOSEFINEAUTO.COM</span></div>`;
const F = `<div class="f"><span></span><span></span><span></span><span></span></div>`;
const T = 7;

const LAMINAS = [
  `<div class="s"><div class="bg" style="background-image:url('${foto(1)}');background-position:center 62%"></div><div class="velo"></div>${top(`1/${T}`)}
    <div class="txt"><span class="tag">En venta · $65,000</span><h1>Mercedes-AMG<br><em>GLE 53</em> Coupé</h1>${F}
    <div class="chips"><span>2021</span><span>56,000 km</span><span>Automático</span><span>Blanco</span></div></div>${pie}</div>`,
  `<div class="s"><div class="ancha" style="background-image:url('${foto(3)}')"></div>${top(`2/${T}`)}
    <div class="txt"><h2>Silueta<br><em>coupé</em></h2>${F}<div class="chips"><span>Parrilla AMG Panamericana</span><span>Estribos laterales</span><span>Faros LED</span></div></div>${pie}</div>`,
  `<div class="s"><div class="dos"><div style="background-image:url('${foto(4)}')"></div><div style="background-image:url('${foto(5)}')"></div></div><div class="velo"></div>${top(`3/${T}`)}
    <div class="txt"><h2>Detrás,<br><em>pura AMG</em></h2><div class="chips"><span>4 salidas de escape</span><span>Alerón forrado en negro</span></div></div>${pie}</div>`,
  `<div class="s"><div class="dos"><div style="background-image:url('${foto(6)}')"></div><div style="background-image:url('${foto(7)}')"></div></div><div class="velo"></div>${top(`4/${T}`)}
    <div class="txt"><h2>Cabina<br><em>AMG</em></h2><div class="chips"><span>Volante AMG en Alcantara</span><span>Interior negro</span><span>Pedales deportivos</span></div></div>${pie}</div>`,
  `<div class="s"><div class="dos"><div style="background-image:url('${foto(8)}')"></div><div style="background-image:url('${foto(9)}')"></div></div><div class="velo"></div>${top(`5/${T}`)}
    <div class="txt"><h2>Rines AMG<br><em>22"</em></h2><div class="chips"><span>Michelin nuevas</span><span>Cálipers pintados en rojo</span></div></div>${pie}</div>`,
  `<div class="s"><div class="bg" style="background-image:url('${foto(2)}');background-position:center 40%"></div><div class="velo"></div>${top(`6/${T}`)}
    <div class="txt"><h2>Lo que<br><em>trae</em></h2>${F}<div class="chips"><span>XPEL PPF en todo el carro</span><span>Michelin nuevas</span><span>Importado de USA</span><span>Sin choques</span><span>Libre para traspaso</span><span>Gasolina 95</span></div></div>${pie}</div>`,
  `<div class="s cta">${top(`7/${T}`)}<div class="txt"><h2>¿Te interesa<br>el GLE 53?</h2>${F}<p>Comenta</p><span class="comenta">GLE</span>
    <div class="lista"><span>💵 $65,000 negociable</span><span>📲 WhatsApp 6698-9569</span></div></div>${pie}</div>`,
];

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, ignoreHTTPSErrors: true });
  const base = `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Inter:wght@400;600&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet"><style>${CSS}</style></head><body>`;
  for (let i = 0; i < LAMINAS.length; i++) {
    await p.setContent(base + LAMINAS[i] + "</body></html>", { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(OUT, `post5-gle53-${String(i + 1).padStart(2, "0")}.png`) });
  }
  await b.close();
  console.log("Láminas:", LAMINAS.length);
})();
