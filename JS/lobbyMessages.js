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

let playerCount = 0;


playerupdate();
function playerupdate() {
    setTimeout(() => {
        playerCount = document.querySelectorAll('[playerid]').length;
        playerupdate();
    }, 500);
}






function joinLobby(lobbyCode) {
    const username = localStorage.getItem('username');
    socket.send(JSON.stringify({ action: 'joinLobby', lobbyCode, username }));
}

function displayLobbyInfo(lobbyCode) {
    document.getElementById('lobbyInfo').innerHTML = `${lobbyCode}`;
}

socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    switch (data.action) {
        case 'lobbyUsers':
            if (data.lobbyCode === lobbyCode) {
                updateLobbyUsers(data.users, data.playerId);
                break;
            } else {
                break;
            }
        case 'playeractive':
            updatereadyplayers(data.playerId);
            break;
        case 'playeractive':
            console.log("test'");
            break;
        case 'nieuwevraag':
            if (data.lobbyCode === lobbyCode) {
                console.log(data.quizQuestion);
            }
    }
};
function updateLobbyUsers(users, playerIds) {
    const currentUsername = localStorage.getItem('username');

    for (let i = 1; i <= 4; i++) {
        const playerDiv = document.getElementById(`player${i}`);
        const img = playerDiv.querySelector('img');
        const p = playerDiv.querySelector('.player-name');
        const readyButton = playerDiv.querySelector('.player-button');

        if (users[i - 1]) {
            img.src = `../MEDIA/AVATARS/avatar${i}.webp`;
            p.textContent = users[i - 1];
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
            playerDiv.removeAttribute('playerid');
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
    if (playerCount === readyplayers) {
        const audio = new Audio('MEDIA/SOUNDS/starter.mp3');
        audio.play();
        let timerInterval;
        Swal.fire({
            title: "Iedereen was ready!",
            html: "De game is aan het starten....",
            icon: 'success',
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            willClose: () => {
                clearInterval(timerInterval);
            }

        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {

                document.querySelector('.lobby-container').style.display = 'none';
                document.querySelector('.game').style.display = 'flex';
                socket.send(JSON.stringify({ action: 'startGame', lobbyCode }));
            }
        });
    } else {
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Je bent ready!",
            html: readyplayers + " van de " + playerCount + " spelers zijn ready",
            showConfirmButton: false,
            timer: 2000
        });
    }
}


