
class unit_params {
    constructor () {      
        this.aravian_rebel = {
            'health': 10,
            'death_health': 5,
            'movement': 4,
            'vision': 6,
            'type': 'biological',
            'evasion': 10,
            'accuracy': 65,
            'culture': 'Arabic',
            'gender': 'male',
            'status': 'Alive'
            } 
        this.aravian_civilian = {
            'health': 10,
            'death_health': 5,
            'movement': 4,
            'vision': 6,
            'type': 'biological',
            'evasion': 5,
            'accuracy': 50,
            'culture': 'Arabic',
            'gender': 'male',
            'status': 'Alive'
            } 
       this.mercenary_Thalassa = {
            'health': 10,
            'death_health': 5,
            'movement': 40,
            'vision': 5,
            'type': 'biological',
            'evasion': 10,
            'accuracy': 65,
            'culture': 'American',
            'gender': 'male',
            // 'weapon': Weapon.new(this.param_weapon_gov),
            // 'armor': Armor.new(this.param_armor_gov),
            'status': 'Alive'
        } 
    }
}

let params = null
module.exports.new = function () {
    let new_params = new unit_params()
    params = new_params
    return new_params
}