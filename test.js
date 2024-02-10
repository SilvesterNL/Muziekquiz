let socket = new WebSocket('ws://localhost:8080');

function checkWebSocketConnection() {
    if (socket.readyState === WebSocket.OPEN) {
        console.log("WebSocket is open");
    } else {
        console.log("WebSocket is not open, attempting to reconnect...");
        // Close the previous socket connection before creating a new one
        socket.close();
        // Reinitialize the WebSocket connection
        socket = new WebSocket('ws://localhost:8080');
        checkWebSocketConnection();
    }
}


// Generate a random code
function generateRandomCode() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Open the username selection dialog
document.getElementById('joinLobbyButton').addEventListener('click', () => {
    openUsernameSel();
});

function openUsernameSel() {
    Swal.fire({
        title: 'Kies een naam',
        html: `<input type="text" id="swal-input1" class="swal2-input" placeholder="Jouw naam">`,
        preConfirm: () => {
            const inputElement = document.getElementById('swal-input1');
            if (inputElement.value === '') {
                Swal.showValidationMessage(`Naam mag niet leeg zijn`);
            } else {
                startLobby(inputElement.value);
            }
        }
    });
}

function startLobby(username) {
    const lobbyCode = generateRandomCode();
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('lobbyCode', lobbyCode);
    socket.send(JSON.stringify({ action: 'joinLobby', username, lobbyCode: null }));
    window.location.href = 'PHP/lobby.html';
}

// Reconnect WebSocket if disconnected
function setupWebSocketReconnection() {
    socket.onclose = function () {
        console.log("WebSocket is closed. Attempting to reconnect...");
        socket = new WebSocket('ws://localhost:8080');
        setupWebSocketHandlers();
    };
}

// Set up WebSocket event handlers
function setupWebSocketHandlers() {
    socket.onopen = function () {
        setTimeout(function () {
            socket.send(JSON.stringify({ action: 'requestActiveLobbies' }));
            console.log("Verzoek verzonden na timeout.");
        }, 1000); // Vertraging in milliseconden
    };
    // Aanname: setupWebSocketReconnection wordt op een andere manier geïmplementeerd
    setupWebSocketReconnection();
}


setupWebSocketHandlers();


socket.onmessage = function (event) {
    console.log("WebSocket message received");
    const data = JSON.parse(event.data);
    if (data.action === 'lobbymaak') {
        const lobbyMessagesDiv = document.getElementById('lobbyMessages');
        lobbyMessagesDiv.innerHTML = '';
        data.lobbies.forEach(lobby => {
            lobbyMessagesDiv.innerHTML += `<p>Actieve lobby: ${lobby.lobbyCode} - Spelers: ${lobby.playerCount}</p>`;
            console.log(lobby);
        });
    } else {
        console.log("Unhandled message action:", data.action);
    }
};