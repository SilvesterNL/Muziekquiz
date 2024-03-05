const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const lobbies = {};
const players = {};

function createLobbyCode() {
    return Math.random().toString(36).substring(2, 10);
}

const music = [
    { id: 1, title: 'Bad Medicine', artist: 'Bon Jovi', song_path: 'BadMedicine.mp3' },
    { id: 2, title: 'Blue Monday', artist: 'New Order', song_path: 'BlueMonday.mp3' },
    { id: 3, title: 'Boys Dont Cry', artist: 'The Cure', song_path: 'BoysDontCry.mp3' },
    { id: 4, title: 'Careless Whisper', artist: 'George Michael', song_path: 'CarelessWhisper.mp3' },
    { id: 5, title: 'Everybody Wants To Rule The World', artist: 'Tears For Fears', song_path: 'EverybodyWantsToRuleTheWorld.mp3' },
    { id: 6, title: 'Ghostbusters', artist: 'Ray Parker Jr', song_path: 'Ghostbusters.mp3' },
    { id: 7, title: 'Its My Life', artist: 'Bon Jovi', song_path: 'ItsMyLife.mp3' },
    { id: 8, title: 'Jump', artist: 'Van Halen', song_path: 'Jump.mp3' },
    { id: 9, title: 'Maneater', artist: 'Daryl Hall & John Oates', song_path: 'Maneater.mp3' },
    { id: 10, title: 'Never', artist: 'Heart', song_path: 'Never.mp3' },
    { id: 11, title: 'Sweet Dreams', artist: 'Eurythmics', song_path: 'SweetDreams.mp3' },
    { id: 12, title: 'Take On Me', artist: 'a-ha', song_path: 'TakeOnMe.mp3' },
    { id: 13, title: 'Whats Up', artist: '4 Non Blondes', song_path: 'WhatsUp.mp3' },
    { id: 14, title: 'Creep', artist: 'Radiohead', song_path: 'Creep.mp3' },
    { id: 15, title: 'Gangstas Paradise', artist: 'Coolio', song_path: 'GangstasParadise.mp3' }
];


function leaveCurrentLobby(playerId) {
    if (players[playerId] && lobbies[players[playerId]]) {
        const lobbyCode = players[playerId];
        lobbies[lobbyCode] = lobbies[lobbyCode].filter(player => player.playerId !== playerId);
        console.log("speler verlaten lobby: " + playerId);
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ action: 'playercountremove', lobbyCode }));
            }
        });
        broadcastLobbyUsers(lobbyCode);
        if (lobbies[lobbyCode].length === 0) {
            delete lobbies[lobbyCode];
            console.log("lobby verwijderd met code: " + lobbyCode);
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ action: 'lobbygemaakt' }));
                }
            });
        } else {
            updatePlayerCountInLobby(lobbyCode);
        }
    }
}

function updatePlayerCountInLobby(lobbyCode) {
    const playerCount = lobbies[lobbyCode].length;
    lobbies[lobbyCode].forEach(player => {
        if (player.ws.readyState === WebSocket.OPEN) {
            player.ws.send(JSON.stringify({ action: 'updatePlayerCount', playerCount }));


        }
    });
}

function broadcastLobbyUsers(lobbyCode) {
    const usersInLobby = lobbies[lobbyCode].map(player => player.username);
    const playerId = lobbies[lobbyCode].map(player => player.playerId);

    lobbies[lobbyCode].forEach(player => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ action: 'lobbyUsers', users: usersInLobby, playerId }));
            }
        });
    });
}

function broadcastActiveLobbies() {
    const simplifiedLobbies = Object.fromEntries(
        Object.entries(lobbies).map(([lobbyCode, players]) => [
            lobbyCode,
            players.map(player => ({
                playerId: player.playerId,
                username: player.username,
            })),
        ])
    );
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ action: 'activelobbies', lobbies: simplifiedLobbies }));
        }
    });


}






wss.on('connection', (ws) => {
    const playerId = createLobbyCode();
    ws.playerId = playerId;

    ws.on('message', (message) => {
        const { action, lobbyCode, username } = JSON.parse(message);

        if (action === 'joinLobby') {
            leaveCurrentLobby(playerId);
            if (lobbyCode) {
                if (!lobbies[lobbyCode]) lobbies[lobbyCode] = [];
                lobbies[lobbyCode].push({ ws, playerId, username });
                players[playerId] = lobbyCode;
                updatePlayerCountInLobby(lobbyCode);
                broadcastLobbyUsers(lobbyCode);
                console.log("lobby gemaakt met code: " + lobbyCode);
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ action: 'lobbygemaakt' }));
                    }
                });

            }
        }
        if (action === 'requestActiveLobbies') {
            broadcastActiveLobbies();
        }
        if (action === 'readyPlayer') {
            setPlayerReady(playerId, lobbyCode);
        }
        if (action === 'startGame') {
            function generateQuizQuestion(musicArray) {
                const correctAnswer = musicArray[Math.floor(Math.random() * musicArray.length)];
                let wrongAnswers = musicArray.filter(track => track.id !== correctAnswer.id);
                wrongAnswers = wrongAnswers.sort(() => 0.5 - Math.random()).slice(0, 3);
                const options = [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());

                return {
                    question: `Welk nummer is dit?`,
                    songPath: correctAnswer.song_path,
                    options: options.map(option => `${option.title} - ${option.artist}`),
                    correctAnswer: `${correctAnswer.title} - ${correctAnswer.artist}`
                };
            }

            // Voorbeeld van hoe je een quizvraag genereert
            const quizQuestion = generateQuizQuestion(music);
            console.log(quizQuestion);
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ action: 'nieuwevraag', quizQuestion }));
                }
            });
        }
    });

    ws.on('close', () => {
        leaveCurrentLobby(playerId);
        delete players[playerId];
    });
});

let activeplayers = [];

function setPlayerReady(playerId, lobbyCode) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            activeplayers[lobbyCode] = [];
            activeplayers[lobbyCode].push(playerId);
            client.send(JSON.stringify({ action: 'playeractive', playerId: playerId }));
        }
    })
};