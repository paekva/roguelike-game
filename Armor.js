class Armor {
    //health, movement, vision, type, weapon, armor
    constructor(params) { 
        this.name = params.name
        this.damage_reduction = params.damage_reduction
        this.evasion = params.evasion
        this.type = params.type
    }

}

module.exports.new = function (params) {
    let armor = new Armor(params)
    return armor
}