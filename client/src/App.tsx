// App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { IJoinRoomRes, IPlayer, IRoom } from './ultis/type';
import { showAutoCloseAlert } from './components/AutoCloseAlert'
const socket = io('http://localhost:4000'); // Adjust URL if different

function App() {
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isInRoom, setIsInRoom] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [roomInfo, setRoomInfo] = useState<IRoom>({
    players: [],
    gameStarted: false,
    deck: [],
    currentPlayerIndex: 0,
    turnRemain: 0,
    currentPlayingCards: [],
    discardPile: [],
  });

  const mockRoom = {
    players: [
      {
        id: 'tZWgq3oZcDGbpRT6AAAF',
        name: 'player 1',
        hand: [
          29, 16, 10, 9,
          12, 33, 18, 96
        ]
      },
      {
        id: 'B00wUmtZcvzH7sDPAAAD',
        name: 'player 2',
        hand: [
          30, 4, 6, 32,
          4, 5, 1, 91
        ]
      }
    ]
  }


  useEffect(() => {
    // Listen for the game start event
    socket.on('gameStarted', () => {
      setGameStarted(true);
    });

    socket.on('roomUpdate', (room: IRoom) => {
      setRoomInfo(prevRoomInfo => ({
        ...prevRoomInfo,
        ...room,
      }));
    });
    // Cleanup on component unmount
    return () => {
      socket.off('gameStarted');
      socket.off('roomUpdate');
    };
  }, []);

  const handleCreateRoom = () => {
    socket.emit('createRoom', playerName, (newRoomId) => {
      setRoomId(newRoomId);
      setIsInRoom(true);
      showAutoCloseAlert('Room created. Waiting for players...');
    });
  };

  const handleJoinRoom = () => {
    socket.emit('joinRoom', roomId, playerName, (response: IJoinRoomRes) => {
      if (response.status === 'player') {
        setIsInRoom(true);
        showAutoCloseAlert(`Joined room as player. ${response.playerCount} players in room.`);
      } else if (response.status === 'spectator') {
        setIsInRoom(true);
        showAutoCloseAlert('Joined room as spectator.');
      } else if (response.status === 'error') {
        showAutoCloseAlert(response.message);
      }
    });
  };

  const handleStartGame = () => {
    socket.emit('startGame', roomId);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Exploding Kittens Game</h1>
      <div>
          <h3>Game Started!</h3>
          <h4>Players:</h4>
          <ul>
            {mockRoom.players.map((player) => (
              <li key={player.id}>{player.name}</li>
            ))}
          </ul>
        </div>
    </div>
  );
}

export default App;
