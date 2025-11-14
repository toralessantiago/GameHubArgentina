// ===========================
// 🔹 LOGIN DE ADMINISTRADOR
// ===========================
function iniciarSesion() {
  const usuario = document.getElementById("usuario").value;
  const clave = document.getElementById("clave").value;
  const mensajeError = document.getElementById("mensaje-error");

  if (usuario === "mari" && clave === "123") {
    window.location.href = `admin.html?user=${encodeURIComponent(usuario)}`;
  } else {
    mensajeError.textContent = "Usuario incorrecto";
  }
}

// ===========================
// 🔹 OBTENER ALTURA DEL HEADER
// ===========================
function obtenerAlturaHeader() {
  const navbar =
    document.querySelector(".navbar") || document.querySelector("header");
  return navbar ? navbar.offsetHeight : 0;
}

// ===========================
// 🔹 ACTUALIZAR VARIABLE CSS DEL HEADER
// ===========================
function actualizarOffsetHeader() {
  const altura = obtenerAlturaHeader();
  document.documentElement.style.setProperty("--header-offset", `${altura}px`);
}
actualizarOffsetHeader();
window.addEventListener("resize", actualizarOffsetHeader);

// ===========================
// 🔹 FUNCION DE DESPLAZAMIENTO SUAVE PERSONALIZADO
// ===========================
function desplazamientoSuave(hastaY, duracion = 600) {
  const inicioY = window.scrollY;
  const diferencia = hastaY - inicioY;
  const inicioTiempo = performance.now();

  function animarScroll(tiempoActual) {
    const tiempoTranscurrido = tiempoActual - inicioTiempo;
    const progreso = Math.min(tiempoTranscurrido / duracion, 1);
    const desplazamiento = inicioY + diferencia * easeInOutQuad(progreso);
    window.scrollTo(0, desplazamiento);

    if (progreso < 1) requestAnimationFrame(animarScroll);
  }

  // Curva de aceleración (ease in/out)
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  requestAnimationFrame(animarScroll);
}

// ===========================
// 🔹 DESPLAZAMIENTO SUAVE PARA TODOS LOS ENLACES INTERNOS
// ===========================
function activarDesplazamientoSuave() {
  const enlaces = document.querySelectorAll('a[href^="#"]');

  enlaces.forEach((enlace) => {
    enlace.addEventListener("click", (evento) => {
      const destinoID = enlace.getAttribute("href");

      // Solo si es un ancla interna (#)
      if (destinoID && destinoID.startsWith("#")) {
        evento.preventDefault();

        const destino = document.querySelector(destinoID);
        if (!destino) return;

        const alturaHeader = obtenerAlturaHeader();
        const margenExtra = 15;
        const posicionY =
          destino.getBoundingClientRect().top +
          window.scrollY -
          alturaHeader -
          margenExtra;

        // ✅ Desplazamiento animado suave
        desplazamientoSuave(posicionY);

        // 🔹 Cerrar el menú si está abierto (solo para navbar)
        const navbarCollapse = document.querySelector(".navbar-collapse.show");
        if (navbarCollapse) {
          const bsCollapse =
            bootstrap.Collapse.getInstance(navbarCollapse) ||
            new bootstrap.Collapse(navbarCollapse);
          bsCollapse.hide();
        }

        // 🔹 Actualizar el enlace activo solo si es nav-link
        if (enlace.classList.contains("nav-link")) {
          document
            .querySelectorAll(".nav-link")
            .forEach((a) => a.classList.remove("active"));
          enlace.classList.add("active");
        }
      }
    });
  });
}

// ===========================
// 🔹 ADMIN PANEL CONTROL
// ===========================
// 🔹 Leer parámetro de usuario
const urlParams = new URLSearchParams(window.location.search);
const usuario = urlParams.get("user") || "Administrador";
document.getElementById("saludoAdmin").textContent = `Bienvenido/a ${usuario}`;

// 🔹 Array en memoria para torneos/campañas
let torneos = [];

const form = document.getElementById("formABM");
const listado = document.getElementById("listadoABM");

// Función para renderizar los torneos en pantalla
function renderTorneos() {
  listado.innerHTML = "";
  torneos.forEach((t, index) => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-3";
    card.innerHTML = `
      <div class="card bg-dark text-light p-3">
        <h5>${t.titulo}</h5>
        <p><strong>Juego:</strong> ${t.juego}</p>
        <p><strong>Plataforma:</strong> ${t.plataforma}</p>
        <p><strong>Fecha:</strong> ${t.fecha}</p>
        <p><strong>Cupos:</strong> ${t.cupos}</p>
        <p><strong>Objetivo:</strong> ${t.objetivo}</p>
        <p><strong>Reglas / Premios:</strong> ${t.reglas || "-"}</p>
        <p><strong>PDF Reglamento:</strong> ${
          t.pdfReglamento
            ? `<a href="${t.pdfReglamento}" target="_blank">Ver PDF</a>`
            : "-"
        }</p>
        <p><strong>Link a stream:</strong> ${
          t.linkStream
            ? `<a href="${t.linkStream}" target="_blank">Ver stream</a>`
            : "-"
        }</p>
        <button class="btn btn-warning btn-sm me-2" onclick="editarTorneo(${index})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarTorneo(${index})">Eliminar</button>
      </div>
    `;
    listado.appendChild(card);
  });
}

// 🔹 Alta
form.addEventListener("submit", formSubmitAlta);

function formSubmitAlta(e) {
  e.preventDefault();
  const nuevo = {
    titulo: document.getElementById("titulo").value,
    juego: document.getElementById("juego").value,
    plataforma: document.getElementById("plataforma").value,
    fecha: document.getElementById("fecha").value,
    cupos: document.getElementById("cupos").value,
    objetivo: document.getElementById("objetivo").value,
    reglas: document.getElementById("reglas").value,
    pdfReglamento: document.getElementById("pdfReglamento").value,
    linkStream: document.getElementById("linkStream").value,
  };
  torneos.push(nuevo);
  form.reset();
  renderTorneos();
}

// 🔹 Baja
function eliminarTorneo(index) {
  if (confirm("¿Seguro que querés eliminar este torneo/campaña?")) {
    torneos.splice(index, 1);
    renderTorneos();
  }
}

// 🔹 Modificación
function editarTorneo(index) {
  const t = torneos[index];
  document.getElementById("titulo").value = t.titulo;
  document.getElementById("juego").value = t.juego;
  document.getElementById("plataforma").value = t.plataforma;
  document.getElementById("fecha").value = t.fecha;
  document.getElementById("cupos").value = t.cupos;
  document.getElementById("objetivo").value = t.objetivo;
  document.getElementById("reglas").value = t.reglas;
  document.getElementById("pdfReglamento").value = t.pdfReglamento;
  document.getElementById("linkStream").value = t.linkStream;

  // Al enviar, reemplaza en vez de agregar
  form.removeEventListener("submit", formSubmitAlta);
  const formSubmitEditar = function (e) {
    e.preventDefault();
    torneos[index] = {
      titulo: document.getElementById("titulo").value,
      juego: document.getElementById("juego").value,
      plataforma: document.getElementById("plataforma").value,
      fecha: document.getElementById("fecha").value,
      cupos: document.getElementById("cupos").value,
      objetivo: document.getElementById("objetivo").value,
      reglas: document.getElementById("reglas").value,
      pdfReglamento: document.getElementById("pdfReglamento").value,
      linkStream: document.getElementById("linkStream").value,
    };
    form.reset();
    renderTorneos();
    form.removeEventListener("submit", formSubmitEditar);
    form.addEventListener("submit", formSubmitAlta);
  };
  form.addEventListener("submit", formSubmitEditar);
}

// Inicializar render
renderTorneos();

// ===========================
// 🔹 INICIALIZAR TODO AL CARGAR
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  activarDesplazamientoSuave();
});
