/* Post "Buscamos": sedanes automáticos 2013–2021 (Accent, Elantra, Rio, Forte, Civic, Yaris). Collage + historia.
   Fotos de Wikimedia Commons con licencia libre (créditos en fotos-buscamos/CREDITOS.txt y en el texto del post);
   placas delanteras tapadas con la de Josefine (herramientas/placa/). Sin precio: es una búsqueda para un cliente.
   Uso: node herramientas/build/generar-post-buscamos.js   Salida: web/kit/img/post12-buscamos-01.png y -historia.png */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const RAIZ = path.join(__dirname, "../..");
const foto = (n) => "data:image/jpeg;base64," + fs.readFileSync(path.join(__dirname, "fotos-buscamos", n + ".jpg")).toString("base64");
const FIRMA = "data:image/svg+xml;base64," + fs.readFileSync(path.join(RAIZ, "web/img/logo-firma-blanco.svg")).toString("base64");
const AUTOS = [["accent", "Hyundai Accent", "50% 60%"], ["elantra", "Hyundai Elantra", "50% 60%"], ["rio", "Kia Rio", "55% 60%"],
  ["forte", "Kia Forte", "50% 60%"], ["civic", "Honda Civic", "30% 80%", "118%"], ["yaris", "Toyota Yaris", "50% 62%"]];
const CSS = `*{box-sizing:border-box;margin:0}body{font-family:Inter,sans-serif;background:#14161a;color:#fff;overflow:hidden}
h1{font-family:'Chakra Petch',sans-serif;font-weight:700;text-transform:uppercase;line-height:.95}h1 em{font-style:normal;color:#e11d2e}
.top{display:flex;justify-content:space-between;align-items:center}.top img{height:84px}
.tag{justify-self:start;background:#e11d2e;font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:34px;letter-spacing:.08em;padding:8px 24px;border-radius:14px;text-transform:uppercase}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.c{position:relative;background-size:cover}
.c span{position:absolute;left:14px;bottom:12px;font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:28px;text-transform:uppercase;background:rgba(20,22,26,.8);padding:4px 14px;border-radius:10px}
.f{display:grid;gap:8px;width:280px}.f span{display:block;height:7px;border-radius:7px}
.f span:nth-child(1){background:#3438b8}.f span:nth-child(2){background:#fff;width:88%;margin-left:12%}
.f span:nth-child(3){background:#c8202b;width:62%;margin-left:30%}.f span:nth-child(4){background:#d9a62a;width:40%;margin-left:42%}
.chips{display:flex;flex-wrap:wrap;gap:12px}.chips span{font-family:'IBM Plex Mono',monospace;font-size:27px;border:2px solid rgba(255,255,255,.7);border-radius:99px;padding:8px 22px}
.cta{font-size:38px;font-weight:600}.pie{display:flex;justify-content:space-between;font-family:'IBM Plex Mono',monospace;font-size:25px;letter-spacing:.08em;opacity:.85}`;
const F = `<div class="f"><span></span><span></span><span></span><span></span></div>`;
const grid = (h) => `<div class="grid">${AUTOS.map(([f, n, pos, zoom]) => `<div class="c" style="height:${h}px;background-image:url('${foto(f)}');background-position:${pos}${zoom ? ';background-size:' + zoom : ''}"><span>${n}</span></div>`).join("")}</div>`;
const texto = `<span class="tag">Se busca</span><h1 style="font-size:84px">Sedán <em>automático</em><br>2013 – 2021</h1>${F}
  <div class="chips"><span>Hyundai</span><span>Kia</span><span>Honda</span><span>Toyota</span><span>Menos de 200,000 km</span></div>
  <p class="cta">¿Vendes el tuyo? Escríbenos al DM 💬</p>`;
const POST = `<div style="width:1080px;height:1350px;display:grid;grid-template-rows:auto auto 1fr auto;gap:22px;padding:44px 0 40px">
  <div class="top" style="padding:0 60px"><img src="${FIRMA}"></div>
  ${grid(206)}<div style="display:grid;gap:16px;padding:0 60px;align-content:start">${texto}</div>
  <div class="pie" style="padding:0 60px"><span>@josefineauto</span><span>JOSEFINEAUTO.COM</span></div></div>`;
const HIST = `<div style="width:1080px;height:1920px;display:grid;grid-template-rows:auto auto 1fr auto;gap:30px;padding:150px 0 170px">
  <div class="top" style="padding:0 60px"><img src="${FIRMA}"></div>${grid(300)}
  <div style="display:grid;gap:20px;padding:0 60px;align-content:start">${texto}</div>
  <div class="pie" style="padding:0 60px"><span>@josefineauto</span><span>JOSEFINEAUTO.COM</span></div></div>`;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, ignoreHTTPSErrors: true });
  const base = `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@700&family=Inter:wght@400;600&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet"><style>${CSS}</style></head><body>`;
  const out = path.join(RAIZ, "web/kit/img");
  for (const [html, w, h, nombre] of [[POST, 1080, 1350, "post12-buscamos-01.png"], [HIST, 1080, 1920, "post12-buscamos-historia.png"]]) {
    await p.setViewportSize({ width: w, height: h });
    await p.setContent(base + html + "</body></html>", { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(out, nombre) });
  }
  await b.close();
  console.log("listo");
})();
