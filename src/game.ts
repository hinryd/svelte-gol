import { writable, get } from 'svelte/store'

export let cellSize = writable(7)

export const next = (grid: (0 | 1)[][]) => {
    const combinePositions = ({ y, x }): number[][] =>
        [-1, 0, 1].reduce(
            (acc, _y, _, offset) =>
                offset.reduce(
                    (b, _x) => (_x || _y ? [...b, [y + _y, x + _x]] : b),
                    acc
                ),
            []
        )
    const newKey = (size: number) => (key: number) => {
        if (key === -1) {
            return size - 1
        }
        if (key === size) {
            return 0
        }
        return key
    }
    const newKeys = (size: number, keys: number[]) => keys.map(newKey(size))
    const getIn = grid => (position: number[]) =>
        (([y, x]) => grid[y][x])(newKeys(grid.length, position))

    return grid.map((row, y) =>
        row.map((isAlive, x) => {
            const neighbours = combinePositions({ y, x })
                .map(getIn(grid))
                .filter(Boolean).length

            if (neighbours == 2) {
                return isAlive
            } else if (neighbours == 3) {
                return 1
            } else {
                return 0
            }
        })
    )
}

export const random = () =>
    Array.from({ length: Math.floor(window.innerHeight / get(cellSize)) }, () =>
        Array.from(
            { length: Math.floor(window.innerWidth / get(cellSize)) },
            () => Math.round(Math.random()) as 0 | 1
        )
    )

export const fps = (() => {
    const { subscribe, set, update } = writable(0)
    let times = []
    return {
        subscribe,
        calculate: () => {
            const now = performance.now()
            while (times.length > 0 && times[0] <= now - 1000) {
                times.shift()
            }
            times.push(now)
            set(times.length)
        }
    }
})()
