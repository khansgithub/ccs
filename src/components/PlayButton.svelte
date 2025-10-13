<script lang="ts">
    const { onclick, text }: { onclick: () => void, text: string } = $props();
</script>

<button class="play-round-btn" {onclick}>
    {text}
    <!-- Sparkles wrapper -->
    <span class="sparkles">
        <span class="sparkle sparkle1"></span>
        <span class="sparkle sparkle2"></span>
        <span class="sparkle sparkle3"></span>
        <span class="sparkle sparkle4"></span>
        <span class="sparkle sparkle5"></span>
        <span class="sparkle sparkle6"></span>
    </span>
</button>

<style>
    .play-round-btn {
        position: relative;
        padding: 0.75rem 1.5rem;
        width: fit-content;
        font-size: 1.125rem;
        font-weight: bold;
        color: var(--color-text);
        background: var(--card-light);
        border: 2px solid var(--border-light);
        border-radius: 9999px;
        box-shadow: 0 4px 10px var(--shadow-light);
        transition: all 0.3s ease;
        cursor: pointer;
        letter-spacing: 0.05em;
        overflow: visible; /* so sparkles outside are visible */
        z-index: 0;
    }

    .play-round-btn::before {
        content: "";
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(
            circle,
            var(--color-gradient-start),
            var(--color-gradient-end)
        );
        opacity: 0;
        transition: opacity 0.4s ease;
        z-index: 0;
    }

    .play-round-btn:hover {
        background: var(--color-hover-bg-light);
        border-color: var(--color-hover-border);
        box-shadow: 0 6px 16px var(--color-shadow-hover);
        color: var(--color-text);
    }

    .play-round-btn:active {
        transform: scale(0.97);
        box-shadow: 0 2px 8px var(--color-shadow);
    }

    /* Sparkles container */
    .sparkles {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 140%;
        height: 140%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        z-index: 2;
    }

    /* Each sparkle */
    .sparkle {
        position: absolute;
        width: 6px;
        height: 6px;
        background: radial-gradient(circle, var(--color-text) 60%, transparent 60%);
        border-radius: 50%;
        filter: drop-shadow(0 0 2px var(--color-text));
        opacity: 0.7;
        animation: twinkle 3s infinite ease-in-out alternate;
    }

    /* Position each sparkle around the button */
    .sparkle1 {
        top: 5%;
        left: 10%;
        animation-delay: 0s;
    }
    .sparkle2 {
        top: 15%;
        right: 15%;
        animation-delay: 0.7s;
    }
    .sparkle3 {
        bottom: 10%;
        right: 20%;
        animation-delay: 1.4s;
    }
    .sparkle4 {
        bottom: 15%;
        left: 25%;
        animation-delay: 2.1s;
    }
    .sparkle5 {
        top: 50%;
        left: 5%;
        animation-delay: 1s;
    }
    .sparkle6 {
        bottom: 5%;
        left: 50%;
        animation-delay: 0.4s;
    }

    @keyframes twinkle {
        0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
            filter: drop-shadow(0 0 1px var(--border-dark));
        }
        50% {
            opacity: 1;
            transform: scale(1.3);
            filter: drop-shadow(0 0 6px var(--border-dark));
        }
    }

    :global(main.dark) {
        .play-round-btn {
            background: var(--card-dark);
            color: var(--text-dark);
            border-color: var(--border-dark);
            box-shadow: 0 4px 10px var(--shadow-dark);
        }

        .play-round-btn:hover {
            background: var(--color-hover-bg-dark);
            border-color: var(--color-dark-border);
            box-shadow: 0 6px 16px var(--color-dark-hover-shadow);
            color: var(--text-dark);
        }

        .sparkle {
            background: radial-gradient(circle, var(--color-gradient-start) 60%, transparent 60%);
            filter: drop-shadow(0 0 3px var(--color-gradient-start));
        }

    @keyframes twinkle {
        0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
            filter: drop-shadow(0 0 1px var(--color-hover-bg-light));
        }
        50% {
            opacity: 1;
            transform: scale(1.3);
            filter: drop-shadow(0 0 6px var(--color-hover-bg-light));
        }
    }
    }
</style>
