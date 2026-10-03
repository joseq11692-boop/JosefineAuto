/* Datos iniciales de la app Josefine Gestión. Se cargan solo la primera vez. */
window.JA_BASE = {
  reglas: {
    gananciaMin: 600,   // USD
    margenMin: 0.12,    // 12%
    diasMax: 45,
    colchon: 0.08,      // 8% del precio de compra
    capital: 5000,      // capital inicial
    reserva: 500,       // nunca se invierte
    descuentoVenta: 0.10 // venta realista = precio pedido medio - 10%
  },

  // Precios de referencia encontrados en la web (octubre de 2026). Son precios PEDIDOS.
  precios: [
    { modelo: "Mazda3", anio: 2010, km: null, trans: "", precio: 4599, fuente: "Encuentra24 / Cari Autos", ref: true },
    { modelo: "Mazda3", anio: 2010, km: null, trans: "", precio: 6900, fuente: "Encuentra24 / Cari Autos", ref: true },
    { modelo: "Toyota Yaris", anio: 2012, km: 189000, trans: "Manual", precio: 5900, fuente: "Encuentra24", ref: true },
    { modelo: "Toyota Yaris", anio: 2011, km: 99450, trans: "Automática", precio: 5750, fuente: "Encuentra24", ref: true },
    { modelo: "Toyota Yaris", anio: 2010, km: null, trans: "Automática", precio: 9200, fuente: "Encuentra24", ref: true },
    { modelo: "Toyota Corolla", anio: 2008, km: null, trans: "Automática", precio: 4300, fuente: "Encuentra24", ref: true },
    { modelo: "Toyota Corolla", anio: 2009, km: 280460, trans: "Manual", precio: 5000, fuente: "Encuentra24", ref: true },
    { modelo: "Nissan Sentra", anio: 2010, km: 147000, trans: "Manual", precio: 3900, fuente: "Encuentra24", ref: true },
    { modelo: "Nissan Sentra", anio: 2014, km: 162000, trans: "Manual", precio: 4995, fuente: "Encuentra24", ref: true },
    { modelo: "Hyundai Accent", anio: null, km: null, trans: "Automática", precio: 3999, fuente: "Encuentra24", ref: true },
    { modelo: "Hyundai Accent", anio: 2014, km: null, trans: "Automática", precio: 4200, fuente: "Encuentra24", ref: true },
    { modelo: "Honda Civic", anio: 2012, km: null, trans: "Automática", precio: 5950, fuente: "Encuentra24", ref: true }
  ]
};

/* Checklist de compra (resumen de docs/02-checklist-compra-panama.md).
   c: true = crítico. Un crítico marcado "mal" descarta el carro. */
window.JA_CHECKLIST = [
  { fase: "Filtro por teléfono", items: [
    { id: "t1", t: "El vendedor es el dueño registrado y puede mostrar papeles", c: true },
    { id: "t2", t: "Motivo de venta coherente" },
    { id: "t3", t: "Sin choques ni inundación declarados" },
    { id: "t4", t: "Me pasó el VIN" },
    { id: "t5", t: "Revisado y paz y salvo al día; sin financiamiento pendiente" },
    { id: "t6", t: "Foto del tablero encendido sin testigos" }
  ]},
  { fase: "Papeles", items: [
    { id: "p1", t: "Registro vehicular a nombre del vendedor", c: true },
    { id: "p2", t: "Cédula del vendedor coincide con el registro", c: true },
    { id: "p3", t: "VIN de chasis, parabrisas y papeles coinciden", c: true },
    { id: "p4", t: "Número de motor coincide", c: true },
    { id: "p5", t: "ATTT: sin multas ni impedimentos", c: true },
    { id: "p6", t: "Paz y salvo municipal y revisado vigentes", c: true },
    { id: "p7", t: "Sin prendas ni gravámenes (o carta del banco)", c: true },
    { id: "p8", t: "Si es importado: historial sin salvage / flood / rebuilt", c: true }
  ]},
  { fase: "Carrocería y chasis", items: [
    { id: "b1", t: "Separación entre paneles uniforme" },
    { id: "b2", t: "Pintura del mismo tono (sin repintes grandes)" },
    { id: "b3", t: "Largueros, torres y piso del maletero sin reparaciones", c: true },
    { id: "b4", t: "Sin óxido grave en piso, bajos y pasos de rueda" },
    { id: "b5", t: "Cristales de la misma marca y año" }
  ]},
  { fase: "Prueba anti-inundación", items: [
    { id: "i1", t: "Sin olor a humedad o moho", c: true },
    { id: "i2", t: "Sin barro, arena u óxido bajo alfombras y rieles", c: true },
    { id: "i3", t: "Sin marcas de agua en faros ni tablero", c: true },
    { id: "i4", t: "Conectores bajo asientos sin corrosión verde", c: true }
  ]},
  { fase: "Interior", items: [
    { id: "n1", t: "Desgaste de volante y pedales coherente con los km" },
    { id: "n2", t: "A/C enfría en menos de 2 minutos" },
    { id: "n3", t: "Elevalunas, cierre, luces y pantalla funcionan" },
    { id: "n4", t: "Testigo de airbag se enciende y se apaga", c: true }
  ]},
  { fase: "Motor (en frío)", items: [
    { id: "m1", t: "El motor estaba frío al llegar" },
    { id: "m2", t: "Aceite sin aspecto lechoso", c: true },
    { id: "m3", t: "Refrigerante limpio, sin aceite" },
    { id: "m4", t: "Sin fugas de aceite ni refrigerante" },
    { id: "m5", t: "Arranque sin ruidos ni humo azul o blanco espeso" },
    { id: "m6", t: "Correas y mangueras sin grietas" }
  ]},
  { fase: "Llantas y frenos", items: [
    { id: "l1", t: "Desgaste parejo en las 4 llantas" },
    { id: "l2", t: "Llantas de menos de 6 años (código DOT)" },
    { id: "l3", t: "Discos sin escalón marcado" }
  ]},
  { fase: "Escáner OBD2", items: [
    { id: "o1", t: "Sin códigos de error activos" },
    { id: "o2", t: "Monitores listos (no borraron códigos)" },
    { id: "o3", t: "Temperatura de motor y transmisión normal" }
  ]},
  { fase: "Prueba de manejo", items: [
    { id: "d1", t: "Cambios suaves; la transmisión no patina", c: true },
    { id: "d2", t: "Dirección recta, volante centrado" },
    { id: "d3", t: "Frena recto, sin vibraciones" },
    { id: "d4", t: "Suspensión sin golpes" },
    { id: "d5", t: "Sin ruidos de rodamientos" },
    { id: "d6", t: "No se calienta en tráfico con A/C" },
    { id: "d7", t: "Sin goteos después de la prueba" }
  ]},
  { fase: "Taller", items: [
    { id: "w1", t: "Revisado en el elevador por el mecánico" },
    { id: "w2", t: "Presupuesto de reparación por escrito (pásalo a Números)" }
  ]}
];
