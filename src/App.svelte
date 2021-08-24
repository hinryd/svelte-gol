<script lang="ts">
    import PlayIcon from './icons/Play.svelte'
    import PauseIcon from './icons/Pause.svelte'
    import ResetIcon from './icons/Reset.svelte'
    import { onMount } from 'svelte'
    import { cellSize, next, random } from './game'

    let playing = false
    let interval = null
    let currentGrid = random()
    let cellRadius = $cellSize / 2
    let canvas: HTMLCanvasElement
    let ctx: CanvasRenderingContext2D
    const offset = (n: number) => n * ($cellSize + 2) + cellRadius + 1
    const draw = (ctx: CanvasRenderingContext2D, grid: (0 | 1)[][]) => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        grid.forEach((row, y) => {
            row.forEach((isAlive, x) => {
                const color = isAlive ? 'gray' : 'white'
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
            }, 25)
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
