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
    players.forEach( player => {
        logger.info(`Player ${player.name} cards: ${player.cardsInHands}`);
    })
    logger.info('Finished dealing cards.');
}

export function buildDeck(size: number) : Deck {
    return Array.from({ length: size }, _ => {
        return newRandomCard(AllCardTypesFactory);
    });
}

export function pickCard(cards: Card[]): Card {
    return cards[getRandomInt(0, cards.length - 1)];
}

export function runRound(outcome: [Card, Card], players: Players) {
    logger.info(`Plauer ${players[0].name} card: ${outcome[0]}`)
    logger.info(`Plauer ${players[1].name} card: ${outcome[1]}`)
    outcome.forEach((card, index) => {
        let self = players[index];
        let opponent = players[1 - index];
        self.cardsInHands.splice(self.cardsInHands.indexOf(card), 1);
        card.stats.forEach(stat => {
            let f = StatFunctions[stat.stat];
            f(
                stat.apply_to == Self ? self : opponent,
                stat.value,                
            );
        });
    });
}

export function filterAlivePlayers(players:Players){
    return players.filter(p => p.hp > 0 && p.cardsInHands.length > 0);
}

export function roundState(alive_players: Player[]): RoundStates{
    return alive_players.length as RoundStates;
}
