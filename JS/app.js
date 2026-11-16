// 1. Capturamos el formulario y el mensaje de éxito
const formContacto = document.getElementById("form-contacto");
const mensajeExito = document.getElementById("mensaje-exito");

// 2. Escuchamos cuando el usuario hace clic en "Enviar mensaje"
formContacto.addEventListener("submit", function (evento) {
  // Evita que la página se recargue
  evento.preventDefault();

  // Creamos un objeto con los datos escritos por el cliente
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

  // Obtenemos las solicitudes anteriores (o una lista vacía si no hay)
  const solicitudesGuardadas = JSON.parse(localStorage.getItem("solicitudes_greenarqui")) || [];

  // Agregamos la nueva solicitud a la lista y la guardamos
  solicitudesGuardadas.push(nuevaSolicitud);
  localStorage.setItem("solicitudes_greenarqui", JSON.stringify(solicitudesGuardadas));

  // Limpiamos el formulario y mostramos el mensaje verde
  formContacto.reset();
  mensajeExito.hidden = false;

  // Ocultamos el mensaje después de 5 segundos
  setTimeout(() => {
    mensajeExito.hidden = true;
  }, 5000);
});