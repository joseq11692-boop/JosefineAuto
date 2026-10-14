/* Carrusel de venta: BMW X3 xDrive28i M Sport 2014 (xDrive28i dado por el dueño). 7 láminas 1080x1350.
   Solo datos dados por el dueño (modelo y año, 2026-10-14) o visibles en las fotos (km del tablero, insignias M Sport,
   levas, doble escape, motor TwinPower Turbo); placa real tapada con la de Josefine; precio solo por DM.
   Uso: NODE_PATH=<node_modules con playwright> node herramientas/build/generar-post-x3.js [chakra-petch-700.ttf]
   Salida: web/kit/img/post7-x3-XX.png */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const RAIZ = path.resolve(__dirname, "../..");
const OUT = path.join(RAIZ, "web", "kit", "img");
const foto = (n) => "data:image/jpeg;base64," + fs.readFileSync(path.join(RAIZ, "web/img/carros/bmw-x3-m-sport-2014", `${String(n).padStart(2, "0")}.jpg`)).toString("base64");
const svg = (f) => "data:image/svg+xml;base64," + fs.readFileSync(path.join(RAIZ, "web/img", f)).toString("base64");
const FIRMA_B = svg("logo-firma-blanco.svg");

const TTF = process.argv[2] ? `@font-face{font-family:'Chakra Petch';font-weight:700;src:url(data:font/ttf;base64,${fs.readFileSync(process.argv[2]).toString("base64")})}` : "";
const CSS = TTF + `
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
.ancha{position:absolute;left:0;right:0;top:290px;height:608px;background-size:cover;background-position:center}
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
  `<div class="s"><div class="bg" style="background-image:url('${foto(1)}');background-position:center 70%"></div><div class="velo"></div>${top(`1/${T}`)}
    <div class="txt"><span class="tag">En venta</span><h1>BMW X3 <span style="text-transform:none">xDrive28i</span><br><em>M Sport</em></h1>${F}
    <div class="chips"><span>2014</span><span>150,590 km</span><span>Automática</span><span>Negro</span></div></div>${pie}</div>`,
  `<div class="s"><div class="bg" style="background-image:url('${foto(2)}');background-position:center 70%"></div><div class="velo"></div>${top(`2/${T}`)}
    <div class="txt"><div class="chips"><span>Paquete M Sport</span><span>Rines oscuros</span></div></div>${pie}</div>`,
  `<div class="s"><div class="dos"><div style="background-image:url('${foto(3)}')"></div><div style="background-image:url('${foto(4)}')"></div></div><div class="velo"></div>${top(`3/${T}`)}
    <div class="txt"><div class="chips"><span>Doble salida de escape</span></div></div>${pie}</div>`,
  `<div class="s"><div class="dos"><div style="background-image:url('${foto(6)}')"></div><div style="background-image:url('${foto(7)}')"></div></div><div class="velo"></div>${top(`4/${T}`)}
    <div class="txt"><div class="chips"><span>Volante M con levas</span><span>Interior negro</span><span>Pantalla con mapa</span></div></div>${pie}</div>`,
  `<div class="s"><div class="dos"><div style="background-image:url('${foto(8)}')"></div><div style="background-image:url('${foto(9)}')"></div></div><div class="velo"></div>${top(`5/${T}`)}
    <div class="txt"><h2>150,590<br><em>km</em></h2></div>${pie}</div>`,
  `<div class="s"><div class="bg" style="background-image:url('${foto(10)}');background-position:center 55%"></div><div class="velo"></div>${top(`6/${T}`)}
    <div class="txt"><h2>Motor<br><em>TwinPower Turbo</em></h2>${F}</div>${pie}</div>`,
  `<div class="s cta">${top(`7/${T}`)}<div class="txt"><h2>¿Te interesa<br>la X3?</h2>${F}<p>Comenta</p><span class="comenta">X3</span>
    <div class="lista"><span>💬 Precio por DM</span></div></div>${pie}</div>`,
];

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, ignoreHTTPSErrors: true });
  const base = `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Inter:wght@400;600&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet"><style>${CSS}</style></head><body>`;
  for (let i = 0; i < LAMINAS.length; i++) {
    await p.setContent(base + LAMINAS[i] + "</body></html>", { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(OUT, `post7-x3-${String(i + 1).padStart(2, "0")}.png`) });
  }
  await b.close();
  console.log("Láminas:", LAMINAS.length);
})();
