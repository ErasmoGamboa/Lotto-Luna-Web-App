// Base de datos de los 22 Arcanos Mayores
const arcanos = [
    { id: 0, nombre: "0 - El Loco", img: "imagenes/El Loco.jpg" },
    { id: 1, nombre: "I - El Mago", img: "imagenes/El Mago.jpg" },
    { id: 2, nombre: "II -La Suma Sacerdotisa", img: "https://placehold.co/150x250/2c003e/d4af37?text=La+Sacerdotisa" },
    { id: 3, nombre: "III - La Emperatriz", img: "https://placehold.co/150x250/2c003e/d4af37?text=La+Emperatriz" },
    { id: 4, nombre: "IV - El Emperador", img: "https://placehold.co/150x250/2c003e/d4af37?text=El+Emperador" },
    { id: 5, nombre: "V - El Hierofante", img: "https://placehold.co/150x250/2c003e/d4af37?text=El+Hierofante" },
    { id: 6, nombre: "VI - Los Enamorados", img: "imagenes/Los Enamorados.jpg" },
    { id: 7, nombre: "VII - El Carro", img: "https://placehold.co/150x250/2c003e/d4af37?text=El+Carro" },
    { id: 8, nombre: "VIII - La Fuerza", img: "imagenes/La Fuerza.jpg" },
    { id: 9, nombre: "IX - El Ermitaño", img: "imagenes/El Ermitaño.jpg" },
    { id: 10, nombre: "X - La Rueda de la Fortuna", img: "https://placehold.co/150x250/2c003e/d4af37?text=La+Rueda" },
    { id: 11, nombre: "XI - La Justicia", img: "https://placehold.co/150x250/2c003e/d4af37?text=La+Justicia" },
    { id: 12, nombre: "XII - El Colgado", img: "https://placehold.co/150x250/2c003e/d4af37?text=La+Colgado" },
    { id: 13, nombre: "XIII - La Muerte", img: "https://placehold.co/150x250/2c003e/d4af37?text=La+Muerte" },
    { id: 14, nombre: "XIV - La Templanza", img: "https://placehold.co/150x250/2c003e/d4af37?text=La+Templanza" },
    { id: 15, nombre: "XV - El Diablo", img: "https://placehold.co/150x250/2c003e/d4af37?text=La+Diablo" },
    { id: 16, nombre: "XVI - La Torre", img: "imagenes/La Torre.jpg" },
    { id: 17, nombre: "XVII - La Estrella", img: "imagenes/La Estrella.jpg" },
    { id: 18, nombre: "XVIII - La Luna", img: "imagenes/La Luna.jpg" },
    { id: 19, nombre: "XIX - El Sol", img: "imagenes/El Sol.jpg" },
    { id: 20, nombre: "XX - El Juicio", img: "https://placehold.co/150x250/2c003e/d4af37?text=El+Juicio" },
    { id: 21, nombre: "XXI - El Mundo", img: "imagenes/El Mundo.jpg" }
];

function formatDate(dateString) {
    if (!dateString) return "";
    const parts = dateString.split("-");
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
}

function getVETTime() {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const vetTime = new Date(utcTime - (4 * 3600000));
    return vetTime;
}

function getCurrentCycleId() {
    const vet = getVETTime();
    let cycleDate = new Date(vet);
    if (vet.getHours() < 19) {
        cycleDate.setDate(cycleDate.getDate() - 1);
    }
    return `${cycleDate.getFullYear()}-${String(cycleDate.getMonth()+1).padStart(2, '0')}-${String(cycleDate.getDate()).padStart(2, '0')}`;
}

const wheel = document.getElementById('wheel');
const resultDisplay = document.getElementById('resultDisplay');
const historyGrid = document.getElementById('historyGrid');
const timerDisplay = document.getElementById('timer');

let currentRotation = 0;
let isSpinning = false;

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
            body: `Tu carta de hoy es ${arcanoName}. Descubre tu mensaje.`,
            icon: "logo.png" // Utiliza tu logo como icono
        });
    }
}

// --- GESTIÓN DE COMPARTIR REDES SOCIALES ---
const shareBtn = document.getElementById('shareBtn');

shareBtn.addEventListener('click', async () => {
    const arcanoActual = document.getElementById('arcanaName').innerText;
    const shareData = {
        title: 'Mi Arcano de Hoy - Lotto Luna',
        text: `✨ ¡El Oráculo me ha revelado mi destino! Mi arcano de hoy es: ${arcanoActual}. Descubre el tuyo en Lotto Luna.`,
        url: window.location.href // Comparte el enlace de tu web
    };

    try {
        if (navigator.share) {
            // Abre el menú nativo del celular (WhatsApp, Instagram, etc)
            await navigator.share(shareData);
        } else {
            // Plan B para computadoras: Copia al portapapeles
            await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
            alert("¡Texto copiado! Pégalo en Facebook, WhatsApp o donde quieras.");
        }
    } catch (err) {
        console.log("Error al compartir: ", err);
    }
});


function buildWheel() {
    const numSlices = 22;
    const sliceAngle = 360 / numSlices;
    const offsetAngle = sliceAngle / 2; 
    let gradientStr = `conic-gradient(from -${offsetAngle}deg, `;
    
    for (let i = 0; i < numSlices; i++) {
        const color = i % 2 === 0 ? '#3a0052' : '#4b0082';
        const start = i * sliceAngle;
        const end = (i + 1) * sliceAngle;
        gradientStr += `${color} ${start}deg ${end}deg${i === numSlices - 1 ? '' : ', '}`;
    }
    gradientStr += ')';
    wheel.style.background = gradientStr;

    arcanos.forEach((arcano, i) => {
        const slice = document.createElement('div');
        slice.classList.add('slice');
        slice.style.transform = `rotate(${i * sliceAngle}deg)`;
        
        let wheelName = arcano.nombre;
        wheelName = wheelName.replace('La Suma Sacerdotisa', 'Sacerdotisa');
        wheelName = wheelName.replace('La Rueda de la Fortuna', 'Rueda de la Fortuna');
        if (wheelName.length > 18) {
            wheelName = wheelName.substring(0, 16) + '...';
        }
        
        slice.innerText = wheelName;
        wheel.appendChild(slice);
    });
}

function updateTimer() {
    const vet = getVETTime();
    let next7PM = new Date(vet);
    next7PM.setHours(19, 0, 0, 0);

    if (vet.getHours() >= 19) {
        next7PM.setDate(next7PM.getDate() + 1);
    }

    const diff = next7PM - vet;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (!isSpinning) {
        timerDisplay.innerText = `Próximo giro en: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    checkTimeAndSpin();
}

function checkTimeAndSpin() {
    const cycleId = getCurrentCycleId();
    const history = JSON.parse(localStorage.getItem('tarotHistory')) || {};

    if (history[cycleId] !== undefined) return;

    const vet = getVETTime();
    if (vet.getHours() >= 19) {
        if (!isSpinning) {
            autoSpinWheel();
        }
    }
}

function autoSpinWheel() {
    isSpinning = true;
    const cycleId = getCurrentCycleId();
    const history = JSON.parse(localStorage.getItem('tarotHistory')) || {};

    timerDisplay.innerText = "¡Los astros se están alineando!...";
    resultDisplay.style.display = 'none';

    const winnerIndex = Math.floor(Math.random() * 22);
    const sliceAngle = 360 / 22;
    const extraSpins = 360 * 6; 
    const offset = 270; 
    
    const targetRotation = extraSpins + offset - (winnerIndex * sliceAngle);
    
    currentRotation += targetRotation;
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
        history[cycleId] = winnerIndex;
        localStorage.setItem('tarotHistory', JSON.stringify(history));
        
        showResult(arcanos[winnerIndex]);
        renderHistory();
        
        // Lanzamos la notificación Push cuando se revela el ganador
        triggerPushNotification(arcanos[winnerIndex].nombre);
        
        isSpinning = false;
        updateTimer();
    }, 5000);
}

function showResult(arcano) {
    document.getElementById('arcanaName').innerText = arcano.nombre;
    document.getElementById('arcanaImg').src = arcano.img;
    resultDisplay.style.display = 'block';
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('tarotHistory')) || {};
    historyGrid.innerHTML = '';

    const dates = Object.keys(history).sort((a, b) => b.localeCompare(a));
    const last7Dates = dates.slice(0, 7);

    if (last7Dates.length === 0) {
        historyGrid.innerHTML = '<p style="grid-column: 1/-1; color: #888;">No hay resultados anteriores aún.</p>';
        return;
    }

    last7Dates.forEach(date => {
        const arcano = arcanos[history[date]];
        const formattedDate = formatDate(date);
        const cardHtml = `
            <div class="history-card">
                <div style="font-size: 0.9rem; font-weight: bold; margin-bottom: 5px;">${arcano.nombre}</div>
                <img src="${arcano.img}" alt="${arcano.nombre}">
                <div class="date">${formattedDate}</div>
            </div>
        `;
        historyGrid.innerHTML += cardHtml;
    });
}

// --- LÓGICA DE BÚSQUEDA ---
const searchBtn = document.getElementById('searchBtn');
const searchDateInput = document.getElementById('searchDate');
const searchResult = document.getElementById('searchResult');

searchBtn.addEventListener('click', () => {
    const selectedDate = searchDateInput.value; 
    
    if (!selectedDate) {
        searchResult.innerHTML = '<span style="color: #ffaa00;">Por favor, selecciona una fecha en el calendario.</span>';
        return;
    }

    const history = JSON.parse(localStorage.getItem('tarotHistory')) || {};
    const formattedDisplayDate = formatDate(selectedDate);
    
    if (history[selectedDate] !== undefined) {
        const arcano = arcanos[history[selectedDate]];
        searchResult.innerHTML = `
            <p style="margin-top:0;">El arcano del ciclo <strong>${formattedDisplayDate}</strong> fue:</p>
            <div class="history-card" style="max-width: 120px; margin: 0 auto; background: rgba(44, 0, 62, 0.8);">
                <div style="font-size: 0.9rem; font-weight: bold; margin-bottom: 5px;">${arcano.nombre}</div>
                <img src="${arcano.img}" alt="${arcano.nombre}">
            </div>
        `;
    } else {
        searchResult.innerHTML = `<span style="color: #aaa;">No hubo resultado registrado para el ciclo ${formattedDisplayDate}.</span>`;
    }
});

function init() {
    buildWheel();
    initNotifications(); // Llama a la inicialización de notificaciones

    const cycleId = getCurrentCycleId();
    const history = JSON.parse(localStorage.getItem('tarotHistory')) || {};

    renderHistory();

    if (history[cycleId] !== undefined) {
        showResult(arcanos[history[cycleId]]);
        
        const sliceAngle = 360 / 22;
        const offset = 270;
        wheel.style.transition = 'none'; 
        wheel.style.transform = `rotate(${offset - (history[cycleId] * sliceAngle)}deg)`;
    }
    
    setInterval(updateTimer, 1000);
    updateTimer();
}

init();