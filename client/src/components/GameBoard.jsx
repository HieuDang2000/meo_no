import React from 'react';
import PlayerList from './PlayerList';
import CardDisplay from './CardDisplay';

function GameBoard({ gameState, socket, drawnCard }) {
    const drawCard = () => {
        socket.emit('drawCard');
    };

    return (
        <div className="game-board">
            <h2>Game State</h2>
            <PlayerList players={gameState.players} currentPlayerIndex={gameState.currentPlayerIndex} />
            <button onClick={drawCard}>Draw Card</button>
            {drawnCard && <CardDisplay card={drawnCard} />}
        </div>
    );
}

export default GameBoard;
