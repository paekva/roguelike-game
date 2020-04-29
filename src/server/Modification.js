class Modification {
	constructor(params) {
		this.attackNames = ['Claw', 'Tentacle', 'Talons', 'Fangs', 'Blade'];
		this.defenseNames = ['Spine', 'Spikes', 'Carapace', 'Skin', 'Hide'];
		this.utilityNames = ['Glands', 'Fiber', 'Symbiont'];
		this.prefixesCommon = ['Petty ', 'Small ', 'Medium ', 'Big '];
		this.prefixesRare = ['Swift ', 'Dense ', 'Solid ', 'Enhanced '];
		this.prefixesEpic = [
			'Superior ',
			'Ravenous ',
			'Horrific ',
			'Perpetual ',
			'Murderous ',
		];
		this.postfixes = [
			'Doom',
			'Death',
			'Destruction',
			'Annihilation',
			'Eradication',
			'Procrastination',
		];

		if (
			params === 'random attack' ||
			params === 'random defense' ||
			params === 'random utility' ||
			params === 'random'
		) {
			if (params === 'random attack') {
				this.type = 'Attack';
			} else if (params === 'random defense') {
				this.type = 'Defense';
			} else if (params === 'random utility') {
				this.type = 'Utility;';
			} else {
				this.type = this.getRandomElement(['Attack', 'Defense', 'Utility']);
			}
			this.weight = this.getRandomInt(11) + 1;

			if (this.weight < 7) {
				this.name = this.getRandomElement(this.prefixesCommon);
			} else if (this.weight > 6 && this.weight < 11) {
				this.name = this.getRandomElement(this.prefixesRare);
			} else {
				this.name = this.getRandomElement(this.prefixesEpic);
			}
			if (this.type === 'Attack') {
				this.name += this.getRandomElement(this.attackNames);
				this.damage = this.weight;
				this.defense = 0;
				this.health = 0;
			} else if (this.type === 'Defense') {
				this.name += this.getRandomElement(this.defenseNames);
				this.damage = 0;
				this.health = (this.weight * this.getRandomInt(10)) / 10;
				this.defense = this.weight - this.health;
			} else {
				this.name += this.getRandomElement(this.utilityNames);
				this.damage = (this.weight * this.getRandomInt(10)) / 20;
				this.health = (this.weight * this.getRandomInt(10)) / 20;
				this.defense = this.weight - this.health - this.damage;
			}
			if (this.weight > 10) {
				this.name += " of " + this.getRandomElement(this.postfixes);
			}
			this.effects = [];
			this.cost = this.weight / 4;
			this.passive_cost = this.weight / 400;
			this.is_active = true;
		} else {
			this.name = params.name;
			this.effects = [];
			this.damage = params.damage;
			this.defense = params.defense;
			this.cost = params.cost;
			this.health = params.health;
			this.passive_cost = params.passive_cost;
			this.is_active = params.is_active;
			this.speed = params.speed;
		}
	}

	getRandomElement(array) {
		return array[Math.floor(Math.random() * array.length)];
	}

	getRandomInt(max) {
		return Math.floor(Math.random() * Math.floor(max + 1));
	}
}

module.exports.new = function(params) {
	let part = new Modification(params);
	return part;
};
