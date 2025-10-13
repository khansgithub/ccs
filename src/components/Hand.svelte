<script lang="ts">
    import Card from "./Card.svelte";
    import Nav from "./Nav.svelte";
    import { player_cards_store } from "../store/store";
    import logger from "../core/logger";
    import { type Player } from "../core/types";
    // let cards = Array.from({ length: 50 }, (_, i) => `Card ${i + 1}`);
    const props: {player: Player} = $props();
    let carousel: HTMLDivElement = $state();
    let content: HTMLDivElement;

    let scrollLeft = 0;
    let isDragging = false;
    let dragStartX = 0;
    let scrollStartLeft = 0;

    function clamp(value: number, min: number, max: number) {
        return Math.min(Math.max(value, min), max);
    }

    function updateScroll(newScrollLeft: number) {
        scrollLeft = clamp(
            newScrollLeft,
            0,
            content.scrollWidth - carousel.clientWidth,
        );
        if (scrollLeft < 0) return;
        content.style.transform = `translateX(${-scrollLeft}px)`;
    }

    // Wheel handler for horizontal scroll
    function onWheel(event: WheelEvent) {
        event.preventDefault();
        updateScroll(scrollLeft + event.deltaY);
    }

    // Mouse drag handlers
    function onMouseDown(event: MouseEvent) {
        isDragging = true;
        dragStartX = event.clientX;
        scrollStartLeft = scrollLeft;
        carousel.style.cursor = "grabbing";
        carousel.style.userSelect = "none";
    }

    function onMouseUp() {
        isDragging = false;
        carousel.style.cursor = "grab";
        carousel.style.userSelect = "auto";
    }

    function onMouseMove(event: MouseEvent) {
        if (!isDragging) return;
        const delta = event.clientX - dragStartX;
        updateScroll(scrollStartLeft - delta);
    }

    /**
     * This function limits how many cards the player can select.
     */
    function disable_click(){
        return $player_cards_store !== null;
    }
</script>

<Nav {carousel} direction="left" />
<Nav {carousel} direction="right" />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="row-wrapper">
    <div class="col col-1">
        <div class="cover"></div>
    </div>
    <div class="col col-2">
        <div
            class="hand"
            bind:this={carousel}
            onwheel={onWheel}
            onmousedown={onMouseDown}
            onmouseup={onMouseUp}
            onmouseleave={onMouseUp}
            onmousemove={onMouseMove}
        >
            <div class="hand-cards" bind:this={content}>
                {#each Object.values($player_cards_store[0].cards) as card} 
                    <Card card={card} disable_click={disable_click}/>
                {/each}
            </div>
        </div>
    </div>
    <div class="col col-3"></div>
</div>

<style>
    .row-wrapper {
        display: flex;
        width: 100%;
        height: 50%;
        position: relative;
    }
    .col {
        overflow: visible;
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }
    .col-1 {
        flex: 0 0 10%;
    }
    .col-2 {
        flex: 0 0 80%;
        max-width: 80%;
        min-width: 80%;
    }
    .col-3 {
        flex: 0 0 10%;
    }
    .hand {
        /* overflow: hidden; */
        display: flex;
        width: 100%; /* now fills the 80% container */
        height: 50%; /* fills 240px height from wrapper */
        max-height: 500px;
        min-height: 240px;
        align-self: flex-end;
        padding: 1rem;
        z-index: 0;
        position: relative; /* changed from absolute */

        border-radius: 16px;
        background: var(--card-light);
        box-shadow: 0 0 40px var(--shadow-light);
        border: 2px solid var(--color-shadow-white);
        backdrop-filter: blur(8px);
        transition:
            background 0.5s ease,
            box-shadow 0.5s ease;
    }

    .cover {
        /* width: 50%; */
        /* height: 100%; */
        /* z-index: 100; */
        /* position: absolute; */
        /* top: 1%; */
        /* left: -10px; */
        filter: blur(10px);
        display: flex;
        z-index: 100;
        left: 0;
        align-self: flex-end;

        width: 100%;
        height: 50%;
        max-height: 500px;
        min-height: 240px;
        padding: 1rem;
        margin-bottom: 10px;
        margin-right: 25%;
        margin-left: -25%;

        background: black;
        border: 2px solid black;
    }

    .hand-cards {
        display: flex;
        gap: 3rem;
    }

    :global(main.dark) {
        .hand {
            background: var(--card-dark);
            box-shadow: 0 0 30px var(--shadow-dark);
            border: 2px solid var(--border-dark-gray);
        }
    }
</style>
