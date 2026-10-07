# UNESR 2026-2

Semestre 2026-2 · Universidad Nacional Experimental Simón Rodríguez (Núcleo Los Teques) · Administración mención Informática.

Página de estado: https://unesr.ubbedigital.com

Lapso académico (calendario oficial): 28/09/2026 al 13/02/2027. Las constancias indican 27/09/2026 al 12/02/2027; se usan las fechas del calendario.

SGA: https://sga.unesr.edu.ve/#/

## Materias

| Código | Materia | Sección | Horas | Docente | Carpeta |
|--------|---------|---------|-------|---------|---------|
| 32041 | Contabilidad I | 10301 | 2 | Bueno Otamendi, Amilcar Jose de Jesus | [Contabilidad I](Contabilidad%20I) |
| 32061 | Economía General | 10201 | 2 | Meza Palma, Sergio Roldan | [Economia General](Economia%20General) |

## Horario

| Día | Hora | Materia | Aula | Ambiente |
|-----|------|---------|------|----------|
| Jueves | 05:00 - 06:20 pm | Economía General | ARMFCG215 | Ambiente 21 |
| Sábado | 08:40 - 10:00 am | Contabilidad I | ARMFCG208 | Ambiente 10 |

Escala de notas: 1 a 5, mínimo aprobatorio 4. Cada materia tiene 3 unidades de crédito.

## Estructura

- `docs/`: sitio de GitHub Pages.
  - `index.html`: Home (resumen, avance del lapso, materias, horario).
  - `contabilidad-i/`, `economia-general/`: página de cada materia (datos, horario, temario, apuntes, evaluaciones y notas, tareas, material).
  - `assets/data.js`: datos del sitio (materias, horario, evaluaciones, tareas). Es lo único que hay que editar para actualizar las páginas.
  - `assets/app.js`, `assets/style.css`: lógica, navegación y estilos compartidos.
- `Contabilidad I/`, `Economia General/`: archivos de cada materia (README con temario, `Apuntes/` con las notas de clase en Markdown, PDFs, etc.).
- `Documentos/CALENDARIO.md`: calendario académico administrativo 2026-2 (los hitos que muestra la página están en `HITOS` de `assets/data.js`).
- `privado/`: documentos personales (constancias, datos de la API, contactos). Está en `.gitignore` y no se sube al repo.

Para agregar una materia nueva: añadirla en `MATERIAS` dentro de `assets/data.js` y copiar una carpeta de `docs/` cambiando `data-materia` por el nuevo `slug`.
