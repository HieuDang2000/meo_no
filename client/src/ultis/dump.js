{isInRoom ? (
    <>
      <h2>Room ID: {roomId}</h2>
      {!gameStarted && (
        <button onClick={handleStartGame} disabled={roomInfo.players.length < 2}>
          Start Game
        </button>
      )}
      {gameStarted && (
        <div>
          <h3>Game Started!</h3>
          <h4>Players:</h4>
          <ul>
            {roomInfo.players.map((player) => (
              <li key={player.id}>{player.name}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  ) : (
    <>
      <input
        type="text"
        placeholder="Enter your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <button onClick={handleCreateRoom}>Create Room</button>
      <br />
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={handleJoinRoom}>Join Room</button>
    </>
  )}