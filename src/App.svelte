<script lang="ts">
    import PlayIcon from './icons/Play.svelte'
    import PauseIcon from './icons/Pause.svelte'
    import ResetIcon from './icons/Reset.svelte'
    import { onMount } from 'svelte'
    import { cellSize, random, fps, betterNext } from './game'

    let playing = false
    let interval = null
    let currentGrid = random()
    let cellRadius = $cellSize
    let canvas: HTMLCanvasElement
    let ctx: CanvasRenderingContext2D
    const offset = (n: number) => n * $cellSize
    const draw = (ctx: CanvasRenderingContext2D, grid: boolean[][]) => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        grid.forEach((row, y) => {
            row.forEach((isAlive, x) => {
                const color = isAlive ? 'gray' : 'white'
                ctx.fillStyle = color
                ctx.beginPath()
                ctx.rect(offset(x), offset(y), $cellSize, $cellSize)
                ctx.fill()
            })
        })
        fps.calculate()
    }
    const onPlay = () => {
        if (playing) {
            clearInterval(interval)
            playing = false
        } else {
            interval = setInterval(() => {
                currentGrid = betterNext(currentGrid)
                draw(ctx, currentGrid)
            }, 100)
            playing = true
        }
    }
    const onRand = () => {
        if (playing) {
            clearInterval(interval)
            playing = false
        }
        currentGrid = random()
        draw(ctx, currentGrid)
    }

    onMount(() => {
        ctx = canvas.getContext('2d')
        onRand()
    })
</script>

<svelte:window on:resize={onRand} />

<!-- <h1 class="absolute top-0 left-0 text-2xl bg-white font-bold">{$fps}</h1> -->

<div class="absolute flex justify-center bottom-5 w-full">
    <div class="flex border shadow-2xl rounded-xl bg-white">
        {#if playing}
            <button
                class="p-4 text-blue-500 outline-none"
                on:click|preventDefault={onPlay}
            >
                <PauseIcon />
            </button>
        {:else}
            <button
                class="p-4 text-red-600 outline-none"
                on:click|preventDefault={onPlay}
            >
                <PlayIcon />
            </button>
        {/if}
        <button class="p-4 outline-none" on:click|preventDefault={onRand}>
            <ResetIcon />
        </button>
        <input
            class="m-4 w-24"
            type="range"
            min="1"
            max="10"
            bind:value={$cellSize}
            on:change={onRand}
        />
    </div>
</div>

<canvas bind:this={canvas} />

<style windi:preflights:global>
</style>
