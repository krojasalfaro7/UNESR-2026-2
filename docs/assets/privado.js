// Acceso privado: login con Google + datos en Firestore (colección "privado", documento "datos").
// La configuración de Firebase es pública por diseño; lo que protege los datos son las reglas
// de Firestore (ver firestore.rules), que solo permiten leer y escribir al dueño.
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc }
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
const db = getFirestore(app);
const ref = doc(db, "privado", "datos");

const $ = id => document.getElementById(id);
const emit = detail => document.dispatchEvent(new CustomEvent("sesion", { detail }));
const btn = $("sesion");
const plantilla = { perfil: {}, materias: {
  "contabilidad-i": { evaluaciones: [], tareas: [], material: [] },
  "economia-general": { evaluaciones: [], tareas: [], material: [] },
} };

function mensaje(t) {
  const m = $("msg");
  if (m) m.textContent = t;
}

onAuthStateChanged(auth, async user => {
  if (!user) {
    btn.textContent = "Iniciar sesión";
    btn.title = "Desbloquear datos privados";
    emit(null);
    return;
  }
  if (user.email !== OWNER || !user.emailVerified) {
    await signOut(auth);
    btn.textContent = "Sin acceso";
    setTimeout(() => { btn.textContent = "Iniciar sesión"; }, 2500);
    return;
  }
  btn.textContent = "Cerrar sesión";
  btn.title = user.email;
  try {
    const snap = await getDoc(ref);
    const datos = snap.exists() ? snap.data() : {};
    const ta = $("json");
    if (ta) ta.value = JSON.stringify(snap.exists() ? datos : plantilla, null, 2);
    emit(datos);
  } catch (e) {
    console.error(e);
    mensaje("No se pudieron leer los datos: " + e.code);
    emit({});
  }
});

btn.onclick = () => {
  if (auth.currentUser) return signOut(auth);
  return signInWithPopup(auth, new GoogleAuthProvider()).catch(e => {
    if (e.code !== "auth/popup-closed-by-user" && e.code !== "auth/cancelled-popup-request") console.error(e);
  });
};

const guardar = $("guardar");
if (guardar) guardar.onclick = async () => {
  let datos;
  try { datos = JSON.parse($("json").value); }
  catch (e) { return mensaje("JSON inválido: " + e.message); }
  try {
    await setDoc(ref, datos);
    mensaje("Guardado.");
    emit(datos);
  } catch (e) {
    mensaje("No se pudo guardar: " + e.code);
  }
};
