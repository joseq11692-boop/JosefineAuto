/* Post informativo "Conoce Josefine Auto" (7 láminas 1080x1350) con fotos reales.
   Uso: NODE_PATH=<node_modules con playwright> node herramientas/build/generar-post-nosotros.js
   Salida: web/kit/img/post0b-nosotros-XX.png */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const RAIZ = path.resolve(__dirname, "../..");
const OUT = path.join(RAIZ, "web", "kit", "img");
const img = (p) => "data:image/jpeg;base64," + fs.readFileSync(path.join(RAIZ, "web", p)).toString("base64");
const svg = (f) => "data:image/svg+xml;base64," + fs.readFileSync(path.join(RAIZ, "web/img", f)).toString("base64");
const FIRMA = svg("logo-firma.svg"), FIRMA_B = svg("logo-firma-blanco.svg");

const V = ["maserati-ghibli-sq4-2019/03", "bmw-x6-m50i/02", "range-rover-sport-2019/02", "honda-pilot-elite-2022/02", "ford-edge-2016/03", "bmw-320i-2006/02"]
  .map((p) => img(`img/carros/${p}.jpg`));
const NOMBRES = ["Maserati Ghibli SQ4", "BMW X6 M50i", "Range Rover Sport", "Honda Pilot Elite", "Ford Edge", "BMW 320i"];
const EVO = img("img/proyectos/lancer-evo-vi-gsr-1999.jpg"), CIVIC = img("img/proyectos/honda-civic-si-2008.jpg");
const ESC = [img("img/escena/lexus-santa-maria/02.jpg"), img("img/escena/jetour-g700/02.jpg"), img("img/escena/the-collection-mexico/02.jpg")];

const CSS = `
*{box-sizing:border-box;margin:0}
body{width:1080px;height:1350px;font-family:Inter,sans-serif;overflow:hidden}
.s{position:relative;width:1080px;height:1350px;overflow:hidden;padding:200px 80px 170px;display:grid;align-content:center;gap:36px}
.oscuro{background:#14161a;color:#fff}.claro{background:#f6f7f8;color:#14161a}.rojo{background:#e11d2e;color:#fff}
h1,h2,h3{font-family:'Chakra Petch',sans-serif;font-weight:700;text-transform:uppercase;line-height:1;letter-spacing:.01em}
h1{font-size:112px}h2{font-size:80px}h3{font-size:40px}
em{font-style:normal;color:#e11d2e}.rojo em{color:#14161a}
p{font-size:38px;line-height:1.35}.claro p{color:#5b6270}.oscuro p{color:#c9ccd3}
.mono{font-family:'IBM Plex Mono',monospace;font-size:28px;letter-spacing:.12em;text-transform:uppercase}
.f{display:grid;gap:9px;width:300px}.f span{display:block;height:7px;border-radius:7px}
.f span:nth-child(1){background:#3438b8;width:100%}.f span:nth-child(2){background:#14161a;width:88%;margin-left:12%}
.oscuro .f span:nth-child(2),.rojo .f span:nth-child(2){background:#fff}
.f span:nth-child(3){background:#c8202b;width:62%;margin-left:30%}.f span:nth-child(4){background:#d9a62a;width:40%;margin-left:42%}
.rojo .f span:nth-child(3){background:#14161a}
.top{position:absolute;top:70px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center}
.top img{height:96px}.top span{font-family:'IBM Plex Mono',monospace;font-size:26px;letter-spacing:.1em;opacity:.7}
.pie{position:absolute;bottom:60px;left:80px;right:80px;display:flex;justify-content:space-between;font-family:'IBM Plex Mono',monospace;font-size:26px;letter-spacing:.08em;opacity:.75}
.firma-xl{width:600px;justify-self:center}
.pilares{display:grid;gap:26px}
.pilar{display:flex;gap:28px;align-items:center;background:#fff;border:2px solid #e1e4e8;border-radius:28px;padding:26px 30px}
.pilar b{flex:none;width:92px;height:92px;border-radius:22px;background:#14161a;display:grid;place-items:center}
.pilar b svg{width:56px;height:56px}
.pilar p{font-size:30px;margin-top:6px}
.checks{display:grid;gap:22px}
.check{display:flex;gap:24px;align-items:center;font-size:40px;font-weight:600}
.check i{flex:none;width:64px;height:64px;border-radius:50%;background:#e11d2e;display:grid;place-items:center;font-style:normal;font-size:36px;color:#fff}
.grid6{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.grid6 div{height:240px;border-radius:20px;background-size:cover;background-position:center;position:relative;overflow:hidden}
.grid6 div span{position:absolute;left:0;right:0;bottom:0;padding:30px 16px 12px;background:linear-gradient(transparent,rgba(10,11,14,.85));color:#fff;font-family:'Chakra Petch';font-weight:700;font-size:26px;text-transform:uppercase}
.dos{display:grid;gap:18px}
.dos div{height:330px;border-radius:24px;background-size:cover;background-position:center 60%;position:relative;overflow:hidden}
.dos div span{position:absolute;left:0;right:0;bottom:0;padding:50px 24px 18px;background:linear-gradient(transparent,rgba(10,11,14,.88));color:#fff;font-family:'Chakra Petch';font-weight:700;font-size:36px;text-transform:uppercase}
.tres{display:grid;grid-template-columns:1.3fr 1fr;grid-template-rows:1fr 1fr;gap:14px;height:640px}
.tres div{border-radius:22px;background-size:cover;background-position:center}
.tres div:first-child{grid-row:1/3}
.contacto{display:grid;gap:18px;font-size:42px;font-weight:600}
.contacto span{background:#fff;color:#14161a;border-radius:20px;padding:20px 28px}

.unico{padding:150px 80px 140px;gap:30px;align-content:start}
.unico .firma-u{width:420px}
.tira{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.tira div{height:250px;border-radius:20px;background-size:cover;background-position:center 62%;position:relative;overflow:hidden}
.tira div::after{content:"VENDIDO";position:absolute;top:12px;left:12px;font-family:'IBM Plex Mono',monospace;font-size:18px;letter-spacing:.1em;background:#e11d2e;color:#fff;padding:5px 12px;border-radius:99px}
.lista3{display:grid;gap:16px}
.lista3 div{display:flex;gap:20px;align-items:center;font-size:36px;font-weight:600}
.lista3 i{flex:none;width:58px;height:58px;border-radius:16px;background:#e11d2e;display:grid;place-items:center;font-style:normal;color:#fff;font-size:32px}
.barra-cta{display:flex;justify-content:space-between;align-items:center;background:#fff;color:#14161a;border-radius:24px;padding:24px 30px;font-size:34px;font-weight:700}
.barra-cta span{font-family:'Chakra Petch';text-transform:uppercase}
`;
const top = (n, claro) => `<div class="top"><img src="${claro ? FIRMA : FIRMA_B}"><span>${n}</span></div>`;
const pie = () => `<div class="pie"><span>@josefineauto</span><span>JOSEFINE AUTO · PANAMÁ</span></div>`;
const F = `<div class="f"><span></span><span></span><span></span><span></span></div>`;
const ico = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const T = 7;
const L = [
  ["oscuro", `<img class="firma-xl" src="${FIRMA_B}"><span class="mono" style="color:#c9ccd3">Conoce a</span><h1>Josefine<br><em>Auto</em></h1>${F}<p style="font-size:34px">Compraventa de carros, proyectos y cultura automotriz en Panamá.</p>`],
  ["claro", `<h2>Qué <em>hacemos</em></h2>${F}<div class="pilares">
     <div class="pilar"><b>${ico('<path d="M5 17h14M6 17l1.5-5h9L18 17M8 12l1.2-3.5h5.6L16 12"/><circle cx="8" cy="17" r="1.6"/><circle cx="16" cy="17" r="1.6"/>')}</b><div><h3>Compramos y vendemos</h3><p>Carros seleccionados, revisados y con papeles en orden.</p></div></div>
     <div class="pilar"><b>${ico('<path d="M12 3v12m-5-5 5 5 5-5M5 21h14"/>')}</b><div><h3>Vendemos el tuyo</h3><p>A comisión: tú no atiendes curiosos. Solo cobramos si se vende.</p></div></div>
     <div class="pilar"><b>${ico('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>')}</b><div><h3>Proyectos y cultura</h3><p>Armamos proyectos y vivimos la escena automotriz.</p></div></div>
   </div>`],
  ["oscuro", `<h2>Cómo <em>trabajamos</em></h2>${F}<p>Antes de vender un carro, lo revisamos punto por punto:</p><div class="checks">
     <div class="check"><i>✓</i>Papeles verificados (ATTT)</div>
     <div class="check"><i>✓</i>Prueba anti-inundación</div>
     <div class="check"><i>✓</i>Escáner y revisión en taller</div>
     <div class="check"><i>✓</i>Defectos siempre a la vista</div></div>`],
  ["claro", `<h2>Lo que ya <em>vendimos</em></h2>${F}<div class="grid6">${V.map((u, i) => `<div style="background-image:url('${u}')"><span>${NOMBRES[i]}</span></div>`).join("")}</div>`],
  ["oscuro", `<h2>Proyectos de <em>la casa</em></h2>${F}<div class="dos"><div style="background-image:url('${EVO}')"><span>Lancer Evolution VI GSR · 1999</span></div><div style="background-image:url('${CIVIC}')"><span>Honda Civic Si · 2008</span></div></div>`],
  ["claro", `<h2>En la <em>escena</em></h2>${F}<p>Lanzamientos, aperturas y car spotting, aquí y fuera de Panamá.</p><div class="tres">${ESC.map((u) => `<div style="background-image:url('${u}')"></div>`).join("")}</div>`],
  ["rojo", `<h2>Síguenos y<br><em>escríbenos</em></h2>${F}<p>¿Buscas carro, quieres vender el tuyo o te gustan los proyectos?</p><div class="contacto"><span>📲 WhatsApp 6698-9569</span><span>🌐 josefineauto · web en la bio</span></div>`],
];

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, ignoreHTTPSErrors: true });
  const base = `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Inter:wght@400;600&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet"><style>${CSS}</style></head><body>`;
  for (let i = 0; i < L.length; i++) {
    const [cls, html] = L[i];
    await p.setContent(base + `<div class="s ${cls}">${top(`${i + 1}/${T}`, cls === "claro")}${html}${pie()}</div></body></html>`, { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(OUT, `post0b-nosotros-${String(i + 1).padStart(2, "0")}.png`) });
  }
  // Imagen única "Conócenos"
  const U = `<div class="s oscuro unico"><div class="top" style="top:60px"><span></span><span>@josefineauto</span></div>
    <img class="firma-u" src="${FIRMA_B}">
    <h1 style="font-size:104px">Conó<em>cenos</em></h1>${F}
    <div class="lista3">
      <div><i>✓</i>Compramos y vendemos carros seleccionados</div>
      <div><i>✓</i>Vendemos el tuyo a comisión</div>
      <div><i>✓</i>Proyectos y cultura automotriz</div>
    </div>
    <div class="tira">${["audi", "range", "mini"].map((k) => img(`img/conocenos/${k}.jpg`)).map((u) => `<div style="background-image:url('${u}')"></div>`).join("")}</div>
    <div class="barra-cta"><span>Escríbenos</span>📲 6698-9569</div></div>`;
  await p.setContent(base + U + "</body></html>", { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(OUT, "post0c-conocenos-01.png") });
  await b.close();
  console.log("Láminas:", L.length);
})();
