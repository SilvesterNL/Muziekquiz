let socket = new WebSocket('ws://10.10.60.50:8080');

let activeLobbies = [];

let leiderid = 0;

let playerid = 0;


function checkWebSocketConnection() {
    if (socket.readyState === WebSocket.OPEN) {
        starta();
    } else {
        socket = new WebSocket('ws://10.10.60.50:8080');
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
        case 'playeridtje':
            if (playerid === 0) {
                playerid = data.playerId;
                break;
            } else {
                break;
            }
        case 'updatePointslocal':
            if (data.lobbyCode === lobbyCode) {
                punten[data.playerid] = data.points;
                console.log(punten);
                break;
            } else {
                break;
            }
        case 'gameover':
            if (data.lobbycode === lobbyCode) {
                alert("game over");
                console.log(data.songsgot);
                break;
            } else {
                break;
            }
        case 'nieuwevraag':
            if (data.lobbycodevragen === lobbyCode) {
                startquiz(data.quizQuestion);
                console.log(data.quizQuestion);
                break;
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
            leiderid = playerIds[0];
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
                console.log(playerid);
                console.log(leiderid);
                if (playerid === leiderid) {
                    console.log("leider res gestuurd");
                    socket.send(JSON.stringify({ action: 'startGame', lobbyCode }));
                }

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

let vraagid = 1;

let vragengehad = [];

let antwoord = "";

let timer = 0;

function startquiz(vraag) {
    if (vraagid <= 8) {
        console.log(vraagid);
        console.log("game booted");
        antwoord = vraag.correctAnswer;
        document.querySelector('.card-title').textContent = vraag.question;
        document.getElementById('card-button1').textContent = vraag.options[0];
        document.getElementById('card-button2').textContent = vraag.options[1];
        document.getElementById('card-button3').textContent = vraag.options[2];
        document.getElementById('card-button4').textContent = vraag.options[3];
        let audio = new Audio("MEDIA/MUSIC/" + vraag.songPath);
        audio.play();
        timer = 15;
        let interval = setInterval(() => {
            timer--;
            if (timer === 0) {
                clearInterval(interval);
            }
        }, 1000);
        setTimeout(() => {
            audio.pause();
            vraagid++;
        }, 15000);
    } else {
        alert("game over");
    }



}


let punten = {};

function answer(button) {
    let answer = document.getElementById("card-button" + button).textContent;
    if (answer === antwoord) {
        if (vragengehad.includes(vraagid)) {
            return;
        } else {

            punten[playerid] = (punten[playerid] || 0) + 1 * timer;
            socket.send(JSON.stringify({ action: 'updatePoints', points: punten[playerid], playerid: playerid, lobbyCode: lobbyCode }));
            console.log(punten);
            vragengehad.push(vraagid);
        }
    } else {
        vragengehad.push(vraagid);
    }
}

