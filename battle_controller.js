let Hero = require('./Hero')
let Unit = require('./Unit')
let Modification = require('./Modification')
let Effect = require('./Effect')
let Tile = require('./Tile')
let Player = require('./Player')
let PriorityQueue = require('priorityqueuejs');
let AI = require('./AI')
let weapon_params = require('./weapon_params')
let armor_params = require('./armor_params')
let unit_params = require('./unit_params')
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max + 1));
}

class battle_controller {
    constructor () {
        this.AAA = 250
        this.turn = 0
        let hero_params = {
            'health': 10,
            'energy': 20,
            'vision': 6
        } 
        let unit_params = {
            'health': 5,
            'vision': 3
        } 
        let big_claw = Modification.new({        
            "name": "Big claw",
            "this.effects": [],
            "damage": 3,
            "defense": 0,
            "cost": 1,
            "health": 0,
            "passive_cost": 0.01,
            "is_active": true})

        let small_claw = Modification.new({        
            "name": "Big claw",
            "this.effects": [],
            "damage": 2,
            "defense": 0,
            "cost": 0.75,
            "health": 0,
            "passive_cost": 0.01,
            "is_active": true})
        this.hero = Hero.new(hero_params, [big_claw], 3, 3)
        this.unit_1 = Unit.new(unit_params, [small_claw], 5, 3, null)
        this.unit_2 = Unit.new(unit_params, [small_claw], 7, 3, null)
        this.units = []
        this.units.push(this.hero)
        this.units.push(this.unit_1)
        this.units.push(this.unit_2)
        this.battlefield = []
        this.battlefield_X = 15
        this.battlefield_Y = 5
        for (let i = 0; i < this.battlefield_X; i++) {
            this.battlefield.push([])
            for (let j = 0; j < this.battlefield_Y; j++) {
                if ((i === 1 && j === 3) || (i === 0 && j === 1) || (i === 3 && j === 6) || (i === 4 && j === 6) || (i === 3 && j === 6)){
                    this.battlefield[i].push(Tile.new(i, j, 'desert_hill', 2, true, 15))
                } else if ((i === 4 && j === 4) || (i === 4 && j === 5)) {
                    this.battlefield[i].push(Tile.new(i, j, 'house', 1, false, 0))
                } else {
                    this.battlefield[i].push(Tile.new(i, j, 'desert', 1, true, 0))
                }
                
            }
        }
        for (let j = 0; j < this.battlefield_X; j++) {
            this.battlefield[j][1] = (Tile.new(j, 1, 'desert_hill', 2, true, 15))
            this.battlefield[j][2] = (Tile.new(j, 2, 'desert_hill', 2, true, 15))
        }

        for (let i = 0; i < this.battlefield_X; i++) {
            for (let j = 0; j < this.battlefield_Y; j++) {
                if (i > 0) {
                    this.battlefield[i][j].neighbors.push({X: i - 1, Y: j})
                }
                if (i < this.battlefield_X - 1) {
                    this.battlefield[i][j].neighbors.push({X: i + 1, Y: j})
                }
                if (j > 0) {
                    this.battlefield[i][j].neighbors.push({X: i, Y: j - 1})
                }
                if (j < this.battlefield_Y - 1) {
                    this.battlefield[i][j].neighbors.push({X: i, Y: j + 1})
                }
            }
        }

        for (let unit of this.units) {
            this.battlefield[unit.X][unit.Y].unit = unit
        }
        // x * 10 + y
        this.player_human = Player.new('Player', 0, this.hero)
        this.player_human.create_visibility_map(this.battlefield)
        this.player_human.get_visible_tile(this.battlefield)
    }

    check_unit_existing() {
        for (let i = 0 ; i < this.units.length; i++){
        let unit = this.units[i]
            if (unit.health <= 0) {
                battlefield[unit.X][unit.Y].unit = null
                this.units.splice(i, 1)
            }
        }
    }

    get_tile_id_from_coords(tile) {
        return tile.X * this.battlefield_Y + tile.Y
    }
    get_coords_from_tile_id(id) {
        return {X: parseInt(id / this.battlefield_Y) , Y: id % this.battlefield_Y}
    }
      
    aStar (start, goal) {
        let frontier = new PriorityQueue(function(a, b) {
            return b.priority - a.priority;
        })
        frontier.enq({coords: start, priority: 0})
        let came_from = {}
        let cost_so_far = {}
        let id_start = this.get_tile_id_from_coords(start)
        came_from[id_start] = null
        cost_so_far[id_start] = 0
    
        while (frontier.size() !== 0) {
            let current = frontier.deq()
            if (current.coords.X === goal.X && current.coords.Y === goal.Y){
                return {path: came_from, cost: cost_so_far[this.get_tile_id_from_coords(current.coords)]}
            }
            let tile = this.battlefield[current.coords.X][current.coords.Y]
            for (let next of tile.neighbors){
                let nextTile = this.battlefield[next.X][next.Y]
                let new_cost = cost_so_far[this.get_tile_id_from_coords(current.coords)] + nextTile.mp_required
                let id_next = this.get_tile_id_from_coords(next)
                if (!cost_so_far[id_next] || new_cost < cost_so_far[id_next]){
                    if (this.battlefield[next.X][next.Y].is_passable && (this.battlefield[next.X][next.Y].squad === null || this.players[this.turn].visibility_map[next.X][next.Y] === 0)) {
                        cost_so_far[id_next] = new_cost
                        let priority = new_cost + goal.distance_to_tile(nextTile)
                        frontier.enq({coords: next, priority: priority})
                        came_from[id_next] = current
                    }
                }
            }
        }
        return null
    }

    move_squad_to_tile(squad_info, goal, res) {
        let squad = this.players[squad_info.player].squads[squad_info.index]
        let prevX = squad.X
        let prevY = squad.Y
        if (this.battlefield[goal.X][goal.Y].squad === null && this.battlefield[goal.X][goal.Y].is_passable && this.players[squad_info.player].squads[squad_info.index].cur_movement >= res.cost) {   
            this.players[squad_info.player].squads[squad_info.index].cur_movement -= res.cost
            this.players[squad_info.player].squads[squad_info.index].X = goal.X
            this.players[squad_info.player].squads[squad_info.index].Y = goal.Y
            this.battlefield[goal.X][goal.Y].squad = this.players[squad_info.player].squads[squad_info.index]
            this.battlefield[prevX][prevY].squad = null
            return true
        }
        return false
    }


    check_squad_access_tile(squad_info, start, goal) {
        let squad = this.players[squad_info.player].squads[squad_info.index]
        let res = this.aStar(start, goal)
        if (res) {
            if (res.cost > squad.cur_movement) {
                // console.log(squad.cur_movement)
                // console.log("not enough movement")
                return null
            } else {
                if (goal.is_passable === false || goal.squad) {
                    return null
                }
                let cur_key = this.get_tile_id_from_coords({X: goal.X, Y: goal.Y})
                let ret_path = []
                while (this.get_coords_from_tile_id(cur_key).X !== start.X || this.get_coords_from_tile_id(cur_key).Y !== start.Y){
                    ret_path.push([{X: this.get_coords_from_tile_id(cur_key).X, Y: this.get_coords_from_tile_id(cur_key).Y}, {X: res.path[cur_key].coords.X, Y: res.path[cur_key].coords.Y}])
                    cur_key = this.get_tile_id_from_coords(res.path[cur_key].coords)
                }
                return [ret_path, squad_info, goal, res]
            }
        } else {
            // console.log("cant access tile")
            return null
        }
    }

    get_tile_to_move (in_potential_range) {
        let priority = -1000
        let tile_ind = -1
        for (let i = 0; i < in_potential_range.length; i++) {
            let tile = in_potential_range[i]
            if (tile.priority > priority) {
                priority = tile.priority
                tile_ind = i
            }
        }
        return ([priority, tile_ind])
    }

    // make_AI_turns() {
    //     let squads_that_acted = []
    //     let attacked_squads = []
    //     if (this.turn === 1) {    
    //         for (let l = 0; l < this.player_reb.squads.length; l++) {
    //         let squad = this.player_reb.squads[l]
    //         // console.log(squad.vision)
    //             if (squad.AI) {
    //                 squad.AI.update_desire_map(this.battlefield, squad.X, squad.Y)
    //                 let distances = squad.AI.BFS({X: squad.X, Y: squad.Y}, this.battlefield, 0)
    //                 let priority = -1000
    //                 let in_potential_range = [] 
    //                 for (let i = 0 ; i < this.battlefield.length; i++) {
    //                     for (let j = 0 ; j < this.battlefield[0].length; j++) {
    //                         if (distances[i][j] <= squad.cur_movement) {
    //                             if (squad.AI.behavior === 'attack') {
    //                                 in_potential_range.push({X: i, Y: j, priority: squad.AI.desire_map_attack[i][j]})
    //                             }
    //                             if (squad.AI.behavior === 'flee') {
    //                                 in_potential_range.push({X: i, Y: j, priority: squad.AI.desire_map_flee[i][j]})
    //                             }
    //                         }
    //                     }
    //                 }
    //                 //console.log(in_potential_range)
    //                 this.player_reb.create_visibility_map(this.battlefield)
    //                 this.player_reb.get_visible_tile(this.battlefield)
    //                 let tile_inf = this.get_tile_to_move(in_potential_range)
    //                 while (tile_inf[1] !== -1) {
    //                     let tile = in_potential_range[tile_inf[1]]
    //                     let canGo = this.aStar({X: squad.X, Y: squad.Y}, this.battlefield[tile.X][tile.Y])
    //                     if (canGo) {
    //                         this.move_squad_to_tile({player:1, index: l},{X: tile.X, Y: tile.Y}, canGo)
    //                         this.player_reb.create_visibility_map(this.battlefield)
    //                         this.player_reb.get_visible_tile(this.battlefield)
    //                         squads_that_acted.push({squad: squad, index: l, player: 1})
    //                         priority = 1001
    //                         for (let k = 0; k < this.players[0].squads.length; k++) {
    //                             let target_squad = this.players[0].squads[k]
    //                             let range =  Math.abs(squad.X - target_squad.X) + Math.abs(squad.Y - target_squad.Y)
    //                             if (range <= squad.max_range && range >= squad.min_range){
    //                                 if (squad.has_attacked === false) {
    //                                     let tgt_tile = this.battlefield[target_squad.X][target_squad.Y]
    //                                     squad.attack_squad(target_squad, range, tgt_tile)
    //                                     attacked_squads.push({squad: target_squad, index: k, player: 0})
    //                                 }
    //                             }
    //                         }
    //                         // tile_inf[1] = -1
    //                         break
    //                     } else {
    //                         in_potential_range.splice(tile_inf[1], 1)
    //                         tile_inf = this.get_tile_to_move(in_potential_range)
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     return [squads_that_acted, attacked_squads]
    // }
    
}

let controller = null
module.exports.new = function () {
    let new_controller = new battle_controller()
    controller = new_controller
    return new_controller
}

//aStar returns path and cost OR null
module.exports.aStar = function (start, goal) {
    controller.aStar(start, goal)
}

//returns 
module.exports.check_squad_access_tile = function (squad_info, start, goal) {
    controller.check_squad_access_tile(squad_info, start, goal)
}

module.exports.move_squad_to_tile = function(squad_info, goal, res) {
    controller.move_squad_to_tile(squad_info, goal, res)
}

module.exports.get_tile_to_move = function(in_potential_range) {
    controller.get_tile_to_move(in_potential_range)
}

module.exports.check_unit_existing = function () {
    controller.check_unit_existing()
}