/* -------------------------------
   SALUDO DINÁMICO
--------------------------------*/
const params = new URLSearchParams(window.location.search);
const usuario = params.get("user") || "admin";
document.getElementById("saludoAdmin").innerText = "Bienvenido/a " + usuario;

/* -------------------------------
   ABM TORNEOS
--------------------------------*/
let torneos = [];

const formABM = document.getElementById("formABM");
const listadoABM = document.getElementById("listadoABM");

formABM.addEventListener("submit", (e) => {
  e.preventDefault();

  const nuevo = {
    titulo: titulo.value,
    juego: juego.value,
    plataforma: plataforma.value,
    fecha: fecha.value,
    cupos: cupos.value,
    objetivo: objetivo.value,
    reglas: reglas.value,
    pdf: pdfReglamento.value,
    stream: linkStream.value,
  };

  torneos.push(nuevo);
  formABM.reset();
  renderTorneos();
});

function renderTorneos() {
  listadoABM.innerHTML = "";

  torneos.forEach((t, i) => {
    listadoABM.innerHTML += `
      <div class="col-md-4">
        <div class="card p-3 mb-3 shadow-sm">
          <h5>${t.titulo}</h5>
          <p><strong>Juego:</strong> ${t.juego}</p>
          <p><strong>Plataforma:</strong> ${t.plataforma}</p>
          <button class="btn btn-danger w-100" onclick="eliminarTorneo(${i})">Eliminar</button>
        </div>
      </div>
    `;
  });
}

function eliminarTorneo(i) {
  torneos.splice(i, 1);
  renderTorneos();
}

/* -------------------------------
   ABM SPONSORS
--------------------------------*/
let sponsors = [];

const formSponsor = document.getElementById("formSponsor");
const listadoSponsors = document.getElementById("listadoSponsors");

let sponsorLogoBase64 = "";

/* ---- MANEJO DE LOGO (drag & drop) ---- */

const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("sponsorLogoFile");

dropZone.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
  handleFile(e.target.files[0]);
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("bg-light");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("bg-light");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("bg-light");

  const file = e.dataTransfer.files[0];
  handleFile(file);
});

function handleFile(file) {
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Solo se aceptan imágenes");
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    alert("Máximo 2MB");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    sponsorLogoBase64 = reader.result;

    dropZone.innerHTML = `
      <img src="${sponsorLogoBase64}" class="img-fluid" style="max-height:120px;">
    `;
  };

  reader.readAsDataURL(file);
}

/* ---- Alta sponsor ---- */

formSponsor.addEventListener("submit", (e) => {
  e.preventDefault();

  const nuevo = {
    nombre: sponsorNombre.value,
    tipo: sponsorTipo.value,
    logo: sponsorLogoBase64,
    link: sponsorLink.value,
  };

  sponsors.push(nuevo);

  formSponsor.reset();
  sponsorLogoBase64 = "";
  dropZone.innerHTML = `
    <p class="mb-1">Arrastre la imagen aquí<br>o haga clic para seleccionar</p>
    <small class="text-muted">Formatos: JPG, PNG — Máx 2MB</small>
  `;
});

function renderSponsors() {
  listadoSponsors.innerHTML = "";

  sponsors.forEach((s, i) => {
    listadoSponsors.innerHTML += `
      <div class="col-md-3">
        <div class="card p-3 mb-3 shadow-sm">
          <img src="${s.logo}" class="img-fluid mb-2" style="max-height:100px;">
          <h6>${s.nombre}</h6>
          <p><strong>Tipo:</strong> ${s.tipo}</p>
          <button class="btn btn-danger w-100" onclick="eliminarSponsor(${i})">Eliminar</button>
        </div>
      </div>
    `;
  });
}

function eliminarSponsor(i) {
  sponsors.splice(i, 1);
  renderSponsors();
}
