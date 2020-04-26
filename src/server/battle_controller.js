let Hero = require('./Hero');
let Unit = require('./Unit');
let Modification = require('./Modification');
let Effect = require('./Effect');
let Tile = require('./Tile');
let Player = require('./Player');
let PriorityQueue = require('priorityqueuejs');
let AI = require('./AI');
let MapGen = require('./map_generator');
// let weapon_params = require('./weapon_params')
// let armor_params = require('./armor_params')
// let unit_params = require('./unit_params')
function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max + 1));
}

class battle_controller {
	constructor() {
		this.AAA = 250;
		this.turn = 0;
		let hero_params = {
			health: 10,
			energy: 20,
			vision: 6,
		};
		let unit_params = {
			health: 5,
			vision: 3,
		};
		let big_claw = Modification.new({
			name: 'Big claw',
			effects: [],
			damage: 3,
			defense: 0,
			cost: 1,
			health: 0,
			passive_cost: 0.01,
			is_active: true,
		});

		let small_claw = Modification.new({
			name: 'Small claw',
			effects: [],
			damage: 2,
			defense: 0,
			cost: 0.75,
			health: 0,
			passive_cost: 0.01,
			is_active: true,
		});
		this.units = [];
		this.battlefield = MapGen.new().generateMap();
		this.battlefield_X = 25;
		this.battlefield_Y = 25;
		// for (let i = 0; i < this.battlefield_X; i++) {
		// 	this.battlefield.push([]);
		// 	for (let j = 0; j < this.battlefield_Y; j++) {
		// 		if (
		// 			(i === 1 && j === 3) ||
		// 			(i === 0 && j === 1) ||
		// 			(i === 3 && j === 6) ||
		// 			(i === 4 && j === 6) ||
		// 			(i === 3 && j === 6)
		// 		) {
		// 			this.battlefield[i].push(Tile.new(i, j, 'desert_hill', 2, true, []));
		// 		} else if ((i === 4 && j === 4) || (i === 4 && j === 5)) {
		// 			this.battlefield[i].push(Tile.new(i, j, 'house', 1, false, []));
		// 		} else {
		// 			this.battlefield[i].push(Tile.new(i, j, 'desert', 1, true, []));
		// 		}
		// 	}
		// }
		// for (let j = 0; j < this.battlefield_X; j++) {
		// 	this.battlefield[j][1] = Tile.new(j, 1, 'house', 2, false, 0);
		// 	this.battlefield[j][2] = Tile.new(j, 2, 'house', 2, false, 0);
		// }

		for (let i = 0; i < this.battlefield_X; i++) {
			for (let j = 0; j < this.battlefield_Y; j++) {
				if (i > 0) {
					this.battlefield[i][j].neighbors.push({ X: i - 1, Y: j });
				}
				if (i < this.battlefield_X - 1) {
					this.battlefield[i][j].neighbors.push({ X: i + 1, Y: j });
				}
				if (j > 0) {
					this.battlefield[i][j].neighbors.push({ X: i, Y: j - 1 });
				}
				if (j < this.battlefield_Y - 1) {
					this.battlefield[i][j].neighbors.push({ X: i, Y: j + 1 });
				}
			}
		}

		let done = false;
		while (!done) {
			let x = getRandomInt(23) + 1;
			let y = getRandomInt(23) + 1;
			if (this.battlefield[x][y].is_passable === true) {
				this.hero = Hero.new(
					hero_params,
					[Modification.new('random attack')],
					x,
					y
				);
				this.units.push(this.hero);
				this.battlefield[this.hero.X][this.hero.Y].unit = this.hero;
				done = true;
			}
		}

		for (let i = 0; i < 30; i++) {
			let x = getRandomInt(23) + 1;
			let y = getRandomInt(23) + 1;
			if (
				this.battlefield[x][y].is_passable === true &&
				this.battlefield[x][y].unit == null
			) {
				this.units.push(
					Unit.new(
						unit_params,
						[small_claw],
						x,
						y,
						AI.new(this.battlefield, 'attack')
					)
				);
				this.battlefield[this.units[this.units.length - 1].X][
					this.units[this.units.length - 1].Y
				].unit = this.units[this.units.length - 1];
				this.units[this.units.length - 1].create_visibility_map(
					this.battlefield
				);
			}
		}
		//this.hero = Hero.new(hero_params, [big_claw], 3, 3);
		// this.unit_1 = Unit.new(
		// 	unit_params,
		// 	[small_claw],
		// 	5,
		// 	3,
		// 	AI.new(this.battlefield, 'attack')
		// );
		// // this.unit_2 = Unit.new(unit_params, [small_claw], 7, 3, AI.new(this.battlefield, 'attack'));
		// this.unit_2 = Unit.new(unit_params, [small_claw], 7, 3, null);
		// this.units.push(this.unit_1);
		// this.units.push(this.unit_2);
		// for (let unit of this.units) {
		// 	this.battlefield[unit.X][unit.Y].unit = unit;
		// }
		// this.unit_1.create_visibility_map(this.battlefield);
		// this.unit_2.create_visibility_map(this.battlefield);
		// x * 10 + y
		this.player_human = Player.new('Player', 0, this.hero);
		this.player_human.create_visibility_map(this.battlefield);
		this.player_human.get_visible_tile(this.battlefield);
	}

	check_unit_existing() {
		for (let i = 0; i < this.units.length; i++) {
			let unit = this.units[i];
			if (unit.health <= 0) {
				unit.onDeath(this.battlefield);
				this.battlefield[unit.X][unit.Y].unit = null;
				this.units.splice(i, 1);
			}
		}
	}

	get_tile_id_from_coords(tile) {
		return tile.X * this.battlefield_Y + tile.Y;
	}

	get_coords_from_tile_id(id) {
		return { X: parseInt(id / this.battlefield_Y), Y: id % this.battlefield_Y };
	}

	// aStar(start, goal) {
	// 	let frontier = new PriorityQueue(function(a, b) {
	// 		return b.priority - a.priority;
	// 	});
	// 	frontier.enq({ coords: start, priority: 0 });
	// 	let came_from = {};
	// 	let cost_so_far = {};
	// 	let id_start = this.get_tile_id_from_coords(start);
	// 	came_from[id_start] = null;
	// 	cost_so_far[id_start] = 0;

	// 	while (frontier.size() !== 0) {
	// 		let current = frontier.deq();
	// 		if (current.coords.X === goal.X && current.coords.Y === goal.Y) {
	// 			return {
	// 				path: came_from,
	// 				cost: cost_so_far[this.get_tile_id_from_coords(current.coords)],
	// 			};
	// 		}
	// 		let tile = this.battlefield[current.coords.X][current.coords.Y];
	// 		for (let next of tile.neighbors) {
	// 			let nextTile = this.battlefield[next.X][next.Y];
	// 			let new_cost =
	// 				cost_so_far[this.get_tile_id_from_coords(current.coords)] +
	// 				nextTile.mp_required;
	// 			let id_next = this.get_tile_id_from_coords(next);
	// 			if (!cost_so_far[id_next] || new_cost < cost_so_far[id_next]) {
	// 				if (
	// 					this.battlefield[next.X][next.Y].is_passable &&
	// 					(this.battlefield[next.X][next.Y].squad === null ||
	// 						this.players[this.turn].visibility_map[next.X][next.Y] === 0)
	// 				) {
	// 					cost_so_far[id_next] = new_cost;
	// 					let priority = new_cost + goal.distance_to_tile(nextTile);
	// 					frontier.enq({ coords: next, priority: priority });
	// 					came_from[id_next] = current;
	// 				}
	// 			}
	// 		}
	// 	}
	// 	return null;
	// }

	move_unit_to_tile(unit_info, goal, res) {
		console.log('moving unit');
		let unit = this.units[unit_info.index];
		let prevX = unit.X;
		let prevY = unit.Y;
		// console.log(unit);
		// console.log(goal);
		// console.log(this.battlefield[goal.X][goal.Y]);
		if (
			this.battlefield[goal.X][goal.Y].unit === null &&
			this.battlefield[goal.X][goal.Y].is_passable
		) {
			this.units[unit_info.index].X = goal.X;
			this.units[unit_info.index].Y = goal.Y;
			this.battlefield[goal.X][goal.Y].unit = this.units[unit_info.index];
			this.battlefield[prevX][prevY].unit = null;

			return true;
		}
		return false;
	}

	check_squad_access_tile(squad_info, start, goal) {
		let squad = this.players[squad_info.player].squads[squad_info.index];
		let res = this.aStar(start, goal);
		if (res) {
			if (res.cost > squad.cur_movement) {
				// console.log(squad.cur_movement)
				// console.log("not enough movement")
				return null;
			} else {
				if (goal.is_passable === false || goal.squad) {
					return null;
				}
				let cur_key = this.get_tile_id_from_coords({ X: goal.X, Y: goal.Y });
				let ret_path = [];
				while (
					this.get_coords_from_tile_id(cur_key).X !== start.X ||
					this.get_coords_from_tile_id(cur_key).Y !== start.Y
				) {
					ret_path.push([
						{
							X: this.get_coords_from_tile_id(cur_key).X,
							Y: this.get_coords_from_tile_id(cur_key).Y,
						},
						{ X: res.path[cur_key].coords.X, Y: res.path[cur_key].coords.Y },
					]);
					cur_key = this.get_tile_id_from_coords(res.path[cur_key].coords);
				}
				return [ret_path, squad_info, goal, res];
			}
		} else {
			// console.log("cant access tile")
			return null;
		}
	}

	get_tile_to_move(in_potential_range) {
		let priority = -1000;
		let tile_ind = -1;
		for (let i = 0; i < in_potential_range.length; i++) {
			let tile = in_potential_range[i];
			if (tile.priority > priority) {
				priority = tile.priority;
				tile_ind = i;
			}
		}
		return [priority, tile_ind];
	}

	make_AI_turns() {
		if (this.turn > 0) {
			for (let l = 1; l < this.units.length; l++) {
				let current_unit = this.units[l];
				// console.log(squad.vision)
				if (current_unit.AI) {
					current_unit.AI.update_desire_map(
						this.battlefield,
						current_unit.X,
						current_unit.Y,
						current_unit.get_visible_tile(this.battlefield)
					);
					// let distances = current_unit.AI.BFS(
					// 	{ X: current_unit.X, Y: current_unit.Y },
					// 	this.battlefield,
					// 	0
					// );
					// console.log('final map');
					// console.log(current_unit.AI.final_desire_map);
					let priority = -1000;
					let tgt = { X: current_unit.X, Y: current_unit.Y };
					for (let neighbor_cord of this.battlefield[current_unit.X][
						current_unit.Y
					].neighbors) {
						// console.log(neighbor);
						let neighbor = this.battlefield[neighbor_cord.X][neighbor_cord.Y];
						if (neighbor.is_passable) {
							if (
								current_unit.AI.final_desire_map[neighbor.X][neighbor.Y] >
								priority
							) {
								// console.log('hey1!');
								priority =
									current_unit.AI.final_desire_map[neighbor.X][neighbor.Y];
								tgt = { X: neighbor.X, Y: neighbor.Y };
							}
						}
					}
					// console.log('MOVVING');
					this.move_unit_to_tile({ index: l }, tgt, 1);

					let target = this.units[0];
					let range =
						Math.abs(current_unit.X - target.X) +
						Math.abs(current_unit.Y - target.Y);
					if (
						range <= current_unit.max_range &&
						range >= current_unit.min_range &&
						current_unit.AI.vis_map[target.X][target.Y] > 0
					) {
						let tgt_tile = this.battlefield[target.X][target.Y];
						current_unit.attack_unit(target, range, tgt_tile);
					}
				}
			}
		}
	}
}

let controller = null;
module.exports.new = function() {
	let new_controller = new battle_controller();
	controller = new_controller;
	return new_controller;
};

//aStar returns path and cost OR null
module.exports.aStar = function(start, goal) {
	controller.aStar(start, goal);
};

//returns
module.exports.check_unit_access_tile = function(unit_info, start, goal) {
	controller.check_unit_access_tile(unit_info, start, goal);
};

module.exports.move_unit_to_tile = function(unit_info, goal, res) {
	controller.move_unit_to_tile(unit_info, goal, res);
};

module.exports.get_tile_to_move = function(in_potential_range) {
	controller.get_tile_to_move(in_potential_range);
};

module.exports.check_unit_existing = function() {
	controller.check_unit_existing();
};

module.exports.make_AI_turns = function() {
	controller.make_AI_turns();
};
