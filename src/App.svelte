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

    type getPickedCardsType = () => [CardType, CardType];

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
        static player_hp() {
            this.checkDataIsSet();
            self_hp = this.players[0].hp;
            opponent_hp = this.players[1].hp;
        }

        static player_self_status() {
            self_status = this.players[0].status;
            logger.debug("self status", self_status);
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
            this.player_self_status();
            this.winner();
            this.player_cards(data.player_cards_store);
            this.player_picked_card_null(data.picked_card_store);
        }

        /**
         * Updates the $states - self_hp, opponent_hp, winner
         */
        static states() {
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

        const r = new Round(
            round_number,
            () => getPickedCards(players),
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

        // debugger;

        const alive_players = filterAlivePlayers(round.players);
        const round_state = roundState(alive_players);
        if (round_state == CONTINUE) {
            round.round_number++;
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

    function playAgainButtonClick() {
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
    var self_status: Player["status"] = $state(round.players[0].status);
</script>

<main class:dark={darkMode}>
    <DarkModeToggle bind:darkMode />
    <div class="row row1 hand_opponent"></div>
    <div class="row row2 board">
        <h1>Round: {round.round_number}</h1>
        <h2>Opponent ({round.players[1].name}) HP: {opponent_hp}</h2>
        <h2>Self ({round.players[0].name}) HP: {self_hp}</h2>
        {#each Object.entries(self_status) as stat}
            <h2>{stat[0]}: {stat[1]}</h2>
        {/each}
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
        --middle_row: 50%;
        /* --middle_row: 70%; */
        display: flex;
        flex-direction: column;
        flex-grow: 0;           /* prevents growing */
        flex-shrink: 0;         /* prevents shrinking */
        height: 100%;
        border: 1px solid white;
    }

    .row.row1 {
        /* flex-basis: 20%; */
        flex-basis: calc((100% - var(--middle_row))/2);
    }

    .row.row2 {
        flex-basis: var(--middle_row);
        justify-content: center;
        place-items: center;
        overflow: hidden;
    }

    .row.row2 *{
        font-size: 100%;
    }

    .row.row3 {
        flex-basis: calc((100% - var(--middle_row))/2);
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
