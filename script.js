// Base de datos de los 22 Arcanos Mayores
const arcanos = [
    { id: 0, nombre: "0. El Loco", img: "imagenes/El Loco.jpg" },
    { id: 1, nombre: "I. El Mago", img: "imagenes/El Mago.jpg" },
    { id: 2, nombre: "II. La Sacerdotisa", img: "imagenes/La Sacerdotisa.jpg" },
    { id: 3, nombre: "III. La Emperatriz", img: "imagenes/La Emperatriz.jpg" },
    { id: 4, nombre: "IV. El Emperador", img: "imagenes/El Emperador.jpg" },
    { id: 5, nombre: "V. El Sumo Sacerdote", img: "imagenes/El Sumo Sacerdote.jpg" },
    { id: 6, nombre: "VI. Los Enamorados", img: "imagenes/Los Enamorados.jpg" },
    { id: 7, nombre: "VII. El Carro", img: "imagenes/El Carro.jpg" },
    { id: 8, nombre: "VIII. La Justicia", img: "imagenes/La Justicia.jpg" },
    { id: 9, nombre: "IX. El Ermitaño", img: "imagenes/El Ermitaño.jpg" },
    { id: 10, nombre: "X. La Rueda de la Fortuna", img: "imagenes/La Rueda de la Fortuna.jpg" },
    { id: 11, nombre: "XI. La Fuerza", img: "imagenes/La Fuerza.jpg" },
    { id: 12, nombre: "XII. El Colgado", img: "imagenes/La Colgado.jpg" },
    { id: 13, nombre: "XIII. La Muerte", img: "imagenes/La Muerte.jpg" },
    { id: 14, nombre: "XIV. La Templanza", img: "imagenes/La Templanza.jpg" },
    { id: 15, nombre: "XV. El Diablo", img: "imagenes/El Diablo.jpg" },
    { id: 16, nombre: "XVI. La Torre", img: "imagenes/La Torre.jpg" },
    { id: 17, nombre: "XVII. La Estrella", img: "imagenes/La Estrella.jpg" },
    { id: 18, nombre: "XVIII. La Luna", img: "imagenes/La Luna.jpg" },
    { id: 19, nombre: "XIX. El Sol", img: "imagenes/El Sol.jpg" },
    { id: 20, nombre: "XX. El Juicio", img: "imagenes/El Juicio.jpg" },
    { id: 21, nombre: "XXI. El Mundo", img: "imagenes/El Mundo.jpg" }
];

function getVETTime() {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Caracas' }));
}

function getIdHoyVenezuela() {
    const vet = getVETTime();
    const dia = String(vet.getDate()).padStart(2, '0');
    const mes = String(vet.getMonth() + 1).padStart(2, '0');
    const anio = vet.getFullYear();
    return `${dia}-${mes}-${anio}`;
}

const wheel = document.getElementById('wheel');
const resultDisplay = document.getElementById('resultDisplay');
const historyGrid = document.getElementById('historyGrid');
const timerDisplay = document.getElementById('timer');

let currentRotation = 0;
let isSpinning = false;
let resultadoHoyMostrado = false;
let intervaloTimer = null;

// --- GESTIÓN DE NOTIFICACIONES ---
const notifyBtn = document.getElementById('notifyBtn');

function initNotifications() {
    if ("Notification" in window) {
        if (Notification.permission === "default") {
            notifyBtn.style.display = "inline-block";
        }
        
        notifyBtn.addEventListener("click", () => {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    notifyBtn.style.display = "none";
                    new Notification("✨ Conectado", {
                        body: "Te avisaremos cuando el Oráculo revele un nuevo arcano.",
                        icon: "logo.png"
                    });
                }
            });
        });
    }
}

function triggerPushNotification(arcanoName) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("✨ El Oráculo ha hablado ✨", {
            body: `El Arcano Ganador de hoy es ${arcanoName}. ¡Revisa tu ticket!`,
            icon: "logo.png"
        });
    }
}

// --- GESTIÓN DE COMPARTIR ---
const shareBtn = document.getElementById('shareBtn');
if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
        const arcanoActual = document.getElementById('arcanaName').innerText;
        const shareData = {
            title: 'Arcano Ganador - Lotto Luna',
            text: `✨ El Arcano Ganador de hoy en Lotto Luna es: ${arcanoActual}. Descubre tu suerte en:`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
                alert("¡Texto copiado al portapapeles!");
            }
        } catch (err) {
            console.log("Error al compartir: ", err);
        }
    });
}

function buildWheel() {
    const numSlices = 22;
    const sliceAngle = 360 / numSlices;

    wheel.style.background = 'none';
    wheel.style.backgroundImage = 'url("imagenes/Ruleta Arcanos.png")';
    wheel.style.backgroundSize = 'cover';
    wheel.style.backgroundPosition = 'center';
    wheel.style.backgroundRepeat = 'no-repeat';

    arcanos.forEach((arcano, i) => {
        const slice = document.createElement('div');
        slice.classList.add('slice');
        slice.style.transform = `rotate(${i * sliceAngle}deg)`;
        slice.style.display = 'none';
        wheel.appendChild(slice);
    });
}

// --- TEMPORIZADOR DE CONTEO REGRESIVO ---
function iniciarTemporizadorConcurrente() {
    if (intervaloTimer) clearInterval(intervaloTimer);

    const ejecutarConteo = () => {
        if (resultadoHoyMostrado) return;

        const vet = getVETTime();
        let next7PM = new Date(vet);
        next7PM.setHours(19, 0, 0, 0);

        const diff = next7PM - vet;

        if (diff <= 0) {
            timerDisplay.innerHTML = "✨ ¡El velo se está descorriendo! Aguardando la revelación oficial... ✨";
        } else {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            timerDisplay.innerHTML = `La carta del arcano ganador del día de hoy se revelará en:<br><strong style="font-size:1.15rem; color:#fff; display:block; margin-top:5px;">${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s</strong>`;
        }
    };

    ejecutarConteo();
    intervaloTimer = setInterval(ejecutarConteo, 1000);
}

// --- SINCRONIZACIÓN Y ESCUCHA EN TIEMPO REAL CON FIRESTORE ---
function inicializarSistemaFirebase() {
    const docIdHoy = getIdHoyVenezuela();

    // 1. Escuchar el resultado del día de hoy en tiempo real
    window.fbDb.onSnapshot(window.fbDb.doc(window.db, "resultados_diarios", docIdHoy), (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            const indiceGanador = Number(data.indice);
            
            if (!resultadoHoyMostrado && !isSpinning) {
                girarHaciaWinnerIndex(indiceGanador, arcanos[indiceGanador]);
            }
        } else {
            resultDisplay.style.display = 'none';
        }
    });

    // 2. Escuchar toda la colección para actualizar el historial de los últimos 7 días automáticamente en vivo
    window.fbDb.onSnapshot(window.fbDb.collection(window.db, "resultados_diarios"), (snapshot) => {
        let resultados = [];

        snapshot.forEach(d => {
            const data = d.data();
            resultados.push({ id: d.id, ...data });
        });

        // Ordenar del más reciente al más antiguo basándonos en el ID (DD-MM-YYYY)
        resultados.sort((a, b) => {
            const partesA = a.id.split('-');
            const partesB = b.id.split('-');
            const fechaA = new Date(`${partesA[2]}-${partesA[1]}-${partesA[0]}`);
            const fechaB = new Date(`${partesB[2]}-${partesB[1]}-${partesB[0]}`);
            return fechaB - fechaA;
        });

        const ultimos7 = resultados.slice(0, 7);
        historyGrid.innerHTML = '';

        if (ultimos7.length === 0) {
            historyGrid.innerHTML = '<p style="grid-column: 1/-1; color: #888;">No hay resultados registrados todavía.</p>';
            return;
        }

        ultimos7.forEach(res => {
            const idx = Number(res.indice);
            const arc = arcanos[idx] || { nombre: res.nombre, img: 'logo.png' };
            const cardHtml = `
                <div class="history-card">
                    <div style="font-size: 0.9rem; font-weight: bold; margin-bottom: 5px;">${res.nombre}</div>
                    <img src="${arc.img}" alt="${res.nombre}">
                    <div class="date">${res.fecha}</div>
                </div>
            `;
            historyGrid.innerHTML += cardHtml;
        });
    });
}

function girarHaciaWinnerIndex(winnerIndex, arcanoObjeto) {
    isSpinning = true;
    resultadoHoyMostrado = true;
    if (intervaloTimer) clearInterval(intervaloTimer);

    timerDisplay.innerHTML = "✨ ¡El Oráculo está revelando el Arcano Ganador de hoy! ✨";
    resultDisplay.style.display = 'none';

    const sliceAngle = 360 / 22;
    const extraSpins = 360 * 6; 
    const offset = 270; 
    
    const targetRotation = extraSpins + offset - (winnerIndex * sliceAngle);
    currentRotation += targetRotation;
    
    wheel.style.transition = 'transform 5.5s cubic-bezier(0.15, 0.85, 0.1, 1)';
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
        showResult(arcanoObjeto);
        triggerPushNotification(arcanoObjeto.nombre);
        isSpinning = false;
        timerDisplay.innerHTML = "🌕 ¡Resultado Oficial Revelado! 🌕";
    }, 5500);
}

function showResult(arcano) {
    document.getElementById('arcanaName').innerText = arcano.nombre;
    document.getElementById('arcanaImg').src = arcano.img;
    resultDisplay.style.display = 'block';
}

// --- BUSCADOR POR CALENDARIO ---
const searchBtn = document.getElementById('searchBtn');
const searchDateInput = document.getElementById('searchDate');
const searchResult = document.getElementById('searchResult');

if (searchBtn) {
    searchBtn.addEventListener('click', async () => {
        const selectedDate = searchDateInput.value; // Formato YYYY-MM-DD
        
        if (!selectedDate) {
            searchResult.innerHTML = '<span style="color: #ffaa00;">Por favor, selecciona una fecha en el calendario.</span>';
            return;
        }

        const partes = selectedDate.split('-');
        const docId = `${partes[2]}-${partes[1]}-${partes[0]}`; // Convertir a DD-MM-YYYY
        const fechaMostrar = `${partes[2]}/${partes[1]}/${partes[0]}`;

        try {
            searchResult.innerHTML = '<span style="color: #aaa;">Consultando oráculo...</span>';
            const docSnap = await window.fbDb.getDoc(window.fbDb.doc(window.db, "resultados_diarios", docId));

            if (docSnap.exists()) {
                const res = docSnap.data();
                const arc = arcanos[Number(res.indice)] || { nombre: res.nombre, img: 'logo.png' };

                searchResult.innerHTML = `
                    <p style="margin-top:0;">El arcano ganador del <strong>${fechaMostrar}</strong> fue:</p>
                    <div class="history-card" style="max-width: 130px; margin: 0 auto; background: rgba(44, 0, 62, 0.8);">
                        <div style="font-size: 0.9rem; font-weight: bold; margin-bottom: 5px;">${res.nombre}</div>
                        <img src="${arc.img}" alt="${res.nombre}">
                    </div>
                `;
            } else {
                searchResult.innerHTML = `<span style="color: #aaa;">No hay resultado registrado para la fecha ${fechaMostrar}.</span>`;
            }
        } catch (e) {
            searchResult.innerHTML = '<span style="color: #e74c3c;">Error al consultar la base de datos.</span>';
        }
    });
}

function init() {
    buildWheel();
    initNotifications();
    iniciarTemporizadorConcurrente(); // Arranca el temporizador de inmediato
    
    // Esperar a que el módulo de Firebase inyectado en el HTML esté listo
    const checkBD = setInterval(() => {
        if (window.fbDb) {
            clearInterval(checkBD);
            inicializarSistemaFirebase();
        }
    }, 100);
}

document.addEventListener('DOMContentLoaded', init);