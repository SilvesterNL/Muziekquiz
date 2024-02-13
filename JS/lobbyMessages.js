const socket = new WebSocket('ws://localhost:8080');

let activeLobbies = [];


function starta() {
    if (socket.readyState === WebSocket.OPEN) {
        const lobbyCode = sessionStorage.getItem('lobbyCode');
        if (!lobbyCode) {
            window.location.href = '../index.html'; // Terug naar hoofdpagina als er geen lobbyCode is
        } else {
            displayLobbyInfo(lobbyCode);
            joinLobby(lobbyCode);
        }
    } else {
        const socket = new WebSocket('ws://localhost:8080');

        function starta() {
            const lobbyCode = sessionStorage.getItem('lobbyCode');
            if (!lobbyCode) {
                window.location.href = 'index.html'; // Terug naar hoofdpagina als er geen lobbyCode is
            } else {
                displayLobbyInfo(lobbyCode);
                joinLobby(lobbyCode);
            }
        }

        function connectWithRetry() {
            if (socket.readyState === WebSocket.OPEN) {
                starta();
            } else {
                setTimeout(connectWithRetry, 1000); // Retry connection after 1 second
            }
        }

        connectWithRetry();

    }
}
function joinLobby(lobbyCode) {
    const username = sessionStorage.getItem('username');
    socket.send(JSON.stringify({ action: 'joinLobby', lobbyCode, username }));
}

function displayLobbyInfo(lobbyCode) {
    document.getElementById('lobbyInfo').innerHTML = `${lobbyCode}`;
}

socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    const userList = document.getElementById('userList');
    switch (data.action) {
        case 'lobbyJoined':
            // Wanneer iemand de lobby joint, update de gebruikerslijst
            if (data.lobbyCode === sessionStorage.getItem('lobbyCode')) {
                data.usernames.forEach(username => {
                    const userItem = document.createElement('li');
                    userItem.textContent = username;
                    userList.appendChild(userItem);
                });
            }
            break;
        case 'userJoined':
            // Voeg nieuwe gebruiker toe aan de lijst
            if (data.lobbyCode === sessionStorage.getItem('lobbyCode')) {
                const userItem = document.createElement('li');
                userItem.textContent = data.username;
                userList.appendChild(userItem);
            }
            break;
        case 'lobbyUsers':
            updateLobbyUsers(data.users);
            break;
        // Voeg aanvullende cases toe voor andere acties, zoals 'userLeft' om een gebruiker te verwijderen uit de lijst
    }
};

function updateLobbyUsers(users) {
    // Update elke speler div met de gebruikersgegevens of met standaardwaarden
    for (let i = 1; i <= 4; i++) {
        const playerDiv = document.getElementById(`player${i}`);
        const img = playerDiv.querySelector('img');
        const p = playerDiv.querySelector('.player-name');

        if (users[i - 1]) {
            // Gebruik `i` om de avatar dynamisch te kiezen op basis van de spelerindex
            img.src = `../MEDIA/AVATARS/avatar${i}.png`; // Dit kiest avatar1.png voor de eerste speler, avatar2.png voor de tweede, etc.
            p.textContent = users[i - 1]; // Dit stelt de speler naam in
        } else {
            img.src = '../MEDIA/AVATARS/default.png'; // Terug naar de standaard avatar als er geen gebruiker is
            p.textContent = '?';
        }
    }
}




socket.onerror = function (error) {
    console.error('WebSocket error:', error.message);
};
