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
            window.location.href = '../index.html'; 
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
    switch (data.action) {
        case 'lobbyUsers':
            updateLobbyUsers(data.users, data.playerId);
            break;
    }
};
function updateLobbyUsers(users, playerIds) {
    console.log(users);
    const currentUsername = sessionStorage.getItem('username');

    for (let i = 1; i <= 4; i++) {
        const playerDiv = document.getElementById(`player${i}`);
        const img = playerDiv.querySelector('img');
        const p = playerDiv.querySelector('.player-name');
        const readyButton = playerDiv.querySelector('.player-button');

        if (users[i - 1]) {
            img.src = `../MEDIA/AVATARS/avatar${i}.webp`;
            p.textContent = users[i - 1];
            // Assign corresponding player ID from the array to each player div
            playerDiv.setAttribute('data-playerid', playerIds[i - 1]);

            if (users[i - 1] === currentUsername) {
                readyButton.style.display = 'block';
            } else {
                readyButton.style.display = 'none';
            }
        } else {
            img.src = '../MEDIA/AVATARS/default.webp';
            p.textContent = '???';
            playerDiv.setAttribute('data-playerid', "NULL");
            readyButton.style.display = 'none';
        }
    }
}



