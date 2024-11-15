
export interface IPlayer {
    id: string;
    name: string;
    hand: number[];
}

export interface IGameState {
    players: IPlayer[];
    deck: number[];
    currentPlayerIndex: number;
    turnRemain: number;
    currentPlayingCards: number[];
    discardPile: number[];
}

export interface IBasicRangeCard {
    attack: [number, number],
    favor: [number, number],
    seeFuture: [number, number],
    block: [number, number],
    skip: [number, number],
    shuffle: [number, number],
}

export interface IRoom {
    players: IPlayer[];
    gameStarted: boolean;
    deck: number[];
    currentPlayerIndex: number;
    turnRemain: number;
    currentPlayingCards: number[];
    discardPile: number[];
}

export interface IRooms {
    [roomId: string]: IRoom;
}

export interface IJoinRoomRes {
    status: string;
    playerCount?: number;
    message?: string
}

export interface IGameState {
    players: IPlayer[];
    gameStarted: boolean;
    deck: number[];
    currentPlayerIndex: number;
    turnRemain: number;
    currentPlayingCards: number[];
    discardPile: number[];
}

export interface IBasicDeck {
    normalCatNumber:number,
    normalCatType:number,
    functionCardNumber:number,
    functionCardType:number,
}
