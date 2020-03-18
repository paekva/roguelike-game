const fs = require('fs');
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max + 1));
}

class Unit {
    
    constructor(params, weapon, armor) { 
        this.health = params.health
        this.death_health = params.death_health
        this.movement = params.movement + weapon.speed_modifier
        this.vision = params.vision
        this.weapon = weapon
        this.armor = armor
        this.accuracy = params.accuracy
        this.evasion = params.evasion
        this.type = params.type
        this.culture = params.culture
        this.gender = params.gender
        const fs = require('fs');
        let rawnames
        if (this.gender === 'male'){
            rawnames = JSON.parse(fs.readFileSync('./Names/' + this.culture + '/FirstNames.json'))
        } else {
            rawnames = JSON.parse(fs.readFileSync('./Names/' + this.culture + '/FirstNamesF.json'))
        }
        let rawlastnames = JSON.parse(fs.readFileSync('./Names/' + this.culture + '/LastNames.json'))
        this.firstname = rawnames[getRandomInt(rawnames.length - 1)]
        this.lastname = rawlastnames[getRandomInt(rawlastnames.length - 1)]
        this.fullname = this.firstname + ' ' + this.lastname
        this.status = params.status
    }

    unit_get_danger () {
        let danger = 0
        if (unit_info.status === 'alive'){
            let avg_dmg = (((this.weapon.min_damage + this.weapon.max_damage) / 2) * this.weapon.attacks) * (this.accuracy + this.weapon.accuracy) / 100
            if (this.weapon.type === 'AOE'){
                avg_dmg = avg_dmg * 5
            }
            let weapon_range_mod = this.weapon.max_range - this.weapon.min_range + 1
            let def_coeff = (5 - this.armor.damage_reduction) * (75 - (this.evasion + this.armor.evasion)) / 100
            danger = (weapon_range_mod * 0.2 * avg_dmg / def_coeff)
        }
        // console.log(danger)
        return danger
    }

    attack_unit (target, tgt_tile) {
        console.log(this.fullname + ' attacked!')
        let total_acc = this.accuracy + this.weapon.accuracy
        let total_eva = target.evasion + target.armor.evasion + tgt_tile.eva_bonus
        let hit_chance = total_acc - total_eva
        if (this.weapon.ammo !== -1) {
            this.weapon.ammo --
        }
        if (getRandomInt(100) <= hit_chance) {
            let dmg = (getRandomInt(this.weapon.max_damage - this.weapon.min_damage) + this.weapon.min_damage) - target.armor.damage_reduction
            if (dmg > 0) {
                console.log(this.fullname + ' dealt ' + dmg + ' to ' + target.fullname)
                target.health -= dmg
                if (target.health <= 0) {
                    if(target.status === 'Alive') {
                        console.log(target.fullname + ' is unconscious!')
                    }
                    target.status = 'Unconscious'
                    target.death_health += target.health
                    target.health = 0
                    
                    if (target.death_health <= 0) {
                        target.status = 'Dead'
                        console.log(target.fullname + ' is dead!')
                    }
                }
            } else {
                console.log(this.fullname + " dealt no damage to " + target.fullname + "!")
            }
        }
    }
}

module.exports.new = function (params, weapon, armor) {
    let unit = new Unit(params, weapon, armor)
    return unit
}