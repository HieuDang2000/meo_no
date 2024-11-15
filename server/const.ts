import { IBasicDeck, IBasicRangeCard } from "./type";

export const BasicRangeCard: IBasicRangeCard = {
    attack: [26, 30],
    favor: [31, 35],
    seeFuture: [36, 40],
    block: [41, 45],
    skip: [46, 49],
    shuffle: [50, 53],
} ;

export const basicDeck: IBasicDeck = {
    normalCatNumber: 20,
    normalCatType: 5,
    functionCardNumber: 28,
    functionCardType: 6,
}