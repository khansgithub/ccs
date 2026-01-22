import { StatFunctions } from "./cards.ts";
import { Player } from "./classes.ts";
import { CONTINUE, DRAW, Self, WIN } from "./consts.ts";
import { AppError } from "./errors.ts";
import logger from "./logger.ts";
import type { NewPlayerOptions, Player as PlayerType, Players, Deck, Card, RoundStates } from "./types.ts";
import { getRandomInt, newRandomCard, AllCardTypesFactory } from "./util.ts";

export function newPlayer(name: string, options?: NewPlayerOptions): Player {
    logger.debug(`Creating new player with options: ${JSON.stringify(options)}`);
    return new Player(name);
}

export function dealCards(players: Players, deck: Deck) {
    logger.info('Starting to deal cards...');
    deck.forEach(card => {
        const index = getRandomInt(0, players.length - 1) as 0 | 1;
        const player = players[index];
        if (player === undefined) throw new AppError("InvalidPlayer");
        // logger.debug(`Dealing ${card.toString()} to Player ${index + 1}`);
        player.dealCard(card);
    });
    players.forEach(player => {
        logger.info(`Player ${player.name} cards: ${player.cardsInHands}`);
    })
    logger.info('Finished dealing cards.');
}

export function buildDeck(size: number): Deck {
    return Array.from({ length: size }, _ => {
        return newRandomCard(AllCardTypesFactory);
    });
}

export function pickCard(cards: Card[]): Card {
    return cards[getRandomInt(0, cards.length - 1)];
}

export function runRound(outcome: [Card, Card], players: Players) {
    const [card1, card2] = outcome;
    const [player1, player2] = [players[0], players[1]];

    // Log card selections
    logger.info(`Player ${player1.name} plays: ${card1.name}`);
    logger.info(`Player ${player2.name} plays: ${card2.name}`);

    // Remove used cards from hand
    player1.cardsInHands.splice(player1.cardsInHands.indexOf(card1), 1);
    player2.cardsInHands.splice(player2.cardsInHands.indexOf(card2), 1);

    // Process both players' cards
    processCard(card1, player1, player2);
    processCard(card2, player2, player1);
}

function processCard(card: Card, self: PlayerType, opponent: PlayerType) {
    // Skip if stunned
    if (self.status.isStunned) {
        logger.info(`${self.name} is stunned and skips this round.`);
        self.status.isStunned = false; // Clear stun
        return;
    }

    logger.info(`${self.name} activates card: ${card.name}`);

    for (const stat of card.stats) {
        const target = stat.apply_to === "self" ? self : opponent;

        if (stat.stat === "damage") {
            resolveDamage(target, stat.value as number);
        } else {
            const func = StatFunctions[stat.stat];
            func(target, stat.value);
        }
    }
};

function resolveDamage(target: PlayerType, rawDamage: number): number {
    const dodgeChance = target.status.tempDodge ?? 0;
    const dodged = Math.random() * 100 < dodgeChance;

    if (dodged) {
        logger.info(`${target.name} dodged the attack!`);
        return 0;
    }

    const def = target.status.tempDef ?? 0;
    const reducedDamage = Math.max(0, rawDamage - def);
    target.hp -= reducedDamage;

    logger.info(`${target.name} blocked ${def} damage, took ${reducedDamage}. HP now: ${target.hp}`);

    // Clear temporary stats
    target.status.tempDef = 0;
    target.status.tempDodge = 0;

    return reducedDamage;
}


export function filterAlivePlayers(players: Players) {
    return players.filter(p => p.hp > 0 && p.cardsInHands.length > 0);
}

export function roundState(alive_players: PlayerType[]): RoundStates {
    return alive_players.length as RoundStates;
}
