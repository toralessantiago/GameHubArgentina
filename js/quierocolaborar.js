// =========================
// SELECT PERSONALIZADO
// =========================
const wrapper = document.getElementById("selectColaboracion");
const selected = wrapper.querySelector(".select-selected");
const items = wrapper.querySelector(".select-items");

const panelDinero = document.getElementById("panelDinero");
const panelVoluntariado = document.getElementById("panelVoluntariado");
const panelDifusion = document.getElementById("panelDifusion");
const panelTarjeta = document.getElementById("panelTarjeta");

// Mostrar opciones
selected.addEventListener("click", () => {
  items.classList.toggle("select-hide");
});

// Selección de tipo de colaboración
items.querySelectorAll("div").forEach((option) => {
  option.addEventListener("click", () => {
    selected.textContent = option.textContent;
    selected.dataset.value = option.dataset.value;
    items.classList.add("select-hide");

    panelDinero.classList.add("d-none");
    panelVoluntariado.classList.add("d-none");
    panelDifusion.classList.add("d-none");

    if (option.dataset.value === "dinero")
      panelDinero.classList.remove("d-none");
    if (option.dataset.value === "voluntariado")
      panelVoluntariado.classList.remove("d-none");
    if (option.dataset.value === "difusion")
      panelDifusion.classList.remove("d-none");
  });
});

// =========================
// MONTO
// =========================
let montoSeleccionado = null;

function seleccionarMonto(valor, element) {
  montoSeleccionado = valor;

  document.querySelectorAll(".monto-card").forEach((card) => {
    card.classList.remove("active");
  });

  element.classList.add("active");

  if (valor === "otro") {
    document.getElementById("montoPersonalizadoBox").classList.remove("d-none");
  } else {
    document.getElementById("montoPersonalizadoBox").classList.add("d-none");
  }
}

// =========================
// MÉTODOS DE PAGO
// =========================

function pagar(metodo) {
  if (montoSeleccionado === null) {
    alert("Seleccioná un monto primero.");
    return;
  }

  if (metodo === "tc") {
    panelTarjeta.classList.remove("d-none");
    return;
  }

  if (metodo === "mp") {
    let link = "";

    switch (montoSeleccionado) {
      case 1000:
        link = "https://mpago.la/24gt8tW";
        break;
      case 5000:
        link = "https://mpago.la/2qDMfry";
        break;
      case 10000:
        link = "https://mpago.la/21aDj9G";
        break;
      case "otro":
        const monto = document.getElementById("montoPersonalizado").value;
        if (monto < 10001) {
          alert("El monto debe ser mayor a $10.000.");
          return;
        } else {
          link = "https://www.google.com";
          break;
        }
    }

    window.open(link, "_blank");
  }
}

// =========================
// COPIAR LINK DIFUSIÓN
// =========================
document.getElementById("copiarLink").addEventListener("click", () => {
  const link = document.getElementById("linkPrincipal").textContent;
  navigator.clipboard.writeText(link);
  alert("¡Link copiado!");
});

// =========================
// SELECTS DINÁMICOS
// =========================
const selectRol = document.getElementById("volRol");
[
  "Logística (Armado y desarmado)",
  "Comunicación (Difusión en redes)",
  "Técnico (Reparaciones / Moderación)",
].forEach((rol) => {
  const opt = document.createElement("option");
  opt.value = rol;
  opt.textContent = rol;
  selectRol.appendChild(opt);
});

const selectDisp = document.getElementById("volDisponibilidad");
["08:00 a 12:00", "12:00 a 16:00", "16:00 a 20:00"].forEach((h) => {
  const opt = document.createElement("option");
  opt.value = h;
  opt.textContent = h;
  selectDisp.appendChild(opt);
});

const selectZona = document.getElementById("volZona");
["GBA Norte", "GBA Sur", "GBA Oeste", "CABA"].forEach((z) => {
  const opt = document.createElement("option");
  opt.value = z;
  opt.textContent = z;
  selectZona.appendChild(opt);
});

// Tarjeta → Mes
const selectMes = document.getElementById("tarjetaMes");
for (let m = 1; m <= 12; m++) {
  const opt = document.createElement("option");
  opt.value = m.toString().padStart(2, "0");
  opt.textContent = m.toString().padStart(2, "0");
  selectMes.appendChild(opt);
}

// Tarjeta → Año
const selectAnio = document.getElementById("tarjetaAnio");
for (let y = 2025; y <= 2040; y++) {
  const opt = document.createElement("option");
  opt.value = y;
  opt.textContent = y;
  selectAnio.appendChild(opt);
}
