import { type Writable, writable } from 'svelte/store';
import type { Card } from '../core/types';

export const player_cards_store = writable({
    0: {
        cards: new Array()
    },
    1: {
        cards: new Array()
    }
});

export var picked_card_store = writable(null) as Writable<Card | null> | null ;
export var game_over_store: Writable<boolean> = writable(false);