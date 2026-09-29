// Acceso privado: login con Google + datos en Firestore (colección "privado", documento "datos").
// La configuración de Firebase es pública por diseño; lo que protege los datos son las reglas
// de Firestore (ver firestore.rules), que solo permiten leer y escribir al dueño.
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { initializeFirestore, doc, getDoc, setDoc }
  from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const OWNER = "krojas.alfaro7@gmail.com";
const app = initializeApp({
  apiKey: "AIzaSyDwF35ADRYMwICFH6qFztj6Dsj6tUc3Hs8",
  authDomain: "unesr-c564e.firebaseapp.com",
  projectId: "unesr-c564e",
  storageBucket: "unesr-c564e.firebasestorage.app",
  messagingSenderId: "547214216107",
  appId: "1:547214216107:web:66c60718e050fd13b1e0ee",
});
const auth = getAuth(app);
// Si la conexión en tiempo real es lenta o la bloquea la red, cambia sola a long polling.
const db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
const ref = doc(db, "privado", "datos");

const $ = id => document.getElementById(id);
const emit = detail => document.dispatchEvent(new CustomEvent("sesion", { detail }));
const btn = $("sesion");
const plantilla = { perfil: {}, materias: {
  "contabilidad-i": { evaluaciones: [], tareas: [], material: [] },
  "economia-general": { evaluaciones: [], tareas: [], material: [] },
} };
let datos = {};
let t0 = 0;

function mensaje(t) {
  const m = $("msg");
  if (m) m.textContent = t;
}

// Guarda un campo de una materia (evaluaciones, tareas o material) y vuelve a pintar.
window.PRIV = {
  async guardar(slug, campo, arr) {
    const previo = (datos.materias || {})[slug] || {};
    const nuevo = { ...datos, materias: { ...datos.materias, [slug]: { ...previo, [campo]: arr } } };
    await setDoc(ref, { materias: { [slug]: { [campo]: arr } } }, { merge: true });
    datos = nuevo;
    emit(datos);
  },
};

onAuthStateChanged(auth, async user => {
  if (!user) {
    datos = {};
    btn.textContent = "Iniciar sesión";
    btn.title = "Desbloquear datos privados";
    btn.disabled = false;
    emit(null);
    return;
  }
  if (user.email !== OWNER || !user.emailVerified) {
    await signOut(auth);
    btn.textContent = "Sin acceso";
    setTimeout(() => { btn.textContent = "Iniciar sesión"; }, 2500);
    return;
  }
  btn.textContent = "Cargando datos…";
  btn.disabled = true;
  btn.title = user.email;
  const t1 = performance.now();
  try {
    const snap = await getDoc(ref);
    datos = snap.exists() ? snap.data() : {};
    const ta = $("json");
    if (ta) ta.value = JSON.stringify(snap.exists() ? datos : plantilla, null, 2);
    console.info(`[privado] login ${Math.round(t1 - t0)} ms · lectura Firestore ${Math.round(performance.now() - t1)} ms`);
    emit(datos);
  } catch (e) {
    console.error(e);
    mensaje("No se pudieron leer los datos: " + e.code);
    emit({});
  }
  btn.textContent = "Cerrar sesión";
  btn.disabled = false;
});

btn.onclick = () => {
  if (auth.currentUser) return signOut(auth);
  t0 = performance.now();
  btn.textContent = "Abriendo Google…";
  return signInWithPopup(auth, new GoogleAuthProvider()).catch(e => {
    btn.textContent = "Iniciar sesión";
    if (e.code !== "auth/popup-closed-by-user" && e.code !== "auth/cancelled-popup-request") console.error(e);
  });
};

const guardar = $("guardar");
if (guardar) guardar.onclick = async () => {
  let nuevo;
  try { nuevo = JSON.parse($("json").value); }
  catch (e) { return mensaje("JSON inválido: " + e.message); }
  try {
    await setDoc(ref, nuevo);
    datos = nuevo;
    mensaje("Guardado.");
    emit(datos);
  } catch (e) {
    mensaje("No se pudo guardar: " + e.code);
  }
};
