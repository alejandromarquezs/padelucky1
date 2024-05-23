// Inicializar Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCjpLyfV-wo9uM6K14N0q9DzsabKIIX4gA",
    authDomain: "padelucky-e80e6.firebaseapp.com",
    projectId: "padelucky-e80e6",
    storageBucket: "padelucky-e80e6.appspot.com",
    messagingSenderId: "87499387761",
    appId: "1:87499387761:web:e446eb19d6505e924afcd0",
    measurementId: "G-HZRERWE8TS"
};

firebase.initializeApp(firebaseConfig);

// Inicializar variables globales
let selectedTickets = [];
const ticketPrice = 99;
const totalTickets = 149;

// Crear tabla de boletos
const table = document.getElementById('ticketTable');
for (let i = 0; i < 10; i++) {
    const row = table.insertRow();
    for (let j = 0; j < 10; j++) {
        const cell = row.insertCell();
        const ticketNumber = (i * 10 + j + 1).toString().padStart(3, '0');
        cell.textContent = ticketNumber;
        cell.addEventListener('click', () => selectTicket(cell, ticketNumber));
    }
}

function selectTicket(cell, ticketNumber) {
    if (cell.classList.contains('selected')) {
        cell.classList.remove('selected');
        selectedTickets = selectedTickets.filter(ticket => ticket !== ticketNumber);
    } else {
        cell.classList.add('selected');
        selectedTickets.push(ticketNumber);
    }
    updateSelectedTickets();
}

function updateSelectedTickets() {
    const list = document.getElementById('selectedTicketsList');
    list.innerHTML = '';
    selectedTickets.forEach(ticket => {
        const listItem = document.createElement('li');
        listItem.textContent = ticket;
        list.appendChild(listItem);
    });
    const totalPrice = selectedTickets.length * ticketPrice;
    document.getElementById('totalPrice').textContent = totalPrice;
    document.getElementById('reserveButton').disabled = selectedTickets.length === 0;
}

document.getElementById('randomTicketButton').addEventListener('click', () => {
    const quantity = parseInt(document.getElementById('ticketQuantity').value);
    if (isNaN(quantity) || quantity < 1 || quantity > totalTickets) {
        alert('Por favor, ingrese una cantidad válida de boletos.');
        return;
    }
    const availableTickets = Array.from(document.querySelectorAll('#ticketTable td:not(.selected)'));
    if (availableTickets.length < quantity) {
        alert('No hay suficientes boletos disponibles.');
        return;
    }
    for (let i = 0; i < quantity; i++) {
        const randomIndex = Math.floor(Math.random() * availableTickets.length);
        const randomCell = availableTickets.splice(randomIndex, 1)[0];
        const ticketNumber = randomCell.textContent;
        randomCell.classList.add('selected');
        selectedTickets.push(ticketNumber);
    }
    updateSelectedTickets();
});

document.getElementById('reserveButton').addEventListener('click', () => {
    openModal('customerForm');
});

document.getElementById('reservationForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const state = document.getElementById('state').value;
    const totalCost = selectedTickets.length * ticketPrice;
    const message = `Datos del Cliente:\nNombre: ${name}\nCelular: ${phone}\nEstado: ${state}\nBoletos: ${selectedTickets.join(', ')}\nTotal a pagar: $${totalCost}\nGracias por tu confianza, tienes 3 horas para apartar el boleto.`;
    const whatsappURL = `https://api.whatsapp.com/send/?phone=526647185248&text=${encodeURIComponent(message)}`;

    // Guardar en Firebase
    selectedTickets.forEach(ticket => {
        firebase.database().ref('tickets/' + ticket).set({
            name,
            phone,
            state,
            status: 'reserved'
        });
    });

    // Redireccionar a WhatsApp
    window.location.href = whatsappURL;
});

document.getElementById('verifyButton').addEventListener('click', () => {
    openModal('verifyForm');
});

document.getElementById('verifyTicketForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const ticketNumber = document.getElementById('verifyTicketNumber').value.padStart(3, '0');
    firebase.database().ref('tickets/' + ticketNumber).get().then(snapshot => {
        const result = document.getElementById('verifyResult');
        if (snapshot.exists()) {
            const data = snapshot.val();
            result.textContent = `Boleto ${ticketNumber} está reservado por:\nNombre: ${data.name}\nCelular: ${data.phone}\nEstado: ${data.state}`;
        } else {
            result.textContent = `Boleto ${ticketNumber} está disponible.`;
        }
    });
});

document.getElementById('accessButton').addEventListener('click', () => {
    openModal('accessForm');
});

document.getElementById('accessVerificationForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('accessPassword').value;
    if (password === '560$Iimams') {
        closeModal('accessForm');
        openModal('crmPanel');
    } else {
        alert('Contraseña incorrecta.');
    }
});

document.getElementById('reactivateButton').addEventListener('click', () => {
    const ticketNumber = document.getElementById('reactivateTicketNumber').value.padStart(3, '0');
    firebase.database().ref('tickets/' + ticketNumber).remove().then(() => {
        document.querySelector(`#ticketTable td:contains(${ticketNumber})`).classList.remove('selected');
        alert(`Boleto ${ticketNumber} ha sido reactivado y está disponible nuevamente.`);
    });
});

function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}
