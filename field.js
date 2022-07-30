import { Cell } from "./cell.js";

let field = document.getElementById("field");

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    //Максимум не включается, минимум включается
    return Math.floor(Math.random() * (max - min)) + min;
}


export class Field {
    constructor(width, height, bombAmount) {
        this._width = width;
        this._height = height;
        this._cells = new Array();
        this._bombAmount = bombAmount

        if (field) {
            field.width = this._width * (Cell.width + Cell.margin) + Cell.offset;
            field.height = this._height * (Cell.height + Cell.margin) + Cell.offset;
        }
        // Create field
        for (let i = 0; i < this._width; i++) {
            this._cells.push(new Array());
            for (let j = 0; j < this._height; j++) {
                this._cells[i].push(new Cell(i, j));
            }
        }

        // Infill neighbours for cell
        for (let i = 0; i < this._width; i++) {
            for (let j = 0; j < this._height; j++) {
                let cell = this._cells[i][j];

                for (let ii = Math.max(0, i - 1); ii <= Math.min(this._width - 1, i + 1); ii++) {
                    for (let jj = Math.max(0, j - 1); jj <= Math.min(this._height - 1, j + 1); jj++) {
                        if (i == ii && j == jj) continue;
                        cell.neighbours.push(this._cells[ii][jj]);
                    }
                }
            }
        }

        this.setBombs(this._bombAmount);
        this.calcCells();
    }

    get bombAmount() {
        return this._bombAmount;
    }

    get flagAmount() {
        let flagAmount = 0;
        for (let cell of this.cells()) {
            flagAmount += cell.flagBomb ? 1 : 0;
        }
        return flagAmount;
    }

    checkWin() {
        let flagedBomb = 0;
        for (let cell of this.cells()) {
            if (!cell.isOpened && !cell.flagBomb) {
                return false;
            }
            if (cell.isOpened && cell.has_bomb) {
                return false;
            }

            flagedBomb += cell.has_bomb ? 1 : 0;
        }

        if (flagedBomb == this.bombAmount)
            alert("You win!");
    }

    * cells() {
        for (let cell_row of this._cells) {
            for (let cell of cell_row) {
                yield cell;
            }
        }
    }

    getCell(i, j) {
        if (i < 0 || i >= this._width) {
            console.log(`${i} is outer of heigh ${this._height}`);
            return;
        }
        if (j < 0 || j >= this._height) {
            console.log(`${j} is outer of width ${this._width}`);
            return;
        }

        return this._cells[i][j];
    }

    redraw() {
        for (let cells_raw of this._cells) {
            for (let cell of cells_raw) {
                cell.redraw();
            }
        }
    }

    openField() {
        for (let cell of this.cells()) {
            if (cell.flagBomb || cell.isOpened)
                continue;
            cell._is_opened = true;
            cell.redraw();
        }
    }

    clickField(x, y) {
        let [i, j] = Cell.getCellNumber(x, y);
        return this.clickCell(i, j);
    }

    clickCell(i, j) {
        let game_over = false;
        if (i < this._width && j < this._height) {
            game_over ||= this.getCell(i, j).click();
            if (game_over) {
                this.openField();
            }
        }

        this.checkWin();

        return game_over;
    }

    flagField(x, y) {
        let [i, j] = Cell.getCellNumber(x, y);
        this.getCell(i, j).flagBomb = !this.getCell(i, j).flagBomb;
        this.checkWin();
    }

    getRandomBombs(from, to, n) {
        let bombs = [];
        while (bombs.length < n) {
            let i = getRandomInt(from, to);
            if (!bombs.includes(i)) {
                bombs.push(i);
            }
        }
        return bombs;
    }

    setBombs(n) {
        if (n > this._height * this._width) {
            console.log(`Bomb amount could not be more than ${this._height * this._width}`);
            n = this._height * this._width;
        }

        let bombs = this.getRandomBombs(0, this._height * this._width, n);
        // console.log(bombs);
        for (let i of bombs) {
            // console.log(`Bomb ${i} in ${Math.floor(i / this._width)}:${i % this._width}`);
            this._cells[i % this._width][Math.floor(i / this._width)].has_bomb = true;
        }
    }

    calcCells() {
        for (let i = 0; i < this._width; i++) {
            for (let j = 0; j < this._height; j++) {
                if (this._cells[i][j].has_bomb) continue;

                let b = 0;
                // console.log(`Check cell ${i}:${j}`);
                for (let ii = Math.max(0, i - 1); ii <= Math.min(this._width - 1, i + 1); ii++) {
                    for (let jj = Math.max(0, j - 1); jj <= Math.min(this._height - 1, j + 1); jj++) {
                        if (i == ii && j == jj) continue;
                        // console.log(`\ttest bomb in  ${ii}:${jj}`);
                        b += this._cells[ii][jj].has_bomb ? 1 : 0;
                    }
                }
                this._cells[i][j].text = b > 0 ? b.toString() : "";
            }
        }
    }
}
