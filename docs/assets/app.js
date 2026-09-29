(function () {
  const root = document.body.dataset.root || "";
  const slug = document.body.dataset.materia || "";
  const $ = id => document.getElementById(id);
  const fmt = d => d.toLocaleDateString("es-VE", { day: "numeric", month: "short", year: "numeric" });
  const hoy = new Date();
  let privado = false;
  const esc = t => String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Datos públicos originales, para restaurarlos al cerrar sesión.
  const base = MATERIAS.map(m => ({ evaluaciones: m.evaluaciones, tareas: m.tareas, material: m.material }));

  // ---- Tema ----
  const raiz = document.documentElement;
  const sistema = matchMedia("(prefers-color-scheme: dark)");
  const temaActual = () => raiz.dataset.theme || (sistema.matches ? "dark" : "light");
  try { const t = localStorage.getItem("tema"); if (t) raiz.dataset.theme = t; } catch (e) {}

  // ---- Navegación ----
  const links = [`<a href="${root || "./"}" class="${slug ? "" : "on"}">Home</a>`]
    .concat(MATERIAS.map(m => `<a href="${root}${m.slug}/" class="${m.slug === slug ? "on" : ""}">${m.nombre}</a>`));
  $("nav").innerHTML = `<div class="in">${links.join("")}<span class="sp"></span><a class="sga" href="${SITIO.sga}" target="_blank" rel="noopener">SGA ↗</a><button id="sesion" type="button">Iniciar sesión</button><button id="copiar" type="button" title="Copiar enlace del SGA">Copiar enlace</button><button id="tema" type="button" aria-label="Cambiar tema"></button></div>`;
  const btn = $("tema");
  const pintar = () => { btn.textContent = temaActual() === "dark" ? "☀️ Modo claro" : "🌙 Modo oscuro"; };
  btn.onclick = () => {
    const t = temaActual() === "dark" ? "light" : "dark";
    raiz.dataset.theme = t;
    try { localStorage.setItem("tema", t); } catch (e) {}
    pintar();
  };
  pintar();

  $("copiar").onclick = async () => {
    const b = $("copiar");
    try { await navigator.clipboard.writeText(SITIO.sga); }
    catch (e) {
      const t = document.createElement("textarea");
      t.value = SITIO.sga; document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); } catch (e2) {}
      t.remove();
    }
    b.textContent = "¡Copiado!";
    setTimeout(() => { b.textContent = "Copiar enlace"; }, 1500);
  };

  const vacio = t => `<p class="empty">${t}</p>`;
  const kpis = arr => arr.map(([v, l]) => `<div class="kpi"><b>${v}</b><span>${l}</span></div>`).join("");

  // ---- Horario (compartido) ----
  function horario(clases, colorDe, etiquetaDe = a => a) {
    if (!clases.length) return vacio("Sin horario asignado todavía.");
    const usados = clases.map(c => c[1]);
    const desde = Math.min(...usados) - 1, hasta = Math.max(...usados) + 1;
    const hoyIdx = (hoy.getDay() + 6) % 7;
    let h = `<tr><th>Hora</th>${DIAS.map((d, i) => `<th class="${i === hoyIdx ? "hoy" : ""}">${d}</th>`).join("")}</tr>`;
    BLOQUES.forEach((hora, b) => {
      if (!usados.includes(b) && b !== desde && b !== hasta) return;
      h += `<tr><td class="hora">${hora}</td>` + DIAS.map((_, d) => {
        const c = clases.find(x => x[0] === d && x[1] === b);
        return c ? `<td><div class="cls" style="background:${colorDe(c[2])}">${etiquetaDe(c[2])}<small>${c[2]} · ${c[3]}</small></div></td>` : "<td></td>";
      }).join("") + "</tr>";
    });
    return `<div class="scroll"><table class="grid">${h}</table></div>`;
  }

  // ---- Hitos del calendario ----
  const DIA = 864e5;
  const dia0 = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const aFecha = t => new Date(t + "T00:00");
  const corto = d => d.toLocaleDateString("es-VE", { day: "numeric", month: "short" });
  const cuando = n => n <= 0 ? "hoy" : n === 1 ? "mañana" : `en ${n} días`;
  function hitosEstado() {
    return HITOS.map(h => {
      const ini = aFecha(h.inicio), fin = aFecha(h.fin || h.inicio);
      const estado = dia0 > fin ? "pasado" : dia0 >= ini ? "curso" : "prox";
      const dias = estado === "curso" ? Math.round((fin - dia0) / DIA) : Math.round((ini - dia0) / DIA);
      return { ...h, ini, fin, estado, dias };
    });
  }
  function proximoHito(hs) {
    const vivos = hs.filter(h => h.estado !== "pasado");
    // primero lo que está en curso y vence antes; luego lo que viene
    return vivos.filter(h => h.estado === "curso").sort((a, b) => a.dias - b.dias)[0]
        || vivos.sort((a, b) => a.dias - b.dias)[0];
  }
  function timeline(hs) {
    return `<ul class="tl">${hs.map(h => {
      const fecha = h.fin ? `${corto(h.ini)} – ${corto(h.fin)}` : corto(h.ini);
      const est = h.estado === "pasado" ? "Pasado"
        : h.estado === "curso" ? (h.dias <= 0 ? "Vence hoy" : `En curso · vence ${cuando(h.dias)}`)
        : `Comienza ${cuando(h.dias)}`;
      return `<li class="${h.estado}"><span class="fecha">${fecha}</span><span class="que">${h.nombre}${h.nota ? `<small>${h.nota}</small>` : ""}</span><span class="est">${est}</span></li>`;
    }).join("")}</ul>`;
  }

  // ---- Enlaces útiles ----
  function enlaces() {
    if (!ENLACES.length) return vacio("Todavía no hay enlaces.");
    return `<ul>${ENLACES.map(e =>
      `<li><a href="${e.url}" target="_blank" rel="noopener">${e.titulo} ↗</a> <span class="muted">${e.nota}</span></li>`).join("")}</ul>`;
  }

  // ---- Home ----
  function home() {
    document.title = `UNESR 2026-2 · Home`;
    $("titulo").textContent = SITIO.titulo;
    $("sub").textContent = SITIO.subtitulo;
    const ini = new Date(SITIO.lapso.inicio + "T00:00"), fin = new Date(SITIO.lapso.fin + "T00:00"), dia = 864e5;
    const total = Math.round((fin - ini) / dia);
    const pasado = Math.min(Math.max(Math.floor((hoy - ini) / dia), 0), total);
    const pct = Math.round(pasado / total * 100);
    const semTotal = Math.ceil(total / 7), semActual = Math.min(Math.floor(pasado / 7) + 1, semTotal);
    const hs = hitosEstado(), prox = proximoHito(hs);
    $("kpis").innerHTML = kpis([
      [MATERIAS.length, "materias inscritas"],
      prox ? [prox.dias <= 0 ? "Hoy" : `${prox.dias} d`,
              `${prox.estado === "curso" ? "para que venza" : "para"}: ${prox.nombre}`] : ["—", "sin hitos pendientes"],
      [`${semActual}/${semTotal}`, "semana del lapso"],
      [MATERIAS.reduce((s, m) => s + m.tareas.filter(t => !t.hecha).length, 0), "tareas pendientes"],
    ]);
    $("prog").style.width = pct + "%";
    $("ini").textContent = fmt(ini);
    $("fin").textContent = fmt(fin);
    $("pct").textContent = `${pct}% · día ${pasado} de ${total}`;
    $("mats").innerHTML = MATERIAS.map(m =>
      `<a class="mat" href="${m.slug}/"><b>${m.nombre}</b><span>${m.codigo} · sección ${m.seccion} · ${m.horas} h</span><span>${m.docente}</span></a>`).join("");
    $("hitos").innerHTML = timeline(hs);
    const nombreDe = a => (MATERIAS.find(m => m.aula === a) || {}).nombre || a;
    $("horario").innerHTML = horario(CLASES, a => COLORES[a] || "var(--accent)", nombreDe);
    $("enlaces").innerHTML = enlaces();
  }

  // ---- Materia ----
  function materia() {
    const m = MATERIAS.find(x => x.slug === slug);
    if (!m) { $("titulo").textContent = "Materia no encontrada"; return; }
    document.title = `${m.nombre} · UNESR 2026-2`;
    $("titulo").textContent = m.nombre;
    $("sub").textContent = `${m.codigo} · sección ${m.seccion} · ${m.docente}`;
    const pend = m.tareas.filter(t => !t.hecha).length;
    const notas = m.evaluaciones.filter(e => e.nota != null);
    const pesoEval = notas.reduce((s, e) => s + e.peso, 0);
    const prom = pesoEval ? notas.reduce((s, e) => s + e.nota * e.peso, 0) / pesoEval : null;
    const cls = n => n >= ESCALA.aprobatoria ? "ok" : "bad";
    $("kpis").innerHTML = kpis([
      [m.evaluaciones.length, "evaluaciones"],
      [pend, "tareas pendientes"],
      [prom != null ? `<span class="${cls(prom)}">${prom.toFixed(1)}</span>` : "—",
        `promedio ponderado (escala ${ESCALA.min}–${ESCALA.max}, mínimo ${ESCALA.aprobatoria})`],
      [m.material.length, "recursos de material"],
    ]);

    $("datos").innerHTML = `<table><tbody>
      <tr><th>Código</th><td>${m.codigo}</td></tr>
      <tr><th>Sección</th><td>${m.seccion}</td></tr>
      <tr><th>Horas semanales</th><td>${m.horas}</td></tr>
      <tr><th>Unidades de crédito</th><td>${m.uc}</td></tr>
      <tr><th>Cupo</th><td>${m.cupo.inscritos} inscritos de ${m.cupo.capacidad}</td></tr>
      <tr><th>Aula</th><td>${m.aula || "Sin asignar"}</td></tr>
      <tr><th>Docente</th><td>${m.docente}</td></tr>
    </tbody></table>`;

    if (m.aula) {
      $("horario").innerHTML = horario(CLASES.filter(c => c[2] === m.aula), () => "var(--accent)", () => m.nombre);
    } else {
      $("horario").innerHTML = vacio("Aún no está asignada el aula de esta materia. Ver el horario general en Home.");
    }

    // Evaluaciones, tareas y material: solo se pueden editar con la sesión abierta.
    const edit = privado && window.PRIV;
    const msg = t => { const el = $("msg-mat"); if (el) el.textContent = t; };
    const guardar = async (campo, arr) => {
      msg("Guardando…");
      try { await window.PRIV.guardar(m.slug, campo, arr); msg(""); }
      catch (e) { msg("No se pudo guardar: " + (e.code || e.message)); }
    };
    const porFecha = k => (a, b) => (a[k] || "9999").localeCompare(b[k] || "9999");
    const fechaTxt = f => f ? fmt(new Date(f + "T00:00")) : "—";
    const del = (attr, campo, lista, texto) => $(campo).querySelectorAll(`[${attr}]`).forEach(b => b.onclick = () => {
      if (confirm(texto)) guardar(campo === "evals" ? "evaluaciones" : campo, lista.filter((_, i) => i !== Number(b.getAttribute(attr))));
    });
    const x = attr => i => edit ? `<td><button class="x" ${attr}="${i}" title="Borrar" aria-label="Borrar">✕</button></td>` : "";

    // Evaluaciones
    const pesoTotal = m.evaluaciones.reduce((s, e) => s + e.peso, 0);
    $("evals").innerHTML = (m.evaluaciones.length
      ? `<div class="scroll"><table><thead><tr><th>Evaluación</th><th>Fecha</th><th>Peso</th><th>Nota</th>${edit ? "<th></th>" : ""}</tr></thead><tbody>${
          m.evaluaciones.map((e, i) => `<tr><td>${esc(e.nombre)}</td><td>${fechaTxt(e.fecha)}</td><td>${e.peso}%</td><td>${
            edit ? `<input class="mini" type="number" min="${ESCALA.min}" max="${ESCALA.max}" step="0.1" value="${e.nota ?? ""}" data-nota="${i}" aria-label="Nota">`
                 : e.nota == null ? "—" : `<span class="${cls(e.nota)}">${e.nota}</span>`}</td>${x("data-del-eval")(i)}</tr>`).join("")
        }</tbody></table></div>`
      : vacio("Todavía no hay evaluaciones registradas."))
      + (edit && m.evaluaciones.length && pesoTotal !== 100 ? `<p class="muted">Peso total registrado: ${pesoTotal}% (debería sumar 100%).</p>` : "")
      + (edit ? `<form class="frm" id="f-eval"><input name="nombre" placeholder="Evaluación" required>
          <input name="fecha" type="date" aria-label="Fecha"><input class="mini" name="peso" type="number" min="1" max="100" placeholder="Peso %" required>
          <input class="mini" name="nota" type="number" min="${ESCALA.min}" max="${ESCALA.max}" step="0.1" placeholder="Nota"><button class="btn">Agregar</button></form>` : "");

    // Tareas
    $("tareas").innerHTML = (m.tareas.length
      ? `<div class="scroll"><table><thead><tr><th>Tarea</th><th>Entrega</th><th>Estado</th>${edit ? "<th></th>" : ""}</tr></thead><tbody>${
          m.tareas.map((t, i) => `<tr><td>${esc(t.titulo)}</td><td>${fechaTxt(t.entrega)}</td><td>${
            edit ? `<label><input type="checkbox" data-hecha="${i}" ${t.hecha ? "checked" : ""}> Hecha</label>` : t.hecha ? "Hecha" : "Pendiente"}</td>${x("data-del-tarea")(i)}</tr>`).join("")
        }</tbody></table></div>`
      : vacio("Todavía no hay tareas registradas."))
      + (edit ? `<form class="frm" id="f-tarea"><input name="titulo" placeholder="Tarea" required>
          <input name="entrega" type="date" aria-label="Entrega"><button class="btn">Agregar</button></form>` : "");

    // Material (por enlace)
    const carpeta = `<p><a href="${REPO}${m.carpeta}">Abrir carpeta de la materia en GitHub</a></p>`;
    $("material").innerHTML = carpeta + (m.material.length
      ? `<ul>${m.material.map((it, i) => `<li><a href="${esc(it.url)}" target="_blank" rel="noopener">${esc(it.titulo)} ↗</a>${
          edit ? ` <button class="x" data-del-mat="${i}" title="Borrar" aria-label="Borrar">✕</button>` : ""}</li>`).join("")}</ul>`
      : vacio("Todavía no hay material cargado."))
      + (edit ? `<form class="frm" id="f-mat"><input name="titulo" placeholder="Título" required>
          <input name="url" type="url" placeholder="https://…" required><button class="btn">Agregar</button></form>` : "");

    if (!edit) return;

    $("f-eval").onsubmit = ev => {
      ev.preventDefault();
      const f = new FormData(ev.target), nota = f.get("nota");
      guardar("evaluaciones", [...m.evaluaciones, { nombre: f.get("nombre").trim(), fecha: f.get("fecha") || null,
        peso: Number(f.get("peso")), nota: nota === "" ? null : Number(nota) }].sort(porFecha("fecha")));
    };
    $("evals").querySelectorAll("[data-nota]").forEach(inp => inp.onchange = () => {
      const v = inp.value === "" ? null : Number(inp.value);
      if (v != null && (v < ESCALA.min || v > ESCALA.max)) return msg(`La nota debe estar entre ${ESCALA.min} y ${ESCALA.max}.`);
      guardar("evaluaciones", m.evaluaciones.map((e, i) => i === Number(inp.dataset.nota) ? { ...e, nota: v } : e));
    });
    del("data-del-eval", "evals", m.evaluaciones, "¿Borrar esta evaluación?");

    $("f-tarea").onsubmit = ev => {
      ev.preventDefault();
      const f = new FormData(ev.target);
      guardar("tareas", [...m.tareas, { titulo: f.get("titulo").trim(), entrega: f.get("entrega") || null, hecha: false }].sort(porFecha("entrega")));
    };
    $("tareas").querySelectorAll("[data-hecha]").forEach(c => c.onchange = () =>
      guardar("tareas", m.tareas.map((t, i) => i === Number(c.dataset.hecha) ? { ...t, hecha: c.checked } : t)));
    del("data-del-tarea", "tareas", m.tareas, "¿Borrar esta tarea?");

    $("f-mat").onsubmit = ev => {
      ev.preventDefault();
      const f = new FormData(ev.target), url = f.get("url").trim();
      if (!/^https?:\/\//i.test(url)) return msg("El enlace debe empezar por http:// o https://");
      guardar("material", [...m.material, { titulo: f.get("titulo").trim(), url }]);
    };
    del("data-del-mat", "material", m.material, "¿Quitar este material?");
  }

  // ---- Datos privados (llegan desde assets/privado.js tras iniciar sesión) ----
  const ETIQUETAS = { nombre: "Nombre", nucleo: "Núcleo", plan: "Plan", titulo: "Título", condicion: "Condición", estado: "Estado",
    ingreso: "Fecha de ingreso", periodo_ingreso: "Período de ingreso", tipo_matricula: "Tipo de matrícula", turno: "Turno",
    promedio: "Promedio (1–5)", observacion: "Observación" };
  function perfil(d) {
    const card = $("card-privado");
    if (!card) return;
    card.hidden = !d;
    if (!d) return;
    const filas = Object.entries(d.perfil || {});
    $("perfil").innerHTML = filas.length
      ? `<table><tbody>${filas.map(([k, v]) => `<tr><th>${ETIQUETAS[k] || k}</th><td>${v}</td></tr>`).join("")}</tbody></table>`
      : vacio("Aún no hay perfil cargado. Usa el editor de abajo.");
  }
  document.addEventListener("sesion", e => {
    const d = e.detail;
    privado = !!d;
    MATERIAS.forEach((m, i) => {
      const p = (d && d.materias && d.materias[m.slug]) || {};
      m.evaluaciones = p.evaluaciones || base[i].evaluaciones;
      m.tareas = p.tareas || base[i].tareas;
      m.material = p.material || base[i].material;
    });
    slug ? materia() : home();
    perfil(d);
  });

  slug ? materia() : home();
})();
