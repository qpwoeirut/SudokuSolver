const SIZE = 9;
const SQUARE_SIZE = 3;
const UNKNOWN = 0;


class Sudoku {
    grid = [];

    constructor() {
        this.grid = [];
        for (let r = 0; r < SIZE; ++r) {
            this.grid.push([]);
            for (let c = 0; c < SIZE; ++c) {
                const cell = document.querySelector(`input[data-row="${r}"][data-col="${c}"]`);
                const val = parseInt(cell.value) || UNKNOWN;
                this.grid[r].push(val);
            }
        }
    }

    setCell(row, col, val) {
        this.grid[row][col] = val;
        const cell = document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
        cell.value = val === UNKNOWN ? "" : val.toString();
    }

    solve() {
        let possibilities = [];

        const updateCell = (row, col, val, changes) => {
            if (possibilities[row][col].delete(val)) {
                changes.push([row, col, -val]);
                if (possibilities[row][col].size === 1) {
                    let [newVal] = possibilities[row][col];
                    this.setCell(row, col, newVal);
                    changes.push([row, col, newVal]);
                }
            }
        }

        const updateRow = (row, col, val) => {
            let changes = [];
            for (let c = 0; c < SIZE; ++c) {
                if (c !== col) updateCell(row, c, val, changes);
            }
            return changes;
        }
        const updateCol = (row, col, val) => {
            let changes = [];
            for (let r = 0; r < SIZE; ++r) {
                if (r !== row) updateCell(r, col, val, changes);
            }
            return changes;
        }
        const updateSquare = (row, col, val) => {
            let changes = [];
            const squareRow = Math.floor(row / SQUARE_SIZE);
            const squareCol = Math.floor(col / SQUARE_SIZE);
            for (let r = 0; r < SQUARE_SIZE; ++r) {
                for (let c = 0; c < SQUARE_SIZE; ++c) {
                    const cellRow = SQUARE_SIZE * squareRow + r;
                    const cellCol = SQUARE_SIZE * squareCol + c;
                    if (row !== cellRow || col !== cellCol) updateCell(cellRow, cellCol, val, changes);
                }
            }
            return changes;
        }

        const fillLogically = (row, col, val) => {
            let directChanges = [];
            for (let n = 1; n <= SIZE; ++n) {
                if (n !== val && possibilities[row][col].delete(n)) {
                    directChanges.push([row, col, -n]);
                }
            }

            directChanges = directChanges.concat(updateRow(row, col, val)).concat(updateCol(row, col, val)).concat(updateSquare(row, col, val));
            if (!isValid()) return directChanges;

            let allChanges = [];

            for (const change of directChanges) {
                const [row, col, val] = change;
                if (val > 0) {
                    allChanges = allChanges.concat(fillLogically(row, col, val));
                }
            }
            return directChanges.concat(allChanges);
        }

        const findUndeterminedCell = () => {
            for (let r = 0; r < SIZE; ++r) {
                for (let c = 0; c < SIZE; ++c) {
                    if (possibilities[r][c].size > 1) {
                        return [r, c];
                    }
                }
            }
            return [-1, -1];
        }

        const backtrack = (row, col, val) => {
            this.setCell(row, col, val);
            const changes = fillLogically(row, col, val);
            if (!isValid()) {
                for (const change of changes) {
                    const [r, c, v] = change;
                    if (v < 0) {
                        possibilities[r][c].add(-v);
                    } else {
                        this.setCell(r, c, UNKNOWN);
                    }
                }
                return false;
            }

            const [nextRow, nextCol] = findUndeterminedCell();
            if (nextRow === -1) {
                return true;
            }
            for (let n = 1; n <= SIZE; ++n) {
                if (possibilities[nextRow][nextCol].has(n)) {
                    if (backtrack(nextRow, nextCol, n)) {
                        return true;
                    }
                }
            }

            for (const change of changes) {
                const [r, c, v] = change;
                if (v < 0) {
                    possibilities[r][c].add(-v);
                } else {
                    this.setCell(r, c, UNKNOWN);
                }
            }

            this.setCell(row, col, UNKNOWN);
            return false;
        }

        const isValid = () => {
            for (let r = 0; r < SIZE; ++r) {
                for (let c = 0; c < SIZE; ++c) {
                    if (possibilities[r][c].size === 0) {
                        return false;
                    }

                    for (let i = 0; i < SIZE; ++i) {
                        if (i !== r && this.grid[r][c] !== UNKNOWN && this.grid[i][c] !== UNKNOWN &&
                            this.grid[r][c] === this.grid[i][c]) {
                                return false;
                        }
                        if (i !== c && this.grid[r][c] !== UNKNOWN && this.grid[r][i] !== UNKNOWN &&
                            this.grid[r][c] === this.grid[r][i]) {
                                return false;
                        }
                    }
                }
            }
            for (let sqRow = 0; sqRow < SIZE; sqRow += SQUARE_SIZE) {
                for (let sqCol = 0; sqCol < SIZE; sqCol += SQUARE_SIZE) {
                    let used = [];
                    for (let n = 0; n <= SIZE; ++n) used.push(false);
                    for (let r = 0; r < SQUARE_SIZE; ++r) {
                        for (let c = 0; c < SQUARE_SIZE; ++c) {
                            const val = this.grid[sqRow + r][sqCol + c];
                            if (used[val]) {
                                return false;
                            }
                            if (val !== UNKNOWN) used[val] = true;
                        }
                    }
                }
            }
            return true;
        }

        for (let r = 0; r < SIZE; ++r) {
            possibilities.push([]);
            for (let c = 0; c < SIZE; ++c) {
                possibilities[r].push(new Set());
                if (this.grid[r][c] !== UNKNOWN) {
                    possibilities[r][c].add(this.grid[r][c]);
                    // fillLogically(r, c, this.grid[r][c]);
                } else {
                    for (let n = 1; n <= SIZE; ++n) {
                        possibilities[r][c].add(n);
                    }
                }
            }
        }

        if (!isValid()) {
            alert("Board invalid!");
            return;
        }

        const [startRow, startCol] = findUndeterminedCell();
        if (startRow !== -1) {
            for (let n = 1; n <= SIZE; ++n) {
                if (possibilities[startRow][startCol].has(n)) {
                    this.setCell(startRow, startCol, n);
                    if (backtrack(startRow, startCol, n)) {
                        return;
                    }
                }
            }
        }
    }
}