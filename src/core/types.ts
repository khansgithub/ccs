import { CONTINUE, DRAW, Opponent, Self, WIN } from "./consts.ts"; // the only import allowed



export interface Card {
    name: CardName
    stats: CardStat[]
};
export interface Player {
    id: number;
    cardsInHands: Card[];
    hp: number;
    name: string;
    dealCard(card: Card): void;
    showCards(): Card[]
    toString(): string;
};

export type Deck = Card[];
export type Self = "self";
export type Opponent = "opponent";
export type Players = readonly [Player, Player];
type BinaryFn = (a: number, b: number) => number;
export type CardFactory = (() => Card)[];
export type NewPlayerOptions = {};
export type RoundStates = typeof DRAW | typeof WIN | typeof CONTINUE;


// -----------

// Card names now themed after Cardcaptor Sakura
export type CardName =
    | "The Firey"
    | "The Watery"
    | "The Shield"
    | "The Jump"
    | "The Sword"
    | "The Mirror"
    | "The Thunder"
    | "The Time";

export type AllStats = {
    def: number;
    dodge: number;
    damage: number;
    stun: boolean;
};

export type PlayerDirective = "self" | "opponent";

export interface Card {
    name: CardName;
    stats: CardStat[];
}

export interface Player {
    name: string;
    hp: number;
    cardsInHands: Card[];
    dealCard(card: Card): void;
    showCards(): Card[];
    toString(): string;

    // NEW: runtime properties for battle
    status: {
        tempDef?: number;
        tempDodge?: number;
        isStunned?: boolean;
    }
}

export type CardStat = {
    stat: keyof AllStats;
    value: AllStats[keyof AllStats];
    apply_to: PlayerDirective;
};

export type StatFunction = (apply_to: Player, value: any) => void;
