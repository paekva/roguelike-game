let Tile = require("./Tile");

class MapGenerator {

    constructor() {
        this.bigSquareModules = [
            [
                ["W", " ", " ", " ", "W", "W", "W"],
                ["W", " ", " ", " ", " ", "W", "W"],
                ["W", "W", " ", " ", " ", " ", "W"],
                [" ", " ", " ", " ", " ", " ", " "],
                [" ", " ", " ", " ", " ", " ", " "],
                [" ", " ", "W", " ", " ", " ", " "],
                [" ", "W", "W", " ", "W", "W", " "]
            ],

            [
                ["W", "W", "W", " ", " ", " ", "W"],
                ["W", "W", "W", " ", " ", " ", " "],
                ["W", " ", "W", " ", " ", " ", " "],
                [" ", " ", " ", " ", " ", " ", " "],
                ["W", "W", "W", " ", "W", "W", " "],
                ["W", "W", " ", " ", "W", "W", " "],
                ["W", " ", " ", " ", " ", " ", " "]
            ],

            [
                ["W", " ", " ", " ", " ", " ", "W"],
                [" ", "W", " ", " ", " ", "W", " "],
                [" ", " ", " ", "W", " ", " ", " "],
                [" ", " ", "W", "W", "W", " ", " "],
                [" ", " ", " ", "W", " ", " ", " "],
                [" ", "W", " ", " ", " ", "W", " "],
                ["W", " ", " ", " ", " ", " ", "W"]
            ],

            [
                ["W", "W", "W", " ", "W", "W", "W"],
                ["W", "W", "W", " ", "W", "W", "W"],
                ["W", "W", " ", " ", " ", "W", "W"],
                [" ", " ", " ", " ", " ", " ", " "],
                ["W", "W", " ", " ", " ", "W", "W"],
                ["W", "W", "W", " ", "W", "W", "W"],
                ["W", "W", "W", " ", "W", "W", "W"]
            ],

            [
                ["W", "W", " ", " ", " ", " ", "W"],
                [" ", "W", " ", " ", " ", "W", " "],
                [" ", "W", " ", " ", "W", " ", " "],
                [" ", " ", " ", " ", " ", " ", " "],
                [" ", " ", "W", " ", " ", " ", " "],
                [" ", "W", "W", " ", " ", "W", "W"],
                ["W", "W", " ", " ", "W", "W", "W"]
            ],

            [
                ["W", "W", "W", " ", " ", " ", " "],
                [" ", "W", "W", " ", " ", "W", " "],
                [" ", " ", "W", " ", " ", " ", " "],
                [" ", " ", " ", " ", " ", " ", " "],
                [" ", " ", "W", " ", " ", "W", " "],
                [" ", "W", "W", " ", "W", "W", "W"],
                ["W", "W", "W", " ", " ", "W", "W"]
            ],

            [
                ["W", "W", " ", " ", " ", " ", " "],
                ["W", "W", "W", " ", "W", " ", " "],
                ["W", "W", "W", "W", " ", " ", " "],
                [" ", " ", "W", "W", "W", " ", " "],
                [" ", "W", " ", " ", "W", " ", " "],
                [" ", " ", " ", " ", "W", " ", " "],
                [" ", " ", " ", " ", " ", " ", " "]
            ],

            [
                [" ", " ", " ", " ", " ", " ", " "],
                [" ", "W", "W", "W", "W", "W", " "],
                [" ", "W", "W", "W", "W", "W", " "],
                [" ", "W", "W", "W", "W", "W", " "],
                [" ", "W", "W", "W", "W", "W", " "],
                [" ", "W", "W", "W", "W", "W", " "],
                [" ", " ", " ", " ", " ", " ", " "]
            ],

            [
                ["W", "W", "W", " ", " ", " ", " "],
                ["W", "W", " ", " ", "W", "W", " "],
                [" ", "W", " ", " ", "W", " ", " "],
                [" ", " ", "W", " ", "W", " ", " "],
                [" ", " ", "W", "W", "W", " ", "W"],
                [" ", "W", "W", " ", " ", " ", "W"],
                [" ", " ", " ", " ", " ", "W", "W"]
            ],

            [
                ["W", " ", "W", " ", " ", "W", "W"],
                ["W", " ", "W", " ", "W", "W", "W"],
                [" ", " ", "W", " ", "W", "W", " "],
                [" ", " ", " ", " ", " ", " ", " "],
                [" ", "W", " ", " ", "W", " ", " "],
                ["W", "W", "W", " ", " ", " ", "W"],
                ["W", "W", "W", " ", " ", "W", "W"]
            ]
        ];

        this.generateMap = function() {
            let battlefield = [];
            let battlefield_X = 25;
            let battlefield_Y = 25;
            let modules = [];
            for (let i = 0; i < 9; i++) {
                modules.push(Array.from(this.bigSquareModules[Math.floor(Math.random() * this.bigSquareModules.length)]));
                for (let j = 0; j < this.getRandomInt(4); j++) {
                    this.rotateMatrix(modules[i]);
                }
            }
            for (let i = 0; i < battlefield_X; i++) {
                battlefield.push([]);
                for (let j = 0; j < battlefield_Y; j++) {
                    if (i === 0 || j === 0 || i === 24 || j === 24 ||
                        ((i === 8 || i === 16) && j !== 4 && j !== 12 && j !== 20) ||
                        ((j === 8 || j === 16) && i !== 4 && i !== 12 && i !== 20)) {
                        battlefield[i].push(Tile.new(i, j, 'house', 1, false, []));
                    } else if (i > 0 && i < 8 && j > 0 && j < 8) {
                        if (modules[0][i - 1][j - 1] === " ") {
                            battlefield[i].push(Tile.new(i, j, 'desert', 1, true, []));
                        } else {
                            battlefield[i].push(Tile.new(i, j, 'house', 1, false, []));
                        }
                    } else if (i > 8 && i < 16 && j > 0 && j < 8) {
                        if (modules[1][i - 9][j - 1] === " ") {
                            battlefield[i].push(Tile.new(i, j, 'desert', 1, true, []));
                        } else {
                            battlefield[i].push(Tile.new(i, j, 'house', 1, false, []));
                        }
                    } else if (i > 16 && i < 24 && j > 0 && j < 8) {
                        if (modules[2][i - 17][j - 1] === " ") {
                            battlefield[i].push(Tile.new(i, j, 'desert', 1, true, []));
                        } else {
                            battlefield[i].push(Tile.new(i, j, 'house', 1, false, []));
                        }
                    } else if (i > 0 && i < 8 && j > 8 && j < 16) {
                        if (modules[3][i - 1][j - 9] === " ") {
                            battlefield[i].push(Tile.new(i, j, 'desert', 1, true, []));
                        } else {
                            battlefield[i].push(Tile.new(i, j, 'house', 1, false, []));
                        }
                    } else if (i > 8 && i < 16 && j > 8 && j < 16) {
                        if (modules[4][i - 9][j - 9] === " ") {
                            battlefield[i].push(Tile.new(i, j, 'desert', 1, true, []));
                        } else {
                            battlefield[i].push(Tile.new(i, j, 'house', 1, false, []));
                        }
                    } else if (i > 16 && i < 24 && j > 8 && j < 16) {
                        if (modules[5][i - 17][j - 9] === " ") {
                            battlefield[i].push(Tile.new(i, j, 'desert', 1, true, []));
                        } else {
                            battlefield[i].push(Tile.new(i, j, 'house', 1, false, []));
                        }
                    } else if (i > 0 && i < 8 && j > 16 && j < 24) {
                        if (modules[6][i - 1][j - 17] === " ") {
                            battlefield[i].push(Tile.new(i, j, 'desert', 1, true, []));
                        } else {
                            battlefield[i].push(Tile.new(i, j, 'house', 1, false, []));
                        }
                    } else if (i > 8 && i < 16 && j > 16 && j < 24) {
                        if (modules[7][i - 9][j - 17] === " ") {
                            battlefield[i].push(Tile.new(i, j, 'desert', 1, true, []));
                        } else {
                            battlefield[i].push(Tile.new(i, j, 'house', 1, false, []));
                        }
                    } else if (i > 16 && i < 24 && j > 16 && j < 24) {
                        if (modules[8][i - 17][j - 17] === " ") {
                            battlefield[i].push(Tile.new(i, j, 'desert', 1, true, []));
                        } else {
                            battlefield[i].push(Tile.new(i, j, 'house', 1, false, []));
                        }
                    } else {
                        battlefield[i].push(Tile.new(i, j, 'desert', 1, true, []));
                    }
                }

            }
            return battlefield;
        }
    };

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max + 1));
    }

    rotateMatrix(mat, N) {
        for (let x = 0; x < N / 2; x++) {
            for (let y = x; y < N - x - 1; y++) {
                let temp = mat[x][y];
                mat[x][y] = mat[y][N - 1 - x];
                mat[y][N - 1 - x] = mat[N - 1 - x][N - 1 - y];
                mat[N - 1 - x][N - 1 - y] = mat[N - 1 - y][x];
                mat[N - 1 - y][x] = temp;
            }
        }
        return mat;
    }


}

let mapGen = null;
module.exports.new = function () {
    let new_gen = new MapGenerator();
    mapGen = new_gen;
    return new_gen;
};
