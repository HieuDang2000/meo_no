import React from 'react';

function PlayerList({ players, currentPlayerIndex }) {
    return (
        <div className="player-list">
            <h3>Players:</h3>
            <ul>
                {players && players.map((player, index) => (
                    <li key={index} className={currentPlayerIndex === index ? 'current-player' : ''}>
                        {player.name} {currentPlayerIndex === index ? '(Your Turn)' : ''}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PlayerList;
