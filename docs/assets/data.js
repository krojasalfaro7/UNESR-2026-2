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
  { nombre: "Prueba de recuperación de Economía General (oral)", inicio: "2027-02-03", fin: null },
  { nombre: "Recuperación académica", inicio: "2027-02-08", fin: "2027-02-13" },
  { nombre: "Cierre del período", inicio: "2027-02-13", fin: null },
  { nombre: "Carga de notas y consignación en Control de Estudios", inicio: "2027-02-08", fin: "2027-02-26", nota: "Correo: notasunesrlosteques@gmail.com" },
];

// Escala de notas de la oferta ("1-5 Min 4").
const ESCALA = { min: 1, max: 5, aprobatoria: 4 };

// aula: código de aula asignado a la materia (null = aún sin asignar)
// uc: unidades de crédito; cupo: { inscritos, capacidad } según la oferta del período
// evaluaciones: { nombre, fecha: "AAAA-MM-DD", peso: %, nota: 1-5 | null }
// tareas: { titulo, entrega: "AAAA-MM-DD", hecha: bool }
// material: { titulo, url }
// temario: lista de temas del plan de la materia; apuntes: { fecha, titulo, archivo } (ruta dentro de la carpeta de la materia)
const MATERIAS = [
  { slug: "contabilidad-i", nombre: "Contabilidad I", codigo: "32041", seccion: "10301", horas: 2,
    docente: "Bueno Otamendi, Amilcar Jose de Jesus", aula: "ARMFCG208", uc: 3, cupo: { inscritos: 2, capacidad: 5 }, carpeta: "Contabilidad%20I",
    evaluaciones: [], tareas: [], material: [], temario: [],
    apuntes: [{ fecha: "2026-10-10", titulo: "Definición de contabilidad y ecuación contable", archivo: "Apuntes/2026-10-10%20Definicion%20y%20ecuacion%20contable.md" }] },
  { slug: "economia-general", nombre: "Economía General", codigo: "32061", seccion: "10201", horas: 2,
    docente: "Meza Palma, Sergio Roldan", aula: "ARMFCG215", uc: 3, cupo: { inscritos: 4, capacidad: 5 }, carpeta: "Economia%20General",
    evaluaciones: [
      { nombre: "I Evaluación: Ensayo (unidades I y II)", fecha: "2026-10-22", peso: 25, nota: null },
      { nombre: "II Evaluación: Exposiciones en grupo (unidades III y IV)", fecha: "2026-11-12", peso: 25, nota: null },
      { nombre: "III Evaluación: Taller en grupo (unidades V, VI y VII)", fecha: "2026-12-03", peso: 25, nota: null },
      { nombre: "IV Evaluación: Debate en grupo (unidades VIII, IX y X)", fecha: "2027-01-28", peso: 25, nota: null },
    ],
    tareas: [
      { titulo: "Enviar por correo el ensayo (unidades I y II)", entrega: "2026-10-22", hecha: false },
      { titulo: "Enviar por correo la monografía (unidades III y IV)", entrega: "2026-11-12", hecha: false },
      { titulo: "Enviar por correo la monografía (unidades VIII, IX y X)", entrega: "2027-01-28", hecha: false },
    ],
    material: [{ titulo: "Bibliografía del contrato de aprendizaje", url: "https://github.com/krojasalfaro7/UNESR-2026-2/blob/develop/Economia%20General/Bibliografia.md" }],
    temario: [
      "I. La ciencia económica",
      "II. La producción y el equilibrio económico",
      "III. El capitalismo y el imperialismo",
      "IV. El socialismo y el imperialismo soviético",
      "V. La demanda",
      "VI. La oferta",
      "VII. Los mercados",
      "VIII. Teoría de la moneda y el crédito",
      "IX. Producto bruto, inflación y desempleo",
      "X. Objetivos e instrumentos de la política económica",
    ],
    apuntes: [{ fecha: "2026-10-01", titulo: "Introducción: concepto de economía, Adam Smith y oferta y demanda", archivo: "Apuntes/2026-10-01%20Introduccion.md" }] },
];

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const BLOQUES = ["07:00 - 07:40 am","07:40 - 08:20 am","08:40 - 09:20 am","09:20 - 10:00 am","10:10 - 10:50 am","10:50 - 11:30 am","11:30 - 12:10 am","12:30 - 01:10 pm","01:10 - 01:50 pm","02:10 - 02:50 pm","02:50 - 03:30 pm","03:40 - 04:20 pm","04:20 - 05:00 pm","05:00 - 05:40 pm","05:40 - 06:20 pm","06:30 - 07:10 pm","07:10 - 07:55 pm","08:00 - 08:40 pm","08:40 - 09:20 pm"];
// [dia, bloque, aula, ambiente]
const CLASES = [
  [5, 2, "ARMFCG208", "Ambiente 10"], [5, 3, "ARMFCG208", "Ambiente 10"],
  [3, 13, "ARMFCG215", "Ambiente 21"], [3, 14, "ARMFCG215", "Ambiente 21"],
];
const COLORES = { ARMFCG208: "var(--a)", ARMFCG215: "var(--b)" };
