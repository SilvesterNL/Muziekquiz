const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const lobbies = {};
const players = {};

function createLobbyCode() {
    return Math.random().toString(36).substring(2, 10);
}

function leaveCurrentLobby(playerId) {
    if (players[playerId] && lobbies[players[playerId]]) {
        const lobbyCode = players[playerId];
        lobbies[lobbyCode] = lobbies[lobbyCode].filter(player => player.playerId !== playerId);

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
    lobbies[lobbyCode].forEach(player => {
        if (player.ws.readyState === WebSocket.OPEN) {
            player.ws.send(JSON.stringify({ action: 'lobbyUsers', users: usersInLobby }));
        }
    });
}

function broadcastActiveLobbies() {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ action: 'activelobbies', lobbies: lobbies}));
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
    });

    ws.on('close', () => {
        leaveCurrentLobby(playerId);
        delete players[playerId];
    });
});

