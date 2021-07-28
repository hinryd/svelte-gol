export const cellSize = 25

export const grid = []

const getGrid = (size, width, height) => {
    const cols = Math.floor(width / size)
    const rows = Math.floor(height / size)
    return {
        grid: Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => Math.round(Math.random()))
        ),
        rows,
        cols
    }
}