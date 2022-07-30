let field = document.getElementById("field");
let ctx;
if (field) {
    ctx = field.getContext("2d");
}

export class Cell {
    static width = 20;
    static height = 20;
    static margin = 5;
    static offset = 5;

    constructor(x, y) {
        this._x = x;
        this._y = y;
        this._flagBomb = false;
        this._is_opened = false;

        this.text = "";
        this.has_bomb = false;
        this.neighbours = [];

        this.redraw()
    }

    set flagBomb(flag) {
        if (this.isOpened) return;
        this._flagBomb = flag;
        this.redraw();
    }

    get flagBomb() {
        return this._flagBomb;
    }

    get isOpened() {
        return this._is_opened;
    }

    toString() {
        return `${this._x}:${this._y} opend:${this.isOpened} bomb:${this.has_bomb}`;
    }

    click() {
        if (this.flagBomb) {
            return false;
        }

        let game_over = false;
        if (this.isOpened) {
            if (this.text === "") {
                // do nothing
            }
            else {
                let expectedBomb = +this.text;
                let flagedBomb = 0;
                for (let neighbour of this.neighbours) {
                    flagedBomb += neighbour.flagBomb;
                }
                if (flagedBomb == expectedBomb) {
                    for (let neighbour of this.neighbours) {
                        if (neighbour.text === "")
                            game_over ||= neighbour.click();
                        else
                            game_over ||= neighbour.#openCell();
                    }
                }
            }
        }
        else {
            game_over ||= this.#openCell();

            if (this.text === "") {
                for (let neighbour of this.neighbours) {
                    game_over ||= neighbour.click();
                }
            }
        }

        return game_over;
    }

    #openCell() {
        let res = false;
        if (!this.isOpened && !this.flagBomb) {
            res ||= this.has_bomb;
            this._is_opened = true;
            this.redraw();
        }
        return res;
    }

    redraw() {
        this.#clear();
        this.#draw();
    }

    static getCellNumber(x, y) {
        let cell_i = Math.floor((x - Cell.offset) / (Cell.width + Cell.margin));
        let cell_j = Math.floor((y - Cell.offset) / (Cell.height + Cell.margin));
        return [cell_i, cell_j]
    }

    #draw() {
        if (!ctx) return;
        // Draw cell
        if (this.isOpened) {
            ctx.fillStyle = 'rgba(0,0,0,0)';
        }
        else {
            if (this.flagBomb) {
                ctx.fillStyle = 'rgba(200,0,0,0.5)';
            }
            else {
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
            }
        }

        ctx.fillRect(
            Cell.offset + this._x * (Cell.width + Cell.margin),
            Cell.offset + this._y * (Cell.height + Cell.margin),
            Cell.width,
            Cell.height
        );
        // }

        // Draw bomb amount
        if (this.isOpened) {
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillText(this.has_bomb ? 'X' : this.text,
                Cell.offset + this._x * (Cell.width + Cell.margin) + 1 * Cell.width / 3,
                Cell.offset + this._y * (Cell.height + Cell.margin) + 2 * Cell.height / 3,
            );
        }
    }

    #clear() {
        if (!ctx) return;

        ctx.clearRect(
            Cell.offset + this._x * (Cell.width + Cell.margin),
            Cell.offset + this._y * (Cell.height + Cell.margin),
            Cell.width,
            Cell.height
        );
    }
}