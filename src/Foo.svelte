<script lang="ts">
    // const { bar } = $props(); <- will break the update
    let foo = false; // <- doesn't need $state to work
    function foo_f() {
        foo = !foo;
    }
</script>

<main class:foo={foo}>
    <button onclick={foo_f}>
        {foo ? "foo" : "bar"}
    </button>
</main>
