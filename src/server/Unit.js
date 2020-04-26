const fs = require('fs');
function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max + 1));
}

class Unit {
	constructor(params, modifications, X, Y, AI) {
		this.X = X;
		this.Y = Y;
		this.AI = AI;
		this.health = params.health;
		this.max_health = this.health;
		this.movement = params.movement;
		this.vision = params.vision;
		this.modifications = modifications;
		this.effects = [];
		let rawnames = JSON.parse(fs.readFileSync('./Names/FirstNames.json'));
		let rawlastnames = JSON.parse(fs.readFileSync('./Names/LastNames.json'));
		this.firstname = rawnames[getRandomInt(rawnames.length - 1)];
		this.lastname = rawlastnames[getRandomInt(rawlastnames.length - 1)];
		this.fullname = this.firstname + ' ' + this.lastname;
		this.min_range = 1;
		this.max_range = 1;
	}

	move_unit(target_tile) {
		if (target_tile.is_passable && !target_tile.unit) {
			if (
				(target_tile.X === this.X && Math.abs(target_tile.Y - this.Y) === 1) ||
				(target_tile.Y === this.Y && Math.abs(target_tile.X - this.X) === 1)
			) {
				this.X = target_tile.X;
				this.Y = target_tile.Y;
				return true;
			}
		}
		return false;
	}

	get_damage() {
		let dmg = 0;
		let energy_cost = 0;
		let atk_effects = [];
		for (let part of this.modifications) {
			if (part.is_active) {
				dmg += part.damage;
				energy_cost += part.cost;
				atk_effects = atk_effects.concat(part.effects);
			}
		}
		for (let effect of this.effects) {
			dmg += effect.damage;
			energy_cost += effect.cost;
			atk_effects = atk_effects.concat(effect.effects);
		}
		return [dmg, energy_cost, atk_effects];
	}

	get_damage_reduction() {
		let reduction = 0;
		for (let part of this.modifications) {
			if (part.is_active) {
				reduction += part.defense;
			}
		}
		for (let effect of this.effects) {
			reduction += effect.defense;
		}
		return reduction;
	}

	attack_unit(target, tgt_tile) {
		console.log(this.fullname + ' attacked!');
		let damage_stats = this.get_damage();
		let dmg = damage_stats[0] - target.get_damage_reduction();
		target.effects = target.effects.concat(damage_stats[2]);
		if (dmg > 0) {
			console.log(this.fullname + ' dealt ' + dmg + ' to ' + target.fullname);
			target.health -= dmg;
			if (target.health <= 0) {
				if (target.status === 'Alive') {
					console.log(target.fullname + ' is unconscious!');
				}
				target.status = 'Unconscious';
				target.death_health += target.health;
				target.health = 0;

				if (target.death_health <= 0) {
					target.status = 'Dead';
					console.log(target.fullname + ' is dead!');
				}
			}
		} else {
			console.log(
				this.fullname + ' dealt no damage to ' + target.fullname + '!'
			);
		}
		this.energy -= damage_stats[1];
	}

	create_visibility_map(battlefield) {
		this.visibility_map = [];
		for (let i = 0; i < battlefield.length; i++) {
			this.visibility_map.push([]);
			for (let j = 0; j < battlefield[0].length; j++) {
				this.visibility_map[i].push(0);
			}
		}
	}

	BFS(start, battlefield, mode) {
		//mode = 0 -> calculate distance in tiles, 1 -> range with terrain, 2 -> vision distance
		let visited = [];
		let distance = [];
		for (let i = 0; i < battlefield.length; i++) {
			visited.push([]);
			distance.push([]);
			for (let j = 0; j < battlefield[0].length; j++) {
				visited[i].push(false);
				distance[i].push(1000);
			}
		}
		visited[start.X][start.Y] = true;
		distance[start.X][start.Y] = 0;
		let toExplore = [start];
		while (toExplore.length > 0) {
			let tileIndex = toExplore.shift();
			for (let neighbor of battlefield[tileIndex.X][tileIndex.Y].neighbors) {
				if (battlefield[neighbor.X][neighbor.Y].is_passable) {
					// if (battlefield[neighbor.X][neighbor.Y].squad === null || battlefield[neighbor.X][neighbor.Y].squad.owner === this.player){
					if (!visited[neighbor.X][neighbor.Y]) {
						visited[neighbor.X][neighbor.Y] = true;
						if (mode === 0) {
							if (distance[neighbor.X][neighbor.Y] === 1000) {
								distance[neighbor.X][neighbor.Y] =
									distance[tileIndex.X][tileIndex.Y] + 1;
							}
						}
						if (mode === 1) {
							if (
								distance[neighbor.X][neighbor.Y] >
								distance[tileIndex.X][tileIndex.Y] +
									battlefield[tileIndex.X][tileIndex.Y].mp_required
							) {
								distance[neighbor.X][neighbor.Y] =
									distance[tileIndex.X][tileIndex.Y] +
									battlefield[tileIndex.X][tileIndex.Y].mp_required;
							}
						}
						toExplore.push({ X: neighbor.X, Y: neighbor.Y });
					}
					// }
				}
			}
		}
		return distance;
	}

	onDeath () {
		let dropItem = this.modifications[getRandomInt(this.modifications.length - 1)]
		battlefield[this.X][this.neighbor.Y]
	}

	get_visible_tile(battlefield) {
		let distances = this.BFS({ X: this.X, Y: this.Y }, battlefield, 1);
		for (let i = 0; i < battlefield.length; i++) {
			for (let j = 0; j < battlefield[0].length; j++) {
				if (this.vision >= distances[i][j]) {
					this.visibility_map[i][j] = 1;
				} else {
					this.visibility_map[i][j] = 0;
				}
			}
		}

		// this.print_map(this.visibility_map);
		return this.visibility_map;
	}

	print_map(desire_map) {
		let Xlength = desire_map.length;
		let Ylength = desire_map[0].length;
		let str = '';
		for (let i = 0; i < Ylength; i++) {
			for (let j = 0; j < Xlength; j++) {
				str += desire_map[j][i] + ' ';
			}
			console.log(str);
			str = '';
		}
	}
}

module.exports.new = function(params, modifications, X, Y, AI) {
	let unit = new Unit(params, modifications, X, Y, AI);
	return unit;
};

module.exports.get_visible_tile = function(battlefield) {
	player.get_visible_tile(battlefield);
};
