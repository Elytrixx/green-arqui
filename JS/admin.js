
// ==========================================
// GREEN ARQUI - PANEL ADMINISTRATIVO
// Firebase Authentication + Cloud Firestore
// ==========================================

import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// ==========================================
// 1. CONFIGURACIÓN ADMINISTRATIVA
// ==========================================


const ADMIN_UID = "z8hIrDbkUsTfS3tG0NlWmdi0CgN2";

// Colecciones de Firestore
const COLECCION_PROYECTOS = "proyectos";
const COLECCION_SOLICITUDES = "solicitudes";

// ==========================================
// 2. ELEMENTOS HTML
// ==========================================

const vistaLogin = document.getElementById("vista-login");
const vistaPanel = document.getElementById("vista-panel");

const formLogin = document.getElementById("form-login");
const errorLogin = document.getElementById("error-login");

const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");

const formNuevoProyecto = document.getElementById("form-nuevo-proyecto");

const listaProyectos = document.getElementById("lista-proyectos-admin");
const listaSolicitudes = document.getElementById("lista-solicitudes-admin");

// Referencias a las suscripciones de Firestore
let cancelarProyectos = null;
let cancelarSolicitudes = null;

// ==========================================
// 3. FUNCIONES AUXILIARES
// ==========================================

function mostrarError(mensaje) {
  if (!errorLogin) return;

  errorLogin.textContent = mensaje;
  errorLogin.hidden = false;
}

function ocultarError() {
  if (!errorLogin) return;

  errorLogin.hidden = true;
}

function escaparHTML(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, caracter => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[caracter]);
}

function mostrarLogin() {
  vistaLogin.hidden = false;
  vistaPanel.hidden = true;
}

function mostrarPanel() {
  vistaLogin.hidden = true;
  vistaPanel.hidden = false;
}

// ==========================================
// 4. CONTROL DE SESIÓN CON FIREBASE
// ==========================================

onAuthStateChanged(auth, async (usuario) => {

  if (usuario && usuario.uid === ADMIN_UID) {

    mostrarPanel();
    ocultarError();

    cargarProyectosAdmin();
    cargarSolicitudesAdmin();

  } else {

    detenerActualizaciones();

    mostrarLogin();

    // Si existe una sesión de otro usuario,
    // se cierra para impedir el acceso al panel.
    if (usuario) {
      await signOut(auth);
      mostrarError("Esta cuenta no tiene permisos administrativos.");
    }
  }

});

// ==========================================
// 5. INICIAR SESIÓN
// ==========================================

formLogin.addEventListener("submit", async (e) => {

  e.preventDefault();

  const correo = document
    .getElementById("admin-usuario")
    .value.trim();

  const password = document
    .getElementById("admin-password")
    .value;

  if (!correo || !password) {
    mostrarError("Completa el correo y la contraseña.");
    return;
  }

  try {

    ocultarError();

    const credenciales = await signInWithEmailAndPassword(
      auth,
      correo,
      password
    );

    if (credenciales.user.uid !== ADMIN_UID) {

      await signOut(auth);

      mostrarError("Esta cuenta no tiene permisos administrativos.");
      return;

    }

    formLogin.reset();

  } catch (error) {

    console.error("Error de autenticación:", error);

    mostrarError("No se pudo iniciar sesión. Verifica tus credenciales.");

  }

});

// ==========================================
// 6. CERRAR SESIÓN
// ==========================================

btnCerrarSesion.addEventListener("click", async () => {

  try {

    detenerActualizaciones();

    await signOut(auth);

    mostrarLogin();

  } catch (error) {

    console.error("Error al cerrar sesión:", error);

    alert("No se pudo cerrar la sesión.");

  }

});

// ==========================================
// 7. DETENER ACTUALIZACIONES DE FIRESTORE
// ==========================================

function detenerActualizaciones() {

  if (cancelarProyectos) {
    cancelarProyectos();
    cancelarProyectos = null;
  }

  if (cancelarSolicitudes) {
    cancelarSolicitudes();
    cancelarSolicitudes = null;
  }

}

// ==========================================
// 8. AGREGAR NUEVO PROYECTO
// ==========================================

formNuevoProyecto.addEventListener("submit", async (e) => {

  e.preventDefault();

  if (!auth.currentUser || auth.currentUser.uid !== ADMIN_UID) {
    alert("No tienes autorización para publicar proyectos.");
    return;
  }

  const nuevoProyecto = {

    titulo: document.getElementById("proj-titulo").value.trim(),

    categoria: document.getElementById("proj-categoria").value.trim(),

    imagen: document.getElementById("proj-imagen").value.trim(),

    boton: document.getElementById("proj-boton").value.trim(),

    descripcion: document.getElementById("proj-descripcion").value.trim(),

    fechaCreacion: new Date()

  };

  if (
    !nuevoProyecto.titulo ||
    !nuevoProyecto.categoria ||
    !nuevoProyecto.imagen ||
    !nuevoProyecto.boton ||
    !nuevoProyecto.descripcion
  ) {
    alert("Completa todos los campos del proyecto.");
    return;
  }

  try {

    await addDoc(
      collection(db, COLECCION_PROYECTOS),
      nuevoProyecto
    );

    formNuevoProyecto.reset();

    alert("¡Proyecto publicado correctamente!");

  } catch (error) {

    console.error("Error al publicar proyecto:", error);

    alert("No se pudo publicar el proyecto. Revisa la conexión y los permisos de Firestore.");

  }

});

// ==========================================
// 9. CARGAR PROYECTOS DESDE FIRESTORE
// ==========================================

function cargarProyectosAdmin() {

  if (cancelarProyectos) {
    cancelarProyectos();
  }

  const consulta = query(
    collection(db, COLECCION_PROYECTOS),
    orderBy("fechaCreacion", "desc")
  );

  cancelarProyectos = onSnapshot(consulta, (snapshot) => {

    if (snapshot.empty) {

      listaProyectos.innerHTML =
        "<p>No hay proyectos agregados todavía.</p>";

      return;

    }

    listaProyectos.innerHTML = snapshot.docs.map((documento) => {

      const proyecto = documento.data();

      return `
        <div class="item-admin">

          <div>
            <p>
              <strong>${escaparHTML(proyecto.titulo)}</strong>
              (${escaparHTML(proyecto.categoria)})
            </p>

            <p>${escaparHTML(proyecto.descripcion)}</p>
          </div>

          <button
            class="btn-eliminar-item"
            data-id="${escaparHTML(documento.id)}"
            data-tipo="proyecto"
            type="button">
            Eliminar
          </button>

        </div>
      `;

    }).join("");

  }, (error) => {

    console.error("Error al cargar proyectos:", error);

    listaProyectos.textContent =
      "No se pudieron cargar los proyectos. Revisa los permisos de Firestore.";

  });

}

// ==========================================
// 10. ELIMINAR PROYECTO
// ==========================================

listaProyectos.addEventListener("click", async (e) => {

  const boton = e.target.closest('[data-tipo="proyecto"]');

  if (!boton) return;

  if (!auth.currentUser || auth.currentUser.uid !== ADMIN_UID) {
    alert("No tienes autorización.");
    return;
  }

  const id = boton.dataset.id;

  if (!confirm("¿Seguro que deseas eliminar este proyecto?")) {
    return;
  }

  try {

    await deleteDoc(
      doc(db, COLECCION_PROYECTOS, id)
    );

  } catch (error) {

    console.error("Error al eliminar proyecto:", error);

    alert("No se pudo eliminar el proyecto.");

  }

});

// ==========================================
// 11. CARGAR SOLICITUDES DESDE FIRESTORE
// ==========================================

function cargarSolicitudesAdmin() {

  if (cancelarSolicitudes) {
    cancelarSolicitudes();
  }

  const consulta = query(
    collection(db, COLECCION_SOLICITUDES),
    orderBy("fecha", "desc")
  );

  cancelarSolicitudes = onSnapshot(consulta, (snapshot) => {

    if (snapshot.empty) {

      listaSolicitudes.innerHTML =
        "<p>Aún no hay solicitudes de cotización.</p>";

      return;

    }

    listaSolicitudes.innerHTML = snapshot.docs.map((documento) => {

      const solicitud = documento.data();

      return `
        <div class="item-admin">

          <div>

            <p>
              <strong>${escaparHTML(solicitud.nombre)}</strong>
              (${escaparHTML(solicitud.pais)})
            </p>

            <p>
              <strong>Servicio:</strong>
              ${escaparHTML(solicitud.servicio)}
            </p>

            <p>
              <strong>Contacto:</strong>
              ${escaparHTML(solicitud.correo)}
              |
              ${escaparHTML(solicitud.telefono)}
            </p>

            <p>
              <strong>Mensaje:</strong>
              ${escaparHTML(solicitud.mensaje)}
            </p>

            <p>
              <strong>Fecha:</strong>
              ${escaparHTML(
                solicitud.fecha?.toDate
                  ? solicitud.fecha.toDate().toLocaleString("es-PA")
                  : "Sin fecha"
              )}
            </p>

          </div>

          <button
            class="btn-eliminar-item"
            data-id="${escaparHTML(documento.id)}"
            data-tipo="solicitud"
            type="button">
            Eliminar
          </button>

        </div>
      `;

    }).join("");

  }, (error) => {

    console.error("Error al cargar solicitudes:", error);

    listaSolicitudes.textContent =
      "No se pudieron cargar las solicitudes. Revisa los permisos de Firestore.";

  });

}

// ==========================================
// 12. ELIMINAR SOLICITUD
// ==========================================

listaSolicitudes.addEventListener("click", async (e) => {

  const boton = e.target.closest('[data-tipo="solicitud"]');

  if (!boton) return;

  if (!auth.currentUser || auth.currentUser.uid !== ADMIN_UID) {
    alert("No tienes autorización.");
    return;
  }

  const id = boton.dataset.id;

  if (!confirm("¿Seguro que deseas eliminar esta solicitud?")) {
    return;
  }

  try {

    await deleteDoc(
      doc(db, COLECCION_SOLICITUDES, id)
    );

  } catch (error) {

    console.error("Error al eliminar solicitud:", error);

    alert("No se pudo eliminar la solicitud.");

  }

});
