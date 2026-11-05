/* Dibuja la placa "JOSEFINE AUTO" que tapa las placas reales en las fotos (herramientas/placa/placa.png, 532x272 con 6 px de margen).
   Uso: node herramientas/placa/hacer-placa.js */
const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 532, height: 272 }, ignoreHTTPSErrors: true });
  await p.setContent(`<!doctype html><html><head><link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@700&display=swap" rel="stylesheet"><style>
    *{margin:0;box-sizing:border-box}body{width:532px;height:272px;background:transparent;padding:6px}
    .pl{width:520px;height:260px;background:#e9eaec;border:9px solid #111;border-radius:14px;display:grid;place-content:center;gap:16px;justify-items:center}
    h1{font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:52px;letter-spacing:.02em;color:#111;line-height:1}h1 em{font-style:normal;color:#e11d2e}
    .f{display:grid;gap:7px;width:330px}.f span{display:block;height:7px;border-radius:7px}
    .f span:nth-child(1){background:#3438b8}.f span:nth-child(2){background:#111;width:88%;margin-left:12%}
    .f span:nth-child(3){background:#c8202b;width:62%;margin-left:30%}.f span:nth-child(4){background:#d9a62a;width:40%;margin-left:42%}
  </style></head><body><div class="pl"><h1>JOSEFINE <em>AUTO</em></h1><div class="f"><span></span><span></span><span></span><span></span></div></div></body></html>`, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(__dirname, "placa.png"), omitBackground: true });
  await b.close();
})();
