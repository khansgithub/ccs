<script lang="ts">
    import "./lib/vars.css";
    import {
        game_over_store,
        picked_card_store,
        player_cards_store,
    } from "./store/store";
    import { onMount } from "svelte";
    import Hand from "./components/Hand.svelte";
    import DarkModeToggle from "./components/DarkModeToggle.svelte";
    import { type Writable } from "svelte/store";
    import {
        buildDeck,
        newPlayer,
        dealCards,
        pickCard,
        runRound,
        filterAlivePlayers,
        roundState,
    } from "./core/functions";
    import logger from "./core/logger";
    import { CONTINUE, DeckSize, DRAW, PlayerHp, WIN } from "./core/consts";
    import type { Player, Card as CardType, Players, Deck } from "./core/types";
    import PlayButton from "./components/PlayButton.svelte";
    import Card from "./components/Card.svelte";
    import { AppError } from "./core/errors";

    let darkMode = $state(false);
    onMount(() => {
        const saved = localStorage.getItem("magical-dark-mode");
        if (saved) darkMode = saved === "true";
    });

    // var round_data = {};
    // function round_button(round_data) {
    //     const new_round_data = {};
    //     return new_round_data;
    // }
    // var round_data = round_button(round_data);
    // -----------------------------------------------------

    type getPickedCardsType = () => [CardType, CardType]

    class ReactiveUpdateFunctions {
        private constructor() {}
        public static players: Players;
        public static round: Round;
        /**
         * Make sure `players` is set before calling this function.
         * Updates the `player_cards_store` via side effect
         */
        static player_cards(data: typeof player_cards_store) {
            this.checkDataIsSet();
            data.update((current) => {
                this.players.forEach((player, index) => {
                    current[index as 0 | 1].cards = player.cardsInHands;
                });
                // logger.debug(`Cards updated to`, current);
                return current;
            });
        }

        /**
         * Make sure `players` is set before calling this function.
         * Updates the state `self_hp`, `opponent_hp` by side effect.
         */
        static player_hp(): [number, number] {
            this.checkDataIsSet();
            self_hp = this.players[0].hp;
            opponent_hp = this.players[1].hp;
            return [self_hp, opponent_hp];
        }

        /**
         * Sets `picked_card_store` to null by side effect.
         */
        static player_picked_card_null(data: typeof picked_card_store) {
            data.set(null);
        }

        static winner() {
            winner = this.round.winner;
            logger.debug(this.round.winner);
        }

        static all(data: {
            player_cards_store: typeof player_cards_store;
            picked_card_store: typeof picked_card_store;
        }) {
            this.checkDataIsSet();
            this.player_hp();
            this.winner();
            this.player_cards(data.player_cards_store);
            this.player_picked_card_null(data.picked_card_store);
        }

        /**
         * Updates the $states - self_hp, opponent_hp, winner
         */
        static states(){
            this.player_hp();
            this.winner();
        }

        static setRound(round: Round) {
            this.round = round;
            this.players = round.players;
        }

        static checkDataIsSet() {
            if (!this.round) throw new AppError("PlayersNotSet");
            if (!this.players) throw new AppError("PlayersNotSet");
        }
    }

    class Round {
        winner: Player | false | null = $state(null);
        self_hp = 0;
        opponent_hp = $state(0);
        round_number: number;
        picked_cards: getPickedCardsType;
        players: Players;
        deck: Deck = buildDeck(DeckSize);

        constructor(
            round: number,
            picked_card: getPickedCardsType,
            players: Players,
        ) {
            this.players = players;
            this.round_number = round;
            this.picked_cards = picked_card;
            this.self_hp = players[0].hp;
            this.opponent_hp = players[1].hp;
            dealCards(players, this.deck);
        }
    }

    function getPickedCards(players?: Players): [CardType, CardType] {
        return [$picked_card_store, pickCard(players[1].cardsInHands)];
    }

    function makeRound(): Round {
        const round_number = 1;
        const players: Players = [newPlayer("foo"), newPlayer("bar")] as const;
        // const r = new Round(
        //     round_number,
        //     { f: getPickedCardsFunction, args: [players] },
        //     // (() => return getPickedCardsFunction(players))
        //     players,
        // );

        const r = new Round(
            round_number,
            (() => getPickedCards(players)),
            players,
        );
        return r;
    }

    function executeRound(round: Round): Round {
        const picked_cards = round.picked_cards();
        if (picked_cards.includes(null)) {
            logger.error(`null found in ${picked_cards}`);
            return round;
        }

        runRound(picked_cards, round.players);

        ReactiveUpdateFunctions.all({
            player_cards_store: player_cards_store,
            picked_card_store: picked_card_store,
        });

        const alive_players = filterAlivePlayers(round.players);
        const round_state = roundState(alive_players);
        if (round_state == CONTINUE) {
            round.round_number++;
            return round;
        } else {
            game_over_store.set(true);
            if (round_state == WIN) {
                round.winner = alive_players[0];
            } else if (round_state == DRAW) {
                round.winner = false;
            }
            ReactiveUpdateFunctions.winner();
        }
        return round;
    }

    function playButtonClick() {
        round = executeRound(round);
    }
    
    function playAgainButtonClick(){
        round = makeRound();
        ReactiveUpdateFunctions.setRound(round);
        ReactiveUpdateFunctions.all({
            player_cards_store: player_cards_store,
            picked_card_store: picked_card_store,
        });
        game_over_store.set(false);
    }

    var round = makeRound();
    ReactiveUpdateFunctions.setRound(round);
    ReactiveUpdateFunctions.player_cards(player_cards_store);

    var winner = $state(round.winner);
    var self_hp = $state(round.self_hp);
    var opponent_hp = $state(round.opponent_hp);
    // round = executeRound(round);

    // -----------------------------------------------------
    // class Match {
    //     readonly deck: CardType[];
    //     readonly players: Players;

    //     constructor(deck_size: number, players: Players) {
    //         this.deck = buildDeck(deck_size);
    //         this.players = players;
    //     }

    //     public dealCards() {
    //         dealCards(this.players, this.deck);
    //     }
    // }

    // const deck = buildDeck(50);
    // const players = [newPlayer("foo"), newPlayer("bar")] as const;
    // let winner: Player | null = $state(null);
    // let self_hp = $state(getPlayerHp(0));
    // let opponent_hp = $state(getPlayerHp(1));
    // let round = 1; // for some reason this works even without beign a $state

    // dealCards(players, deck);

    // player_cards_store.update((current) => {
    //     players.forEach((player, index) => {
    //         current[index as 0 | 1].cards = player.cardsInHands;
    //     });
    //     // logger.debug(`Cards updated to`, current);
    //     return current;
    // });

    // function playRound(): void {
    //     const player_1_card: Card = $picked_card_store;
    //     const player_2_card: Card = pickCard(players[1].cardsInHands);
    //     if (player_1_card === null || player_2_card === null) return;
    //     runRound([player_1_card, player_2_card], players);
    //     logger.info(`HP ${players[0].name}: ${players[0].hp}`);
    //     logger.info(`HP ${players[1].name}: ${players[1].hp}`);
    //     updateReactiveData();

    //     const alive_players = filterAlivePlayers(players);
    //     const round_state = roundState(alive_players);
    //     switch (round_state) {
    //         case WIN:
    //             winner = alive_players[0];
    //             game_over_store.set(true);
    //             break;
    //         case DRAW:
    //             game_over_store.set(true);
    //             return;
    //         default:
    //             break;
    //     }
    //     round++;
    // }

    // function updateReactiveData() {
    //     self_hp = getPlayerHp(0);
    //     opponent_hp = getPlayerHp(1);
    //     player_cards_store.update((current) => {
    //         players.forEach((player, index) => {
    //             current[index as 0 | 1].cards = player.cardsInHands;
    //         });
    //         // logger.debug(`Cards updated to`, current);
    //         return current;
    //     });
    //     picked_card_store.set(null);
    // }

    function playAgain() {}
</script>

<main class:dark={darkMode}>
    <DarkModeToggle bind:darkMode />
    <div class="row row1 hand_opponent"></div>
    <div class="row row2 board">
        <h1>Round: {round.round_number}</h1>
        <h2>Self ({round.players[0].name}) HP: {self_hp}</h2>
        <h2>Opponent ({round.players[1].name}) HP: {opponent_hp}</h2>
        {#if $game_over_store}
            {#if winner}
                <h2>Winner is: {winner.name}</h2>
            {:else if winner == false}
                <h2>Draw!</h2>
            {/if}
        {:else}
            <h3>Picked card:</h3>
            <h3>{$picked_card_store}</h3>
        {/if}

        {#if !$game_over_store}
            <PlayButton onclick={playButtonClick} text="Play Round" />
        {:else}
            <PlayButton onclick={playAgainButtonClick} text="Play Again" />
        {/if}
    </div>
    <div class="row row3 hand_self">
        <Hand player={round.players[0]} />
    </div>
</main>

<style>
    main {
        height: 100vh;
        width: 100vw;
        margin: 0;
        padding-bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
        position: relative;
        overflow: hidden;
        background: var(--bg-light);
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        /* font-family: "Comic Sans MS", "Papyrus", fantasy; */
        transition: background 0.5s ease;
    }

    main.dark {
        background: var(--bg-dark);
    }

    main.dark :is(h1, h2, h3) {
        color: var(--text-dark);
    }

    h1,
    h2,
    h3 {
        color: var(--text-light);
    }

    .row {
        display: flex;
        flex-direction: column;
    }

    .row1 {
        flex-basis: 20%;
    }

    .row2 {
        flex-basis: 60%;
        justify-content: center;
        place-items: center;
    }

    .row3 {
        flex-basis: 20%;
        justify-content: flex-end;
        margin-bottom: 10px;
    }

    .board {
        width: 100%;
        /* height: 100%; */
        /* background: black; */
    }

    .hand_opponent,
    .hand_self {
        width: 100%;
        height: 100%;
        /* background: gray; */
        justify-self: end;
    }
</style>
