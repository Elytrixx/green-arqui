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

// ==========================================
// 5. ASISTENTE DE IA SOSTENIBLE (GREENBOT)
// ==========================================
const btnToggleIa = document.getElementById("btn-toggle-ia");
const btnCerrarIa = document.getElementById("btn-cerrar-ia");
const ventanaIa = document.getElementById("ventana-ia");
const mensajesIa = document.getElementById("mensajes-ia");
const formIa = document.getElementById("form-ia");
const inputIa = document.getElementById("input-ia");
const chipsIa = document.querySelectorAll(".chip-ia");

btnToggleIa.addEventListener("click", () => {
  ventanaIa.hidden = false;
  btnToggleIa.hidden = true;
});

btnCerrarIa.addEventListener("click", () => {
  ventanaIa.hidden = true;
  btnToggleIa.hidden = false;
});

chipsIa.forEach((chip) => {
  chip.addEventListener("click", () => {
    const pregunta = chip.getAttribute("data-pregunta");
    procesarConsultaIa(pregunta);
  });
});

formIa.addEventListener("submit", (e) => {
  e.preventDefault();
  const texto = inputIa.value.trim();
  if (!texto) return;
  inputIa.value = "";
  procesarConsultaIa(texto);
});

function agregarBurbuja(html, tipo) {
  const div = document.createElement("div");
  div.className = `burbuja-ia ${tipo}`;
  div.innerHTML = html;
  mensajesIa.appendChild(div);
  mensajesIa.scrollTop = mensajesIa.scrollHeight;
}

function procesarConsultaIa(textoUsuario) {
  agregarBurbuja(textoUsuario, "usuario");

  const consulta = textoUsuario.toLowerCase();
  let respuesta = "";
  let servicioSugerido = "";

  if (consulta.includes("casa") || consulta.includes("vivienda") || consulta.includes("residencia") || consulta.includes("construir")) {
    servicioSugerido = "diseno-arquitectonico";
    respuesta = `Para un proyecto residencial, nuestro enfoque combina <strong>ventilación cruzada pasiva, captación pluvial y vegetación nativa</strong> (como aplicamos en <em>Terravia Residences</em>).<br>Te recomendamos el servicio de <strong>Diseño arquitectónico sostenible</strong>.`;
  } else if (consulta.includes("local") || consulta.includes("comercial") || consulta.includes("restaurante") || consulta.includes("cocina") || consulta.includes("hostal") || consulta.includes("turismo")) {
    servicioSugerido = "diseno-arquitectonico";
    respuesta = `En espacios comerciales o turísticos (como <em>Papa-razzi</em> o <em>The Lost City</em>), optimizamos la <strong>eficiencia energética, el flujo operativo y el bajo impacto ecológico</strong>.<br>Podemos ayudarte con <strong>Diseño arquitectónico sostenible</strong> o <strong>Modelado 3D y renders</strong>.`;
  } else if (consulta.includes("remodelar") || consulta.includes("ampliar") || consulta.includes("remodelacion") || consulta.includes("adaptar")) {
    servicioSugerido = "remodelaciones";
    respuesta = `Reutilizar estructuras existentes reduce enormemente la huella de carbono. Evaluamos iluminación natural y materiales ecoeficientes.<br>Tu opción ideal es <strong>Remodelaciones y ampliaciones</strong>.`;
  } else if (consulta.includes("impacto") || consulta.includes("ambiental") || consulta.includes("terreno") || consulta.includes("biologia") || consulta.includes("flora") || consulta.includes("fauna")) {
    servicioSugerido = "impacto-ambiental";
    respuesta = `Desde nuestra área de Biología analizamos la <strong>biodiversidad local, suelos y mitigación de riesgos ecológicos</strong> antes de intervenir el terreno.<br>Te recomendamos una <strong>Evaluación de impacto ambiental</strong>.`;
  } else if (consulta.includes("3d") || consulta.includes("render") || consulta.includes("visualizar") || consulta.includes("plano")) {
    servicioSugerido = "modelado-3d";
    respuesta = `Visualizar tu espacio antes de construir evita desperdicios de material y mejora la toma de decisiones.<br>Te sugerimos nuestro servicio de <strong>Modelado 3D y renders</strong>.`;
  } else if (consulta.includes("precio") || consulta.includes("costo") || consulta.includes("cotizacion") || consulta.includes("presupuesto")) {
    servicioSugerido = "supervision";
    respuesta = `Cada diseño se adapta a las condiciones bioclimáticas y escala de tu terreno. Puedes enviarnos los detalles de tu idea en la sección de Contacto para prepararte una propuesta a medida.`;
  } else {
    servicioSugerido = "supervision";
    respuesta = `En <strong>Green Arqui</strong> unimos arquitectura y biología para crear espacios funcionales en armonía con la naturaleza. Cuéntanos si tu proyecto es residencial, comercial o una evaluación ambiental para orientarte mejor.`;
  }

  setTimeout(() => {
    const botonCotizar = servicioSugerido
      ? `<br><button type="button" class="btn-accion-ia" onclick="irACotizarConServicio('${servicioSugerido}')">Cotizar este servicio →</button>`
      : "";
    agregarBurbuja(respuesta + botonCotizar, "bot");
  }, 450);
}

window.irACotizarConServicio = function (valorServicio) {
  ventanaIa.hidden = true;
  btnToggleIa.hidden = false;
  const selectServicio = document.getElementById("servicio-interes");
  if (selectServicio) {
    selectServicio.value = valorServicio;
  }
  document.getElementById("contacto").scrollIntoView({ behavior: "smooth" });
};