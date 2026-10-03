/*
 * ============================================================
 *  JOSEFINE AUTO: DATOS DE LA WEB
 *  Este es el ÚNICO archivo que necesitas editar en el día a día.
 * ============================================================
 */

window.CONFIG = {
  // Número de WhatsApp con código de país, solo dígitos (507 = Panamá).
  // EJEMPLO: "50760000000". CÁMBIALO por tu número real.
  whatsapp: "50766989569",

  // Usuario de Instagram sin @.
  instagram: "josefineauto",

  // Correo de contacto (opcional; deja "" para ocultarlo).
  correo: "",

  // Zona de atención que se muestra en la web.
  zona: "Ciudad de Panamá",
};

/*
 * INVENTARIO
 * Cada carro es un bloque { ... }. Para añadir uno, copia el ejemplo de abajo,
 * quita las barras // del principio de cada línea y rellena los datos.
 *
 *  estado:  "disponible" | "reservado" | "vendido"
 *  fotos:   rutas dentro de la carpeta web/img/ (la primera es la portada)
 *  informe: enlace al informe de inspección (PDF o Google Drive), o ""
 *  tipo:    "propio" (comprado por Josefine Auto) | "consignacion"
 */
/*
 * EN BÚSQUEDA: carros que estás buscando. Se muestran mientras no haya carros
 * disponibles, para que los clientes pidan que les avises.
 */
window.BUSCANDO = [
  { modelo: "Mazda3", anios: "2008–2010", nota: "Automático · Papeles al día" },
  { modelo: "Honda Civic", anios: "2008–2010", nota: "Automático · Papeles al día" },
];

window.INVENTARIO = [
  // {
  //   marca: "Mazda",
  //   modelo: "Mazda3",
  //   anio: 2010,
  //   km: 150000,
  //   transmision: "Automática",
  //   precio: 4950,
  //   estado: "disponible",
  //   tipo: "propio",
  //   fotos: ["img/mazda3-1.jpg"],
  //   destacado: "Revisado en taller · Papeles al día · A/C perfecto",
  //   defectos: "Rayón en parachoques trasero; llantas al 60%",
  //   informe: "",
  // },

  // ===== VENDIDOS (de Instagram @josefineauto) =====
  {
    "id": "ford-edge-2016",
    "marca": "Ford",
    "modelo": "Edge",
    "anio": 2016,
    "km": 104600,
    "motor": "3.5 V6",
    "transmision": "Automática",
    "estado": "vendido",
    "fotos": [
      "img/carros/ford-edge-2016/01.jpg",
      "img/carros/ford-edge-2016/02.jpg",
      "img/carros/ford-edge-2016/03.jpg",
      "img/carros/ford-edge-2016/04.jpg",
      "img/carros/ford-edge-2016/05.jpg",
      "img/carros/ford-edge-2016/06.jpg",
      "img/carros/ford-edge-2016/07.jpg",
      "img/carros/ford-edge-2016/08.jpg"
    ],
    "destacado": "Un solo dueño · Batería, bases de motor y evaporador de A/C nuevos · Mantenimiento recién hecho"
  },
  {
    "id": "range-rover-sport-2019",
    "marca": "Land Rover",
    "modelo": "Range Rover Sport",
    "anio": 2019,
    "transmision": "Automática",
    "estado": "vendido",
    "fotos": [
      "img/carros/range-rover-sport-2019/01.jpg",
      "img/carros/range-rover-sport-2019/02.jpg",
      "img/carros/range-rover-sport-2019/03.jpg",
      "img/carros/range-rover-sport-2019/04.jpg",
      "img/carros/range-rover-sport-2019/05.jpg"
    ],
    "destacado": "Excelentes condiciones físicas y mecánicas"
  },
  {
    "id": "bmw-320i-2006",
    "marca": "BMW",
    "modelo": "320i",
    "anio": 2006,
    "km": 150000,
    "transmision": "Automática",
    "estado": "vendido",
    "fotos": [
      "img/carros/bmw-320i-2006/01.jpg",
      "img/carros/bmw-320i-2006/02.jpg",
      "img/carros/bmw-320i-2006/03.jpg",
      "img/carros/bmw-320i-2006/04.jpg",
      "img/carros/bmw-320i-2006/05.jpg",
      "img/carros/bmw-320i-2006/06.jpg"
    ],
    "destacado": "Interior en buen estado",
    "defectos": "Detalles de pintura"
  },
  {
    "id": "bmw-x6-m50i",
    "marca": "BMW",
    "modelo": "X6 M50i",
    "km": 57000,
    "motor": "4.4 V8 Twin Turbo",
    "estado": "vendido",
    "fotos": [
      "img/carros/bmw-x6-m50i/01.jpg",
      "img/carros/bmw-x6-m50i/02.jpg",
      "img/carros/bmw-x6-m50i/03.jpg",
      "img/carros/bmw-x6-m50i/04.jpg",
      "img/carros/bmw-x6-m50i/05.jpg",
      "img/carros/bmw-x6-m50i/06.jpg",
      "img/carros/bmw-x6-m50i/07.jpg",
      "img/carros/bmw-x6-m50i/08.jpg"
    ],
    "destacado": "Excelentes condiciones físicas y mecánicas"
  },
  {
    "id": "maserati-ghibli-sq4-2019",
    "marca": "Maserati",
    "modelo": "Ghibli SQ4",
    "anio": 2019,
    "km": 30000,
    "motor": "3.0 V6 Twin Turbo · AWD",
    "estado": "vendido",
    "fotos": [
      "img/carros/maserati-ghibli-sq4-2019/01.jpg",
      "img/carros/maserati-ghibli-sq4-2019/02.jpg",
      "img/carros/maserati-ghibli-sq4-2019/03.jpg",
      "img/carros/maserati-ghibli-sq4-2019/04.jpg",
      "img/carros/maserati-ghibli-sq4-2019/05.jpg",
      "img/carros/maserati-ghibli-sq4-2019/06.jpg",
      "img/carros/maserati-ghibli-sq4-2019/07.jpg",
      "img/carros/maserati-ghibli-sq4-2019/08.jpg"
    ],
    "destacado": "Un solo dueño · Excelentes condiciones físicas y mecánicas"
  },
  {
    "id": "honda-pilot-elite-2022",
    "marca": "Honda",
    "modelo": "Pilot Elite",
    "anio": 2022,
    "km": 84531,
    "motor": "3.5 V6 · AWD",
    "transmision": "Automática",
    "estado": "vendido",
    "fotos": [
      "img/carros/honda-pilot-elite-2022/01.jpg",
      "img/carros/honda-pilot-elite-2022/02.jpg",
      "img/carros/honda-pilot-elite-2022/03.jpg",
      "img/carros/honda-pilot-elite-2022/04.jpg",
      "img/carros/honda-pilot-elite-2022/05.jpg",
      "img/carros/honda-pilot-elite-2022/06.jpg",
      "img/carros/honda-pilot-elite-2022/07.jpg"
    ],
    "destacado": "Full extras · Un solo dueño · Excelentes condiciones"
  },
];

/*
 * PROYECTOS DE LA CASA
 * Tus carros de colección y builds. No están a la venta.
 */
window.PROYECTOS = [
  {
    "nombre": "Mitsubishi Lancer Evolution VI GSR 1999",
    "estado": "En construcción",
    "descripcion": "Un clásico del rally. El proyecto de la casa, paso a paso en Instagram.",
    "foto": "img/proyectos/lancer-evo-vi-gsr-1999.jpg"
  },
  {
    "nombre": "Honda Civic Si 2008",
    "estado": "En construcción",
    "descripcion": "El Si de octava generación, con su K20 y el corte a 8.000 rpm.",
    "foto": "img/proyectos/honda-civic-si-2008.jpg"
  }
];

/*
 * EN LA ESCENA: eventos y car spotting (sección de la portada).
 */
window.ESCENA = [
  {
    "titulo": "Lanzamiento del Jetour G700",
    "fecha": "Mayo 2026",
    "texto": "Una propuesta que sorprende por su presencia y prestaciones.",
    "fotos": [
      "img/escena/jetour-g700/01.jpg",
      "img/escena/jetour-g700/02.jpg",
      "img/escena/jetour-g700/03.jpg",
      "img/escena/jetour-g700/04.jpg"
    ]
  },
  {
    "titulo": "Soft Opening de Lexus Santa María",
    "fecha": "Octubre 2025",
    "texto": "Lujo, precisión y estilo japonés en su máxima expresión.",
    "fotos": [
      "img/escena/lexus-santa-maria/01.jpg",
      "img/escena/lexus-santa-maria/02.jpg",
      "img/escena/lexus-santa-maria/03.jpg",
      "img/escena/lexus-santa-maria/04.jpg"
    ]
  },
  {
    "titulo": "Car spotting en The Collection, México",
    "fecha": "Septiembre 2025",
    "texto": "Algunos de los autos más exclusivos del mundo, en un solo lugar.",
    "fotos": [
      "img/escena/the-collection-mexico/01.jpg",
      "img/escena/the-collection-mexico/02.jpg",
      "img/escena/the-collection-mexico/03.jpg",
      "img/escena/the-collection-mexico/04.jpg"
    ]
  }
];
