function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max + 1));
}

class Tile {
	constructor(X, Y, type, tileset, mp_required, eva_bonus) {
		this.unit_id = null;
		this.squad_player = null;
		this.unit = null;
		this.X = X;
		this.Y = Y;
		this.type = type;
		this.tileset = tileset;
		this.mp_required = mp_required;

		this.is_passable = type !== 'wall';

		this.neighbors = [];
	}

	distance_to_tile(tile) {
		return Math.abs(this.X - tile.X) + Math.abs(this.Y - tile.Y);
	}
}
let tile = null;
module.exports.new = function(X, Y, type, tileset, mp_required, eva_bonus) {
	new_tile = new Tile(X, Y, type, tileset, mp_required, eva_bonus);
	tile = new_tile;
	return new_tile;
};

module.exports.distance_to_tile = function(tile_tgt) {
	return tile.distance_to_tile(tile_tgt);
};
