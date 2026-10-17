/* Prueba del menú de escritorio: recorre anchos de 320 a 1440 px y avisa si el menú se sale, choca o se parte en dos líneas.
   Uso: (cd web && python3 -m http.server 8768 &) ; NODE_PATH=<node_modules con playwright> node herramientas/build/probar-menu.js
   Correrlo cada vez que se añada un enlace al menú (lección gotcha_menu-desborda). */
const { chromium } = require("playwright");
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:600}});
await p.goto("http://localhost:8768/",{waitUntil:"networkidle"});
for (let w=320; w<=1440; w+=1){ await p.setViewportSize({width:w,height:600});
 const r=await p.evaluate(()=>{const i=document.querySelector(".barra__in"),m=document.querySelector(".menu"),bt=document.querySelector(".barra__in > .boton"),lg=document.querySelector(".logo");
  const mr=m.getBoundingClientRect(),br=bt.getBoundingClientRect(),lr=lg.getBoundingClientRect();
  return {over:document.documentElement.scrollWidth>innerWidth, choque: mr.right>br.left-4 || mr.left<lr.right+4, alto: Math.round(mr.height)}});
 if(r.over||(r.alto>0&&(r.choque||r.alto>40))){console.log("FALLA",w,JSON.stringify(r));}
}
console.log("fin");await b.close();})();
