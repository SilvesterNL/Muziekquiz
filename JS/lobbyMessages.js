let socket = new WebSocket('ws://localhost:8080');

let activeLobbies = [];


function checkWebSocketConnection() {
    if (socket.readyState === WebSocket.OPEN) {
        console.log("WebSocket is open");
        starta();
    } else {
        console.log("WebSocket is not open, attempting to reconnect...");
        socket = new WebSocket('ws://localhost:8080');
        setTimeout(checkWebSocketConnection, 500);
    }
}




function starta() {
    if (socket.readyState === WebSocket.OPEN) {
        const lobbyCode = sessionStorage.getItem('lobbyCode');
        if (!lobbyCode) {
            window.location.href = '../index.html'; // Terug naar hoofdpagina als er geen lobbyCode is
        } else {
            joinLobby(lobbyCode);
            displayLobbyInfo(lobbyCode);

        }
    } else {
        checkWebSocketConnection();
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
            if (data.lobbyCode === sessionStorage.getItem('lobbyCode')) {
                const userItem = document.createElement('li');
                userItem.textContent = data.username;
                userList.appendChild(userItem);
            }
            break;
        case 'lobbyUsers':
            updateLobbyUsers(data.users);
            console.log("recieved");
            break;
        // Voeg aanvullende cases toe voor andere acties, zoals 'userLeft' om een gebruiker te verwijderen uit de lijst
    }
};
function updateLobbyUsers(users) {
    const currentUsername = sessionStorage.getItem('username'); // Haal de huidige gebruikersnaam op

    for (let i = 1; i <= 4; i++) {
        const playerDiv = document.getElementById(`player${i}`);
        const img = playerDiv.querySelector('img');
        const p = playerDiv.querySelector('.player-name');
        const readyButton = playerDiv.querySelector('.player-button'); // Selecteer de "Klaar" knop

        if (users[i - 1]) {
            img.src = `../MEDIA/AVATARS/avatar${i}.webp`; // Dit kiest dynamisch de avatar
            p.textContent = users[i - 1];

            // Toon de "Klaar" knop alleen als de huidige gebruiker de speler is
            if (users[i - 1] === currentUsername) {
                readyButton.style.display = 'block'; // Of een andere stijl om de knop zichtbaar te maken
            } else {
                readyButton.style.display = 'none'; // Verberg de knop voor andere spelers
            }

        } else {
            img.src = '../MEDIA/AVATARS/default.webp';
            p.textContent = '???';
            readyButton.style.display = 'none'; // Verberg de knop als er geen gebruiker is
        }
    }
}



