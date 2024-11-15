import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import * as ITF from './type';
import { BasicRangeCard } from './const';
import { basicDeck } from './const';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:5173', "http://192.168.2.26:5173"],
        methods: ['GET', 'POST'],
    }
});

const rooms: Record<string, ITF.IRoom> = {};

function initializeDeck(room: ITF.IRoom, deckInfo: ITF.IBasicDeck = basicDeck) {
    const deck: number[] = [];
    const players = room.players;

    let i = 1;
    for (i; i <= deckInfo.normalCatType; i++) {
        deck.push(...Array(4).fill(i));
    }
    for (let j = i; j < i + deckInfo.functionCardNumber; j++) {
        deck.push(j);
    }

    shuffleDeck(deck);

    // Deal 7 cards and 1 defuse card to each player
    let exploding = Array.from({ length: 6 }, (_, i) => 80 + i);
    let defuseRange = Array.from({ length: 8 }, (_, i) => 90 + i);

    for (let i = 0; i < 7; i++) {
        players.forEach(player => player.hand.push(deck.pop() as number));
    }
    players.forEach(player => {
        const randomIndex = Math.floor(Math.random() * defuseRange.length);
        const randomDefuse = defuseRange[randomIndex];

        player.hand.push(randomDefuse);
        defuseRange.splice(randomIndex, 1);
    });

    // Add Exploding Kittens and Defuse cards to the deck
    deck.push(...exploding.splice(0, room.players.length - 1));
    deck.push(...defuseRange.splice(0, 2));

    shuffleDeck(deck);
    room.deck = deck;

    // Choose the initial player
    room.currentPlayerIndex = 0;
}

// Shuffle the deck
function shuffleDeck(deck: number[]) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function generateUniqueRoomId(): string {
    let id: string;
    do {
        id = Math.floor(100000 + Math.random() * 900000).toString();
    } while (rooms[id]);
    return id;
}

io.on('connection', (socket: Socket) => {
    console.log('A user connected:', socket.id);

    socket.on('createRoom', (playerName: string, callback: (roomId: string) => void) => {
        const roomId = generateUniqueRoomId();
        rooms[roomId] = {
            players: [],
            gameStarted: false,
            deck: [],
            currentPlayerIndex: 0,
            turnRemain: 0,
            currentPlayingCards: [],
            discardPile: [],
        };
        rooms[roomId].players.push({ id: socket.id, name: playerName, hand: [] });
        socket.join(roomId);
        callback(roomId); // Send room ID back to the client
        io.to(roomId).emit('roomUpdate', rooms[roomId]);
    });

    socket.on('joinRoom', (roomId: string, playerName: string, callback: (response: ITF.IJoinRoomRes) => void) => {
        const room = rooms[roomId];
        if (room) {
            if (room.gameStarted) {
                socket.join(roomId);
                callback({ status: 'spectator' });
            } else {
                room.players.push({ id: socket.id, name: playerName, hand: [] });
                socket.join(roomId);
                callback({ status: 'player', playerCount: room.players.length });
                io.to(roomId).emit('roomUpdate', room);
            }
        } else {
            callback({ status: 'error', message: 'Room does not exist' });
        }
    });

    socket.on('startGame', (roomId: string) => {
        const room = rooms[roomId];

        if (room && room.players.length >= 2 && !room.gameStarted) {
            room.gameStarted = true;
            initializeDeck(room);
            setInterval(()=>{
                console.log(room.players)
                console.log(new Date())
            },
            3000)
            io.to(roomId).emit('gameStarted');
            io.to(roomId).emit('roomUpdate', room);
        }
    });

    socket.on('disconnect', () => {
        for (const roomId in rooms) {
            const room = rooms[roomId];
            console.log("user disconnect:", socket.id)
            const playerIndex = room.players.findIndex((p) => p.id === socket.id);

            if (playerIndex !== -1) {
                room.players.splice(playerIndex, 1);

                if (room.players.length === 0) {
                    delete rooms[roomId];
                }
                break;
            }
        }
    });
});

server.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});
