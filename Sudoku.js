const SIZE = 9;
const UNKNOWN = 0;


class Sudoku {
    grid = [];
    updateGrid = false;

    constructor() {
        for (let r = 0; r < SIZE; ++r) {
            this.grid.push([]);
            for (let c = 0; c < SIZE; ++c) {
                this.grid[r].push(UNKNOWN);
            }
        }
    }

    loadGrid() {
        this.updateGrid = true;
        this.grid = [];
        for (let r = 0; r < SIZE; ++r) {
            this.grid.push([]);
            for (let c = 0; c < SIZE; ++c) {
                const cell = document.querySelector(`input[data-row="${r}"][data-col="${c}"]`)
                const val = parseInt(cell.value) || UNKNOWN;
                this.grid[r].push(val);
            }
        }
    }

    solve() {
        let possibilities = [];

        const useCell = (row, col) => {
            let [val] = possibilities[row][col];
            this.grid[row][col] = val;
            if (this.updateGrid) {
                const cellElem = document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
                cellElem.value = val.toString();
            }
        }

        const findUndeterminedCell = () => {
            for (let r = 0; r < SIZE; ++r) {

            }
        }

        const updateCell = (row, col, val) => {
            if (possibilities[row][col].delete(val)) {
                if (possibilities[row][col].size === 1) {
                    useCell(row, col);
                }
                return true;
            }
            return false;
        }

        const updateRow = (row, col, val) => {
            let changes = [];
            for (let c = 0; c < SIZE; ++c) {
                if (c !== col && updateCell(row, c, val)) {
                    changes.push([row, c, val]);
                }
            }
            return changes;
        }
        const updateCol = (row, col, val) => {
            let changes = [];
            for (let r = 0; r < SIZE; ++r) {
                if (r !== row && updateCell(r, col, val)) {
                    changes.push([r, col, val]);
                }
            }
            return changes;
        }
        const updateSquare = (row, col, val) => {
            let changes = [];
            const squareRow = Math.floor(row / 3);
            const squareCol = Math.floor(row / 3);
            for (let r = 0; r < 3; ++r) {
                for (let c = 0; c < 3; ++c) {
                    const cellRow = 3 * squareRow + r;
                    const cellCol = 3 * squareCol + c;
                    if (row !== cellRow || col !== cellCol) {
                        if (possibilities[cellRow][col].delete(val)) {
                            changes.push([cellRow, col, val]);
                            if (possibilities[cellRow][col].size === 1) {
                                useCell(r, col);
                            }
                        }
                    }
                }
            }
            return changes;
        }

        const backtrack = (row, col, val) => {
            let changes = [];
            for (let n = 1; n <= SIZE; ++n) {
                if (n !== val && possibilities[row][col].delete(n)) {
                    changes.push([row, col, n]);
                }
            }
            changes = changes.concat(updateRow(row, col, val)).concat(updateCol(row, col, val)).concat(updateSquare(row, col, val));
        }

        for (let r = 0; r < SIZE; ++r) {
            possibilities.push([]);
            for (let c = 0; c < SIZE; ++c) {
                possibilities[r].push(new Set());
                if (this.grid[r][c] !== UNKNOWN) {
                    possibilities[r][c].add(this.grid[r][c]);
                    updateRow(r, c, this.grid[r][c]);
                    updateCol(r, c, this.grid[r][c]);
                    updateSquare(r, c, this.grid[r][c]);
                } else {
                    for (let n = 1; n <= SIZE; ++n) {
                        possibilities[r][c].add(n);
                    }
                }
            }
        }
    }
}