
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max + 1));
}

class Squad {

    constructor(units, X, Y, owner, AI) { 
        this.units = units;
        this.X = X;
        this.Y = Y;
        this.max_range = 0;
        this.min_range = 100;
        this.movement = 100;
        this.cur_movement = 100;
        this.has_attacked = false;
        this.has_moved = false;
        this.update_squad_movement();
        this.set_range();
        this.vision = 0;
        this.check_vision();
        this.owner = owner;
        this.is_active = true;
        this.AI = AI
       
    }

    move_squad (target_tile) {
        let mp_req = target_tile.mp_required;
        if (this.cur_movement >= mp_req && this.is_active && target_tile.is_passable) {
            this.cur_movement -= mp_req;
            this.X = target_tile.X;
            this.Y = target_tile.Y;
            this.has_moved = true;
            return true
        }
        return false
    }

    update_squad_movement() {
        for (let unit of this.units) {
            if (unit.movement < this.movement){
                this.movement = unit.movement;
                if (this.cur_movement > this.movement) {
                    this.cur_movement = this.movement
                }
            }
        }
    }

    set_range() {
        for (let unit of this.units) {
            if (unit.weapon.max_range > this.max_range){
                this.max_range = unit.weapon.max_range
            }
            if (unit.weapon.min_range < this.min_range){
                this.min_range = unit.weapon.min_range
            }
        }
    }

    remove_dead () {
        for (let unit of this.units) {
            if (unit.status === 'Dead') {
                this.units.splice(this.units.indexOf(unit), 1);
            }
        }
    }

    check_if_active () {
        this.is_active = false;
        for (let unit of this.units) {
            if (unit.status === 'Alive') {
                this.is_active = true
            }
        }
       
    }

    check_vision () {
        this.vision = 0;
        for (let unit of this.units) {
            if (unit.status === 'Alive') {
                if (unit.vision > this.vision) {
                    this.vision = unit.vision
                }
            }
        }
    }

    get_target_priorities () {
        let priority = 0;
        for (let unit of this.units) {
            if (unit.status === 'Alive') {
                priority +=2
            }
            if (unit.status === 'Unconscious') {
                priority +=1
            }
        }
        let iterator = 0;
        let result = getRandomInt(priority);
        for (let unit of this.units) {
            if (unit.status === 'Alive') {
                iterator +=2
            }
            if (unit.status === 'Unconscious') {
                iterator +=1
            }
            if (iterator >= result) {
                return unit
            }
        }
        return undefined
    }

    squad_get_danger () {
        let danger = 0;
        for (let unit of squad.units) {
            danger += unit.unit_get_danger()
        }
        return danger
    }

    attack_squad(target_squad, range, tgt_tile) {
        this.has_attacked = true;
        for (let unit of this.units) {
            if (unit.status === 'Alive' && target_squad.units.length !== 0 && unit.weapon.max_range >= range && unit.weapon.min_range <= range && unit.weapon.ammo !== 0) {
                if (unit.weapon.type === 'Assault') {
                    for (let i = 0; i < unit.weapon.attacks; i++) {
                        unit.attack_unit(target_squad.get_target_priorities(), tgt_tile);
                        target_squad.remove_dead();
                        target_squad.check_if_active();
                        target_squad.check_vision();
                        target_squad.set_range()
                    }
                }
                if (unit.weapon.type === 'AOE') {
                    for (let tgt_unit of target_squad.units){
                        unit.attack_unit(tgt_unit, tgt_tile)
                    }
                    target_squad.remove_dead();
                    target_squad.check_if_active();
                    target_squad.check_vision();
                    target_squad.set_range()
                }
            }
        }
    }


    BFS (start, battlefield, mode) {
        //mode = 0 -> calculate distance in tiles, 1 -> range with terrain, 2 -> vision distance
        let visited = [];
        let distance = [];
        for (let i = 0; i < battlefield.length; i++) {
            visited.push([]);
            distance.push([]);
            for (let j = 0 ; j < battlefield[0].length; j++) {
                visited[i].push(false);
                distance[i].push(1000)
            }
        }
        visited[start.X][start.Y] = true;
        distance[start.X][start.Y] = 0;
        let toExplore = [start];
        while (toExplore.length > 0) {
            let tileIndex = toExplore.shift();
            for (let neighbor of battlefield[tileIndex.X][tileIndex.Y].neighbors) {
                if (battlefield[neighbor.X][neighbor.Y].is_passable){
                    // if (battlefield[neighbor.X][neighbor.Y].squad === null || battlefield[neighbor.X][neighbor.Y].squad.owner === this.player){
                        if (!visited[neighbor.X][neighbor.Y]) {
                            visited[neighbor.X][neighbor.Y] = true;
                            if (mode === 0) {
                                if (distance[neighbor.X][neighbor.Y] === 1000) {
                                    distance[neighbor.X][neighbor.Y] = distance[tileIndex.X][tileIndex.Y] + 1
                                }
                            }
                            if (mode === 1) {
                                if (distance[neighbor.X][neighbor.Y] > distance[tileIndex.X][tileIndex.Y] + battlefield[tileIndex.X][tileIndex.Y].mp_required) {
                                    distance[neighbor.X][neighbor.Y] = distance[tileIndex.X][tileIndex.Y] + battlefield[tileIndex.X][tileIndex.Y].mp_required
                                }
                            }
                            toExplore.push({X:neighbor.X, Y:neighbor.Y})
                        }
                    // }
                }
            }
        }
        return distance
    }

}
let squad = null;
module.exports.new = function (units, X, Y, owner, AI) {
    new_squad = new Squad(units, X, Y, owner, AI);
    squad = new_squad;
    return new_squad
};

module.exports.move_squad = function (direction) {
    squad.move_squad(direction)
};

module.exports.attack_squad = function (target) {
    squad.attack_squad(target)
};

module.exports.squad_get_danger  = function () {
    squad.squad_get_danger()
};

module.exports.BFS = function (start, battlefield, mode) {
    squad.BFS(start, battlefield, mode)
};