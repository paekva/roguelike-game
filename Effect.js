class Effect {
    //health, movement, vision, type, weapon, armor
    constructor(params) { 
        this.name = params.name
        this.duration = params.duration
        this.damage = params.defense
        this.defense = params.defense
        this.health = params.health
        this.energy = params.energy
    }

}

module.exports.new = function (params) {
    let effect = new Effect(params)
    return effect
}