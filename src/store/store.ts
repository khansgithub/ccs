import { type Writable, writable } from 'svelte/store';
import type { Card } from '../core/types';

export type PlayerCardsState = {
    0: { cards: Card[] };
    1: { cards: Card[] };
};

export const player_cards_store = writable<PlayerCardsState>({
    0: { cards: [] },
    1: { cards: [] },
});

export const picked_card_store: Writable<Card | null> = writable(null);
export var game_over_store: Writable<boolean> = writable(false);