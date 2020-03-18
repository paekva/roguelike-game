let Squad = require('./Squad')
let Unit = require('./Unit')
let Weapon = require('./weapon')
let Armor = require('./Armor')
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
        let weapon_list = weapon_params.new()
        let unit_list = unit_params.new()
        let armor_list = armor_params.new()
        this.param_weapon_reb = weapon_list.ar_Tellur_old
        this.param_weapon_unarmed = weapon_list.fists
        this.param_weapon_gov = weapon_list.ar_Thalassa
        this.param_weapon_snooper = weapon_list.rf_Tellur_old
        this.param_weapon_flamer = weapon_list.flamer_Tellur
        this.param_weapon_mg = weapon_list.mg_Thalassa

        this.param_armor_reb = armor_list.armor_rebel
        this.param_armor_gov = armor_list.armor_old

        let units_reb = []
        let units_gov1 = []
        let units_gov2 = []
        let units_gov3 = []
        let units_civ1 = []
        let units_civ2 = []
        this.param_unit_reb = unit_list.aravian_rebel
        this.param_unit_civ = unit_list.aravian_civilian
        this.param_unit_gov = unit_list.mercenary_Thalassa
        for (let i = 0; i < 5; i++) {
            let unit1 = Unit.new(this.param_unit_reb, Weapon.new(this.param_weapon_reb), Armor.new(this.param_armor_reb))
            units_reb.push(unit1)
            let unit1g
            let unit2g
            let unit3g
            if (i === 0) {
                unit1g = Unit.new(this.param_unit_gov,Weapon.new(this.param_weapon_flamer),Armor.new(this.param_armor_gov))
                unit2g = Unit.new(this.param_unit_gov,Weapon.new(this.param_weapon_snooper),Armor.new(this.param_armor_gov))
                unit3g = Unit.new(this.param_unit_gov,Weapon.new(this.param_weapon_mg),Armor.new(this.param_armor_gov))
                
            } else {
                unit1g = Unit.new(this.param_unit_gov,Weapon.new(this.param_weapon_gov),Armor.new(this.param_armor_gov))
                unit2g = Unit.new(this.param_unit_gov,Weapon.new(this.param_weapon_gov),Armor.new(this.param_armor_gov))
                unit3g = Unit.new(this.param_unit_gov,Weapon.new(this.param_weapon_gov),Armor.new(this.param_armor_gov))
                
            }
            units_gov1.push(unit1g)
            units_gov2.push(unit2g)
            units_gov3.push(unit3g)
            let param_rand_civ = this.param_unit_civ
            if (getRandomInt(1) === 1) {
                param_rand_civ.gender = 'female'
            } else {
                param_rand_civ.gender = 'male'
            }
            let unit3 = Unit.new(param_rand_civ, Weapon.new(this.param_weapon_unarmed), Armor.new(this.param_armor_reb))
            param_rand_civ = this.param_unit_civ
            if (getRandomInt(1) === 1) {
                param_rand_civ.gender = 'female'
            } else {
                param_rand_civ.gender = 'male'
            }
            let unit4 = Unit.new(param_rand_civ, Weapon.new(this.param_weapon_unarmed), Armor.new(this.param_armor_reb))
            units_civ1.push(unit3)
            units_civ2.push(unit4)
 
        }

        this.battlefield = []

        //-----
        // this.battlefield_X = 11
        // this.battlefield_Y = 10
        // for (let i = 0; i < this.battlefield_X; i++) {
        //     this.battlefield.push([])
        //     for (let j = 0; j < this.battlefield_Y; j++) {
        //         if ((i === 1 && j === 3) || (i === 8 && j === 1) || (i === 5 && j === 6) || (i === 4 && j === 6) || (i === 3 && j === 6)){
        //             this.battlefield[i].push(Tile.new(i, j, 'desert_hill', 2, true, 15))
        //         } else if ((i === 4 && j === 5) || (i === 8 && j === 2)) {
        //             this.battlefield[i].push(Tile.new(i, j, 'house', 1, false, 0))
        //         } else {
        //             this.battlefield[i].push(Tile.new(i, j, 'desert', 1, true, 0))
        //         }
                
        //     }
        // }
        // for (let j = 0; j < this.battlefield_Y; j++) {
        //     this.battlefield[2][j] = (Tile.new(2, j, 'desert_hill', 2, true, 15))
        //     this.battlefield[3][j] = (Tile.new(3, j, 'desert_hill', 2, true, 15))
        // }

        // for (let i = 0; i < this.battlefield_X; i++) {
        //     for (let j = 0; j < this.battlefield_Y; j++) {
        //         if (i > 0) {
        //             this.battlefield[i][j].neighbors.push({X: i - 1, Y: j})
        //         }
        //         if (i < this.battlefield_X - 1) {
        //             this.battlefield[i][j].neighbors.push({X: i + 1, Y: j})
        //         }
        //         if (j > 0) {
        //             this.battlefield[i][j].neighbors.push({X: i, Y: j - 1})
        //         }
        //         if (j < this.battlefield_Y - 1) {
        //             this.battlefield[i][j].neighbors.push({X: i, Y: j + 1})
        //         }
        //     }
        // }
        // // x * 10 + y
        // this.player_gov = Player.new('Player', 0)
        // this.player_reb = Player.new('AI', 1)

        // this.AI_reb = AI.new(this.battlefield, this.player_reb.index, 'attack')
        // this.AI_civ = AI.new(this.battlefield, this.player_reb.index, 'flee')

        // this.squad_reb = Squad.new(units_reb, 5, 8, 1, this.AI_reb)
        // this.battlefield[5][8].squad = this.squad_reb
        // this.squad_civ1 = Squad.new(units_civ1, 7, 1, 1, this.AI_civ)
        // this.battlefield[7][1].squad = this.squad_civ1
        // this.squad_civ2 = Squad.new(units_civ2, 4, 2, 1, this.AI_civ)
        // this.battlefield[4][2].squad = this.squad_civ2
        // this.squad_gov1 = Squad.new(units_gov1, 5, 0, 0, null)
        // this.battlefield[5][0].squad = this.squad_gov1
        // this.squad_gov2 = Squad.new(units_gov2, 0, 5, 0, null)
        // this.battlefield[0][5].squad = this.squad_gov2
        // this.squad_gov3 = Squad.new(units_gov3, 5, 9, 0, null)
        // this.battlefield[5][9].squad = this.squad_gov3

    
        // this.player_gov.squads.push(this.squad_gov1)
        // this.player_gov.squads.push(this.squad_gov2)
        // this.player_gov.squads.push(this.squad_gov3)
        // this.player_reb.squads.push(this.squad_reb)
        // this.player_reb.squads.push(this.squad_civ1)
        // this.player_reb.squads.push(this.squad_civ2)
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
        // x * 10 + y
        this.player_gov = Player.new('Player', 0)
        this.player_reb = Player.new('AI', 1)

        this.AI_reb = AI.new(this.battlefield, this.player_reb.index, 'scout')
        this.AI_civ = AI.new(this.battlefield, this.player_reb.index, 'flee')

        this.squad_reb = Squad.new(units_reb, 12, 2, 1, this.AI_reb)
        this.battlefield[12][2].squad = this.squad_reb
        this.squad_civ1 = Squad.new(units_civ1, 11, 1, 1, this.AI_civ)
        this.battlefield[11][1].squad = this.squad_civ1
        this.squad_civ2 = Squad.new(units_civ2, 4, 2, 1, this.AI_civ)
        this.battlefield[4][2].squad = this.squad_civ2
        this.squad_gov1 = Squad.new(units_gov1, 0, 3, 0, null)
        this.battlefield[0][3].squad = this.squad_gov1
        this.squad_gov2 = Squad.new(units_gov2, 0, 4, 0, null)
        this.battlefield[0][4].squad = this.squad_gov2
        this.squad_gov3 = Squad.new(units_gov3, 0, 2, 0, null)
        this.battlefield[0][2].squad = this.squad_gov3

    
        this.player_gov.squads.push(this.squad_gov1)
        this.player_gov.squads.push(this.squad_gov2)
        this.player_gov.squads.push(this.squad_gov3)
        this.player_reb.squads.push(this.squad_reb)
        this.player_reb.squads.push(this.squad_civ1)
        this.player_reb.squads.push(this.squad_civ2)
        //-----
        
        this.players = []
        this.players.push(this.player_gov)
        this.players.push(this.player_reb)
        for (let player of this.players) {
            player.create_visibility_map(this.battlefield)
            player.get_visible_tile(this.battlefield)
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

// module.exports.make_AI_turns = function () {
//     controller.make_AI_turns()
// }