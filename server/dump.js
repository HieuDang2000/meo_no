socket.on('playTurn', ({ playerId, useCard = [], targetPlayerId = "" }: { playerId: string; useCard: number[]; targetPlayerId: string }) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player || player.id !== playerId) return;

    if (useCard.length !== 0) {
        if (!useCard.every(card => player.hand.includes(card))) return;
        player.hand = player.hand.filter(card => {
            if (useCard.includes(card)) {
                gameState.discardPile.push(card);
                return false;
            }
            return true;
        });

        handleCardEffect(useCard, targetPlayerId, socket);
    } else {
        const drawnCard = gameState.deck.pop() as number;
        player.hand.push(drawnCard);
        socket.emit('cardDrawn', drawnCard);

        if (drawnCard === 0) {
            socket.emit('explodeKitten', "You drew an Exploding Kitten!");
        }

        if (gameState.deck.length === 0) {
            io.emit('gameOver', 'Deck is empty! The game has ended.');
        }

        handleNextPlayer();
        io.emit('gameStateUpdate', gameState);
    }
});


// Check if a card is within a specified range
function isInRange(value: number, range: [number, number]): boolean {
    const [min, max] = range;
    return value >= min && value <= max;
}



function handleNextPlayer() {
    if (gameState.turnRemain > 0) {
        gameState.turnRemain--;
    } else {
        gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    }
}

function handleFavor(cards: number[], targetPlayerId: string, socket: Socket) {
    socket.to(targetPlayerId).emit('requestFavor', { from: socket.id });

    const targetPlayer = gameState.players.find(p => p.id === targetPlayerId);
    if (!targetPlayer || targetPlayer.hand.length === 0) return;

    const favorTimeout = setTimeout(() => {
        if (targetPlayer.hand.length > 0) {
            const randomIndex = Math.floor(Math.random() * targetPlayer.hand.length);
            const randomCard = targetPlayer.hand.splice(randomIndex, 1)[0];
            const player = gameState.players.find(p => p.id === socket.id);
            if (player) player.hand.push(randomCard);

            socket.emit('favorReceived', { card: randomCard, from: targetPlayerId });
            socket.to(targetPlayerId).emit('cardGiven', { card: randomCard, to: socket.id });
            io.emit('gameStateUpdate', gameState);
        }
    }, 10000);

    socket.on('chosenCard', ({ card }: { card: number }) => {
        if (targetPlayer.hand.includes(card)) {
            clearTimeout(favorTimeout);
            targetPlayer.hand = targetPlayer.hand.filter(c => c !== card);
            const player = gameState.players.find(p => p.id === socket.id);
            if (player) player.hand.push(card);

            socket.emit('favorReceived', { card, from: targetPlayerId });
            socket.to(targetPlayerId).emit('cardGiven', { card, to: socket.id });
            io.emit('gameStateUpdate', gameState);
        }
    });
}

function handleCardEffect(cards: number[], targetPlayerId: string, socket: Socket) {
    if (cards.length === 1) {
        const card = cards[0];
        if (isInRange(card, BasicRangeCard.attack)) {
            handleNextPlayer();
            gameState.turnRemain++;
        }
        if (isInRange(card, BasicRangeCard.favor)) {
            handleFavor(cards, targetPlayerId, socket);
        }
        if (isInRange(card, BasicRangeCard.seeFuture)) {
            const futureCards = gameState.deck.slice(-3).reverse();
            socket.emit('seeFuture', futureCards);
        }
        if (isInRange(card, BasicRangeCard.skip)) {
            gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
        }
        if (isInRange(card, BasicRangeCard.shuffle)) {
            shuffleDeck(gameState.deck);
        }
    }
}