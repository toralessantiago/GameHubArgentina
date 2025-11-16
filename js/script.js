// ===========================
// 🔹 LOGIN DE ADMINISTRADOR (global para onclick)
function iniciarSesion() {
  const usuario = document.getElementById("usuario")?.value || "";
  const clave = document.getElementById("clave")?.value || "";
  const mensajeError = document.getElementById("mensaje-error");

  if (usuario === "mari" && clave === "123") {
    window.location.href = `admin.html?user=${encodeURIComponent(usuario)}`;
  } else {
    if (mensajeError) mensajeError.textContent = "Usuario o clave incorrectos";
  }
}
// ===========================

// ===========================
// 🔹 OBTENER ALTURA DEL HEADER
function obtenerAlturaHeader() {
  const navbar =
    document.querySelector(".navbar") || document.querySelector("header");
  return navbar ? navbar.offsetHeight : 0;
}

// ===========================
// 🔹 ACTUALIZAR VARIABLE CSS DEL HEADER
function actualizarOffsetHeader() {
  const altura = obtenerAlturaHeader();
  document.documentElement.style.setProperty("--header-offset", `${altura}px`);
}

// llamo con seguridad si el DOM ya existe
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  actualizarOffsetHeader();
} else {
  window.addEventListener("DOMContentLoaded", actualizarOffsetHeader);
}
window.addEventListener("resize", actualizarOffsetHeader);

// ===========================
// 🔹 FUNCION DE DESPLAZAMIENTO SUAVE PERSONALIZADO
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

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  requestAnimationFrame(animarScroll);
}

// ===========================
// 🔹 DESPLAZAMIENTO SUAVE PARA TODOS LOS ENLACES INTERNOS
function activarDesplazamientoSuave() {
  const enlaces = document.querySelectorAll('a[href^="#"]');

  enlaces.forEach((enlace) => {
    enlace.addEventListener("click", (evento) => {
      const destinoID = enlace.getAttribute("href");

      // Solo si es un ancla interna (#) y el id existe en la página
      if (destinoID && destinoID.startsWith("#")) {
        const destino = document.querySelector(destinoID);
        if (!destino) {
          // No existe el ancla destino: evita romper la ejecución
          evento.preventDefault();
          return;
        }
        evento.preventDefault();

        const alturaHeader = obtenerAlturaHeader();
        const margenExtra = 15;
        const posicionY =
          destino.getBoundingClientRect().top +
          window.scrollY -
          alturaHeader -
          margenExtra;

        desplazamientoSuave(posicionY);

        // Cerrar el menú si está abierto (solo para navbar bootstrap)
        const navbarCollapse = document.querySelector(".navbar-collapse.show");
        if (navbarCollapse) {
          const bsCollapse =
            bootstrap.Collapse.getInstance(navbarCollapse) ||
            new bootstrap.Collapse(navbarCollapse);
          bsCollapse.hide();
        }

        // Actualizar el enlace activo solo si es nav-link
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
// 🔹 INICIALIZAR TODO AL CARGAR
document.addEventListener("DOMContentLoaded", () => {
  // activar scroll suave solo si hay enlaces internos
  activarDesplazamientoSuave();

  // inicializar admin solo si corresponde (evita errores en index.html)
  inicializarAdminSiCorresponde();
});
