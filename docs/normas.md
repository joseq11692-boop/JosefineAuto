# Registro de normas del dueño

Cada "siempre", "nunca" o "a partir de ahora" del dueño, palabra por palabra, con fecha, alcance y origen.
Lo que está aquí no se vuelve a preguntar. Si dos normas chocan, manda la más reciente y se avisa al dueño.

| Id | Fecha | Alcance | Norma (literal) | Origen |
|---|---|---|---|---|
| N01 | 2026-09 | Todo | «quiero que todas las preguntas que me hagas siempre sean en modo elegible, y si es pregunta abierta, me pones opcion en otros… esto para siempre» | Chat, inicio del proyecto |
| N02 | 2026-09 | Todo | Reglas diamante 1 y 2: no pedir lo que Claude puede hacer (si es inevitable, guía visual nivel niño con enlaces) y más de un 70 % de encaje se implementa sin preguntar. (Resumen; el texto literal no se conservó.) | Chat → `CLAUDE.md` |
| N03 | 2026-09 | Todo | «ocupate y desarrolla todo hasta que este inmejorable se autonomo y no me preguntes si no es indispensable, recueda que tienes que hacer todo tu» | Chat |
| N04 | 2026-09 | Instagram | «cuando abras el instagram no entres automaticamente permiteme poner los datos nuevamente» | Chat |
| N05 | 2026-09 | Contenido | Usar "carro" o "auto", no "coche", para la audiencia panameña. | `CLAUDE.md` (guardián en `herramientas/check.py`) |
| N06 | 2026-10-05 | Todos los proyectos | «Te voy a dar reglas que quiero que implementes desde este momento a todos los proyectos, son reglas diamante» | Chat + `docs/reglas/Reglas-y-forma-de-trabajar-con-Claude-Code.docx` |
| N07 | 2026-10-05 | Web | «pon mayor cantidad de atencion en que no salga como sitio inseguro quiero que se pueda entrar correctamente» + "Sí, actívalo" al proceso automático de HTTPS cada 15 min | Chat |
| N08 | 2026-10-05 | Web | "Sí, hazlo ahora" a quitar y volver a poner josefineauto.com una vez (workflow `dominio.yml`, repedir=true) para que GitHub emita el certificado HTTPS | Chat (pregunta de opción múltiple) |
| N09 | 2026-10-06 | GLE 53 | Precio de publicación: «dejale lo que dice el ciente y de en lo que se venda de ahi se saca la comision» → precio del cliente (ya no se publica, ver N10); la comisión sale del precio final | Chat |
| N10 | 2026-10-06 | GLE 53 | «quita el precio y quita mi numero y di que precio al DM» (post y ficha web; reemplaza el precio publicado de N09) | Chat |
| N11 | 2026-10-14 | Web: GLE 53 y BMW X3 | «En el mercedes quita el Precio a comisiones y pon 65,000 y al Bmw 11,500» → GLE 53 sin etiqueta "A comisión" y $65,000; BMW X3 M Sport 2014 $11,500 (reemplaza N10 para la web). Publicado en la misma sesión por elección del dueño ("Hazlo aquí, por esta vez"), excepción a la regla diamante de precios en sesión nueva | Chat (pregunta de opción múltiple) |
| N12 | 2026-10-15 | Web: Mazda CX-5 2015 | «60 mil Km, 8,500 precio / Quita lo de doble salida de escape» → km 60,000 y precio $8,500 en la web (el post sigue "Precio por DM", como N11). "Doble salida de escape" ya se había quitado de la CX-5 antes de publicarla; el dueño confirmó que el X3 se queda igual. Cifra dada por el dueño en el mensaje; publicada en la misma sesión, como en N11 | Chat |
| N13 | 2026-10-15 | Web: Toyota Corolla LE 2018 | «Sube ese corolla a la pagina web siguiendo lo de siempre ponlo en 10 mil dólares» + respuestas «2018» y «92 mil» → precio $10,000, año 2018, 92,000 km en la web (el post sigue "Precio por DM", como N11). Transmisión no dada: no se publica. Placa tapada y teléfono del letrero trasero difuminado. El collage que mandó parece generado por IA: no se usa (la web promete fotos reales) | Chat |

## Consecuencias de N06 en este proyecto (2026-10-05)
- Gate `herramientas/check.py` en hook Stop y pre-push; lista `PENDIENTE-DUENO.md`; este registro; `CONTINUAR.md`; `IDEAS.md`; agente revisor.
- «Solo APIs oficiales»: ya no se leen datos de Instagram con endpoints no oficiales sin el OK del dueño.
