<script lang="ts">
    type LeftRight = "left" | "right";

    interface Props {
        carousel: HTMLDivElement;
        direction: LeftRight;
    }

    let { carousel, direction }: Props = $props();
    const left_right: Record<LeftRight, any> = {
        left: {
            scroll: -150,
            svg: "15 18 9 12 15 6",
        },
        right: {
            scroll: 150,
            svg: "9 6 15 12 9 18",
        },
    };

    function scroll() {
        carousel.scrollBy({
            left: left_right[direction].scroll,
            behavior: "smooth",
        });
    }
</script>

<button
    class="nav {direction}"
    onclick={scroll}
    aria-label="Scroll {direction}"
>
    <svg
        width="24"
        height="24"
        viewBox="0 0 20 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <polyline points={left_right[direction].svg} />
    </svg>
</button>

<style>
    .nav {
        background: linear-gradient(
            to bottom right,
            var(--color-gradient-start),
            var(--color-gradient-end)
        );
        border: none;
        font-size: 2rem;
        cursor: pointer;
        height: 50px;
        width: 50px;
        border-radius: 50%;
        color: var(--color-text);
        box-shadow: 0 0 12px var(--shadow-light);
        transition:
            transform 0.2s ease,
            box-shadow 0.3s ease;
        z-index: 10;
    }

    .nav:hover {
        transform: scale(1.1);
        box-shadow: 0 0 20px var(--shadow-light);
    }

    .nav.left,
    .nav.right {
        top: 50%;
        background: var(--color-bg-light);
        border: 1.5px solid var(--border-light);
        border-radius: 50%;
        padding: 8px;
        cursor: pointer;
        box-shadow: 0 2px 6px var(--color-shadow-white);
        transition:
            background-color 0.2s,
            border-color 0.2s,
            box-shadow 0.2s;
    }

    .nav.left {
        position: absolute;
        left: 2%;
        transform: translateY(-50%);
    }

    .nav.right {
        position: absolute;
        right: 2%;
        transform: translateY(-50%);
    }

    .nav.left:hover,
    .nav.right:hover {
        background-color: var(--color-hover-bg-light);
        border-color: var(--color-hover-border);
        box-shadow: 0 4px 10px var(--color-hover-shadow);
    }

    .nav.left svg {
        display: block;
    }

    :global(main.dark) {
        .nav.left:hover,
        .nav.right:hover {
            background-color: var(--color-hover-bg-dark);
            border-color: var(--color-hover-border);
            box-shadow: 0 4px 10px var(--color-dark-hover-shadow);
        }

        .nav.left,
        .nav.right {
            background: var(--color-dark-bg);
            border: 1.5px solid var(--border-dark);
            box-shadow: 0 2px 6px var(--color-dark-shadow);
        }

        .nav {
            background: linear-gradient(
                to bottom right,
                var(--color-dark-gradient-start),
                var(--color-dark-gradient-end)
            );
            color: var(--text-dark);
            box-shadow: 0 0 12px var(--color-dark-box-shadow);
        }
    }
</style>
