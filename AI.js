class AI {

    constructor (battlefield, player, behavior) { 
        this.player = player
        this.desires = []
        this.desire_map_attack = []
        this.desire_map_flee = []
        this.desire_map_stay_close_to_allies = []
        this.desire_map_stay_in_cover = []
        this.final_desire_map = []
        this.desire_map_scout = []
        this.create_desire_map(battlefield)
        this.behavior = behavior
        this.modifiers = {attack: 1, flee: 0, cover: 0.5, allies: 0.5}
        this.set_modifiers_by_behavior()
        this.X = -1
        this.Y = -1
    }
    
    set_modifiers_by_behavior() {
        if (this.behavior == 'attack') {
            this.modifiers = {attack: 0.75, flee: 0, cover: 0.5, allies: 0.5, scout: 0}
        }
        if (this.behavior == 'flee') {
            this.modifiers = {attack: 0, flee: 1, cover: 0.5, allies: 0.5, scout: 0}
        }
        if (this.behavior == 'firefight') {
            this.modifiers = {attack: 0.5, flee: 0.25, cover: 0.75, allies: 0.75, scout: 0}
        }
        if (this.behavior == 'scout') {
            this.modifiers = {attack: 0, flee: 0, cover: (1/3) * 0.3, allies: -0.25, scout: 1}
        }
    }

    BFS (start, battlefield, mode) {
        //mode = 0 -> calculate distance in tiles, 1 -> range with terrain, 2 -> vision distance
        let visited = []
        let distance = []
        for (let i = 0; i < battlefield.length; i++) {
            visited.push([])
            distance.push([])
            for (let j = 0 ; j < battlefield[0].length; j++) {
                visited[i].push(false)
                distance[i].push(1000)
            }
        }
        visited[start.X][start.Y] = true
        distance[start.X][start.Y] = 0
        let toExplore = [start]
        while (toExplore.length > 0) {
            let tileIndex = toExplore.shift();
            for (let neighbor of battlefield[tileIndex.X][tileIndex.Y].neighbors) {
                if (battlefield[neighbor.X][neighbor.Y].is_passable){
                    // if (battlefield[neighbor.X][neighbor.Y].squad === null || battlefield[neighbor.X][neighbor.Y].squad.owner === this.player){
                        if (!visited[neighbor.X][neighbor.Y]) {
                            visited[neighbor.X][neighbor.Y] = true
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

    print_map (desire_map) {
        let Xlength = desire_map.length
        let Ylength = desire_map[0].length
        let str = ''
        for (let i = 0; i < Ylength;i++) {
            for (let j = 0; j < Xlength; j++){
                str += desire_map[j][i] + ' '
            }
            console.log(str)
            str = ''
        }
    }

    create_desire_map(battlefield) {
        this.desire_map_attack = []
        this.desire_map_flee = []
        this.desire_map_stay_close_to_allies = []
        this.desire_map_stay_in_cover = []
        this.final_desire_map = []
        this.desire_map_scout = []
        let battlefieldX = battlefield.length
        let battlefieldY = battlefield[0].length
        for (let i = 0; i < battlefieldX; i++) {
            this.desire_map_attack.push([])
            this.desire_map_scout.push([])
            this.desire_map_flee.push([])
            this.desire_map_stay_close_to_allies.push([])
            this.final_desire_map.push([])
            this.desire_map_stay_in_cover.push([])
            for (let j = 0 ; j < battlefieldY; j++) {
                this.desire_map_attack[i].push(0)
                this.desire_map_flee[i].push(0)
                this.desire_map_scout[i].push(0)
                this.desire_map_stay_close_to_allies[i].push(0)
                this.desire_map_stay_in_cover[i].push(0)
                this.final_desire_map[i].push(0)
            }
        }
    }

    init_desire_map_scout (battlefield) {
       for (let i = 0 ; i < battlefield.length; i++) {
            for (let j = 0 ; j < battlefield[0].length; j++) {
                if (this.vis_map[i][j] !== 0) {
                    this.desire_map_scout[i][j] = 0
                }  else {
                    this.desire_map_scout[i][j] = 1
                }
            }
        }
    }

    init_desire_map (battlefield, desire_map, invert, fade) {
        for (let i = 0 ; i < battlefield.length; i++) {
            for (let j = 0 ; j < battlefield[0].length; j++) {
                desire_map[i][j] = 0
                if (battlefield[i][j].squad) {
                    if (this.vis_map[i][j] !== 0) {
                        if (battlefield[i][j].squad.owner !== this.player) {
                            if (invert === false) {
                                desire_map[i][j] = fade
                            }
                            if (invert === true) {
                                desire_map[i][j] = fade * (-1)
                            }
                        }
                    }
                }
            }
        }
    }

    init_desire_map_stay_close_to_allies (battlefield, fade) {
        for (let i = 0 ; i < battlefield.length; i++) {
            for (let j = 0 ; j < battlefield[0].length; j++) {
                // console.log(this.desire_map_attack)
                this.desire_map_stay_close_to_allies[i][j] = 0
                if (battlefield[i][j].squad) {
                    if (battlefield[i][j].squad.owner === this.player) {
                        if (i !== this.X || j !== this.Y) {
                            this.desire_map_stay_close_to_allies[i][j] = fade
                        }
                    }
                }
            }
        }
    }

    // init_desire_map_stay_in_range (battlefield) {
    //     for (let i = 0 ; i < battlefield.length; i++) {
    //         for (let j = 0 ; j < battlefield[0].length; j++) {
    //             // console.log(this.desire_map_attack)
    //             this.desire_map_stay_close_to_allies[i][j] = 1000
    //             if (battlefield[i][j].squad) {
    //                 if (battlefield[i][j].squad.owner === this.player) {
    //                     this.desire_map_stay_close_to_allies[i][j] = 0
    //                 }
    //             }
    //         }
    //     }
    // }

    fill_desire_map_scout_step2(battlefield) {
        for (let i = 0 ; i < battlefield.length; i++) {
            for (let j = 0 ; j < battlefield[0].length; j++) {
                if (this.vis_map[i][j] === 0) {
                    this.desire_map_scout[i][j] += 1                
                }
            }
        }
    }

    fill_desire_map(battlefield, desire_map, counter, invert, strength) {
        let change = false
        for (let i = 0 ; i < battlefield.length; i++) {
            for (let j = 0 ; j < battlefield[0].length; j++) {
                let neighbors = battlefield[i][j].neighbors
                // if (battlefield[i][j].is_passable && (battlefield[i][j].squad === null || battlefield[i][j].squad.owner === this.player)) {
                if (battlefield[i][j].is_passable) {
                    for (let neighbor of neighbors) {  
                        if (invert === false) {
                            // && desire_map[neighbor.X][neighbor.Y] + 1 <= fade)
                            if (desire_map[neighbor.X][neighbor.Y] - (1 * strength) > desire_map[i][j]) {
                                desire_map[i][j] = desire_map[neighbor.X][neighbor.Y] - (1 * strength)
                                change = true
                            }
                        }
                        if (invert === true) {
                            if (desire_map[neighbor.X][neighbor.Y] + (1 * strength) < desire_map[i][j]) {
                                desire_map[i][j] = desire_map[neighbor.X][neighbor.Y] + (1 * strength)
                                change = true
                            }
                        }
                    }
                }
            }
        }
        if (change === false) {
            return
        } else {
            counter++
            this.fill_desire_map(battlefield, desire_map, counter, invert, strength)
        }
    }
   
    init_desire_map_stay_in_cover(battlefield) {
        for (let i = 0 ; i < battlefield.length; i++) {
            for (let j = 0 ; j < battlefield[0].length; j++) {
                let desirability = ((battlefield[i][j].eva_bonus - (battlefield[i][j].eva_bonus % 5)) / 5 )
                this.desire_map_stay_in_cover[i][j] = desirability
            }
        }
    }

    fill_final_desire_map (battlefield) {
        for (let i = 0 ; i < battlefield.length; i++) {
            for (let j = 0 ; j < battlefield[0].length; j++) {
                this.final_desire_map[i][j] = (this.desire_map_attack[i][j] * this.modifiers.attack) + (this.desire_map_flee[i][j] * this.modifiers.flee) + (this.desire_map_stay_in_cover[i][j] * this.modifiers.cover) + (this.desire_map_stay_close_to_allies[i][j] * this.modifiers.allies) + (this.desire_map_scout[i][j] * this.modifiers.scout)
            }
        }
    }

    update_desire_map(battlefield, X, Y, visib_map) {
        this.X = X
        this.Y = Y
        this.vis_map = visib_map
        this.init_desire_map(battlefield, this.desire_map_attack, false, 10)
        this.init_desire_map(battlefield, this.desire_map_flee, true, 10)
        this.fill_desire_map(battlefield, this.desire_map_attack, 0, false, 1)
        this.fill_desire_map(battlefield, this.desire_map_flee, 0, true, 1)
        this.init_desire_map_stay_close_to_allies(battlefield, 3)
        this.fill_desire_map(battlefield, this.desire_map_stay_close_to_allies, 0, false, 1)
        this.init_desire_map_stay_in_cover(battlefield)
        this.init_desire_map_scout(battlefield, 0)
        this.fill_desire_map(battlefield, this.desire_map_scout, 0, true, 0.1)
        this.fill_desire_map_scout_step2(battlefield)
        // this.fill_desire_map_scout(battlefield, 0, 0.1)
        this.fill_final_desire_map(battlefield)
        if (this.behavior === 'attack' || this.behavior === 'scout') {
            // console.log('attack')
            // this.print_map(this.desire_map_attack)
            // console.log('flee')
            // this.print_map(this.desire_map_flee)
            // console.log('cover')
            // this.print_map(this.desire_map_stay_in_cover)
            // console.log('allies')
            // this.print_map(this.desire_map_stay_close_to_allies)
            console.log("scout")
            this.print_map(this.desire_map_scout)
            console.log('final')
            this.print_map(this.final_desire_map)
        }
       
        // console.log('flee')
        // this.print_map(this.desire_map_flee)
        // console.log('cover')
        // this.print_map(this.desire_map_stay_in_cover)
        // console.log('allies')
        // this.print_map(this.desire_map_stay_close_to_allies)
        // console.log('final')
        // this.print_map(this.final_desire_map)
    }

}
let squad_AI = null
module.exports.new = function (battlefield, player, behavior) {
    new_squad_AI = new AI(battlefield, player, behavior)
    squad_AI = new_squad_AI
    return new_squad_AI
}

module.exports.update_desire_map = function (battlefield, X, Y, visib_map) {
    squad_AI.update_desire_map(battlefield, X, Y, visib_map)
}

module.exports.BFS = function (start, battlefield, mode) {
    squad_AI.BFS(start, battlefield, mode)
}

