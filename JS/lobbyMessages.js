let socket = new WebSocket('ws://localhost:8080');

let activeLobbies = [];




function checkWebSocketConnection() {
    if (socket.readyState === WebSocket.OPEN) {
        starta();
    } else {
        socket = new WebSocket('ws://localhost:8080');
        setTimeout(checkWebSocketConnection, 500);
    }
}

const lobbyCode = sessionStorage.getItem('lobbyCode');


function starta() {
    if (socket.readyState === WebSocket.OPEN) {
        const lobbyCode = sessionStorage.getItem('lobbyCode');
        if (!lobbyCode) {
            window.location.href = '../index.html';
        } else {
            joinLobby(lobbyCode);
            displayLobbyInfo(lobbyCode);
            document.querySelector('.game').style.display = 'hidden';

        }
    } else {
        checkWebSocketConnection();
    }
}

let playercount = 0;

function playercountupdate(i) {
    playercount = i;
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
        case 'playeractive':
            updatereadyplayers(data.playerId);
            break;
        case 'playeractive':
            console.log("test'");
            break;
        case 'updatePlayerCount':
            playercountupdate(data.playerCount);
            break;
        case 'nieuwevraag':
            console.log(data.quizQuestion);
    }
};
function updateLobbyUsers(users, playerIds) {
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
            playerDiv.setAttribute('playerid', playerIds[i - 1]);
            playerDiv.setAttribute('onclick', 'readyplayer("' + playerIds[i - 1] + '")');

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




function readyplayer(playerId) {
    socket.send(JSON.stringify({ action: 'readyPlayer', playerId }));
}

let readyplayers = 0;

function updatereadyplayers(playerId) {
    const playerDiv = document.querySelector(`[playerid="${playerId}"]`);
    const readyButton = playerDiv.querySelector('.ready-indicator');
    readyButton.style.background = 'green';
    console.log("player is ready");
    readyplayers++;
    startGame();

}


function startGame() {
    if (playercount === readyplayers) {

        let timerInterval;
        Swal.fire({
            title: "Iedereen was ready!",
            html: "De game is aan het starten....",
            icon: 'success',
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: false,
            willClose: () => {
                clearInterval(timerInterval);
            }
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                document.querySelector('.game').style.display = 'block';
                document.querySelector('.lobby-container').style.display = 'none';
                socket.send(JSON.stringify({ action: 'startGame' }));
            }
        });
    } else {
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Je bent ready!",
            html: readyplayers + " van de " + playercount + " spelers zijn ready",
            showConfirmButton: false,
            timer: 2000
        });
    }
}