<script lang="ts">
    import logger from "../core/logger";
    import type { Card } from "../core/types";
    import { picked_card, game_over } from "../store/store";
    const {
        card,
        disable_click,
    }: { card: Card; disable_click: () => boolean } = $props();

    var selected = $state(false);

    export function toggleSelected(e: MouseEvent) {
        e.preventDefault();
        if ($game_over) return;
        // if (disable_click() && !selected) return;
        selected = !selected;
        logger.info(`Selected card ${selected ? "✅" : "❎"}`);
        logger.info(`Card: ${selected ? card.name : "none"}`);
        picked_card.set(
            selected ? card : null,
        );
    }

    picked_card.subscribe((picked_card) => {
        if (selected) {
            /*
            deselect this card when:
                - the round resets (and picked_card is set to null)
                - another card is picked (and picked_card is a different value)
            */
            if (picked_card === null || picked_card !== card) {
                selected = false;
            }
        }
    });
</script>

<div class="card-wrapper" class:selected>
    <button onclick={toggleSelected} title="select card">
        <div class="card">
            <p class="card_name">{card.name}</p>
            <div id="card_stats">
                <h2>stats</h2>
                {#each Object.entries(card.stats) as stat}
                    <p>{stat[1].stat} - {stat[1].value}</p>
                {/each}
            </div>
        </div>
    </button>
</div>

<style>
    .card-wrapper {
        /* Apply the float animation on the wrapper */
        animation: float 4s ease-in-out infinite;
        display: inline-block; /* shrink-wrap */
        position: relative;
    }

    .card-wrapper > button {
        all: unset;
        width: 100%;
        height: 100%;
    }

    .card {
        flex: 0 0 auto;
        aspect-ratio: 7 / 10;
        height: 100%;
        background: var(--card-light);
        border-radius: 16px;
        border: 2px solid var(--border-light);
        box-shadow: 0 4px 10px var(--shadow-light);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--text-light);
        font-weight: bold;
        position: relative;
        pointer-events: none;
        transition:
            transform 0.4s ease,
            box-shadow 0.4s ease,
            filter 0.4s ease,
            background 0.5s ease,
            border 0.5s ease;

        z-index: -1000;
        transform: scale(1) rotateZ(0deg);
    }

    .card-wrapper.selected .card {
        transform: scale(1.2) rotateZ(-1.5deg);
        filter: brightness(1.2);
        border-color: var(--border-light-counter) !important;
    }

    .card-wrapper:hover .card {
        transform: scale(1.2) rotateZ(-1.5deg);
        filter: brightness(1.05);
        box-shadow:
            0 0 15px var(--color-shadow),
            0 0 25px var(--border-light),
            0 0 40px var(--shadow-light);
    }

    .card-wrapper.selected .card {
        box-shadow: 0 0 15px var(--color-shadow) !important;
    }

    .card-wrapper:active .card,
    .card-wrapper.selected:active .card {
        transform: scale(1.3) rotateZ(-1.5deg);
        filter: brightness(1.15);
        box-shadow:
            0 0 15px var(--color-shadow),
            0 0 25px var(--border-light),
            0 0 40px var(--shadow-light);
    }

    .card::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(
            circle at 30% 30%,
            rgba(255, 255, 255, 0.4),
            transparent 60%
        );
        opacity: 0;
        border-radius: inherit;
        transition: opacity 0.4s ease;
        pointer-events: none;
    }

    .card-wrapper:hover .card::before {
        opacity: 1;
        animation: sparkle 3s infinite ease-in-out;
    }

    :global(main.dark) {
        .card-wrapper .card {
            background: var(--card-dark);
            border-color: var(--border-dark);
            color: var(--text-dark);
            box-shadow: 0 4px 10px var(--shadow-dark);
        }

        .card-wrapper:hover .card {
            box-shadow:
                0 0 15px var(--color-dark-box-shadow),
                0 0 25px var(--border-dark),
                0 0 40px var(--shadow-dark);
        }

        .card-wrapper.selected .card {
            border-color: var(--border-dark-counter) !important;
        }
    }

    @keyframes sparkle {
        0%,
        100% {
            transform: scale(1);
            opacity: 0.3;
        }
        50% {
            transform: scale(1.05);
            opacity: 0.6;
        }
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
</style>
