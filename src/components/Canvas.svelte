<script lang="ts">
    import { onMount } from 'svelte'

    export let cellSize
    export let grid

    let canvas: HTMLCanvasElement
    let ctx: CanvasRenderingContext2D
    let cellRadius = cellSize / 2

    onMount(() => {
        ctx = canvas.getContext('2d')
        draw(ctx, grid)
    })

    const offset = (n: number) => n * (cellSize + 2) + cellRadius + 1

    const draw = (ctx: CanvasRenderingContext2D, grid: boolean[][]) => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        grid.forEach((row, y) => {
            row.forEach((isAlive, x) => {
                const color = isAlive ? 'black' : 'yellow'
                ctx.fillStyle = color
                ctx.beginPath()
                ctx.arc(offset(x), offset(y), cellRadius, 0, 2 * Math.PI, false)
                ctx.fill()
            })
        })
    }
</script>

<svelte:window on:resize={e => draw(ctx, grid)} />
<canvas bind:this={canvas} />
