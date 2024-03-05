let socket = new WebSocket('ws://10.10.60.50:8080');

let activeLobbies = [];


function checkWebSocketConnection() {
    if (socket.readyState === WebSocket.OPEN) {
        return
    } else {
        socket = new WebSocket('ws://10.10.60.50:8080');
        setTimeout(checkWebSocketConnection, 500);
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
        html: '<input maxlength="10" type="text" id="swal-input1" class="swal2-input" placeholder="Jouw naam">',
        showCancelButton: true,
        confirmButtonText: 'OK',
        focusConfirm: false,
        didOpen: () => {
            document.getElementById('swal-input1').focus(); // Focus op het invoerveld
        },
        preConfirm: () => {
            const inputElement = document.getElementById('swal-input1');
            const username = inputElement.value.trim(); // Trim to remove any whitespace
            if (!username) {
                Swal.showValidationMessage(`Naam mag niet leeg zijn`);
            } else if (username.length > 10) { // Enforce the character limit
                Swal.showValidationMessage(`Naam mag niet langer zijn dan 10 karakters`);
            } else {
                return username; // Retourneer de waarde voor gebruik in then((result))
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            startLobby(result.value); // Gebruik de ingevoerde waarde na bevestiging
        }
    });
}

function startLobby(username) {
    const lobbyCode = generateRandomCode();
    localStorage.setItem('username', username);
    sessionStorage.setItem('lobbyCode', lobbyCode);
    socket.send(JSON.stringify({ action: 'joinLobby', username, lobbyCode: null }));
    window.location.href = 'lobby.html';
}

// Reconnect WebSocket if disconnected
function setupWebSocketReconnection() {
    socket.onclose = function () {
        console.log("WebSocket is closed. Attempting to reconnect...");
        socket = new WebSocket('ws://localhost:8080');
        setupWebSocketHandlers();
    };
}


function setupWebSocketHandlers() {
    socket.send(JSON.stringify({ action: 'requestActiveLobbies' }));
};


setTimeout(() => {
    setupWebSocketHandlers();
}, 2500);



socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    if (data.action === 'activelobbies') {
        const lobbyMessagesDiv = document.getElementById('lobbyMessages');
        lobbyMessagesDiv.innerHTML = '';
        Object.keys(data.lobbies).forEach(key => {
            const lobby = data.lobbies[key];
            const playerCount = lobby.length;
            lobbyMessagesDiv.innerHTML += `<p>Lobby Code: ${key} | Aantal Spelers: ${playerCount}/4</p> <button class="cssbuttons-io-button" onclick="joinlobby('${key}');">Join Lobby
            <div class="icon">
              <svg
                height="24"
                width="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                  fill="currentColor"
                ></path>
              </svg>
            </div></button> <hr class="hr-lobby">`;
        });
    } else if (data.action === 'lobbygemaakt') {
        setupWebSocketHandlers();
    }
};

function openUsernameSeljoin(lobbycode) {
    Swal.fire({
        title: 'Kies een naam',
        html: '<input maxlength="10" type="text" id="swal-input1" class="swal2-input" placeholder="Jouw naam">',
        showCancelButton: true,
        confirmButtonText: 'OK',
        focusConfirm: false,
        didOpen: () => {
            document.getElementById('swal-input1').focus(); // Focus op het invoerveld
        },
        preConfirm: () => {
            const inputElement = document.getElementById('swal-input1');
            if (!inputElement.value) {
                Swal.showValidationMessage(`Naam mag niet leeg zijn`);
            } else {
                return inputElement.value; // Retourneer de waarde voor gebruik in then((result))
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            getintolobby(result.value, lobbycode); // Gebruik de ingevoerde waarde na bevestiging
        }
    });
}


function joinlobby(lobbycode) {
    openUsernameSeljoin(lobbycode);
}


function getintolobby(username, lobbycode) {
    localStorage.setItem('username', username);
    sessionStorage.setItem('lobbyCode', lobbycode);
    socket.send(JSON.stringify({ action: 'joinLobby', username, lobbyCode: null }));
    window.location.href = 'lobby.html';
}

