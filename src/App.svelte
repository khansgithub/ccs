<script lang="ts">
    import "./lib/vars.css";
    import { game_over, picked_card, player_cards_data } from "./store/store";
    import { onMount } from "svelte";
    import Hand from "./components/Hand.svelte";
    import DarkModeToggle from "./components/DarkModeToggle.svelte";
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
    import { CONTINUE, DRAW, WIN } from "./core/consts";
    import type { Player, Card } from "./core/types";
    import PlayButton from "./components/PlayButton.svelte";

    let darkMode = $state(false);
    onMount(() => {
        const saved = localStorage.getItem("magical-dark-mode");
        if (saved) darkMode = saved === "true";
    });

    function getPlayerHp(i: number) {
        return players[i].hp;
    }

    const deck = buildDeck(50);
    const players = [newPlayer("foo"), newPlayer("bar")] as const;
    let winner: Player | null = $state(null);
    let self_hp = $state(getPlayerHp(0));
    let opponent_hp = $state(getPlayerHp(1));
    let round = 1; // for some reason this works even without beign a $state

    dealCards(players, deck);

    player_cards_data.update((current) => {
        players.forEach((player, index) => {
            current[index as 0 | 1].cards = player.cardsInHands;
        });
        // logger.debug(`Cards updated to`, current);
        return current;
    });

    function playRound(): void {
        const player_1_card: Card = $picked_card;
        const player_2_card: Card = pickCard(players[1].cardsInHands);
        if (player_1_card === null || player_2_card === null) return;
        runRound([player_1_card, player_2_card], players);
        logger.info(`HP ${players[0].name}: ${players[0].hp}`);
        logger.info(`HP ${players[1].name}: ${players[1].hp}`);
        updateReactiveData();

        const alive_players = filterAlivePlayers(players);
        const round_state = roundState(alive_players);
        switch (round_state) {
            case WIN:
                winner = alive_players[0];
                game_over.set(true);
                break;
            case DRAW:
                game_over.set(true);
                return;
            default:
                break;
        }
        round++;
    }

    function updateReactiveData() {
        self_hp = getPlayerHp(0);
        opponent_hp = getPlayerHp(1);
        player_cards_data.update((current) => {
            players.forEach((player, index) => {
                current[index as 0 | 1].cards = player.cardsInHands;
            });
            // logger.debug(`Cards updated to`, current);
            return current;
        });
        picked_card.set(null);
    }

    function playAgain() {}
</script>

<main class:dark={darkMode}>
    <DarkModeToggle bind:darkMode />
    <div class="row row1 hand_opponent"></div>
    <div class="row row2 board">
        <h1>Round: {round}</h1>
        <h2>Self ({players[0].name}) HP: {self_hp}</h2>
        <h2>Opponent ({players[1].name}) HP: {opponent_hp}</h2>
        {#if $game_over}
            {#if winner !== null}
                <h2>Winner is: {winner.name}</h2>
            {:else}
                <h2>Draw!</h2>
            {/if}
        {:else}
            <h3>Picked card:</h3>
            <h3>{$picked_card}</h3>
        {/if}

        {#if !$game_over}
            <!-- <button onclick={playRound}>Play Round</button> -->
            <PlayButton onclick={playRound} />
        {:else}
            <button onclick={playAgain}>Play Again</button>
        {/if}
    </div>
    <div class="row row3 hand_self">
        <Hand player={players[0]} />
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
