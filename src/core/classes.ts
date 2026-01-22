import { AllCards } from "./cards.ts";
import { PlayerHp } from "./consts.ts";
import logger from "./logger.ts";
import {
    type CardName,
    type CardStat,
    type Card as CardType,
    type Player as PlayerType,
} from "./types.ts";

/**
 * Base Card class using dynamic card name + data from AllCards
 */
abstract class Card implements CardType {
    name: CardName;
    abstract stats: CardStat[];

    constructor(cardName: CardName) {
        this.name = cardName;
    }

    toString(): string {
        return `${this.name} Card`;
    }
}

/**
 * Generic Card Factory Class
 * Accepts any CardName and instantiates it from AllCards data
 */
export class ClowCard extends Card {
    stats: CardStat[];

    constructor(name: CardName) {
        super(name);
        this.stats = AllCards[this.name].details;

        logger.debug(`${this.name} card instantiated`);
    }
}

/**
 * Player class with updated battle-related fields:
 * - tempDef: temporary defense
 * - tempDodge: temporary dodge %
 * - isStunned: boolean to skip next turn
 */
export class Player implements PlayerType {
    static id = 0;
    public id = 0;
    public name: string;
    public hp: number;
    public cardsInHands: Card[];
    public picked_card?: Card;

    // 🔥 NEW: battle runtime state
    public status = {
        tempDef: 0,
        tempDodge: 0,
        isStunned: false,
    }

    constructor(name: string) {
        this.id = Player.id ++;
        this.name = name;
        this.hp = PlayerHp;
        this.cardsInHands = [];

        logger.info(`New player instance created: ${name}`);
    }

    public dealCard(card: Card): void {
        this.cardsInHands.push(card);
        logger.debug(`${this.name} received card: ${card.name}`);
    }

    public showCards(): Card[] {
        const list = this.cardsInHands.map((card) => card.toString()).join(", ");
        logger.debug(`${this.name} has cards: ${list}`);
        return this.cardsInHands;
    }

    public toString(): string {
        return `Player: ${this.name}`;
    }
}
