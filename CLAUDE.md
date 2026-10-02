# UNESR 2026-2

Sitio de GitHub Pages (`docs/`) para llevar el semestre: materias, horario, notas, tareas y apuntes. Ver `README.md` para la estructura.

## Convenciones

- Rama de trabajo: `develop`. `main` es la rama principal para PRs.
- Los datos públicos del sitio se editan solo en `docs/assets/data.js`. Para una materia nueva, ver el final de `README.md`.
- El sitio es estático (HTML + JS sin build). Validar sintaxis con `node --check docs/assets/app.js`.
- Antes de cada commit que toque `docs/assets/`, correr `scripts/version.sh`: agrega `?v=` a los CSS/JS de las páginas para que el navegador no use caché vieja (Pages cachea 10 min).
- Textos y commits en español; commits cortos en imperativo (estilo del historial).

## Datos sensibles

- El repo y la página son públicos: no subir teléfonos, correos, notas, constancias ni datos personales.
- Lo sensible vive en Firestore (`privado/datos`) y solo se muestra con la sesión de Google del dueño abierta (`docs/assets/privado.js`, reglas en `firestore.rules`). Por materia: `evaluaciones`, `tareas`, `material`, `contactos`.
- Archivos locales sensibles van en `privado/`, que está en `.gitignore`.
- Si hay un dato nuevo sensible, agregarlo al esquema de `materias.<slug>` con su sección oculta sin sesión (ver `contactos` en `app.js`), no en `data.js`.

## Apuntes

- Los apuntes de clase van en `<Materia>/Apuntes/AAAA-MM-DD Tema.md` y se registran en `apuntes` (y el plan en `temario`) de la materia en `data.js`.
