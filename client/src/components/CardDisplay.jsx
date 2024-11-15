import React from 'react';

function CardDisplay({ card }) {
    return (
        <div className="card-display">
            <h3>Card Drawn:</h3>
            <p>{card}</p>
        </div>
    );
}

export default CardDisplay;
