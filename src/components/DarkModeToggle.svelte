<script lang="ts">
   interface Props {
        darkMode: boolean;
    }

    let { darkMode = $bindable() } = $props();

    function toggleDarkMode() {
        darkMode = !darkMode;
        localStorage.setItem("magical-dark-mode", String(darkMode));
    }
</script>

<button class="dark-toggle" onclick={toggleDarkMode}>
    {darkMode ? "☀️ Light" : "🌙 Dark"}
</button>

<style>
    .dark-toggle {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(255, 255, 255, 0.3);
        border: none;
        border-radius: 20px;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        color: var(--color-text);
        cursor: pointer;
        box-shadow: 0 0 10px var(--color-shadow);
        backdrop-filter: blur(5px);
        transition:
            background 0.3s ease,
            transform 0.2s ease;
    }
    .dark-toggle:hover {
        transform: scale(1.05);
    }

    :global(main.dark) {
        .dark-toggle {
            background: rgba(0, 0, 0, 0.3);
            color: var(--text-dark);
            box-shadow: 0 0 10px var(--color-dark-box-shadow);
        }
    }
</style>
