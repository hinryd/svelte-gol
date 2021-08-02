<script lang="ts">
    import PlayIcon from './icons/Play.svelte'
    import PauseIcon from './icons/Pause.svelte'
    import ResetIcon from './icons/Reset.svelte'
    import { onMount } from 'svelte'
    import { cellSize, next } from './game'

    let playing = false
    let interval = null
    let cellRadius = cellSize / 2
    let currentGrid = Array.from(
        { length: Math.floor(window.innerHeight / cellSize) },
        () =>
            Array.from(
                { length: Math.floor(window.innerWidth / cellSize) },
                () => Math.round(Math.random()) as 0 | 1
            )
    )
    let canvas: HTMLCanvasElement
    let ctx: CanvasRenderingContext2D
    const offset = (n: number) => n * (cellSize + 2) + cellRadius + 1
    const draw = (ctx: CanvasRenderingContext2D, grid: (0 | 1)[][]) => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        grid.forEach((row, y) => {
            row.forEach((isAlive, x) => {
                const color = isAlive ? 'black' : 'white'
                ctx.fillStyle = color
                ctx.beginPath()
                ctx.arc(offset(x), offset(y), cellRadius, 0, 2 * Math.PI, false)
                ctx.fill()
            })
        })
    }

    const onPlay = () => {
        if (playing) {
            clearInterval(interval)
            playing = false
        } else {
            interval = setInterval(() => {
                currentGrid = next(currentGrid)
                draw(ctx, currentGrid)
            }, 50)
            console.log(interval)
            playing = true
        }
    }

    const onRand = () => {
        if (playing) {
            clearInterval(interval)
            playing = false
        }
        currentGrid = Array.from(
            { length: Math.floor(window.innerHeight / cellSize) },
            () =>
                Array.from(
                    { length: Math.floor(window.innerWidth / cellSize) },
                    () => Math.round(Math.random()) as 0 | 1
                )
        )
        draw(ctx, currentGrid)
    }

    onMount(() => {
        ctx = canvas.getContext('2d')
        onRand()
    })
</script>

<svelte:window on:resize={onRand} />

<div class="absolute flex justify-center bottom-5 w-full">
    <div class="flex border shadow-2xl rounded-xl bg-white">
        <button class="p-7" on:click|preventDefault={onPlay}>
            {#if playing}
                <PauseIcon />
            {:else}
                <PlayIcon />
            {/if}
        </button>
        <button class="p-7" on:click={onRand}><ResetIcon /></button>
    </div>
</div>

<canvas bind:this={canvas} />

<style windi:preflights:global>
</style>
