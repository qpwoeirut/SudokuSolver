const container = document.getElementById("sudokuContainer");
for (let r = 0; r < SIZE; ++r) {
    for (let c = 0; c < SIZE; ++c) {
        const cell = document.createElement("div");
        cell.classList.add("sudoku-cell");

        if (r % 3 === 0) cell.classList.add("bold-top");
        else if (r % 3 === 2) cell.classList.add("bold-bottom");

        if (c % 3 === 0) cell.classList.add("bold-left");
        else if (c % 3 === 2) cell.classList.add("bold-right");

        const input = document.createElement("input");
        input.setAttribute("data-row", r.toString());
        input.setAttribute("data-col", c.toString());
        input.type = "number";
        input.min = "1";
        input.max = "9";
        input.oninput = () => {  // prevent multiple digits from being entered
            while (input.value > SIZE) input.value = Math.floor(parseInt(input.value) / 10).toString();
            input.classList.remove("blue");
        }
        cell.appendChild(input);
        container.appendChild(cell);
    }
}

const solveSudoku = () => {
    const sudoku = new Sudoku();
    sudoku.solve();
}
const clearGrid = () => {
    document.querySelectorAll(".sudoku-cell > input").forEach((elem) => {
        elem.value = "";
    })
}