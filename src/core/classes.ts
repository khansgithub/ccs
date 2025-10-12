import { AllCards } from "./cards.ts";
import logger from "./logger.ts";
import {type CardName, type CardStat, type Card as CardType, type Player as PlayerType} from "./types.ts";

abstract class Card implements CardType {
    name: CardName;
    abstract stats: CardStat[];
    constructor(cardName: CardName) {
        this.name = cardName;
    }

    toString(): string {
        return `${this.name}Card`;
    }
}

export class FooCard extends Card {
    stats: CardStat[];

    constructor() {
        super('Foo');
        this.stats = AllCards[this.name];
        logger.debug('FooCard instantiated');
    }

    // toString(): string {
    //     return ""+
    //     "+--------------+" +
    //     "|   FOO CARD   |" +
    //     "|              |" +
    //     "|   (\_/)      |" +
    //     "|  ( •_•)      |" +
    //     "|  / >🍪       |" +
    //     "|              |" +
    //     "|   SAKURA     |" +
    //     "+--------------+" 
    // }    
}

export class BarCard extends Card {
    stats: CardStat[];

    constructor() {
        super('Bar');
        this.stats = AllCards[this.name];
        logger.debug('BarCard instantiated');
    }

    // toString(): string {
    //     return "" +
    //     "+--------------+" +
    //     "|   BAR CARD   |" +
    //     "|              |" +
    //     "|   /\_/\      |" +
    //     "|  ( o.o )     |" +
    //     "|   > ^ <      |" +
    //     "|              |" +
    //     "|   SAKURA     |" +
    //     "+--------------+" 
    // }
}

export class Player implements PlayerType {
    public cardsInHands: Card[];
    public hp: number;
    public name: string;
    public picked_card?: Card;

    constructor(name: string) {
        this.cardsInHands = [];
        this.hp = 50;
        this.name = name;
        logger.info('New player instance created');
    }

    public dealCard(card: Card) {
        // logger.debug(`Dealing card: ${card.toString()}`);
        this.cardsInHands.push(card);
        // logger.info(`Cards in hand now: ${this.cardsInHands}`);
    }

    public showCards() : Card[] {
        const cardList = Object.values(this.cardsInHands).map(card => card.toString()).join(', ');
        // logger.debug(`Showing cards: ${cardList}`);
        return this.cardsInHands;
    }

    public toString(): string {
        return `Player: ${this.name}`;
    }


}