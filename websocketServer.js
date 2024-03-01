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
        console.log("speler verlaten lobby: " + playerId);
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