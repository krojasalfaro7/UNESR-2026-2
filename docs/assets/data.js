// Fuente única de datos del sitio. Editar aquí y todas las páginas se actualizan.
const REPO = "https://github.com/krojasalfaro7/UNESR-2026-2/tree/develop/";

const SITIO = {
  titulo: "Semestre 2026-2",
  subtitulo: "UNESR · Núcleo Los Teques · Administración mención Informática (plan 1982)",
  // Fechas del calendario académico oficial (Documentos/CALENDARIO.md)
  lapso: { inicio: "2026-09-28", fin: "2027-02-13" },
  sga: "https://sga.unesr.edu.ve/#/",
};

// Enlaces útiles del Home.
const ENLACES = [
  { titulo: "SGA", url: SITIO.sga, nota: "Portal de la UNESR" },
  { titulo: "Instagram del Núcleo Los Teques", url: "https://www.instagram.com/unesr.losteques.oficial/", nota: "@unesr.losteques.oficial · cuenta oficial del núcleo" },
  { titulo: "Facebook del Núcleo Los Teques", url: "https://www.facebook.com/unesr.losteques.oficial/", nota: "Unesr Los Teques Ofic" },
];

// Hitos del calendario académico. fin: null = fecha única.
const HITOS = [
  { nombre: "Modificación de inscripción", inicio: "2026-09-28", fin: "2026-10-03" },
  { nombre: "Entrega de acuerdo de aprendizaje", inicio: "2026-09-28", fin: "2026-10-03" },
  { nombre: "Inicio de actividades académicas", inicio: "2026-09-28", fin: null },
  { nombre: "Receso por festividades navideñas", inicio: "2026-12-16", fin: null, nota: "El calendario no indica el fin; las clases continúan el 11/01." },
  { nombre: "Continuación de actividades académicas", inicio: "2027-01-11", fin: null },
  { nombre: "Recuperación académica", inicio: "2027-02-08", fin: "2027-02-13" },
  { nombre: "Cierre del período", inicio: "2027-02-13", fin: null },
  { nombre: "Carga de notas y consignación en Control de Estudios", inicio: "2027-02-08", fin: "2027-02-26", nota: "Correo: notasunesrlosteques@gmail.com" },
];

// aula: código de aula asignado a la materia (null = aún sin asignar)
// evaluaciones: { nombre, fecha: "AAAA-MM-DD", peso: %, nota: 0-20 | null }
// tareas: { titulo, entrega: "AAAA-MM-DD", hecha: bool }
// material: { titulo, url }
const MATERIAS = [
  { slug: "contabilidad-i", nombre: "Contabilidad I", codigo: "32041", seccion: "10301", horas: 2,
    docente: "Bueno Otamendi, Amilcar Jose de Jesus", aula: null, carpeta: "Contabilidad%20I",
    evaluaciones: [], tareas: [], material: [] },
  { slug: "economia-general", nombre: "Economía General", codigo: "32061", seccion: "10201", horas: 2,
    docente: "Meza Palma, Sergio Roldan", aula: null, carpeta: "Economia%20General",
    evaluaciones: [], tareas: [], material: [] },
];

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const BLOQUES = ["07:00 - 07:40 am","07:40 - 08:20 am","08:40 - 09:20 am","09:20 - 10:00 am","10:10 - 10:50 am","10:50 - 11:30 am","11:30 - 12:10 am","12:30 - 01:10 pm","01:10 - 01:50 pm","02:10 - 02:50 pm","02:50 - 03:30 pm","03:40 - 04:20 pm","04:20 - 05:00 pm","05:00 - 05:40 pm","05:40 - 06:20 pm","06:30 - 07:10 pm","07:10 - 07:55 pm","08:00 - 08:40 pm","08:40 - 09:20 pm"];
// [dia, bloque, aula, ambiente]
const CLASES = [
  [5, 2, "ARMFCG208", "Ambiente 10"], [5, 3, "ARMFCG208", "Ambiente 10"],
  [3, 13, "ARMFCG215", "Ambiente 21"], [3, 14, "ARMFCG215", "Ambiente 21"],
];
const COLORES = { ARMFCG208: "var(--a)", ARMFCG215: "var(--b)" };
