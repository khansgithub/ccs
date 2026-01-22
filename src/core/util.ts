import type { Card, CardFactory } from "./types.ts";
import { ClowCard } from "./classes.ts";
import { AllCards } from "./cards.ts";
import { AppError } from "./errors.ts";

// Utility: random int in range
export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Dynamically generate a factory for all cards in AllCards
export const AllCardTypesFactory: CardFactory = Object.keys(AllCards).map((name) => {
    return () => new ClowCard(name as keyof typeof AllCards);
});

// Get a random card from the factory
export function newRandomCard(factory: CardFactory): Card {
    const max = factory.length - 1;
    const i = getRandomInt(0, max);
    const f = factory[i];
    if (!f) throw new AppError("InvalidCard", i);
    return f();
}
