import { buildDeck, newPlayer, dealCards, pickCard, runRound, filterAlivePlayers, roundState } from "./functions.ts";
import type { Players as PlayersType, RoundStates, } from "./types.ts";
import logger from "./logger";
import { CONTINUE, DRAW, WIN } from "./consts.ts";

logger.settings.minLevel = 3;

const Deck = buildDeck(10);
// logger.info(`Deck initialized with cards: ${Deck.map(c => c.toString()).join(', ')}`);

const Players = [newPlayer("foo"), newPlayer("bar")] as const;
logger.info('Two players created');

dealCards(Players, Deck);
logger.info('Delt cards to players');

class Game {
    players: PlayersType;
    constructor(players: PlayersType) {
        this.players = players;
    }

    start() {
        let round_count = 0;
        while (true) {
            round_count ++;
            logger.info(`Round ${round_count} - start -----------------`);

            logger.info('Cards in hand:');
            // logger.info(`Player ${Players[0].name}: ${Players[0].showCards().map(c => c.toString()).join(', ')}`);
            // logger.info(`Player ${Players[1].name}: ${Players[1].showCards().map(c => c.toString()).join(', ')}`);

            const player_1_card = pickCard(this.players[0].cardsInHands);
            const player_2_card = pickCard(this.players[1].cardsInHands);
            // logger.info(`${this.players[0].name} picked: ${player_1_card}`);
            // logger.info(`${this.players[1].name} picked: ${player_2_card}`);
            
            runRound([player_1_card, player_2_card], this.players);
            
            logger.info(`HP ${this.players[0].name}: ${this.players[0].hp}`);
            logger.info(`HP ${this.players[1].name}: ${this.players[1].hp}`);

            const alive_players = filterAlivePlayers(this.players);
            const round_state = roundState(alive_players);
            if (round_state == DRAW){
                logger.info("ROUND IS DRAW");
                break;
            } else if (round_state == WIN){
                logger.info(`Round winner is ${alive_players[0].name}`)
                break;
            } else if (round_state == CONTINUE){
                logger.info(`Continue to next round`);
            }
        }

    };
}

const game = new Game(Players)
game.start();