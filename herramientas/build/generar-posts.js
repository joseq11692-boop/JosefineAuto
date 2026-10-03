/* Genera las imágenes de Instagram (1080x1350) con la identidad Firma.
   Uso: NODE_PATH=<carpeta con playwright>/node_modules node herramientas/build/generar-posts.js
   Salida: web/kit/img/*.png (se ven en la web en /kit/) */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const RAIZ = path.resolve(__dirname, "../..");
const OUT = path.join(RAIZ, "web", "kit", "img");
fs.mkdirSync(OUT, { recursive: true });
const svg = (f) => "data:image/svg+xml;base64," + fs.readFileSync(path.join(RAIZ, "web/img", f)).toString("base64");
const FIRMA = svg("logo-firma.svg"), FIRMA_B = svg("logo-firma-blanco.svg");

const CSS = `
*{box-sizing:border-box;margin:0}
body{width:1080px;height:1350px;font-family:Inter,sans-serif;overflow:hidden}
.s{width:1080px;height:1350px;padding:90px 90px 80px;display:grid;grid-template-rows:auto 1fr auto;position:relative}
.claro{background:#f6f7f8;color:#14161a}.oscuro{background:#14161a;color:#fff}.rojo{background:#e11d2e;color:#fff}
.top{display:flex;justify-content:space-between;align-items:center}
.top img{height:92px}
.n{font-family:'IBM Plex Mono',monospace;font-size:26px;letter-spacing:.1em;opacity:.6}
.c{display:grid;align-content:center;gap:34px}
h1,h2{font-family:'Chakra Petch',sans-serif;text-transform:uppercase;line-height:1;letter-spacing:.01em}
h1{font-size:118px}h2{font-size:92px}
h1 em,h2 em{font-style:normal;color:#e11d2e}.rojo h1 em,.rojo h2 em{color:#14161a}
p{font-size:42px;line-height:1.35}.claro p{color:#5b6270}.oscuro p{color:#c9ccd3}
.big{font-family:'Chakra Petch',sans-serif;font-size:260px;line-height:.85;color:#e11d2e}
.f{display:grid;gap:9px;width:300px}.f span{display:block;height:7px;border-radius:7px}
.f span:nth-child(1){background:#3438b8;width:100%}.f span:nth-child(2){background:#14161a;width:88%;margin-left:12%}
.oscuro .f span:nth-child(2),.rojo .f span:nth-child(2){background:#fff}
.f span:nth-child(3){background:#c8202b;width:62%;margin-left:30%}.f span:nth-child(4){background:#d9a62a;width:40%;margin-left:42%}
.rojo .f span:nth-child(3){background:#14161a}
.pie{display:flex;justify-content:space-between;align-items:center;font-family:'IBM Plex Mono',monospace;font-size:28px;letter-spacing:.06em;opacity:.75}
.lista{display:grid;gap:22px;font-size:44px;font-weight:600}.lista div{display:flex;gap:22px;align-items:center}
.lista b{display:grid;place-items:center;width:62px;height:62px;border-radius:16px;background:#e11d2e;color:#fff;font-family:'Chakra Petch';font-size:34px;flex:none}
.chip{display:inline-block;font-family:'IBM Plex Mono',monospace;font-size:28px;letter-spacing:.1em;text-transform:uppercase;border:2px solid currentColor;border-radius:99px;padding:8px 22px;justify-self:start}
.firma-grande{width:720px;justify-self:center}
.foto{border:4px dashed #c9ccd3;border-radius:36px;height:560px;display:grid;place-items:center;color:#9a9ea8;font-size:36px;font-family:'IBM Plex Mono',monospace;text-align:center;padding:40px}
.hl{width:1080px;height:1080px;display:grid;place-items:center;background:#14161a}
.hl>div{width:760px;height:760px;border-radius:50%;background:#f6f7f8;display:grid;place-items:center;align-content:center;gap:40px}
.hl svg{width:300px;height:300px}.hl svg[viewBox="0 0 100 64"]{width:440px;height:282px}
.hl .f{width:260px}
`;

const top = (n, oscuro) => `<div class="top"><img src="${oscuro ? FIRMA_B : FIRMA}" alt=""><span class="n">${n}</span></div>`;
const pie = (t = "@josefineauto") => `<div class="pie"><span>${t}</span><span>JOSEFINE AUTO · PANAMÁ</span></div>`;
const F = `<div class="f"><span></span><span></span><span></span><span></span></div>`;
const slide = (cls, n, contenido, pieTxt) => `<div class="s ${cls}">${top(n, cls !== "claro")}<div class="c">${contenido}</div>${pie(pieTxt)}</div>`;

const POSTS = {
  "post1-como-trabajamos": [
    ["oscuro", `<span class="chip">Cómo trabajamos</span><h1>Así compramos<br>un <em>carro</em></h1>${F}<p>Y por qué rechazamos la mayoría.</p>`],
    ["claro", `<div class="big">01</div><h2>Primero,<br>los papeles</h2><p>VIN, ATTT, paz y salvo y gravámenes. Si algo no cuadra, no seguimos.</p>`],
    ["claro", `<div class="big">02</div><h2>Prueba anti-<br>inundación</h2><p>Alfombras, rieles, conectores, olor. En Panamá es obligatorio revisarlo.</p>`],
    ["claro", `<div class="big">03</div><h2>Escáner<br>y mecánico</h2><p>Diagnóstico electrónico y revisión en elevador antes de pagar un dólar.</p>`],
    ["claro", `<div class="big">04</div><h2>Números<br>claros</h2><p>Si no sale bien, no lo compramos. Por eso te lo podemos vender con confianza.</p>`],
    ["claro", `<div class="big">05</div><h2>Transparencia<br><em>total</em></h2><p>Te mostramos los defectos, las reparaciones y el historial. Sin sorpresas.</p>`],
    ["rojo", `<img class="firma-grande" src="${FIRMA_B}" alt="">${F}<h2>¿Buscas carro o<br>vendes el tuyo?</h2><p>Escríbenos al WhatsApp<br><b>6698-9569</b></p>`],
  ],
  "post2-carro-inundado": [
    ["oscuro", `<span class="chip">Guía</span><h1>¿Ese carro<br>estuvo bajo<br>el <em>agua</em>?</h1>${F}<p>5 señales para descubrirlo en 5 minutos.</p>`],
    ["claro", `<div class="big">1</div><h2>Levanta la<br>alfombra</h2><p>Barro, arena o humedad debajo: mala señal.</p>`],
    ["claro", `<div class="big">2</div><h2>Rieles y<br>tornillos</h2><p>El óxido en piezas que nunca se mojan no es normal.</p>`],
    ["claro", `<div class="big">3</div><h2>Conectores<br>eléctricos</h2><p>Polvo verde o blanco bajo los asientos = corrosión.</p>`],
    ["claro", `<div class="big">4</div><h2>Faros y<br>tablero</h2><p>Marcas de agua o condensación por dentro.</p>`],
    ["claro", `<div class="big">5</div><h2>Confía en<br>tu nariz</h2><p>La humedad no se quita con ambientador.</p>`],
    ["rojo", `<h2>¿Es importado?</h2>${F}<p>Pide el VIN y revisa su historial. Si dice <b>flood</b> o <b>salvage</b>, mejor no.</p><p>📌 Guárdalo para tu próxima compra.</p>`],
  ],
  "post3-vende-tu-deportivo": [
    ["oscuro", `<span class="chip">Vende con nosotros</span><h1>¿Vendes tu<br><em>deportivo</em>?</h1>${F}<p>Te lo vendemos a quien sí lo valora.</p>`],
    ["claro", `<h2>El<br>problema</h2><p>En Marketplace te escriben 50 personas… y ninguna seria. Los concesionarios no valoran tus modificaciones.</p>`],
    ["claro", `<h2>Lo que<br><em>hacemos</em></h2><div class="lista"><div><b>✓</b>Fotos y video profesionales</div><div><b>✓</b>Llegamos a entusiastas</div><div><b>✓</b>Filtramos compradores</div><div><b>✓</b>Pruebas acompañadas</div></div>`],
    ["claro", `<h2>Cómo<br>funciona</h2><div class="lista"><div><b>1</b>Nos escribes</div><div><b>2</b>Acordamos el precio</div><div><b>3</b>Lo vendemos</div></div>`],
    ["oscuro", `<h1>Solo cobramos<br>si se <em>vende</em></h1>${F}<p>Comisión acordada por contrato. Sin pagos por adelantado.</p>`],
    ["rojo", `<img class="firma-grande" src="${FIRMA_B}" alt="">${F}<h2>Japoneses, deportivos<br>y modificados</h2><p>Mándanos marca, modelo, año, km y fotos al<br><b>6698-9569</b></p>`],
  ],
  "post4-proyecto-portada": [
    ["oscuro", `<span class="chip">Proyecto de la casa</span><h1>Así suena<br>el proyecto<br>de la <em>casa</em></h1>${F}<p>No todo en Josefine Auto está a la venta.</p>`],
  ],
  "plantilla-carro-en-venta": [
    ["claro", `<span class="chip">Disponible</span><div class="foto">AQUÍ VA LA FOTO DEL CARRO<br>(te la preparo cuando me la mandes)</div><h2>Mazda3 2010</h2><p>150.000 km · Automático · Revisado en taller</p>`],
  ],
};
const DESTACADAS = [
  ["en-venta", "En venta", "M8 30h48l-5-14a4 4 0 0 0-4-3H17a4 4 0 0 0-4 3zm-2 4h52v14H6zm8 14v6h8v-6m26 0v6h8v-6"],
  ["vendidos", "Vendidos", "M12 32l14 14 26-28"],
  ["vende-el-tuyo", "Vende el tuyo", "M32 8v32m-14-14 14-14 14 14M10 52h44"],
  ["guias", "Guías", "M14 8h28l10 10v38H14zm28 0v10h10M22 30h20m-20 10h20"],
  ["como-trabajamos", "Cómo trabajamos", "M28 12a16 16 0 1 0 0 32 16 16 0 0 0 0-32zm12 28 14 14"],
  ["proyectos", "Proyectos", '<svg viewBox="0 0 100 64"><g fill="none" stroke="#14161a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 50c0-5 2-7 6-8l12-3c8-9 18-13 31-13 8 0 14 3 20 9l13 3c5 1 8 4 8 8v4h-8a8 8 0 0 0-16 0H34a8 8 0 0 0-16 0z"/><path d="M31 39c7-6 14-9 23-9 6 0 10 2 15 7l-1 2z"/><circle cx="26" cy="50" r="5.5"/><circle cx="78" cy="50" r="5.5"/><g transform="translate(64 1) scale(.95)" stroke-width="3.16"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></g></g></svg>'],
];

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, ignoreHTTPSErrors: true });
  const base = `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Inter:wght@400;600&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet"><style>${CSS}</style></head><body>`;
  let total = 0;
  for (const [nombre, slides] of Object.entries(POSTS)) {
    for (let i = 0; i < slides.length; i++) {
      const [cls, html] = slides[i];
      await p.setContent(base + slide(cls, slides.length > 1 ? `${i + 1}/${slides.length}` : "", html) + "</body></html>", { waitUntil: "networkidle" });
      await p.evaluate(() => document.fonts.ready);
      await p.screenshot({ path: path.join(OUT, `${nombre}-${String(i + 1).padStart(2, "0")}.png`) });
      total++;
    }
  }
  await p.setViewportSize({ width: 1080, height: 1080 });
  for (const [id, , d] of DESTACADAS) {
    await p.setContent(base + `<div class="hl"><div>${d.startsWith("<svg") ? d : `<svg viewBox="0 0 64 64"><g fill="none" stroke="#14161a" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">${d.startsWith("<") ? d : `<path d="${d}"/>`}</g></svg>`}${F}</div></div></body></html>`, { waitUntil: "networkidle" });
    await p.screenshot({ path: path.join(OUT, `destacada-${id}.png`) });
    total++;
  }
  // Variante con foto: proyecto de la casa (Evo VI) dentro del círculo
  const foto = "data:image/jpeg;base64," + fs.readFileSync(path.join(RAIZ, "web/img/proyectos/lancer-evo-vi-gsr-1999.jpg")).toString("base64");
  await p.setContent(base + `<div class="hl"><div style="background:url('${foto}') center 58%/170% auto no-repeat;box-shadow:inset 0 0 0 14px #f6f7f8"></div></div></body></html>`, { waitUntil: "networkidle" });
  await p.screenshot({ path: path.join(OUT, "destacada-proyectos-foto.png") });
  total++;
  await b.close();
  console.log("Imágenes:", total, "→", OUT);
})();
