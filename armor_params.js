
class armor_params {
    constructor () {
        this.armor_rebel = {
            'name': 'Rebel garments',
            'damage_reduction': 0,
            'evasion': 5,
            'type': 'light'
        }
        this.armor_old = {
            'name': 'Combat fatigues',
            'damage_reduction': 1,
            'evasion': 0,
            'type': 'light'
        }
    }
}

let params = null
module.exports.new = function () {
    let new_params = new armor_params()
    params = new_params
    return new_params
}