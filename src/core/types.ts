import { CONTINUE, DRAW, Opponent, Self, WIN } from "./consts.ts"; // the only import allowed

export type CardName = "Foo" | "Bar";
export interface Card {
    name: CardName
    stats: CardStat[]
};
export type Deck = Card[];

export interface Player {
    cardsInHands: Card[];
    hp: number;
    name: string;
    dealCard(card: Card): void;
    showCards(): Card[]
    toString(): string;
};

export type Self = "self";
export type Opponent = "opponent";
export type PlayerDirective = Self | Opponent
export type Players = readonly [Player, Player];

export type AllStats = {
    def: number,
    dodge: number,
    damage: number,
    stun: boolean
};

export type CardStat = {
    stat: keyof AllStats //CardStatName,
    value: AllStats[keyof AllStats] //CardStatName
    apply_to: Player | PlayerDirective
}

type BinaryFn = (a: number, b: number) => number;

export type StatFunction = (apply_to: Player, value: any) => void;
export type CardFactory = (() => Card)[];
export type NewPlayerOptions = {};
export type RoundStates = typeof DRAW | typeof WIN | typeof CONTINUE;