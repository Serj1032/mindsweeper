import { Field } from "./field.js";
import * as sinon from "https://cdnjs.cloudflare.com/ajax/libs/sinon.js/14.0.0/sinon.js";

describe("Пустое поле", function () {

    function clickEmptyCell(w, h, i, j) {
        let f = new Field(w, h, 0);
        let res = f.getCell(0, 0).click();
        assert.isFalse(res); // it is not bomb
        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                let cell = f.getCell(0, 0);
                assert.isTrue(cell.isOpened); // field is opened
                assert.strictEqual(cell.text, "");
            }
        }
    }

    it("Открытие пустой области", function () {
        let w = 5;
        let h = 5;
        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                clickEmptyCell(w, h, i, j);
            }
        }
    });

});

describe("Поле c бомбами", function () {

    function makeField(w, h) {
        let f = new Field(w, h, 0);
        let cell = f.getCell(2, 2);
        cell.has_bomb = true;
        f.calcCells();
        return f;
    }

    it("Проверка Game Over", function () {
        let w = 5;
        let h = 5;
        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                let f = new Field(w, h, w * h);
                assert.isTrue(f.clickCell(i, j), `${i}:${j} должна быть бомба`);

                for (let cell of f.cells()) {
                    assert.isTrue(cell.isOpened, 'все поле должно открываться');
                }
            }
        }
    });

    it("Проверка окружения", function () {
        let w = 5;
        let h = 5;
        let f = makeField(w, h);
        let cell = f.getCell(2, 2);
        for (let neighbour of cell.neighbours) {
            assert.strictEqual(neighbour.text, "1");
        }
    });

    it("Проверка пустого поля", function () {
        let w = 5;
        let h = 5;
        let f = makeField(w, h);
        assert.isFalse(f.getCell(0, 0).click());
        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                let cell = f.getCell(i, j);
                if (!cell.has_bomb)
                    assert.isTrue(cell.isOpened, "должно быть открыто");
                else
                    assert.isFalse(cell.isOpened, `${i}:${j} должно быть закрыто`);
            }
        }
    });

    it("Проверка открытия области", function () {
        let w = 5;
        let h = 5;
        let f = makeField(w, h);

        assert.isFalse(f.getCell(1, 1).click());

        // Проверка открытия 1 поля
        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                let cell = f.getCell(i, j);
                if (i == 1 && j == 1) {
                    assert.isTrue(cell.isOpened, `${i}:${j} должно быть открыто`);
                }
                else {
                    assert.isFalse(cell.isOpened, `${i}:${j} должно быть закрыто`);
                }
            }
        }

        // Пометим бомбу
        f.getCell(2, 2).flagBomb = true;

        // Проверка открытия области
        assert.isFalse(f.getCell(1, 1).click());
        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                let cell = f.getCell(i, j);
                if (!cell.has_bomb)
                    assert.isTrue(cell.isOpened, `${i}:${j} должно быть открыто`);
                else
                    assert.isFalse(cell.isOpened, `${i}:${j} должно быть закрыто`);
            }
        }


    });
});