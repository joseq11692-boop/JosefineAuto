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

## Consecuencias de N06 en este proyecto (2026-10-05)
- Gate `herramientas/check.py` en hook Stop y pre-push; lista `PENDIENTE-DUENO.md`; este registro; `CONTINUAR.md`; `IDEAS.md`; agente revisor.
- «Solo APIs oficiales»: ya no se leen datos de Instagram con endpoints no oficiales sin el OK del dueño.
