import type { Card, CardFactory } from "./types.ts";
import { FooCard, BarCard } from "./classes.ts";
import { AppError } from "./errors.ts";

export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


export const AllCardTypesFactory: CardFactory = [
    () => new FooCard(),
    () => new BarCard(),
] as const;

export function newRandomCard(factory: CardFactory): Card {
    const max = factory.length - 1;
    const i = getRandomInt(0, max);
    const f = factory[i];
    if (!f) throw new AppError("InvalidCard", i);
    return f();
}
