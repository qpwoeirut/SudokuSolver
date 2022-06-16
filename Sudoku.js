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
    let stack = [];
    let used = [];

    for (let r = 0; r < SIZE; ++r) {
        possibilities.push([]);
        used.push([]);
        for (let c = 0; c < SIZE; ++c) {
            possibilities[r].push(new Set());
            if (this.grid[r][c] !== UNKNOWN) {
                stack.push([r, c, this.grid[r][c]]);
                possibilities[r][c].add(this.grid[r][c]);
                used[r][c] = true;
            } else {
                for (let n = 1; n <= 9; ++n) {
                    possibilities[r][c].add(n);
                }
                used[r][c] = false;
            }
        }
    }

    while (stack.length > 0) {
        let [r, c, val] = stack.pop();
        for (let i = 0; i < SIZE; ++i) {
            if (i !== r) {
                possibilities[i][c].delete(val);
                if (possibilities[i][c].size === 1 && used[i][c] === false) {
                    used[i][c] = true;
                    let [only_val] = possibilities[i][c];
                    this.grid[i][c] = only_val;
                    stack.push([i, c, only_val]);
                }
            }
            if (i !== c) {
                possibilities[r][i].delete(val);
                if (possibilities[r][i].size === 1 && used[r][i] === false) {
                    used[r][i] = true;
                    let [only_val] = possibilities[r][i];
                    this.grid[r][i] = only_val;
                    stack.push([r, i, only_val]);
                }
            }
        }
    }
}