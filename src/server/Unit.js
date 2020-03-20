const fs = require('fs');
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max + 1));
}

class Unit {
    
    constructor(params, modifications, X, Y, AI) {         
        this.X = X;
        this.Y = Y;
        this.AI = AI;
        this.health = params.health;
        this.max_health = this.health;
        this.movement = params.movement;
        this.vision = params.vision;
        this.modifications = modifications;
        this.effects = [];
        let rawnames = JSON.parse(fs.readFileSync('./Names/FirstNames.json'));
        let rawlastnames = JSON.parse(fs.readFileSync('./Names/LastNames.json'));
        this.firstname = rawnames[getRandomInt(rawnames.length - 1)];
        this.lastname = rawlastnames[getRandomInt(rawlastnames.length - 1)];
        this.fullname = this.firstname + ' ' + this.lastname;
        this.min_range = 1;
        this.max_range = 1
    }

    move_unit (target_tile) {
        if (target_tile.is_passable && !target_tile.unit) {
            if ((target_tile.X === this.X && Math.abs(target_tile.Y - this.Y) === 1) || (target_tile.Y === this.Y && Math.abs(target_tile.X - this.X) === 1)){
                this.X = target_tile.X;
                this.Y = target_tile.Y;
                return true
            }
        }
        return false
    }

    get_damage () {
        let dmg = 0;
        let energy_cost = 0;
        let atk_effects = [];
        for (let part of this.modifications) {
            if (part.is_active) {
                dmg += part.damage;
                energy_cost += part.cost;
                atk_effects = atk_effects.concat(part.effects)
            }
        }
        for (let effect of this.effects) {
            dmg += effect.damage;
            energy_cost += effect.cost;
            atk_effects = atk_effects.concat(effect.effects)
        }
        return [dmg, energy_cost, atk_effects]
    }

    get_damage_reduction () {
        let reduction = 0;
        for (let part of this.modifications) {
            if (part.is_active) {
                reduction += part.defense
            }
        }
        for (let effect of this.effects) {
            reduction += effect.defense
        }
        return reduction
    }

    attack_unit (target, tgt_tile) {
        console.log(this.fullname + ' attacked!');
        let damage_stats = this.get_damage();
        let dmg = damage_stats[0] - target.get_damage_reduction();
        target.effects = target.effects.concat(damage_stats[2]);
        if (dmg > 0) {
            console.log(this.fullname + ' dealt ' + dmg + ' to ' + target.fullname);
            target.health -= dmg;
            if (target.health <= 0) {
                if(target.status === 'Alive') {
                    console.log(target.fullname + ' is unconscious!')
                }
                target.status = 'Unconscious';
                target.death_health += target.health;
                target.health = 0;
                
                if (target.death_health <= 0) {
                    target.status = 'Dead';
                    console.log(target.fullname + ' is dead!')
                }
            }
        } else {
            console.log(this.fullname + " dealt no damage to " + target.fullname + "!")
        }
        this.energy -= damage_stats[1]
    }
}

module.exports.new = function (params, modifications, X, Y) {
    let unit = new Unit(params, modifications, X, Y);
    return unit
};