<script lang="ts">
    import Canvas from './components/Canvas.svelte'
    import Controls from './components/Controls.svelte'
    import { cellSize, grid } from './game'
</script>

<main class="relative">
    <Canvas {cellSize} {grid} />
    <Controls />
</main>

<style windi:preflights:global>
</style>
