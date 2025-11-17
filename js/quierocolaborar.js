document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // ELEMENTOS
  // =========================
  const wrapper = document.getElementById("selectColaboracion");
  const selected = wrapper.querySelector(".select-selected");
  const items = wrapper.querySelector(".select-items");

  const panelDinero = document.getElementById("panelDinero");
  const panelVoluntariado = document.getElementById("panelVoluntariado");
  const panelDifusion = document.getElementById("panelDifusion");
  const panelTarjeta = document.getElementById("panelTarjeta");

  const form = document.getElementById("formColaborar");

  let montoSeleccionado = null;

  // =========================
  // SELECT PERSONALIZADO
  // =========================
  selected.addEventListener("click", () => {
    items.classList.toggle("select-hide");
  });

  items.querySelectorAll("div").forEach((option) => {
    option.addEventListener("click", () => {
      selected.textContent = option.textContent;
      selected.dataset.value = option.dataset.value;
      items.classList.add("select-hide");

      // Ocultar todos los paneles
      panelDinero.classList.add("d-none");
      panelVoluntariado.classList.add("d-none");
      panelDifusion.classList.add("d-none");
      panelTarjeta.classList.add("d-none");

      // Mostrar el panel correcto
      if (option.dataset.value === "dinero")
        panelDinero.classList.remove("d-none");
      if (option.dataset.value === "voluntariado")
        panelVoluntariado.classList.remove("d-none");
      if (option.dataset.value === "difusion")
        panelDifusion.classList.remove("d-none");

      // Resetear monto y campos
      montoSeleccionado = null;
      resetMontoCards();
      document.getElementById("montoPersonalizadoBox").classList.add("d-none");
      document.getElementById("montoPersonalizado").value = "";
    });
  });

  // Cerrar select al hacer clic fuera
  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      items.classList.add("select-hide");
    }
  });

  // =========================
  // MONTOS
  // =========================
  window.seleccionarMonto = function (valor, element) {
    montoSeleccionado = valor;
    document
      .querySelectorAll(".monto-card")
      .forEach((card) => card.classList.remove("active"));
    element.classList.add("active");

    const box = document.getElementById("montoPersonalizadoBox");
    const input = document.getElementById("montoPersonalizado");

    if (valor === "otro") {
      box.classList.remove("d-none");
      input.focus();
    } else {
      box.classList.add("d-none");
      input.value = "";
    }
  };

  function resetMontoCards() {
    document
      .querySelectorAll(".monto-card")
      .forEach((card) => card.classList.remove("active"));
  }

  // =========================
  // PAGO
  // =========================
  window.pagar = function (metodo) {
    if (!montoSeleccionado) {
      alert("Seleccioná un monto primero.");
      return;
    }

    // Resetear tarjetas
    panelTarjeta.classList.add("d-none");
    document
      .querySelectorAll(".pago-card")
      .forEach((c) => c.classList.remove("active"));

    if (metodo === "tc") {
      panelTarjeta.classList.remove("d-none");
      event.target.closest(".pago-card").classList.add("active");
      return;
    }

    if (metodo === "mp") {
      let link = "";
      if (montoSeleccionado === "otro") {
        const monto = parseInt(
          document.getElementById("montoPersonalizado").value
        );
        if (!monto || monto < 10001) {
          alert("El monto debe ser mayor a $10.000.");
          return;
        }
        link = "https://link.mercadopago.com.ar/santiagotorales";
      } else {
        const links = {
          1000: "https://mpago.la/24gt8tW",
          5000: "https://mpago.la/2qDMfry",
          10000: "https://mpago.la/21aDj9G",
        };
        link = links[montoSeleccionado];
      }
      window.open(link, "_blank");
    }
  };

  // =========================
  // COPIAR LINK DIFUSIÓN
  // =========================
  document.getElementById("copiarLink").addEventListener("click", () => {
    const link = document.getElementById("linkPrincipal").textContent;
    navigator.clipboard.writeText(link).then(() => {
      const btn = document.getElementById("copiarLink");
      btn.textContent = "Copiado!";
      btn.classList.replace("btn-info", "btn-success");
      setTimeout(() => {
        btn.textContent = "Copiar link";
        btn.classList.replace("btn-success", "btn-info");
      }, 2000);
    });
  });

  // =========================
  // SELECTS DINÁMICOS (CORREGIDO)
  // =========================

  // Voluntariado: Roles
  const volRol = document.getElementById("volRol");
  [
    "Logística (Armado y desarmado)",
    "Comunicación (Difusión en redes)",
    "Técnico (Reparaciones / Moderación)",
  ].forEach((rol) => {
    const opt = document.createElement("option");
    opt.value = rol;
    opt.textContent = rol;
    volRol.appendChild(opt);
  });

  // Disponibilidad
  const volDisp = document.getElementById("volDisponibilidad");
  ["08:00 a 12:00", "12:00 a 16:00", "16:00 a 20:00"].forEach((h) => {
    const opt = document.createElement("option");
    opt.value = h;
    opt.textContent = h;
    volDisp.appendChild(opt);
  });

  // Zona
  const volZona = document.getElementById("volZona");
  ["GBA Norte", "GBA Sur", "GBA Oeste", "CABA", "Interior"].forEach((z) => {
    const opt = document.createElement("option");
    opt.value = z;
    opt.textContent = z;
    volZona.appendChild(opt);
  });

  // Tarjeta: Mes
  const selectMes = document.getElementById("tarjetaMes");
  for (let m = 1; m <= 12; m++) {
    const opt = document.createElement("option");
    opt.value = m.toString().padStart(2, "0");
    opt.textContent = m.toString().padStart(2, "0");
    selectMes.appendChild(opt);
  }

  // Tarjeta: Año
  const selectAnio = document.getElementById("tarjetaAnio");
  for (let y = 2025; y <= 2040; y++) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    selectAnio.appendChild(opt);
  }

  // =========================
  // ENVÍO DEL FORMULARIO
  // =========================
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("colaboradorNombre").value.trim();
    const apellido = document
      .getElementById("colaboradorApellido")
      .value.trim();
    const email = document.getElementById("colaboradorEmail").value.trim();
    const telefono = document
      .getElementById("colaboradorTelefono")
      .value.trim();
    const tipo = selected.dataset.value;

    if (!nombre || !apellido || !email) {
      alert("Completá nombre, apellido y email");
      return;
    }
    if (!tipo) {
      alert("Elegí un tipo de colaboración");
      return;
      音频;
    }

    if (tipo === "dinero" && !montoSeleccionado) {
      alert("Elegí un monto");
      return;
    }
    if (tipo === "dinero" && montoSeleccionado === "otro") {
      const monto = parseInt(
        document.getElementById("montoPersonalizado").value
      );
      if (!monto || monto < 10001) {
        alert("Monto debe ser mayor a $10.000");
        return;
      }
    }

    if (tipo === "voluntariado") {
      const rol = document.getElementById("volRol").value;
      const disp = document.getElementById("volDisponibilidad").value;
      const zona = document.getElementById("volZona").value;
      if (!rol || !disp || !zona || rol.includes("Seleccionar")) {
        alert("Completá todos los campos de voluntariado");
        return;
      }
    }

    // Guardar en localStorage
    const colaboracion = {
      nombre,
      apellido,
      email,
      telefono,
      tipo: selected.textContent,
      monto:
        montoSeleccionado === "otro"
          ? parseInt(document.getElementById("montoPersonalizado").value)
          : montoSeleccionado,
      rol:
        tipo === "voluntariado"
          ? document.getElementById("volRol").value
          : null,
      disponibilidad:
        tipo === "voluntariado"
          ? document.getElementById("volDisponibilidad").value
          : null,
      zona:
        tipo === "voluntariado"
          ? document.getElementById("volZona").value
          : null,
      fecha: new Date().toLocaleString("es-AR"),
    };

    let colaboraciones = JSON.parse(
      localStorage.getItem("colaboracionesGameHub") || "[]"
    );
    colaboraciones.push(colaboracion);
    localStorage.setItem(
      "colaboracionesGameHub",
      JSON.stringify(colaboraciones)
    );

    // Mostrar modal
    mostrarModalExito();
  });

  // =========================
  // MODAL DE ÉXITO
  // =========================
  function mostrarModalExito() {
    const modalHTML = `
      <div class="modal fade" id="modalExito" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content bg-dark text-light border border-primary">
            <div class="modal-header border-0 pb-0">
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body text-center py-5">
              <div class="mb-4">
                <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
              </div>
              <h3 class="text-primary">¡Muchas gracias por tu colaboración!</h3>
              <p class="lead">Tus datos fueron enviados correctamente.</p>
              <p class="text-muted">Pronto nos pondremos en contacto.</p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
              <button type="button" class="btn btn-primary px-4" data-bs-dismiss="modal">
                Cerrar y continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
    const modal = new bootstrap.Modal(document.getElementById("modalExito"));
    modal.show();

    document
      .getElementById("modalExito")
      .addEventListener("hidden.bs.modal", () => {
        form.reset();
        selected.textContent = "Seleccionar...";
        selected.dataset.value = "";
        [panelDinero, panelVoluntariado, panelDifusion, panelTarjeta].forEach(
          (p) => p.classList.add("d-none")
        );
        resetMontoCards();
        document
          .getElementById("montoPersonalizadoBox")
          .classList.add("d-none");
        document.getElementById("montoPersonalizado").value = "";
        montoSeleccionado = null;
        document.getElementById("modalExito").remove();
      });
  }
});
