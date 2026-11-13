
/* =====================================
   1. VERIFICAR SESIÓN
===================================== */

if (sessionStorage.getItem("sesionRiego") !== "activa") {
    window.location.replace("login.html");
}

/* =====================================
   2. VARIABLES DEL SISTEMA
===================================== */

let riegoActivo = false;
let nivelAgua = 78;
let consumo = 0;

let humedades = [45, 32, 60, 25, 52];
let temperaturas = [24.5, 26.0, 23.8, 29.1, 25.3];

const modoRiego = document.getElementById("modoRiego");
const botonRiego = document.getElementById("botonRiego");
const listaHistorial = document.getElementById("listaHistorial");

/* =====================================
   3. FECHA Y HORA
===================================== */

function actualizarFechaHora() {
    const fecha = document.getElementById("fechaHora");

    if (fecha) {
        fecha.textContent = new Date().toLocaleString("es-MX", {
            dateStyle: "medium",
            timeStyle: "medium"
        });
    }
}

actualizarFechaHora();
setInterval(actualizarFechaHora, 1000);

/* =====================================
   4. HISTORIAL
===================================== */

function registrarEvento(titulo, detalle) {
    if (!listaHistorial) return;

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

/* =====================================
   5. ACTUALIZAR HUMEDAD
===================================== */

function actualizarHumedad(numero, valor) {
    const lectura = document.getElementById("humedad" + numero);
    const barra = document.getElementById("barraHumedad" + numero);
    const estado = document.getElementById("estadoHumedad" + numero);

    if (!lectura || !barra || !estado) return;

    valor = Math.max(0, Math.min(100, Number(valor)));

    lectura.textContent = valor.toFixed(0) + "%";
    barra.style.width = valor + "%";

    let color;
    let texto;

    if (valor < 30) {
        color = "#ef5350";
        texto = "Suelo seco";
    } else if (valor < 40) {
        color = "#ffb74d";
        texto = "Humedad baja";
    } else if (valor <= 70) {
        color = "#66bb6a";
        texto = "Humedad adecuada";
    } else {
        color = "#42bde8";
        texto = "Exceso de humedad";
    }

    barra.style.background = color;
    estado.style.color = color;
    estado.textContent = texto;
}

/* =====================================
   6. ACTUALIZAR TEMPERATURA
===================================== */

function actualizarTemperatura(numero, valor) {
    const lectura = document.getElementById("temperatura" + numero);
    const barra = document.getElementById("barraTemperatura" + numero);
    const estado = document.getElementById("estadoTemperatura" + numero);

    if (!lectura || !barra || !estado) return;

    valor = Number(valor);

    lectura.textContent = valor.toFixed(1) + " °C";

    const porcentaje = Math.max(0, Math.min(100, valor / 50 * 100));
    barra.style.width = porcentaje + "%";

    let color;
    let texto;

    if (valor < 15) {
        color = "#42bde8";
        texto = "Temperatura fría";
    } else if (valor <= 28) {
        color = "#66bb6a";
        texto = "Temperatura normal";
    } else if (valor <= 35) {
        color = "#ff9f43";
        texto = "Temperatura alta";
    } else {
        color = "#ef5350";
        texto = "Temperatura muy alta";
    }

    barra.style.background = color;
    estado.style.color = color;
    estado.textContent = texto;
}

/* =====================================
   7. ACTUALIZAR LOS 10 SENSORES
===================================== */

function actualizarTodosLosSensores() {
    for (let i = 0; i < 5; i++) {
        actualizarHumedad(i + 1, humedades[i]);
        actualizarTemperatura(i + 1, temperaturas[i]);
    }
}

/* =====================================
   8. SIMULACIÓN DE SENSORES
===================================== */

function variarLectura(valor, variacion, minimo, maximo) {
    const cambio = (Math.random() * variacion * 2) - variacion;

    return Math.max(
        minimo,
        Math.min(maximo, valor + cambio)
    );
}

function simularSensores() {
    for (let i = 0; i < 5; i++) {

        if (riegoActivo) {
            humedades[i] = variarLectura(
                humedades[i],
                2,
                10,
                95
            );
        } else {
            humedades[i] = variarLectura(
                humedades[i],
                3,
                10,
                95
            );
        }

        temperaturas[i] = variarLectura(
            temperaturas[i],
            0.8,
            10,
            42
        );
    }

    actualizarTodosLosSensores();

    evaluarRiegoAutomatico();
}

/* =====================================
   9. DEPÓSITO Y CONSUMO
===================================== */

function actualizarDeposito() {
    const nivel = document.getElementById("nivelAgua");
    const agua = document.getElementById("aguaVisual");
    const porcentaje = document.getElementById("porcentajeDeposito");
    const barra = document.getElementById("barraAgua");
    const estado = document.getElementById("estadoAgua");
    const consumoTexto = document.getElementById("consumo");
    const barraConsumo = document.getElementById("barraConsumo");

    if (nivel) nivel.textContent = nivelAgua;
    if (agua) agua.style.height = nivelAgua + "%";
    if (porcentaje) porcentaje.textContent = nivelAgua + "%";
    if (barra) barra.style.width = nivelAgua + "%";

    let colorAgua;
    let textoAgua;

    if (nivelAgua < 20) {
        colorAgua = "#e45b52";
        textoAgua = "Nivel crítico";
    } else if (nivelAgua < 45) {
        colorAgua = "#ffb74d";
        textoAgua = "Nivel bajo";
    } else {
        colorAgua = "#52c9e8";
        textoAgua = "Nivel suficiente";
    }

    if (agua) {
        agua.style.background =
            "linear-gradient(180deg, " + colorAgua + ", #07547d)";
    }

    if (barra) barra.style.background = colorAgua;

    if (estado) {
        estado.textContent = textoAgua;
        estado.style.color = colorAgua;
    }

    if (consumoTexto) {
        consumoTexto.textContent = consumo.toFixed(1);
    }

    if (barraConsumo) {
        barraConsumo.style.width =
            Math.min(consumo / 20 * 100, 100) + "%";
    }
}

/* =====================================
   10. INTERFAZ GENERAL
===================================== */

function actualizarInterfaz() {
    const estadoSistema = document.getElementById("estadoSistema");
    const textoSistema = document.getElementById("textoSistema");
    const textoControl = document.getElementById("textoControl");
    const etiquetaRiego = document.getElementById("etiquetaRiego");
    const iconoGota = document.getElementById("iconoGota");
    const indicadorRiego = document.querySelector(".indicador-riego");
    const notaControl = document.getElementById("notaControl");

    if (estadoSistema) {
        estadoSistema.textContent =
            riegoActivo ? "Riego en funcionamiento" : "Riego detenido";
    }

    if (textoSistema) {
        textoSistema.textContent = riegoActivo
            ? "El sistema de demostración está regando."
            : "El sistema está listo para funcionar.";
    }

    if (textoControl) {
        textoControl.textContent =
            riegoActivo ? "Riego activado" : "Sistema detenido";
    }

    if (etiquetaRiego) {
        etiquetaRiego.textContent = riegoActivo ? "ACTIVO" : "INACTIVO";
    }

    if (iconoGota) {
        iconoGota.textContent = riegoActivo ? "💧" : "◌";
    }

    if (indicadorRiego) {
        indicadorRiego.classList.toggle("activo", riegoActivo);
    }

    if (botonRiego) {
        botonRiego.textContent =
            riegoActivo ? "Detener riego" : "Activar riego";

        botonRiego.disabled = modoRiego.value === "automatico";
    }

    if (notaControl) {
        notaControl.textContent =
            modoRiego.value === "automatico"
                ? "Modo automático: el riego se activa cuando la humedad promedio es inferior al 35% y se detiene al llegar al 60%."
                : "Modo manual: activa o detén el riego con el botón. Las lecturas son simuladas.";
    }

    actualizarDeposito();
}

/* =====================================
   11. ACTIVAR Y DETENER RIEGO
===================================== */

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

/* =====================================
   12. CONTROL MANUAL
===================================== */

botonRiego.addEventListener("click", function() {
    if (modoRiego.value !== "manual") return;

    cambiarRiego(
        !riegoActivo,
        "Acción realizada en modo manual."
    );
});

/* =====================================
   13. CAMBIAR MODO
===================================== */

modoRiego.addEventListener("change", function() {
    if (modoRiego.value === "automatico") {
        registrarEvento(
            "Modo automático",
            "El sistema evaluará las cinco zonas de humedad."
        );

        evaluarRiegoAutomatico();

    } else {
        cambiarRiego(false, "Cambio a modo manual.");

        registrarEvento(
            "Modo manual",
            "El usuario controla el riego."
        );
    }

    actualizarInterfaz();
});

/* =====================================
   14. LÓGICA AUTOMÁTICA
===================================== */

function evaluarRiegoAutomatico() {
    if (modoRiego.value !== "automatico") return;

    let sumaHumedad = 0;

    for (let i = 0; i < 5; i++) {
        sumaHumedad += humedades[i];
    }

    const humedadPromedio = sumaHumedad / 5;

    if (humedadPromedio < 35 && nivelAgua > 0) {
        cambiarRiego(
            true,
            "La humedad promedio de las zonas es inferior al 35%."
        );

    } else if (humedadPromedio >= 60 && riegoActivo) {
        cambiarRiego(
            false,
            "La humedad promedio alcanzó el 60%."
        );
    }

    if (nivelAgua <= 0 && riegoActivo) {
        cambiarRiego(
            false,
            "El depósito se quedó sin agua."
        );
    }
}

/* =====================================
   15. BOTÓN ACTUALIZAR LECTURAS
===================================== */

document.getElementById("actualizarSensores")
    .addEventListener("click", function() {

        simularSensores();

        registrarEvento(
            "Sensores actualizados",
            "Se generaron nuevas lecturas para las diez zonas de monitoreo."
        );

        actualizarInterfaz();
    });

/* =====================================
   16. LIMPIAR HISTORIAL
===================================== */

document.getElementById("limpiarHistorial")
    .addEventListener("click", function() {

        listaHistorial.replaceChildren();

        const vacio = document.createElement("p");
        vacio.className = "historial-vacio";
        vacio.textContent = "No hay eventos registrados.";

        listaHistorial.appendChild(vacio);
    });

/* =====================================
   17. CERRAR SESIÓN
===================================== */

document.getElementById("cerrarSesion")
    .addEventListener("click", function() {

        sessionStorage.removeItem("sesionRiego");
        window.location.replace("login.html");
    });

/* =====================================
   18. INICIAR PANEL
===================================== */

actualizarTodosLosSensores();
actualizarInterfaz();

registrarEvento(
    "Sistema iniciado",
    "Panel de demostración preparado con diez sensores simulados."
);

/* Simulación automática cada 3 segundos */
setInterval(function() {
    simularSensores();

    if (riegoActivo) {
        nivelAgua = Math.max(0, nivelAgua - 1);
        consumo += 0.2;
    }

    actualizarInterfaz();

}, 3000);
