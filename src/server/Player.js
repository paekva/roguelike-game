class Player {
	constructor(name, index, hero) {
		this.name = name;
		this.index = index;
		this.squads = [];
		this.visibility_map = [];
		this.hero = hero;
	}

	create_visibility_map(battlefield) {
		this.visibility_map = [];
		for (let i = 0; i < battlefield.length; i++) {
			this.visibility_map.push([]);
			for (let j = 0; j < battlefield[0].length; j++) {
				this.visibility_map[i].push(0);
			}
		}
	}

	print_map(desire_map) {
		// console.log("visibility " + this.name)
		let Xlength = desire_map.length;
		let Ylength = desire_map[0].length;
		let str = '';
		for (let i = 0; i < Ylength; i++) {
			for (let j = 0; j < Xlength; j++) {
				str += desire_map[j][i] + ' ';
			}
			console.log(str);
			str = '';
		}
	}

	BFS(start, battlefield, mode) {
		//mode = 0 -> calculate distance in tiles, 1 -> range with terrain, 2 -> vision distance
		let visited = [];
		let distance = [];
		for (let i = 0; i < battlefield.length; i++) {
			visited.push([]);
			distance.push([]);
			for (let j = 0; j < battlefield[0].length; j++) {
				visited[i].push(false);
				distance[i].push(1000);
			}
		}
		visited[start.X][start.Y] = true;
		distance[start.X][start.Y] = 0;
		let toExplore = [start];
		while (toExplore.length > 0) {
			let tileIndex = toExplore.shift();
			for (let neighbor of battlefield[tileIndex.X][tileIndex.Y].neighbors) {
				if (battlefield[neighbor.X][neighbor.Y].is_passable) {
					// if (battlefield[neighbor.X][neighbor.Y].squad === null || battlefield[neighbor.X][neighbor.Y].squad.owner === this.player){
					if (!visited[neighbor.X][neighbor.Y]) {
						visited[neighbor.X][neighbor.Y] = true;
						if (mode === 0) {
							if (distance[neighbor.X][neighbor.Y] === 1000) {
								distance[neighbor.X][neighbor.Y] =
									distance[tileIndex.X][tileIndex.Y] + 1;
							}
						}
						if (mode === 1) {
							if (
								distance[neighbor.X][neighbor.Y] >
								distance[tileIndex.X][tileIndex.Y] +
									battlefield[tileIndex.X][tileIndex.Y].mp_required
							) {
								distance[neighbor.X][neighbor.Y] =
									distance[tileIndex.X][tileIndex.Y] +
									battlefield[tileIndex.X][tileIndex.Y].mp_required;
							}
						}
						toExplore.push({ X: neighbor.X, Y: neighbor.Y });
					}
					// }
				}
			}
		}
		return distance;
	}

	get_visible_tile(battlefield) {
		let distances = this.BFS(
			{ X: this.hero.X, Y: this.hero.Y },
			battlefield,
			1
		);
		for (let i = 0; i < battlefield.length; i++) {
			for (let j = 0; j < battlefield[0].length; j++) {
				if (this.hero.vision >= distances[i][j]) {
					this.visibility_map[i][j] = 1;
				} else {
					this.visibility_map[i][j] = 0;
				}
			}
		}

		this.print_map(this.visibility_map);
	}
}

let player = null;
module.exports.new = function(name, index, hero) {
	new_player = new Player(name, index, hero);
	player = new_player;
	return new_player;
};

module.exports.get_visible_tile = function(battlefield) {
	player.get_visible_tile(battlefield);
};
