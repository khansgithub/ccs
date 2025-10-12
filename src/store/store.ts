import { type Writable, writable } from 'svelte/store';
import type { Card } from '../core/types';

export const player_cards_data = writable({
    0: {
        cards: new Array()
    },
    1: {
        cards: new Array()
    }
});

export var picked_card: Writable<Card | null> = writable(null);

export var game_over: Writable<boolean> = writable(false);