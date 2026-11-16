// ==========================================
// 1. FORMULARIO DE CONTACTO
// ==========================================
const formContacto = document.getElementById("form-contacto");
const mensajeExito = document.getElementById("mensaje-exito");

if (formcontacto) {
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
    setTimeout(() => { mensajeExito.hidden = true; }, 5000);
  });
}

// ==========================================
// 2. RENDERIZAR PROYECTOS DINÁMICOS
// ==========================================
function renderizarProyectosExtra() {
  const listaProyectos = document.getElementById("lista-proyectos");
  if (!listaProyectos) return;

  document.querySelectorAll(".proyecto-dinamico").forEach((el) => el.remove());

  const proyectosExtra = JSON.parse(localStorage.getItem("proyectos_greenarqui")) || [];
  proyectosExtra.forEach((proj) => {
    const articulo = document.createElement("article");
    articulo.className = "tarjeta-proyecto proyecto-dinamico";
    articulo.innerHTML = `
      <div class="imagen-proyecto">
        <img src="${proj.imagen}" alt="Render de ${proj.titulo}">
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
renderizarProyectosExtra();

// ==========================================
// 3. ASISTENTE DE IA SOSTENIBLE (GREENBOT)
// ==========================================
const btnToggleIa = document.getElementById("btn-toggle-ia");
const btnCerrarIa = document.getElementById("btn-cerrar-ia");
const ventanaIa = document.getElementById("ventana-ia");
const mensajesIa = document.getElementById("mensajes-ia");
const formIa = document.getElementById("form-ia");
const inputIa = document.getElementById("input-ia");
const chipsIa = document.querySelectorAll(".chip-ia");

if (btnToggleIa) {
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
      procesarConsultaIa(chip.getAttribute("data-pregunta"));
    });
  });

  formIa.addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = inputIa.value.trim();
    if (!texto) return;
    inputIa.value = "";
    procesarConsultaIa(texto);
  });
}

function agregarBurbuja(html, tipo) {
  const div = document.createElement("div");
  div.className = `burbuja-ia ${tipo}`;
  div.innerHTML = html;
  mensajesIa.appendChild(div);
  mensajesIa.scrollTop = mensajesIa.scrollHeight;
  return div;
}

function procesarConsultaIa(textoUsuario) {
  agregarBurbuja(textoUsuario, "usuario");
  const burbujaEscribiendo = agregarBurbuja("GreenBot está pensando...", "bot escribiendo");
  const consulta = textoUsuario.toLowerCase();
  let respuesta = "";
  let servicioSugerido = "";

  setTimeout(() => {
    mensajesIa.removeChild(burbujaEscribiendo);

    if (consulta.includes("casa") || consulta.includes("vivienda") || consulta.includes("residencia") || consulta.includes("construir")) {
      servicioSugerido = "diseno-arquitectonico";
      respuesta = `Para proyectos residenciales, integramos ventilación pasiva, confort térmico y vegetación nativa (como en <em>Terravia Residences</em>). Te sugerimos nuestro servicio de <strong>Diseño arquitectónico sostenible</strong>.`;
    } else if (consulta.includes("local") || consulta.includes("comercial") || consulta.includes("restaurante") || consulta.includes("hostal") || consulta.includes("negocio")) {
      servicioSugerido = "diseno-arquitectonico";
      respuesta = `En espacios comerciales o turísticos (como <em>Papa-razzi</em> o <em>The Lost City</em>), optimizamos eficiencia energética y flujos operativos. Te recomendamos <strong>Diseño arquitectónico sostenible</strong>.`;
    } else if (consulta.includes("remodelar") || consulta.includes("ampliar") || consulta.includes("cambiar")) {
      servicioSugerido = "remodelaciones";
      respuesta = `Reutilizar y adaptar estructuras existentes reduce la huella de carbono. Te recomendamos <strong>Remodelaciones y ampliaciones</strong>.`;
    } else if (consulta.includes("impacto") || consulta.includes("ambiental") || consulta.includes("terreno") || consulta.includes("biologia")) {
      servicioSugerido = "impacto-ambiental";
      respuesta = `Analizamos biodiversidad local y mitigación ecológica antes de intervenir el sitio. Te recomendamos una <strong>Evaluación de impacto ambiental</strong>.`;
    } else if (consulta.includes("3d") || consulta.includes("render") || consulta.includes("visualizar") || consulta.includes("plano")) {
      servicioSugerido = "modelado-3d";
      respuesta = `Las representaciones digitales permiten anticipar distribución e iluminación. Te recomendamos <strong>Modelado 3D y renders</strong>.`;
    } else {
      servicioSugerido = "supervision";
      respuesta = `En <strong>Green Arqui</strong> unimos arquitectura y biología para crear espacios en armonía con el entorno. Cuéntanos más sobre tu proyecto para orientarte mejor.`;
    }

    const botonCotizar = servicioSugerido ? `<br><button type="button" class="btn-accion-ia" onclick="irACotizarConServicio('${servicioSugerido}')">Cotizar este servicio →</button>` : "";
    agregarBurbuja(respuesta + botonCotizar, "bot");
  }, 800);
}

window.irACotizarConServicio = function (valorServicio) {
  ventanaIa.hidden = true;
  btnToggleIa.hidden = false;
  const selectServicio = document.getElementById("servicio-interes");
  if (selectServicio) selectServicio.value = valorServicio;
  document.getElementById("contacto").scrollIntoView({ behavior: "smooth" });
};