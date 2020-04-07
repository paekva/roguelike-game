class Modification {
	constructor(params) {
		this.name = params.name;
		this.effects = params.effects;
		this.damage = params.damage;
		this.defense = params.defense;
		this.cost = params.cost;
		this.health = params.health;
		this.passive_cost = params.passive_cost;
		this.is_active = params.is_active;
		this.speed = params.speed;
	}
}

module.exports.new = function(params) {
	let part = new Modification(params);
	return part;
};
