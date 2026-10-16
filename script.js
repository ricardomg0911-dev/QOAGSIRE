
/* =========================
   1. MENU PARA CELULARES
========================= */

const menuToggle = document.getElementById("menuToggle");
const navegacion = document.getElementById("navegacion");

menuToggle.addEventListener("click", function() {
    const abierto = navegacion.classList.toggle("abierto");

    menuToggle.setAttribute("aria-expanded", abierto);
    menuToggle.setAttribute(
        "aria-label",
        abierto ? "Cerrar menú" : "Abrir menú"
    );

    menuToggle.textContent = abierto ? "×" : "☰";
});

// Cerrar el menu despues de seleccionar una seccion

const enlacesMenu = navegacion.querySelectorAll("a");

enlacesMenu.forEach(function(enlace) {
    enlace.addEventListener("click", function() {
        navegacion.classList.remove("abierto");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menú");
        menuToggle.textContent = "☰";
    });
});


/* =========================
   2. ANIMACIONES AL SCROLL
========================= */

const elementos = document.querySelectorAll(".revelar");

if ("IntersectionObserver" in window) {

    const observador = new IntersectionObserver(
        function(entradas, observer) {
            entradas.forEach(function(entrada) {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("visible");
                    observer.unobserve(entrada.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    elementos.forEach(function(elemento) {
        observador.observe(elemento);
    });

} else {
    elementos.forEach(function(elemento) {
        elemento.classList.add("visible");
    });
}


/* =========================
   3. ANIO AUTOMATICO
========================= */

const anio = document.getElementById("anio");

anio.textContent = new Date().getFullYear();


/* =========================
   4. FORMULARIO DE CONTACTO
========================= */

const formulario = document.getElementById("formularioContacto");
const respuesta = document.getElementById("respuesta");

formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const servicio = document.getElementById("servicio").value;
    const mensaje = document.getElementById("mensaje").value.trim();

    if (
        nombre === "" ||
        correo === "" ||
        servicio === "" ||
        mensaje === ""
    ) {
        respuesta.textContent =
            "Completa todos los campos antes de continuar.";
        return;
    }

    if (nombre.length < 2) {
        respuesta.textContent =
            "Escribe un nombre de al menos dos caracteres.";
        return;
    }

    const correoValido =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

    if (!correoValido) {
        respuesta.textContent =
            "Escribe una dirección de correo válida.";
        return;
    }

    const asunto = "Consulta sobre " + servicio;

    const cuerpo =
        "Hola, soy " + nombre + ".\n\n" +
        "Mi correo: " + correo + "\n" +
        "Servicio solicitado: " + servicio + "\n\n" +
        "Detalles de mi proyecto:\n" + mensaje;

    const urlCorreo =
        "mailto:contacto@noirtech.com" +
        "?subject=" + encodeURIComponent(asunto) +
        "&body=" + encodeURIComponent(cuerpo);

    respuesta.textContent =
        "Se abrirá tu aplicación de correo para preparar el mensaje.";

    window.location.href = urlCorreo;
});
