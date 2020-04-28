const fs = require('fs');
function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max + 1));
}

class Hero {
	constructor(params, modifications, X, Y) {
		this.has_attacked = false;
		this.X = X;
		this.Y = Y;
		this.health = params.health;
		this.max_health = this.health;
		this.energy = params.energy;
		this.max_energy = this.energy;
		this.vision = params.vision;
		this.modifications = modifications;
		this.inventory = [];
		this.firstname = 'Main';
		this.lastname = 'Character';
		this.fullname = 'Main Character';
		this.effects = [];
		this.min_range = 1;
		this.max_range = 1;
		this.metabolism = 1;
	}

	move_unit(target_tile) {
		// console.log(target_tile);
		if (
			this.energy - this.get_move_cost() >= 0 &&
			target_tile.is_passable &&
			!target_tile.unit
		) {
			if (
				(target_tile.X === this.X && Math.abs(target_tile.Y - this.Y) === 1) ||
				(target_tile.Y === this.Y && Math.abs(target_tile.X - this.X) === 1)
			) {
				this.energy -= this.get_move_cost();
				this.X = target_tile.X;
				this.Y = target_tile.Y;
				target_tile.unit = this;
				return true;
			}
		}
		return false;
	}

	onDeath() {
		console.log('YOU DIED');
	}

	get_damage() {
		let dmg = 0;
		let energy_cost = this.get_attack_cost();
		let atk_effects = [];
		for (let part of this.modifications) {
			if (part.is_active) {
				dmg += part.damage;
				atk_effects = atk_effects.concat(part.effects);
			}
		}
		for (let effect of this.effects) {
			dmg += effect.damage;
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

	get_passive_cost() {
		let cost = 0;
		for (let part of this.modifications) {
			if (part.is_active) {
				cost += part.passive_cost;
			}
		}
		if (this.metabolism === 0) {
			cost = cost * 0.5;
		}
		if (this.metabolism === 2) {
			cost = cost * 2;
		}

		for (let effect of this.effects) {
			cost += effect.cost;
		}

		return cost;
	}

	get_attack_cost() {
		let cost = 0;
		cost += this.get_passive_cost();
		for (let part of this.modifications) {
			if (part.is_active && part.damage > 0) {
				cost += part.cost;
			}
		}
		return cost;
	}

	get_move_cost() {
		let cost = 0;
		cost += this.get_passive_cost();
		for (let part of this.modifications) {
			if (part.is_active && part.speed > 0) {
				cost += part.cost;
			}
		}
		return cost;
	}

	attack_unit(target) {
		this.has_attacked = true;
		console.log(this.fullname + ' attacked!');
		let damage_stats = this.get_damage();
		let dmg = damage_stats[0] - target.get_damage_reduction();
		target.effects = target.effects.concat(damage_stats[2]);
		if (dmg > 0) {
			console.log(this.fullname + ' dealt ' + dmg + ' to ' + target.fullname);
			target.health -= dmg;
			if (target.health <= 0) {
				console.log(target.fullname + ' is dead!');
			}
		} else {
			console.log(
				this.fullname + ' dealt no damage to ' + target.fullname + '!'
			);
		}
		this.energy -= damage_stats[1];
	}

	update_metabolism(stance) {
		this.metabolism = stance;
	}
}
let unit;
module.exports.new = function(params, modifications, X, Y) {
	let new_unit = new Hero(params, modifications, X, Y);
	unit = new_unit;
	return new_unit;
};

// module.exports.update_metabolism = function(stance) {
// 	unit.update_metabolism(stance)
// };
