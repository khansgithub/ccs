<script lang="ts">
    import logger from "../core/logger";
    import type { Card } from "../core/types";
    import {
        player_cards_store,
        game_over_store,
        picked_card_store,
    } from "../store/store";
    const {
        card,
        disable_click,
    }: { card: Card; disable_click: () => boolean } = $props();

    var selected = $state(false);
    const card_class_name = "card-" + card.name.split(" ")[1].toLowerCase();
    function toggleSelected(e: MouseEvent) {
        e.preventDefault();
        if ($game_over_store) return;
        // if (disable_click() && !selected) return;
        selected = !selected;
        logger.info(`Selected card ${selected ? "✅" : "❎"}`);
        logger.info(`Card: ${selected ? card.name : "none"}`);
        picked_card_store.set(selected ? card : null);
    }

    function randomNumber(max: number): number{
        return Math.floor(Math.random() * max)
    }

    function randomPercentage(): number{
        return randomNumber(101);
    }

    picked_card_store.subscribe((picked_card_store) => {
        if (selected) {
            /*
            deselect this card when:
                - the round resets (and player_cards_store is set to null)
                - another card is picked (and player_cards_store is a different value)
            */
            if (picked_card_store === null || picked_card_store !== card) {
                selected = false;
            }
        }
    });
</script>

<div class="card-wrapper" class:selected>
    <button onclick={toggleSelected} title="select card">
        <div class="card card-image {card_class_name}" aria-label="Clow Card"></div>
        <!-- <div class="card" aria-label="Clow Card">
            <div class="card-inner {card_class_name}">
                <div class="card-symbol" aria-hidden="true"></div>
                <div class="card-body">
                    <div class="placeholder">
                        <p class="card_name">{card.name}</p>
                        <div class="card_stats">
                            <h3>Stats</h3>
                            {#each Object.entries(card.stats) as stat}
                                <p>{stat[1].stat} - {stat[1].value}</p>
                            {/each}
                        </div>
                    </div>
                </div>

                <div class="card-footer">
                    <div class="banner"></div>
                </div>

                <div class="sparkle" style={`left:${randomPercentage()}%;top:${randomPercentage()}%;`}></div>
                <div class="sparkle" style={`right:${randomPercentage()}%;top:${randomPercentage()}%;`}></div>
            </div>
        </div> -->
    </button>
</div>

<style>
    .card-wrapper {
        animation: float 4s ease-in-out infinite;
        display: inline-block;
        position: relative;
    }

    .card-wrapper > button {
        all: unset;
        width: 100%;
        height: 100%;
    }

    .card-wrapper:hover .card,
    .card-wrapper.selected .card {
        transform: scale(1.2) rotateZ(-1.5deg);
        filter: brightness(1.05);
        /* box-shadow:
            0 0 15px var(--color-shadow),
            0 0 25px var(--frame-gold),
            0 0 40px var(--symbol-light); */
    }

    .card-wrapper:active .card,
    .card-wrapper.selected:active .card {
        transform: scale(1.3) rotateZ(-1.5deg);
        filter: brightness(1.15);
    }

    .card {
        position: relative;
        height: 100%;
        /* aspect-ratio: 7 / 10; */
        aspect-ratio: 1 / 2.2 ;
        background: linear-gradient(
            180deg,
            var(--outer-bg) 0%,
            var(--outer-bg-2) 100%
        );
        border-radius: clamp(5px, calc(0.1 * 1rem + 1vw), 2rem);
        border: 0.4rem solid var(--frame-gold);
        box-shadow:
            0 10px 10px rgba(0, 0, 0, 0.2),
            0 0 30px rgba(255, 223, 186, 0.15) inset;
        overflow: visible;
        transition:
            transform 0.4s ease,
            filter 0.4s ease,
            box-shadow 0.4s ease;
    }

    .card-inner {
        position: absolute;
        inset: 2%;
        background: linear-gradient(
            180deg,
            var(--inner-top),
            var(--inner-bottom)
        );
        padding-top: 5%;
        border-radius: clamp(5px, calc(0.1 * 1rem + 1vw), 2rem);
        box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.6);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .card-symbol {
        width: 60%;
        aspect-ratio: 1/1;
        opacity: 0.8;
        position: absolute;
        margin-top: 3%;
        border-radius: 100%;
        background: radial-gradient(
            circle at 35% 30%,
            var(--symbol-light) 30%,
            var(--symbol-dark) 85%
        );
        box-shadow:
            0 6px 20px rgba(176, 124, 73, 0.45),
            0 0 18px rgba(255, 215, 128, 0.15) inset;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .card-symbol::before {
        content: "";
        position: absolute;
        width: 160%;
        height: 160%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) rotate(20deg);
        background: conic-gradient(
            from 0deg,
            rgba(255, 215, 128, 0.12),
            transparent 10%
        );
        mask: radial-gradient(circle at center, transparent 55%, black 55%);
        filter: blur(2px);
        pointer-events: none;
    }

    .card-body {
        width: 80%;
        flex: 1 1 auto;
        background: rgba(255, 255, 255, 0.03);
        border-radius: clamp(5px, calc(0.1 * 1rem + 1vw), 2rem);
        border: 2px solid rgba(255, 255, 255, 0.06);
        backdrop-filter: blur(6px);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .placeholder {
        color: rgba(255, 255, 255, 0.9);
        text-align: center;
        line-height: 1.4;
    }

    .card-footer {
        width: 100%;
        min-height: 20%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .card_name {
        width: 100%;
        height: 20%;
        background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.06),
            rgba(0, 0, 0, 0.12)
        );
        margin: 0;
        border-radius: 3%;
        border: 2px solid rgba(255, 215, 170, 0.09);
        display: flex;
        align-items: center;
        justify-content: center;
        letter-spacing: 0.2rem;
        font-size: 1.8rem;
        color: #f5d0a9;
        text-transform: uppercase;
        box-shadow: 0 0.5rem 2rem rgba(0, 0, 0, 0.4) inset;

    }

    .card_stats :is(p, h3){
        margin: 0;
        padding: 0;
    }

    .sparkle {
        position: absolute;
        width: 3%;
        aspect-ratio: 1/1;
        border-radius: 50%;
        opacity: 0.6;
        background: linear-gradient(180deg, #fff, #ffe6b3);
        box-shadow: 0 0 3px rgba(255, 255, 200, 0.6);
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0px) rotateY(0deg);
        }
        50% {
            transform: translateY(-15px) rotateY(2deg);
        }
    }

    :root {
        --outer-bg: #e7b89d;
        --outer-bg-2: #b07473;
        --frame-gold: #f4d7b6;
        --inner-top: #5a3b4a;
        --inner-bottom: #2c2333;
        --symbol-light: #ffd580;
        --symbol-dark: #b07c49;
    }
</style>
