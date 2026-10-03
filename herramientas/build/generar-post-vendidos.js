/* Post de captación con fotos reales: "Vendidos. ¿El tuyo es el siguiente?"
   Uso: NODE_PATH=<node_modules con playwright> node herramientas/build/generar-post-vendidos.js
   Salida: web/kit/img/post0-vendidos-XX.png (1080x1350) */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const RAIZ = path.resolve(__dirname, "../..");
const OUT = path.join(RAIZ, "web", "kit", "img");
const img = (p) => "data:image/jpeg;base64," + fs.readFileSync(path.join(RAIZ, "web", p)).toString("base64");
const svg = (f) => "data:image/svg+xml;base64," + fs.readFileSync(path.join(RAIZ, "web/img", f)).toString("base64");
const FIRMA = svg("logo-firma.svg"), FIRMA_B = svg("logo-firma-blanco.svg");

const C = {
  maserati: img("img/carros/maserati-ghibli-sq4-2019/03.jpg"),
  x6: img("img/carros/bmw-x6-m50i/02.jpg"),
  rr: img("img/carros/range-rover-sport-2019/02.jpg"),
  pilot: img("img/carros/honda-pilot-elite-2022/02.jpg"),
  edge: img("img/carros/ford-edge-2016/03.jpg"),
  bmw3: img("img/carros/bmw-320i-2006/02.jpg"),
};

const CSS = `
*{box-sizing:border-box;margin:0}
body{width:1080px;height:1350px;font-family:Inter,sans-serif;overflow:hidden;background:#14161a;color:#fff}
.s{position:relative;width:1080px;height:1350px;overflow:hidden}
h1,h2{font-family:'Chakra Petch',sans-serif;text-transform:uppercase;line-height:.98;letter-spacing:.01em}
h1{font-size:120px}h2{font-size:84px}
em{font-style:normal;color:#e11d2e}
.mono{font-family:'IBM Plex Mono',monospace;letter-spacing:.12em;text-transform:uppercase}
.f{display:grid;gap:9px;width:300px}.f span{display:block;height:7px;border-radius:7px}
.f span:nth-child(1){background:#3438b8;width:100%}.f span:nth-child(2){background:#fff;width:88%;margin-left:12%}
.f span:nth-child(3){background:#c8202b;width:62%;margin-left:30%}.f span:nth-child(4){background:#d9a62a;width:40%;margin-left:42%}
.claro .f span:nth-child(2){background:#14161a}
.top{position:absolute;top:70px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center;z-index:3}
.top img{height:96px}.top span{font-family:'IBM Plex Mono',monospace;font-size:26px;letter-spacing:.1em;opacity:.75}
.pie{position:absolute;bottom:60px;left:80px;right:80px;display:flex;justify-content:space-between;font-family:'IBM Plex Mono',monospace;font-size:26px;letter-spacing:.08em;opacity:.8;z-index:3}
/* portada mosaico */
.mosaico{position:absolute;inset:0;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(3,1fr);gap:6px}
.mosaico div{background-size:cover;background-position:center;position:relative}
.mosaico div::after{content:"VENDIDO";position:absolute;top:18px;left:18px;font-family:'IBM Plex Mono',monospace;font-size:20px;letter-spacing:.12em;background:#e11d2e;color:#fff;padding:6px 14px;border-radius:99px}
.velo{position:absolute;inset:0;background:linear-gradient(180deg,rgba(20,22,26,.55) 0%,rgba(20,22,26,.2) 30%,rgba(20,22,26,.85) 62%,#14161a 100%);z-index:1}
.portada-txt{position:absolute;left:80px;right:80px;bottom:150px;z-index:2;display:grid;gap:30px}
.portada-txt p{font-size:44px;color:#d6d9df;line-height:1.3}
/* lámina de carro */
.foto{position:absolute;left:0;right:0;top:0;height:900px;background-size:cover;background-position:center 60%}
.foto-velo{position:absolute;left:0;right:0;top:0;height:900px;background:linear-gradient(180deg,rgba(20,22,26,.65) 0%,transparent 22%,transparent 70%,#14161a 100%)}
.sello{position:absolute;top:240px;right:-90px;transform:rotate(18deg);background:#e11d2e;color:#fff;font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:64px;letter-spacing:.08em;padding:14px 140px;z-index:2;box-shadow:0 10px 30px rgba(0,0,0,.35)}
.carro-txt{position:absolute;left:80px;right:80px;bottom:140px;z-index:2;display:grid;gap:22px}
.specs{display:flex;flex-wrap:wrap;gap:14px}
.specs span{font-family:'IBM Plex Mono',monospace;font-size:30px;border:2px solid rgba(255,255,255,.6);border-radius:99px;padding:10px 26px}
/* claro */
.claro{background:#f6f7f8;color:#14161a}
.contenido{position:absolute;left:80px;right:80px;top:250px;bottom:150px;display:grid;align-content:center;gap:40px;z-index:2}
.paso{display:flex;gap:30px;align-items:flex-start}
.paso b{flex:none;width:96px;height:96px;border-radius:24px;background:#e11d2e;color:#fff;display:grid;place-items:center;font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:56px}
.paso h3{font-family:'Chakra Petch',sans-serif;font-weight:700;text-transform:uppercase;font-size:48px;line-height:1.05}
.paso p{font-size:34px;color:#5b6270;line-height:1.3;margin-top:6px}
.cta{background:#e11d2e}
.comenta{justify-self:start;display:inline-block;background:#fff;color:#14161a;font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:110px;padding:6px 40px;border-radius:24px;letter-spacing:.04em}
.cta p{font-size:42px;line-height:1.3}
`;
const top = (n, claro) => `<div class="top"><img src="${claro ? FIRMA : FIRMA_B}"><span>${n}</span></div>`;
const pie = () => `<div class="pie"><span>@josefineauto</span><span>WHATSAPP 6698-9569</span></div>`;
const F = `<div class="f"><span></span><span></span><span></span><span></span></div>`;
const carro = (n, foto, titulo, specs) => `<div class="s"><div class="foto" style="background-image:url('${foto}')"></div><div class="foto-velo"></div>${top(n)}<div class="sello">VENDIDO</div>
  <div class="carro-txt"><h2>${titulo}</h2><div class="specs">${specs.map((x) => `<span>${x}</span>`).join("")}</div></div>${pie()}</div>`;

const LAMINAS = [
  `<div class="s"><div class="mosaico">${[C.maserati, C.x6, C.rr, C.pilot, C.edge, C.bmw3].map((u) => `<div style="background-image:url('${u}')"></div>`).join("")}</div><div class="velo"></div>${top("1/6")}
    <div class="portada-txt"><span class="mono" style="font-size:30px;color:#d6d9df">6 carros vendidos</span><h1>¿El tuyo es<br>el <em>siguiente</em>?</h1>${F}<p>Desde un BMW 320i hasta un Maserati Ghibli.</p></div>${pie()}</div>`,
  carro("2/6", C.maserati, "Maserati<br>Ghibli SQ4 2019", ["30.000 km", "V6 Twin Turbo", "AWD", "Un dueño"]),
  carro("3/6", C.x6, "BMW<br>X6 M50i", ["57.000 km", "V8 Twin Turbo"]),
  carro("4/6", C.rr, "Range Rover<br>Sport 2019", ["Automático", "Excelente estado"]),
  `<div class="s claro">${top("5/6", true)}<div class="contenido"><h2>Así vendemos<br><em>tu carro</em></h2>${F}
    <div class="paso"><b>1</b><div><h3>Nos escribes</h3><p>Marca, modelo, año, km y fotos.</p></div></div>
    <div class="paso"><b>2</b><div><h3>Acordamos el precio</h3><p>Por contrato. Tú apruebas cada oferta.</p></div></div>
    <div class="paso"><b>3</b><div><h3>Lo vendemos</h3><p>Fotos, anuncios, compradores filtrados y pruebas acompañadas.</p></div></div>
    </div><div class="pie" style="color:#14161a"><span>@josefineauto</span><span>JOSEFINE AUTO · PANAMÁ</span></div></div>`,
  `<div class="s cta">${top("6/6")}<div class="contenido"><h2>Solo cobramos<br>si se vende</h2>${F}<p>Comenta</p><span class="comenta">VENDER</span><p>y te escribimos por DM.<br>O directo al WhatsApp <b>6698-9569</b></p></div>${pie()}</div>`,
];

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, ignoreHTTPSErrors: true });
  const base = `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Inter:wght@400;600&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet"><style>${CSS}</style></head><body>`;
  for (let i = 0; i < LAMINAS.length; i++) {
    await p.setContent(base + LAMINAS[i] + "</body></html>", { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(OUT, `post0-vendidos-${String(i + 1).padStart(2, "0")}.png`) });
  }
  await b.close();
  console.log("Láminas:", LAMINAS.length);
})();
