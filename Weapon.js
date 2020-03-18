class Weapon {
    //health, movement, vision, type, weapon, armor
    constructor(params) { 
        this.name = params.name
        this.min_range = params.min_range
        this.max_range = params.max_range
        this.min_damage = params.min_damage
        this.max_damage = params.max_damage
        this.accuracy = params.accuracy
        this.type = params.type
        this.ammo = params.ammo
        this.attacks = params.attacks
        this.speed_modifier = params.speed_modifier
    }
}

module.exports.new = function (params) {
    let weapon = new Weapon(params)
    return weapon
}