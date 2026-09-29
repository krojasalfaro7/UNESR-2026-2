# UNESR 2026-2

Semestre 2026-2 · Universidad Nacional Experimental Simón Rodríguez (Núcleo Los Teques) · Administración mención Informática.

Página de estado: https://krojasalfaro7.github.io/UNESR-2026-2

Lapso académico: 27/09/2026 al 12/02/2027.

## Materias

| Código | Materia | Sección | Horas | Docente | Carpeta |
|--------|---------|---------|-------|---------|---------|
| 32041 | Contabilidad I | 10301 | 2 | Bueno Otamendi, Amilcar Jose de Jesus | [Contabilidad I](Contabilidad%20I) |
| 32061 | Economía General | 10201 | 2 | Meza Palma, Sergio Roldan | [Economia General](Economia%20General) |

## Horario

| Día | Hora | Aula | Ambiente |
|-----|------|------|----------|
| Jueves | 05:00 - 06:20 pm | ARMFCG215 | Ambiente 21 |
| Sábado | 08:40 - 10:00 am | ARMFCG208 | Ambiente 10 |

Pendiente: asignar cada aula a su materia (las constancias no lo indican).

## Estructura

- `docs/`: sitio de GitHub Pages.
  - `index.html`: Home (resumen, avance del lapso, materias, horario).
  - `contabilidad-i/`, `economia-general/`: página de cada materia (datos, horario, evaluaciones y notas, tareas, material).
  - `assets/data.js`: datos del sitio (materias, horario, evaluaciones, tareas). Es lo único que hay que editar para actualizar las páginas.
  - `assets/app.js`, `assets/style.css`: lógica, navegación y estilos compartidos.
- `Contabilidad I/`, `Economia General/`: archivos de cada materia (apuntes, PDFs, etc.).
- Constancias de estudios e inscripción (PDF).

Para agregar una materia nueva: añadirla en `MATERIAS` dentro de `assets/data.js` y copiar una carpeta de `docs/` cambiando `data-materia` por el nuevo `slug`.
