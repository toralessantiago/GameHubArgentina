/* -------------------------------
   SALUDO + LOCALSTORAGE
--------------------------------*/
const params = new URLSearchParams(window.location.search);
const usuario = params.get("user") || "admin";
document.getElementById("saludoAdmin").innerText = "Bienvenido/a " + usuario;

let torneos = JSON.parse(localStorage.getItem("torneosGameHub") || "[]");
let sponsors = JSON.parse(localStorage.getItem("sponsorsGameHub") || "[]");
let editandoTorneo = null;
let editandoSponsor = null;
let torneoPendiente = null;

// PDF
let pdfBase64 = "";
const dropZonePdf = document.getElementById("dropZonePdf");
const pdfFileInput = document.getElementById("pdfFile");
const pdfPreview = document.getElementById("pdfPreview");

dropZonePdf.addEventListener("click", () => pdfFileInput.click());
pdfFileInput.addEventListener("change", (e) => handlePdf(e.target.files[0]));
dropZonePdf.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZonePdf.classList.add("dragover");
});
dropZonePdf.addEventListener("dragleave", () =>
  dropZonePdf.classList.remove("dragover")
);
dropZonePdf.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZonePdf.classList.remove("dragover");
  handlePdf(e.dataTransfer.files[0]);
});

function handlePdf(file) {
  if (!file) return;
  if (file.type !== "application/pdf") return alert("Solo archivos PDF");
  if (file.size > 5 * 1024 * 1024) return alert("Máximo 5MB");

  const reader = new FileReader();
  reader.onload = () => {
    pdfBase64 = reader.result;
    pdfPreview.innerHTML = `
      <div class="alert alert-success p-2 mt-2 d-flex justify-content-between align-items-center">
        <span><strong>PDF:</strong> ${file.name} (${(
      file.size /
      1024 /
      1024
    ).toFixed(2)} MB)</span>
        <button type="button" class="btn-close btn-close-white" onclick="resetPdf()"></button>
      </div>
    `;
  };
  reader.readAsDataURL(file);
}

window.resetPdf = function () {
  pdfBase64 = "";
  pdfPreview.innerHTML = "";
  pdfFileInput.value = "";
};

/* -------------------------------
   TORNEOS
--------------------------------*/
const formABM = document.getElementById("formABM");
const btnSubmitTorneo = document.getElementById("btnSubmitTorneo");
const listadoABM = document.getElementById("listadoABM");

formABM.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    titulo: document.getElementById("titulo").value.trim(),
    juego: document.getElementById("juego").value.trim(),
    plataforma: document.getElementById("plataforma").value.trim(),
    fecha: document.getElementById("fecha").value,
    cupos: document.getElementById("cupos").value,
    objetivo: document.getElementById("objetivo").value.trim(),
    costoinscripcion: document.getElementById("costoinscripcion").value.trim(),
    premios: document.getElementById("premios").value.trim(),
    pdf: pdfBase64,
    stream: document.getElementById("linkStream").value.trim(),
  };

  torneoPendiente = { ...data, index: editandoTorneo };
  mostrarResumenTorneo(data);
  const modal = new bootstrap.Modal(
    document.getElementById("modalConfirmarTorneo")
  );
  modal.show();
});

function mostrarResumenTorneo(t) {
  const resumen = document.getElementById("resumenTorneo");
  resumen.innerHTML = `
    <div class="row g-3">
      <div class="col-md-6"><strong>Título:</strong> ${t.titulo}</div>
      <div class="col-md-6"><strong>Juego:</strong> ${t.juego}</div>
      <div class="col-md-6"><strong>Plataforma:</strong> ${t.plataforma}</div>
      <div class="col-md-6"><strong>Fecha:</strong> ${new Date(
        t.fecha
      ).toLocaleDateString("es-AR")}</div>
      <div class="col-md-6"><strong>Cupos:</strong> ${t.cupos}</div>
      <div class="col-md-6"><strong>Objetivo:</strong> ${t.objetivo}</div>
      <div class="col-12"><strong>costoinscripcion:</strong> ${
        t.costoinscripcion || "—"
      }</div>
      <div class="col-12"><strong>Premios:</strong> ${t.premios || "—"}</div>
      ${
        t.pdf
          ? `<div class="col-12"><strong>PDF:</strong> <a href="${t.pdf}" target="_blank" class="text-info">Ver PDF</a></div>`
          : ""
      }
      ${
        t.stream
          ? `<div class="col-12"><strong>Stream:</strong> <a href="${t.stream}" target="_blank" class="text-info">Ver Stream</a></div>`
          : ""
      }
    </div>
  `;
}

document.getElementById("btnConfirmarTorneo").addEventListener("click", () => {
  if (!torneoPendiente) return;

  if (torneoPendiente.index !== null) {
    torneos[torneoPendiente.index] = { ...torneoPendiente };
    editandoTorneo = null;
    btnSubmitTorneo.textContent = "Agregar Torneo";
    btnSubmitTorneo.classList.replace("btn-warning", "btn-primary");
  } else {
    torneos.push({ ...torneoPendiente });
  }

  guardarTorneos();
  formABM.reset();
  resetPdf();
  renderTorneos();
  bootstrap.Modal.getInstance(
    document.getElementById("modalConfirmarTorneo")
  ).hide();
  torneoPendiente = null;
});

window.editarTorneo = function (i) {
  const t = torneos[i];
  document.getElementById("titulo").value = t.titulo;
  document.getElementById("juego").value = t.juego;
  document.getElementById("plataforma").value = t.plataforma;
  document.getElementById("fecha").value = t.fecha;
  document.getElementById("cupos").value = t.cupos;
  document.getElementById("objetivo").value = t.objetivo;
  document.getElementById("costoinscripcion").value = t.costoinscripcion;
  document.getElementById("premios").value = t.premios;
  document.getElementById("linkStream").value = t.stream;

  if (t.pdf) {
    pdfBase64 = t.pdf;
    pdfPreview.innerHTML = `
      <div class="alert alert-success p-2 mt-2 d-flex justify-content-between align-items-center">
        <span><strong>PDF cargado</strong></span>
        <button type="button" class="btn-close btn-close-white" onclick="resetPdf()"></button>
      </div>
    `;
  } else {
    resetPdf();
  }

  editandoTorneo = i;
  btnSubmitTorneo.textContent = "Actualizar Torneo";
  btnSubmitTorneo.classList.replace("btn-primary", "btn-warning");
  window.scrollTo(0, 0);
};

window.eliminarTorneo = function (i) {
  if (confirm("¿Eliminar este torneo?")) {
    torneos.splice(i, 1);
    guardarTorneos();
    renderTorneos();
  }
};

function renderTorneos() {
  listadoABM.innerHTML = "";
  torneos.forEach((t, i) => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-3";
    card.innerHTML = `
      <div class="torneo-card p-3 shadow-sm h-100">
        <h5 class="card-title">${t.titulo}</h5>
        <p><strong>Juego:</strong> ${t.juego}</p>
        <p><strong>Plataforma:</strong> ${t.plataforma}</p>
        <p><strong>Fecha:</strong> ${new Date(t.fecha).toLocaleDateString(
          "es-AR"
        )}</p>
        <p><strong>Cupos:</strong> ${t.cupos}</p>
        <div class="mt-auto d-flex gap-1">
          <button class="btn btn-info btn-sm flex-fill" onclick="verDetallesTorneo(${i})">Detalles</button>
          <button class="btn btn-warning btn-sm flex-fill" onclick="editarTorneo(${i})">Editar</button>
          <button class="btn btn-danger btn-sm flex-fill" onclick="eliminarTorneo(${i})">Eliminar</button>
        </div>
      </div>
    </div>
    `;
    listadoABM.appendChild(card);
  });
}

window.verDetallesTorneo = function (i) {
  const t = torneos[i];
  document.getElementById("tituloModal").textContent = t.titulo;
  const detalles = document.getElementById("detallesTorneo");
  detalles.innerHTML = `
    <div class="row g-3">
      <div class="col-12"><strong>Juego:</strong> ${
        t.juego
      } | <strong>Plataforma:</strong> ${t.plataforma}</div>
      <div class="col-12"><strong>Fecha:</strong> ${new Date(
        t.fecha
      ).toLocaleDateString("es-AR")} | <strong>Cupos:</strong> ${t.cupos}</div>
      <div class="col-12"><strong>Objetivo:</strong> ${t.objetivo}</div>
      <div class="col-12"><strong>Costo de inscripción:</strong> <pre class="bg-dark p-2 rounded text-light" style="font-size:0.9rem;">${
        t.costoinscripcion || "—"
      }</pre></div>
      <div class="col-12"><strong>Premios:</strong> <pre class="bg-dark p-2 rounded text-light" style="font-size:0.9rem;">${
        t.premios || "—"
      }</pre></div>
      ${
        t.pdf
          ? `<div class="col-12"><strong>PDF:</strong> <a href="${t.pdf}" target="_blank" class="btn btn-sm btn-info">Ver PDF</a></div>`
          : ""
      }
      ${
        t.stream
          ? `<div class="col-12"><strong>Stream:</strong> <a href="${t.stream}" target="_blank" class="text-info">Ver en vivo</a></div>`
          : ""
      }
    </div>
  `;
  new bootstrap.Modal(document.getElementById("modalDetallesTorneo")).show();
};

function guardarTorneos() {
  localStorage.setItem("torneosGameHub", JSON.stringify(torneos));
}

/* -------------------------------
   SPONSORS (sin cambios)
--------------------------------*/
let sponsorLogoBase64 = "";
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("sponsorLogoFile");

dropZone.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", (e) => handleFile(e.target.files[0]));
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});
dropZone.addEventListener("dragleave", () =>
  dropZone.classList.remove("dragover")
);
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  handleFile(e.dataTransfer.files[0]);
});

function handleFile(file) {
  if (!file) return;
  if (!file.type.startsWith("image/")) return alert("Solo imágenes");
  if (file.size > 2 * 1024 * 1024) return alert("Máximo 2MB");
  const reader = new FileReader();
  reader.onload = () => {
    sponsorLogoBase64 = reader.result;
    dropZone.innerHTML = `<img src="${sponsorLogoBase64}" class="img-fluid rounded" style="max-height:100px;"><p class="mt-2"><small>Click para cambiar</small></p>`;
  };
  reader.readAsDataURL(file);
}

const formSponsor = document.getElementById("formSponsor");
const btnSubmitSponsor = document.getElementById("btnSubmitSponsor");
const listadoSponsors = document.getElementById("listadoSponsors");

formSponsor.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!sponsorLogoBase64 && editandoSponsor === null) {
    return alert("Subí un logo");
  }

  const data = {
    nombre: document.getElementById("sponsorNombre").value.trim(),
    tipo: document.getElementById("sponsorTipo").value.trim(),
    logo: sponsorLogoBase64,
    link: document.getElementById("sponsorLink").value.trim(),
  };

  if (editandoSponsor !== null) {
    sponsors[editandoSponsor] = data;
    editandoSponsor = null;
    btnSubmitSponsor.textContent = "Agregar Sponsor";
    btnSubmitSponsor.classList.replace("btn-warning", "btn-success");
  } else {
    sponsors.push(data);
  }

  guardarSponsors();
  formSponsor.reset();
  sponsorLogoBase64 = "";
  dropZone.innerHTML = `
    <p class="mb-1">Arrastre la imagen aquí<br>o haga clic para seleccionar</p>
    <small class="text-muted">JPG, PNG — Máx 2MB</small>
  `;
  renderSponsors();
});

window.editarSponsor = function (i) {
  const s = sponsors[i];
  document.getElementById("sponsorNombre").value = s.nombre;
  document.getElementById("sponsorTipo").value = s.tipo;
  document.getElementById("sponsorLink").value = s.link;
  sponsorLogoBase64 = s.logo;

  dropZone.innerHTML = `
    <img src="${s.logo}" class="img-fluid rounded" style="max-height:100px;">
    <p class="mt-2"><small>Haga clic para cambiar</small></p>
  `;

  editandoSponsor = i;
  btnSubmitSponsor.textContent = "Actualizar Sponsor";
  btnSubmitSponsor.classList.replace("btn-success", "btn-warning");
  window.scrollTo(0, formSponsor.offsetTop - 100);
};

window.eliminarSponsor = function (i) {
  if (confirm("¿Eliminar este sponsor?")) {
    sponsors.splice(i, 1);
    guardarSponsors();
    renderSponsors();
  }
};

function renderSponsors() {
  listadoSponsors.innerHTML = "";
  sponsors.forEach((s, i) => {
    const card = document.createElement("div");
    card.className = "col-md-3 mb-3";
    card.innerHTML = `
      <div class="sponsor-card p-3 text-center h-100">
        <img src="${s.logo}" class="img-fluid mb-2" style="max-height:80px; object-fit: contain;">
        <h6 class="mb-1">${s.nombre}</h6>
        <p class="small text-muted">${s.tipo}</p>
        <div class="d-flex gap-2">
          <button class="btn btn-warning btn-sm flex-fill" onclick="editarSponsor(${i})">Editar</button>
          <button class="btn btn-danger btn-sm flex-fill" onclick="eliminarSponsor(${i})">Eliminar</button>
        </div>
      </div>
    </div>
    `;
    listadoSponsors.appendChild(card);
  });
}

function guardarSponsors() {
  localStorage.setItem("sponsorsGameHub", JSON.stringify(sponsors));
}

// Render inicial
renderTorneos();
renderSponsors();
