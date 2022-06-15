const SIZE = 9;
const UNKNOWN = 0;


function Sudoku() {
    this.grid = [];
    for (let r = 0; r < SIZE; ++r) {
        this.grid.push([]);
        for (let c = 0; c < SIZE; ++c) {
            this.grid[r].push(UNKNOWN);
        }
    }
}
Sudoku.prototype.solve = () => {
    let possibilities = [];

    for (let r = 0; r < SIZE; ++r) {
        possibilities.push([]);
        for (let c = 0; c < SIZE; ++c) {
            possibilities[r].push(new Set());
            for (let n = 1; n <= 9; ++n) {
                possibilities[r][c].add(n);
            }
        }
    }

    let stack = [];
    for (let r = 0; r < SIZE; ++r) {
        for (let c = 0; c < SIZE; ++c) {
            if (this.grid[r][c] !== UNKNOWN) {
                stack.push([r, c, this.grid[r][c]]);
            }
        }
    }

    while (stack.length > 0) {
        let [r, c, val] = stack.pop();

    }
}