#!/usr/bin/env bash
# Gate al cerrar cada turno de Claude: si hay cambios en la web o en las herramientas, tiene que salir en verde.
input=$(cat)
if command -v jq >/dev/null 2>&1; then
  segundo=$(printf '%s' "$input" | jq -r '.stop_hook_active // false')
else
  printf '%s' "$input" | grep -Eq '"stop_hook_active": *true' && segundo=true || segundo=false
fi
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
[ -z "$(git status --porcelain -- web herramientas .claude .github)" ] && exit 0
# Sin pipe: nos quedamos con el código de salida real del gate
out=$(python3 herramientas/check.py 2>&1); code=$?
[ "$code" -eq 0 ] && exit 0
if [ "$segundo" = "true" ]; then
  printf '{"systemMessage":"Turno cerrado con el gate en ROJO (exit %s). No hagas push hasta arreglarlo."}\n' "$code"
  exit 0
fi
echo "El gate ha fallado (exit $code). Arréglalo antes de terminar:" >&2
printf '%s\n' "$out" | tail -n 40 >&2
exit 2
