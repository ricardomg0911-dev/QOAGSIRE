
/* =========================
   1. VERIFICAR SESION
========================= */

if (sessionStorage.getItem("sesionRiego") !== "activa") {
    window.location.replace("login.html");
}


/* =========================
   2. VARIABLES DEL SISTEMA
========================= */

let riegoActivo = false;
let humedad = 42;
let temperatura = 25;
let nivelAgua = 78;
let consumo = 0;

const modoRiego = document.getElementById("modoRiego");
const botonRiego = document.getElementById("botonRiego");
const estadoSistema = document.getElementById("estadoSistema");
const textoSistema = document.getElementById("textoSistema");
const textoControl = document.getElementById("textoControl");
const etiquetaRiego = document.getElementById("etiquetaRiego");
const iconoGota = document.getElementById("iconoGota");
const indicadorRiego = document.querySelector(".indicador-riego");
const notaControl = document.getElementById("notaControl");
const listaHistorial = document.getElementById("listaHistorial");


/* =========================
   3. FECHA Y HORA
========================= */

function actualizarFechaHora() {
    const ahora = new Date();

    document.getElementById("fechaHora").textContent =
        ahora.toLocaleString("es-MX", {
            dateStyle: "medium",
            timeStyle: "medium"
        });
}

actualizarFechaHora();
setInterval(actualizarFechaHora, 1000);


/* =========================
   4. HISTORIAL
========================= */

function registrarEvento(titulo, detalle) {
    const vacio = listaHistorial.querySelector(".historial-vacio");

    if (vacio) {
        vacio.remove();
    }

    const evento = document.createElement("div");
    evento.className = "evento-historial";

    const nombre = document.createElement("strong");
    nombre.textContent = titulo;

    const descripcion = document.createElement("span");
    descripcion.textContent =
        new Date().toLocaleTimeString("es-MX") + " · " + detalle;

    evento.append(nombre, descripcion);
    listaHistorial.prepend(evento);

    while (listaHistorial.children.length > 30) {
        listaHistorial.lastElementChild.remove();
    }
}


/* =========================
   5. ACTUALIZAR INTERFAZ
========================= */


function actualizarInterfaz() {
    // Mostrar lecturas
    document.getElementById("humedad").textContent = humedad;
    document.getElementById("temperatura").textContent = temperatura;
    document.getElementById("nivelAgua").textContent = nivelAgua;
    document.getElementById("consumo").textContent = consumo.toFixed(1);

    // Actualizar barras
    document.getElementById("barraHumedad").style.width =
        humedad + "%";

    document.getElementById("barraTemperatura").style.width =
        Math.min(temperatura / 50 * 100, 100) + "%";

    document.getElementById("barraAgua").style.width =
        nivelAgua + "%";

    document.getElementById("barraConsumo").style.width =
        Math.min(consumo / 20 * 100, 100) + "%";

    // Escala de colores de humedad
    let colorHumedad;
    let textoHumedad;

    if (humedad < 30) {
        colorHumedad = "#ef5350";
        textoHumedad = "Suelo seco";
    } else if (humedad < 40) {
        colorHumedad = "#ffb74d";
        textoHumedad = "Humedad baja";
    } else if (humedad <= 70) {
        colorHumedad = "#66bb6a";
        textoHumedad = "Humedad adecuada";
    } else {
        colorHumedad = "#42bde8";
        textoHumedad = "Exceso de humedad";
    }

    document.getElementById("barraHumedad")
        .style.setProperty("--color-sensor", colorHumedad);

    document.getElementById("estadoHumedad").style.color =
        colorHumedad;

    document.getElementById("estadoHumedad").textContent =
        textoHumedad;

    document.getElementById("barraHumedad").style.background =
        colorHumedad;

    // Escala de colores de temperatura
    let colorTemperatura;
    let textoTemperatura;

    if (temperatura < 15) {
        colorTemperatura = "#42bde8";
        textoTemperatura = "Temperatura fría";
    } else if (temperatura <= 28) {
        colorTemperatura = "#66bb6a";
        textoTemperatura = "Temperatura normal";
    } else if (temperatura <= 35) {
        colorTemperatura = "#ff9f43";
        textoTemperatura = "Temperatura alta";
    } else {
        colorTemperatura = "#ef5350";
        textoTemperatura = "Temperatura muy alta";
    }

    document.getElementById("barraTemperatura")
        .style.background = colorTemperatura;

    document.getElementById("barraTemperatura")
        .style.boxShadow = "0 0 10px " + colorTemperatura;

    document.getElementById("estadoTemperatura").style.color =
        colorTemperatura;

    document.getElementById("estadoTemperatura").textContent =
        textoTemperatura;

    // Simulación visual del depósito
    const aguaVisual = document.getElementById("aguaVisual");

    aguaVisual.style.height = nivelAgua + "%";

    document.getElementById("porcentajeDeposito").textContent =
        nivelAgua + "%";

    let colorAgua;

    if (nivelAgua < 20) {
        colorAgua = "#e45b52";
        document.getElementById("estadoAgua").textContent =
            "Nivel crítico";
    } else if (nivelAgua < 45) {
        colorAgua = "#ffb74d";
        document.getElementById("estadoAgua").textContent =
            "Nivel bajo";
    } else {
        colorAgua = "#52c9e8";
        document.getElementById("estadoAgua").textContent =
            "Nivel suficiente";
    }

    aguaVisual.style.background =
        "linear-gradient(180deg, " + colorAgua +
        ", #07547d)";

    document.getElementById("barraAgua").style.background =
        colorAgua;

    document.getElementById("estadoAgua").style.color =
        colorAgua;

    // Estado del riego
    document.getElementById("estadoSistema").textContent =
        riegoActivo ? "Riego en funcionamiento" : "Riego detenido";

    document.getElementById("textoSistema").textContent =
        riegoActivo
            ? "El sistema de demostración está regando."
            : "El sistema está listo para funcionar.";

    document.getElementById("textoControl").textContent =
        riegoActivo ? "Riego activado" : "Sistema detenido";

    document.getElementById("etiquetaRiego").textContent =
        riegoActivo ? "ACTIVO" : "INACTIVO";

    document.getElementById("iconoGota").textContent =
        riegoActivo ? "💧" : "◌";

    document.querySelector(".indicador-riego")
        .classList.toggle("activo", riegoActivo);

    document.getElementById("botonRiego").textContent =
        riegoActivo ? "Detener riego" : "Activar riego";

    document.getElementById("botonRiego").disabled =
        modoRiego.value === "automatico";

    document.getElementById("notaControl").textContent =
        modoRiego.value === "automatico"
            ? "Modo automático: el riego se activa con humedad inferior al 35% y se detiene al llegar al 60%."
            : "Modo manual: activa o detén el riego con el botón. Las lecturas son simuladas.";
}
{
    // El control manual solo funciona en modo manual.
    botonRiego.disabled = modoRiego.value === "automatico";

    if (modoRiego.value === "automatico") {
        notaControl.textContent =
            "Modo automático: el riego se activa con humedad inferior al 35% y se detiene al llegar al 60%.";
    } else {
        notaControl.textContent =
            "Modo manual: activa o detén el riego con el botón. Las lecturas son simuladas.";
    }
}


/* =========================
   6. ACTIVAR Y DETENER RIEGO
========================= */

function cambiarRiego(activar, motivo) {
    if (activar && nivelAgua <= 0) {
        riegoActivo = false;
        actualizarInterfaz();
        registrarEvento(
            "Riego bloqueado",
            "El depósito simulado está vacío."
        );
        return;
    }

    if (activar === riegoActivo) {
        actualizarInterfaz();
        return;
    }

    riegoActivo = activar;
    actualizarInterfaz();

    registrarEvento(
        activar ? "Riego activado" : "Riego detenido",
        motivo
    );
}

botonRiego.addEventListener("click", function() {
    if (modoRiego.value !== "manual") {
        return;
    }

    cambiarRiego(
        !riegoActivo,
        "Acción realizada en modo manual."
    );
});


/* =========================
   7. CAMBIAR MODO
========================= */

modoRiego.addEventListener("change", function() {
    if (modoRiego.value === "automatico") {
        registrarEvento(
            "Modo automático",
            "El sistema evaluará la humedad simulada."
        );

        evaluarRiegoAutomatico();
    } else {
        // Evita que el riego siga activo al pasar a manual.
        cambiarRiego(false, "Cambio a modo manual.");
        registrarEvento(
            "Modo manual",
            "El usuario controla el riego."
        );
    }

    actualizarInterfaz();
});


/* =========================
   8. LOGICA AUTOMATICA
========================= */

function evaluarRiegoAutomatico() {
    if (modoRiego.value !== "automatico") {
        return;
    }

    if (humedad < 35 && nivelAgua > 0) {
        cambiarRiego(
            true,
            "Humedad inferior al 35%."
        );
    } else if (humedad >= 60 && riegoActivo) {
        cambiarRiego(
            false,
            "Se alcanzó la humedad objetivo del 60%."
        );
    } else if (nivelAgua <= 0 && riegoActivo) {
        cambiarRiego(
            false,
            "Depósito sin agua."
        );
    }
}


/* =========================
   9. SIMULAR SENSORES
========================= */

document.getElementById("actualizarSensores")
    .addEventListener("click", function() {

        temperatura = Math.max(
            15,
            Math.min(40, temperatura + Math.round(Math.random() * 4 - 2))
        );

        if (riegoActivo) {
            humedad = Math.min(100, humedad + 5);
            nivelAgua = Math.max(0, nivelAgua - 2);
            consumo += 0.5;
        } else {
            humedad = Math.max(
                10,
                Math.min(90, humedad + Math.round(Math.random() * 8 - 4))
            );
        }

        actualizarInterfaz();

        registrarEvento(
            "Sensores actualizados",
            "Se generaron nuevas lecturas simuladas."
        );

        evaluarRiegoAutomatico();
        actualizarInterfaz();
    });


/* =========================
   10. LIMPIAR HISTORIAL
========================= */

document.getElementById("limpiarHistorial")
    .addEventListener("click", function() {

        listaHistorial.replaceChildren();

        const vacio = document.createElement("p");
        vacio.className = "historial-vacio";
        vacio.textContent = "No hay eventos registrados.";

        listaHistorial.appendChild(vacio);
    });


/* =========================
   11. CERRAR SESION
========================= */

document.getElementById("cerrarSesion")
    .addEventListener("click", function() {

        sessionStorage.removeItem("sesionRiego");
        window.location.replace("login.html");
    });


/* =========================
   12. INICIAR PANEL
========================= */

actualizarInterfaz();

registrarEvento(
    "Sistema iniciado",
    "Panel de demostración preparado."
);
