
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max + 1));
}

class Square {

    constructor(X, Y, type, mp_required, is_passable, eva_bonus) { 
        this.squad_id = null
        this.squad_player = null
        this.squad = null
        this.X = X
        this.Y = Y
        this.type = type
        this.mp_required = mp_required
        this.is_passable = is_passable
        this.neighbors = []
        this.eva_bonus = eva_bonus
        // console.log(this)
    }
    
    distance_to_tile (tile) {
        return Math.abs(this.X - tile.X) +  Math.abs(this.Y - tile.Y)
    }
}
let square = null
module.exports.new = function (X, Y, type, mp_required, is_passable, eva_bonus) {
    new_square = new Square(X, Y, type, mp_required, is_passable, eva_bonus)
    square = new_square
    return new_square
}

module.exports.distance_to_tile = function (tile) {
    return square.distance_to_tile(tile)
}

