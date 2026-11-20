
import { db } from "./firebase.js";

import {
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// ==========================================
// 1. RENDERIZAR PROYECTOS DESDE FIRESTORE
// ==========================================

const listaProyectos = document.getElementById("lista-proyectos");

function renderizarProyectosExtra(proyectos) {
  if (!listaProyectos) return;

  // Eliminar únicamente los proyectos dinámicos anteriores.
  document.querySelectorAll(".proyecto-dinamico").forEach((el) => {
    el.remove();
  });

  proyectos.forEach((proj) => {

    const articulo = document.createElement("article");
    articulo.className = "tarjeta-proyecto proyecto-dinamico";

    const imagenProyecto = document.createElement("div");
    imagenProyecto.className = "imagen-proyecto";

    const imagen = document.createElement("img");
    imagen.src = proj.imagen || "";
    imagen.alt = `Render de ${proj.titulo || "proyecto"}`;

    const categoria = document.createElement("span");
    categoria.className = "etiqueta-categoria";
    categoria.textContent = proj.categoria || "";

    imagenProyecto.appendChild(imagen);
    imagenProyecto.appendChild(categoria);

    const informacion = document.createElement("div");
    informacion.className = "info-proyecto";

    const titulo = document.createElement("h3");
    titulo.textContent = proj.titulo || "";

    const descripcion = document.createElement("p");
    descripcion.textContent = proj.descripcion || "";

    const boton = document.createElement("a");
    boton.href = "#contacto";
    boton.className = "btn-proyecto";
    boton.textContent = proj.boton || "Más información";

    informacion.appendChild(titulo);
    informacion.appendChild(descripcion);
    informacion.appendChild(boton);

    articulo.appendChild(imagenProyecto);
    articulo.appendChild(informacion);

    listaProyectos.appendChild(articulo);

  });
}

// Escuchar cambios en Firestore en tiempo real.
if (listaProyectos) {

  onSnapshot(
    collection(db, "proyectos"),

    (snapshot) => {

      const proyectos = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
      }));

      // Ordenar por fecha de creación, del más reciente al más antiguo.
      proyectos.sort((a, b) => {

        const fechaA = a.fechaCreacion?.toMillis
          ? a.fechaCreacion.toMillis()
          : 0;

        const fechaB = b.fechaCreacion?.toMillis
          ? b.fechaCreacion.toMillis()
          : 0;

        return fechaB - fechaA;

      });

      renderizarProyectosExtra(proyectos);

    },

    (error) => {
      console.error("Error al consultar proyectos de Firebase:", error);
    }
  );

}

// ==========================================
// 2. ASISTENTE DE IA SOSTENIBLE (GREENBOT)
// ==========================================

const btnToggleIa = document.getElementById("btn-toggle-ia");
const btnCerrarIa = document.getElementById("btn-cerrar-ia");
const ventanaIa = document.getElementById("ventana-ia");
const mensajesIa = document.getElementById("mensajes-ia");
const formIa = document.getElementById("form-ia");
const inputIa = document.getElementById("input-ia");
const chipsIa = document.querySelectorAll(".chip-ia");

if (
  btnToggleIa &&
  btnCerrarIa &&
  ventanaIa
) {

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

  if (formIa && inputIa) {

    formIa.addEventListener("submit", (e) => {

      e.preventDefault();

      const texto = inputIa.value.trim();

      if (!texto) return;

      inputIa.value = "";

      procesarConsultaIa(texto);

    });

  }

}

// ==========================================
// 3. AGREGAR MENSAJES AL CHAT
// ==========================================

function agregarBurbuja(contenido, tipo, esHTML = false) {

  if (!mensajesIa) return null;

  const div = document.createElement("div");

  div.className = `burbuja-ia ${tipo}`;

  if (esHTML) {
    div.innerHTML = contenido;
  } else {
    div.textContent = contenido;
  }

  mensajesIa.appendChild(div);

  mensajesIa.scrollTop = mensajesIa.scrollHeight;

  return div;

}

// ==========================================
// 4. PROCESAR CONSULTAS DE GREENBOT
// ==========================================

function procesarConsultaIa(textoUsuario) {

  agregarBurbuja(textoUsuario, "usuario");

  const burbujaEscribiendo = agregarBurbuja(
    "GreenBot está pensando...",
    "bot escribiendo"
  );

  const consulta = textoUsuario.toLowerCase();

  let respuesta = "";
  let servicioSugerido = "";

  setTimeout(() => {

    if (burbujaEscribiendo) {
      burbujaEscribiendo.remove();
    }

    if (
      consulta.includes("casa") ||
      consulta.includes("vivienda") ||
      consulta.includes("residencia") ||
      consulta.includes("construir") ||
      consulta.includes("edificio")
    ) {

      servicioSugerido = "diseno-arquitectonico";

      respuesta = `Para proyectos residenciales o edificaciones, integramos ventilación pasiva, confort térmico y vegetación nativa (como en <em>Terravia Residences</em>). Te sugerimos nuestro servicio de <strong>Diseño arquitectónico sostenible</strong>.`;

    } else if (
      consulta.includes("local") ||
      consulta.includes("comercial") ||
      consulta.includes("restaurante") ||
      consulta.includes("hostal") ||
      consulta.includes("negocio")
    ) {

      servicioSugerido = "diseno-arquitectonico";

      respuesta = `En espacios comerciales o turísticos (como <em>Papa-razzi</em> o <em>The Lost City</em>), optimizamos eficiencia energética y flujos operativos. Te recomendamos <strong>Diseño arquitectónico sostenible</strong>.`;

    } else if (
      consulta.includes("remodelar") ||
      consulta.includes("ampliar") ||
      consulta.includes("cambiar")
    ) {

      servicioSugerido = "remodelaciones";

      respuesta = `Reutilizar y adaptar estructuras existentes reduce la huella de carbono. Te recomendamos <strong>Remodelaciones y ampliaciones</strong>.`;

    } else if (
      consulta.includes("impacto") ||
      consulta.includes("ambiental") ||
      consulta.includes("terreno") ||
      consulta.includes("biologia")
    ) {

      servicioSugerido = "impacto-ambiental";

      respuesta = `Analizamos biodiversidad local y mitigación ecológica antes de intervenir el sitio. Te recomendamos una <strong>Evaluación de impacto ambiental</strong>.`;

    } else if (
      consulta.includes("3d") ||
      consulta.includes("render") ||
      consulta.includes("visualizar") ||
      consulta.includes("plano")
    ) {

      servicioSugerido = "modelado-3d";

      respuesta = `Las representaciones digitales permiten anticipar distribución e iluminación. Te recomendamos <strong>Modelado 3D y renders</strong>.`;

    } else {

      servicioSugerido = "supervision";

      respuesta = `En <strong>Green Arqui</strong> unimos arquitectura y biología para crear espacios en armonía con el entorno. Cuéntanos más sobre tu proyecto para orientarte mejor.`;

    }

    const botonCotizar = servicioSugerido
      ? `<br><button type="button" class="btn-accion-ia" onclick="irACotizarConServicio('${servicioSugerido}')">Cotizar este servicio →</button>`
      : "";

    agregarBurbuja(respuesta + botonCotizar, "bot", true);

  }, 800);

}

// ==========================================
// 5. CONECTAR GREENBOT CON EL FORMULARIO
// ==========================================

window.irACotizarConServicio = function (valorServicio) {

  if (ventanaIa) {
    ventanaIa.hidden = true;
  }

  if (btnToggleIa) {
    btnToggleIa.hidden = false;
  }

  const selectServicio = document.getElementById("servicio-interes");

  if (selectServicio) {
    selectServicio.value = valorServicio;
  }

  const contacto = document.getElementById("contacto");

  if (contacto) {
    contacto.scrollIntoView({
      behavior: "smooth"
    });
  }

};
