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
];

/*
 * PROYECTOS DE LA CASA
 * Tus carros de colección y builds. No están a la venta.
 */
window.PROYECTOS = [
  {
    nombre: "Proyecto JDM",          // CÁMBIALO: por ejemplo "Honda Civic EG 1994"
    estado: "En construcción",
    descripcion: "El proyecto de la casa. Síguelo paso a paso en Instagram.",
    foto: "",                         // por ejemplo "img/proyecto-1.jpg"
  },
];
