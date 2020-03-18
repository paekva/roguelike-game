
class weapon_params {
    constructor () {
        this.ar_Tellur_old = {
            'name': 'AKA47',
            'min_range': 1,
            'max_range': 3,
            'min_damage': 4,
            'max_damage': 6,
            'accuracy': 5,
            'type': 'Assault',
            'ammo': 30,
            'attacks': 1,
            'speed_modifier': 0
        } 
        this.fists = {
            'name': 'Fists',
            'min_range': 1,
            'max_range': 1,
            'min_damage': 0,
            'max_damage': 1,
            'accuracy': -5,
            'type': 'Melee',
            'ammo': -1,
            'attacks': 1,
            'speed_modifier': 0
        } 
        this.ar_Thalassa = {
            'name': 'BK15',
            'min_range': 1,
            'max_range': 3,
            'min_damage': 4,
            'max_damage': 5,
            'accuracy': 10,
            'type': 'Assault',
            'ammo': 20,
            'attacks': 1,
            'speed_modifier': 0
        } 
        this.rf_Tellur_old = {
            'name': 'Moist Nugget',
            'min_range': 2,
            'max_range': 5,
            'min_damage': 7,
            'max_damage': 10,
            'accuracy': 20,
            'type': 'Assault',
            'ammo': 5,
            'attacks': 1,
            'speed_modifier': -1
        } 
        this.flamer_Tellur = {
            'name': 'FmW 86',
            'min_range': 1,
            'max_range': 1,
            'min_damage': 3,
            'max_damage': 9,
            'accuracy': 50,
            'type': 'AOE',
            'ammo': 5,
            'attacks': 1,
            'speed_modifier': -1
        }
        this.mg_Thalassa = {
            'name': 'M50',
            'min_range': 1,
            'max_range': 3,
            'min_damage': 4,
            'max_damage': 7,
            'accuracy': 0,
            'type': 'Assault',
            'ammo': 100,
            'attacks': 3,
            'speed_modifier': -1
        } 
    }
}

let params = null
module.exports.new = function () {
    let new_params = new weapon_params()
    params = new_params
    return new_params
}