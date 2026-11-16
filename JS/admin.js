// ==========================================
// GESTIÓN EXCLUSIVA DE ADMIN (admin.html)
// ==========================================
const vistaLogin = document.getElementById("vista-login");
const vistaPanel = document.getElementById("vista-panel");
const formLogin = document.getElementById("form-login");
const errorLogin = document.getElementById("error-login");
const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");

const ADMIN_USER = "admin";
const ADMIN_PASS = "greenarqui2026";

function verificarSesion() {
  if (sessionStorage.getItem("admin_logueado") === "true") {
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
  if (document.getElementById("admin-usuario").value === ADMIN_USER && document.getElementById("admin-password").value === ADMIN_PASS) {
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

function cargarSolicitudesAdmin() {
  const contenedor = document.getElementById("lista-solicitudes-admin");
  const solicitudes = JSON.parse(localStorage.getItem("solicitudes_greenarqui")) || [];
  if (solicitudes.length === 0) {
    contenedor.innerHTML = "<p>Aún no hay solicitudes de cotización.</p>";
    return;
  }
  contenedor.innerHTML = solicitudes.map(sol => `
    <div class="item-admin">
      <div>
        <p><strong>${sol.nombre}</strong> (${sol.pais}) - <em>${sol.fecha}</em></p>
        <p><strong>Servicio:</strong> ${sol.servicio}</p>
        <p><strong>Contacto:</strong> ${sol.correo} | ${sol.telefono}</p>
        <p><strong>Mensaje:</strong> ${sol.mensaje}</p>
      </div>
      <button class="btn-eliminar-item" onclick="eliminarSolicitud(${sol.id})">Eliminar</button>
    </div>
  `).join("");
}

window.eliminarSolicitud = function(id) {
  let sols = JSON.parse(localStorage.getItem("solicitudes_greenarqui")) || [];
  sols = sols.filter(s => s.id !== id);
  localStorage.setItem("solicitudes_greenarqui", JSON.stringify(sols));
  cargarSolicitudesAdmin();
};

const formNuevoProyecto = document.getElementById("form-nuevo-proyecto");
formNuevoProyecto.addEventListener("submit", (e) => {
  e.preventDefault();
  const nuevo = {
    id: Date.now(),
    titulo: document.getElementById("proj-titulo").value,
    categoria: document.getElementById("proj-categoria").value,
    imagen: document.getElementById("proj-imagen").value,
    boton: document.getElementById("proj-boton").value,
    descripcion: document.getElementById("proj-descripcion").value
  };
  const projs = JSON.parse(localStorage.getItem("proyectos_greenarqui")) || [];
  projs.push(nuevo);
  localStorage.setItem("proyectos_greenarqui", JSON.stringify(projs));
  formNuevoProyecto.reset();
  cargarProyectosAdmin();
});

function cargarProyectosAdmin() {
  const contenedor = document.getElementById("lista-proyectos-admin");
  const projs = JSON.parse(localStorage.getItem("proyectos_greenarqui")) || [];
  if (projs.length === 0) {
    contenedor.innerHTML = "<p>No hay proyectos dinámicos agregados todavía.</p>";
    return;
  }
  contenedor.innerHTML = projs.map(p => `
    <div class="item-admin">
      <div>
        <p><strong>${p.titulo}</strong> (${p.categoria})</p>
        <p>${p.descripcion}</p>
      </div>
      <button class="btn-eliminar-item" onclick="eliminarProyecto(${p.id})">Eliminar</button>
    </div>
  `).join("");
}

window.eliminarProyecto = function(id) {
  let projs = JSON.parse(localStorage.getItem("proyectos_greenarqui")) || [];
  projs = projs.filter(p => p.id !== id);
  localStorage.setItem("proyectos_greenarqui", JSON.stringify(projs));
  cargarProyectosAdmin();
};

verificarSesion();