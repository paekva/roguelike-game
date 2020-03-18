
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max + 1));
}

class Tile {

    constructor(X, Y, type, mp_required, is_passable, eva_bonus) { 
        this.unit_id = null
        this.squad_player = null
        this.unit = null
        this.X = X
        this.Y = Y
        this.type = type
        this.mp_required = mp_required
        this.is_passable = is_passable
        this.neighbors = []
        // console.log(this)
    }
    
    distance_to_tile (tile) {
        return Math.abs(this.X - tile.X) +  Math.abs(this.Y - tile.Y)
    }
}
let tile = null
module.exports.new = function (X, Y, type, mp_required, is_passable, eva_bonus) {
    new_tile = new Tile(X, Y, type, mp_required, is_passable, eva_bonus)
    tile = new_tile
    return new_tile
}

module.exports.distance_to_tile = function (tile_tgt) {
    return tile.distance_to_tile(tile_tgt)
}

