class Player {
    constructor(name, index) { 
        this.name = name
        this.index = index
        this.squads = []
        this.visibility_map = []
    }

    create_visibility_map (battlefield) {
        this.visibility_map = []
        for (let i = 0; i < battlefield.length; i++) {
            this.visibility_map.push([])
            for (let j = 0 ; j < battlefield[0].length; j++) {
                this.visibility_map[i].push(0)
            }
        }
    }

    print_map (desire_map) {
        // console.log("visibility " + this.name)
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

    get_visible_tile (battlefield) {
        for (let l = 0; l < this.squads.length; l++) {
            let squad = this.squads[l]
            let distances = squad.BFS({X: squad.X, Y: squad.Y}, battlefield, 1)
            for (let i = 0; i < battlefield.length; i++) {
                for (let j = 0 ; j < battlefield[0].length; j++) {
                    if (squad.vision >= distances[i][j]) {
                        this.visibility_map[i][j]++
                    }
                }
            }
        }
        // this.print_map(this.visibility_map)
    }

    check_squad_existing(battlefield) {
        for (let i = 0 ; i < this.squads.length; i++){
        let squad = this.squads[i]
            if (squad.units.length === 0) {
                battlefield[squad.X][squad.Y].squad = null
                this.squads.splice(i, 1)
            }
        }
    }
}

let player = null
module.exports.new = function (name, index) {
    new_player = new Player(name, index)
    player = new_player
    return new_player
}

module.exports.get_visible_tile = function (battlefield) {
    player.get_visible_tile(battlefield)
}


