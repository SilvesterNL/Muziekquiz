let socket = new WebSocket('ws://websocket.silvesterhensen.dev');

let activeLobbies = [];

let leiderid = 0;

let playerid = 0;


function checkWebSocketConnection() {
    if (socket.readyState === WebSocket.OPEN) {
        starta();
    } else {
        socket = new WebSocket('ws://websocket.silvesterhensen.dev');
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
            break;
        case 'playeridtje':
            if (playerid === 0) {
                playerid = data.playerId;
                break;
            } else {
                break;
            }
        case 'updatePointslocal':
            if (data.lobbyCode === lobbyCode && usernames[data.playerId]) {
                punten[usernames[usernames[data.playerId]]] = data.points;
                geantwoord = false;

            }
            break;
        case 'gameover':
            if (data.lobbycode === lobbyCode) {
                document.querySelector('.game').style.display = 'none';
                document.querySelector('.leaderboard').style.display = 'block';
                document.querySelector('#ranking-block').style.display = 'block';
                showLeaderboard(data.songsgot, punten);
                socket.send(JSON.stringify({ action: 'puntensync', punten: punten[usernames[playerid]], lobbyCode: lobbyCode, username: localStorage.getItem('username') }));
                break;
            } else {
                break;
            }
        case 'puntenupdate':
            if (data.lobbyCode === lobbyCode) {
                puntensyncro = data.puntensyncro;
                showLeaderboard(puntensyncro);
            }
            break;
        case 'nieuwevraag':
            if (data.lobbycodevragen === lobbyCode) {
                startquiz(data.quizQuestion);
                geantwoord = false;
                break;
            }
    }
};

let usernames = {};

function updateLobbyUsers(users, playerIds) {
    const currentUsername = localStorage.getItem('username');
    users.forEach((username, index) => {
        usernames[playerIds[index]] = username; // Map player IDs to usernames
    });
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
                if (playerid === leiderid) {
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
        antwoord = vraag.correctAnswer;
        document.querySelector('.card-title').textContent = vraag.question;
        document.getElementById('card-button1').textContent = vraag.options[0];
        document.getElementById('card-button2').textContent = vraag.options[1];
        document.getElementById('card-button3').textContent = vraag.options[2];
        document.getElementById('card-button4').textContent = vraag.options[3];
        document.getElementById('card-button1').style.background = "#6293c8";
        document.getElementById('card-button2').style.background = "#6293c8";
        document.getElementById('card-button3').style.background = "#6293c8";
        document.getElementById('card-button4').style.background = "#6293c8";

        timer = 15;
        let timerElement = document.querySelector('.go-arrow');
        timerElement.textContent = timer;

        let audio = new Audio("MEDIA/MUSIC/" + vraag.songPath);
        audio.play();

        let interval = setInterval(() => {
            timer--;
            if (timer >= 0) {
                timerElement.textContent = timer.toString();
            } else {
                clearInterval(interval);
                timerElement.textContent = "⏰";
                vraagid++;
                geantwoord = false;
                (geantwoord);
                audio.pause();
            }
        }, 1000);

        setTimeout(() => {
            clearInterval(interval);
            if (vraagid <= 8) {
                vraagid++;
                clearInterval(interval);
            }
        }, 15000);
    }
}



let punten = {};

let geantwoord = false;

// Aannemende dat `vragengehad`, `vraagid`, `antwoord`, `punten`, `usernames`, `playerid`, `timer`, `socket`, `lobbyCode` zijn gedefinieerd elders in je code.

function resetAntwoordStatus() {
    geantwoord = false; // Reset de antwoord status zodat de gebruiker weer kan antwoorden
}

function answer(button) {
    let answerElement = document.getElementById("card-button" + button);
    let answer = answerElement.textContent;
    // Controleer of de vraag al beantwoord is
    if (vragengehad.includes(vraagid)) {
        ("Vraag al beantwoord.");
        return; // Vroegtijdig beëindigen als de vraag al beantwoord is
    }

    if (answer === antwoord && !geantwoord) {
        answerElement.style.background = "green";
        // Update punten en verstuur via WebSocket
        let currentPlayerPoints = punten[usernames[playerid]] || 0;
        punten[usernames[playerid]] = currentPlayerPoints + 1 * timer;
        socket.send(JSON.stringify({ action: 'updatePoints', points: punten[usernames[playerid]], playerid: playerid, lobbyCode: lobbyCode }));

        (punten);
        geantwoord = true;
        (geantwoord);

    } else if (!geantwoord) {
        answerElement.style.background = "red";
        geantwoord = true;
        (geantwoord);
    }

    // Voeg huidige vraag toe aan beantwoorde vragen
    vragengehad.push(vraagid);

    // Optioneel: Reset de antwoordstatus na een bepaalde tijd of actie, zodat nieuwe vragen beantwoord kunnen worden
    setTimeout(resetAntwoordStatus, 1000); // 1000ms = 1 seconde na het beantwoorden van een vraag
}



function showLeaderboard(serverPoints) {
    const leaderboard = document.getElementById('leaderboard');
    const table = leaderboard.querySelector('table');
    const entries = Object.entries(serverPoints).sort((a, b) => b[1] - a[1]).slice(0, 4);

    // Clear existing rows except the header
    const rows = table.querySelectorAll('tr');
    for (let i = rows.length - 1; i > 0; i--) {
        rows[i].remove();
    }

    // Create and append new rows
    entries.forEach((entry, index) => {
        const [name, points] = entry;
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);

        cell1.className = 'number';
        cell2.className = 'name';
        cell3.className = 'points';

        cell1.innerHTML = index === 0 ? '&#129351;' : index === 1 ? '&#129352;' : index === 2 ? '&#129353;' : '&#10005;';
        cell2.textContent = name;
        cell3.textContent = points;
    });

    // Remove the first row after adding new rows
    table.deleteRow(0);
}
