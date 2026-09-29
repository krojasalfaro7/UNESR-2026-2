(function () {
  const root = document.body.dataset.root || "";
  const slug = document.body.dataset.materia || "";
  const $ = id => document.getElementById(id);
  const fmt = d => d.toLocaleDateString("es-VE", { day: "numeric", month: "short", year: "numeric" });
  const hoy = new Date();

  // ---- Tema ----
  const raiz = document.documentElement;
  const sistema = matchMedia("(prefers-color-scheme: dark)");
  const temaActual = () => raiz.dataset.theme || (sistema.matches ? "dark" : "light");
  try { const t = localStorage.getItem("tema"); if (t) raiz.dataset.theme = t; } catch (e) {}

  // ---- Navegación ----
  const links = [`<a href="${root || "./"}" class="${slug ? "" : "on"}">Home</a>`]
    .concat(MATERIAS.map(m => `<a href="${root}${m.slug}/" class="${m.slug === slug ? "on" : ""}">${m.nombre}</a>`));
  $("nav").innerHTML = `<div class="in">${links.join("")}<span class="sp"></span><a class="sga" href="${SITIO.sga}" target="_blank" rel="noopener">SGA ↗</a><button id="copiar" type="button" title="Copiar enlace del SGA">Copiar enlace</button><button id="tema" type="button" aria-label="Cambiar tema"></button></div>`;
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
  function horario(clases, colorDe) {
    if (!clases.length) return vacio("Sin horario asignado todavía.");
    const usados = clases.map(c => c[1]);
    const desde = Math.min(...usados) - 1, hasta = Math.max(...usados) + 1;
    const hoyIdx = (hoy.getDay() + 6) % 7;
    let h = `<tr><th>Hora</th>${DIAS.map((d, i) => `<th class="${i === hoyIdx ? "hoy" : ""}">${d}</th>`).join("")}</tr>`;
    BLOQUES.forEach((hora, b) => {
      if (!usados.includes(b) && b !== desde && b !== hasta) return;
      h += `<tr><td class="hora">${hora}</td>` + DIAS.map((_, d) => {
        const c = clases.find(x => x[0] === d && x[1] === b);
        return c ? `<td><div class="cls" style="background:${colorDe(c[2])}">${c[2]}<small>${c[3]}</small></div></td>` : "<td></td>";
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
    $("horario").innerHTML = horario(CLASES, a => COLORES[a] || "var(--accent)");
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
    const acum = notas.reduce((s, e) => s + e.nota * e.peso / 100, 0);
    $("kpis").innerHTML = kpis([
      [m.evaluaciones.length, "evaluaciones"],
      [pend, "tareas pendientes"],
      [notas.length ? acum.toFixed(1) : "—", "nota acumulada (sobre 20)"],
      [m.material.length, "recursos de material"],
    ]);

    $("datos").innerHTML = `<table><tbody>
      <tr><th>Código</th><td>${m.codigo}</td></tr>
      <tr><th>Sección</th><td>${m.seccion}</td></tr>
      <tr><th>Horas semanales</th><td>${m.horas}</td></tr>
      <tr><th>Docente</th><td>${m.docente}</td></tr>
    </tbody></table>`;

    if (m.aula) {
      $("horario").innerHTML = horario(CLASES.filter(c => c[2] === m.aula), () => "var(--accent)");
    } else {
      $("horario").innerHTML = vacio("Aún no está asignada el aula de esta materia. Ver el horario general en Home.");
    }

    $("evals").innerHTML = m.evaluaciones.length
      ? `<div class="scroll"><table><thead><tr><th>Evaluación</th><th>Fecha</th><th>Peso</th><th>Nota</th></tr></thead><tbody>${
          m.evaluaciones.map(e => `<tr><td>${e.nombre}</td><td>${e.fecha ? fmt(new Date(e.fecha + "T00:00")) : "—"}</td><td>${e.peso}%</td><td>${e.nota ?? "—"}</td></tr>`).join("")
        }</tbody></table></div>`
      : vacio("Todavía no hay evaluaciones registradas.");

    $("tareas").innerHTML = m.tareas.length
      ? `<div class="scroll"><table><thead><tr><th>Tarea</th><th>Entrega</th><th>Estado</th></tr></thead><tbody>${
          m.tareas.map(t => `<tr><td>${t.titulo}</td><td>${t.entrega ? fmt(new Date(t.entrega + "T00:00")) : "—"}</td><td>${t.hecha ? "Hecha" : "Pendiente"}</td></tr>`).join("")
        }</tbody></table></div>`
      : vacio("Todavía no hay tareas registradas.");

    const carpeta = `<p><a href="${REPO}${m.carpeta}">Abrir carpeta de la materia en GitHub</a></p>`;
    $("material").innerHTML = carpeta + (m.material.length
      ? `<ul>${m.material.map(x => `<li><a href="${x.url}">${x.titulo}</a></li>`).join("")}</ul>`
      : vacio("Todavía no hay material cargado."));
  }

  slug ? materia() : home();
})();
