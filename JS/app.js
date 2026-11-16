// ==========================================
// 1. FORMULARIO DE CONTACTO
// ==========================================
const formContacto = document.getElementById("form-contacto");
const mensajeExito = document.getElementById("mensaje-exito");

formContacto.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const nuevaSolicitud = {
    id: Date.now(),
    nombre: document.getElementById("nombre").value,
    correo: document.getElementById("correo").value,
    telefono: document.getElementById("telefono").value,
    pais: document.getElementById("pais").value,
    servicio: document.getElementById("servicio-interes").value,
    mensaje: document.getElementById("mensaje").value,
    fecha: new Date().toLocaleDateString("es-PA")
  };

  const solicitudesGuardadas = JSON.parse(localStorage.getItem("solicitudes_greenarqui")) || [];
  solicitudesGuardadas.push(nuevaSolicitud);
  localStorage.setItem("solicitudes_greenarqui", JSON.stringify(solicitudesGuardadas));

  formContacto.reset();
  mensajeExito.hidden = false;

  setTimeout(() => {
    mensajeExito.hidden = true;
  }, 5000);
});

// ==========================================
// 2. LOGIN Y PANEL ADMIN
// ==========================================
const modalAdmin = document.getElementById("modal-admin");
const btnAbrirAdmin = document.getElementById("btn-abrir-admin");
const btnCerrarAdmin = document.getElementById("btn-cerrar-admin");
const vistaLogin = document.getElementById("vista-login");
const vistaPanel = document.getElementById("vista-panel");
const formLogin = document.getElementById("form-login");
const errorLogin = document.getElementById("error-login");
const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");

// Credenciales de acceso (pueden cambiarlas si desean)
const ADMIN_USER = "admin";
const ADMIN_PASS = "greenarqui2026";

btnAbrirAdmin.addEventListener("click", (e) => {
  e.preventDefault();
  modalAdmin.hidden = false;
  verificarSesion();
});

btnCerrarAdmin.addEventListener("click", () => {
  modalAdmin.hidden = true;
});

function verificarSesion() {
  const sesionActiva = sessionStorage.getItem("admin_logueado");
  if (sesionActiva === "true") {
    vistaLogin.hidden = true;
    vistaPanel.hidden = false;
    cargarSolicitudesAdmin();
    cargarProyectosAdmin();
  } else {
    vistaLogin.hidden = false;
    vistaPanel.hidden = true;
  }
}

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  const usuario = document.getElementById("admin-usuario").value;
  const password = document.getElementById("admin-password").value;

  if (usuario === ADMIN_USER && password === ADMIN_PASS) {
    sessionStorage.setItem("admin_logueado", "true");
    errorLogin.hidden = true;
    formLogin.reset();
    verificarSesion();
  } else {
    errorLogin.hidden = false;
  }
});

btnCerrarSesion.addEventListener("click", () => {
  sessionStorage.removeItem("admin_logueado");
  verificarSesion();
});

// ==========================================
// 3. GESTIÓN DE SOLICITUDES EN EL PANEL
// ==========================================
function cargarSolicitudesAdmin() {
  const contenedor = document.getElementById("lista-solicitudes-admin");
  const solicitudes = JSON.parse(localStorage.getItem("solicitudes_greenarqui")) || [];

  if (solicitudes.length === 0) {
    contenedor.innerHTML = "<p>Aún no hay solicitudes de cotización registradas.</p>";
    return;
  }

  contenedor.innerHTML = solicitudes.map((sol) => `
    <div class="item-admin">
      <div>
        <p><strong>${sol.nombre}</strong> (${sol.pais}) - <em>${sol.fecha}</em></p>
        <p><strong>Servicio:</strong> ${sol.servicio}</p>
        <p><strong>Contacto:</strong> ${sol.correo} | ${sol.telefono}</p>
        <p><strong>Proyecto:</strong> ${sol.mensaje}</p>
      </div>
      <button class="btn-eliminar-item" onclick="eliminarSolicitud(${sol.id})">Eliminar</button>
    </div>
  `).join("");
}

window.eliminarSolicitud = function (id) {
  let solicitudes = JSON.parse(localStorage.getItem("solicitudes_greenarqui")) || [];
  solicitudes = solicitudes.filter((sol) => sol.id !== id);
  localStorage.setItem("solicitudes_greenarqui", JSON.stringify(solicitudes));
  cargarSolicitudesAdmin();
};

// ==========================================
// 4. GESTIÓN DE PROYECTOS DINÁMICOS
// ==========================================
const formNuevoProyecto = document.getElementById("form-nuevo-proyecto");

formNuevoProyecto.addEventListener("submit", (e) => {
  e.preventDefault();

  const nuevoProyecto = {
    id: Date.now(),
    titulo: document.getElementById("proj-titulo").value,
    categoria: document.getElementById("proj-categoria").value,
    imagen: document.getElementById("proj-imagen").value,
    boton: document.getElementById("proj-boton").value,
    descripcion: document.getElementById("proj-descripcion").value
  };

  const proyectosExtra = JSON.parse(localStorage.getItem("proyectos_greenarqui")) || [];
  proyectosExtra.push(nuevoProyecto);
  localStorage.setItem("proyectos_greenarqui", JSON.stringify(proyectosExtra));

  formNuevoProyecto.reset();
  renderizarProyectosExtra();
  cargarProyectosAdmin();
});

function renderizarProyectosExtra() {
  const listaProyectos = document.getElementById("lista-proyectos");
  // Eliminamos los dinámicos previos para no duplicar al recargar
  document.querySelectorAll(".proyecto-dinamico").forEach((el) => el.remove());

  const proyectosExtra = JSON.parse(localStorage.getItem("proyectos_greenarqui")) || [];
  proyectosExtra.forEach((proj) => {
    const articulo = document.createElement("article");
    articulo.className = "tarjeta-proyecto proyecto-dinamico";
    articulo.innerHTML = `
      <div class="imagen-proyecto">
        <img src="${proj.imagen}" alt="Render del proyecto ${proj.titulo}">
        <span class="etiqueta-categoria">${proj.categoria}</span>
      </div>
      <div class="info-proyecto">
        <h3>${proj.titulo}</h3>
        <p>${proj.descripcion}</p>
        <a href="#contacto" class="btn-proyecto">${proj.boton}</a>
      </div>
    `;
    listaProyectos.appendChild(articulo);
  });
}

function cargarProyectosAdmin() {
  const contenedor = document.getElementById("lista-proyectos-admin");
  const proyectosExtra = JSON.parse(localStorage.getItem("proyectos_greenarqui")) || [];

  if (proyectosExtra.length === 0) {
    contenedor.innerHTML = "<p>Los 3 proyectos base están activos. Aquí aparecerán los nuevos que agregues.</p>";
    return;
  }

  contenedor.innerHTML = proyectosExtra.map((proj) => `
    <div class="item-admin">
      <div>
        <p><strong>${proj.titulo}</strong> (${proj.categoria})</p>
        <p>${proj.descripcion}</p>
      </div>
      <button class="btn-eliminar-item" onclick="eliminarProyecto(${proj.id})">Eliminar</button>
    </div>
  `).join("");
}

window.eliminarProyecto = function (id) {
  let proyectosExtra = JSON.parse(localStorage.getItem("proyectos_greenarqui")) || [];
  proyectosExtra = proyectosExtra.filter((proj) => proj.id !== id);
  localStorage.setItem("proyectos_greenarqui", JSON.stringify(proyectosExtra));
  renderizarProyectosExtra();
  cargarProyectosAdmin();
};

// Cargar proyectos extra al abrir la página
renderizarProyectosExtra();