const http = require('http');
const path = require('path');
const fs = require('fs');
let battle_controller = require('./src/server/battle_controller');

async function move_unit_iteratively(data) {
	io.sockets.emit('drawpathstop', {});
	for (let i = data[0].length - 1; i >= 0; i--) {
		let curtile = controller.battlefield[data[0][i][0].X][data[0][i][0].Y];
		let moved = controller.move_unit_to_tile(data[1], data[0][i][0], {
			cost: curtile.mp_required,
		});
		if (moved === false) {
			i = -1;
			controller.players[data[1].player].units[data[1].index].has_moved = true;
			io.sockets.emit('updateunit', {
				unit: controller.players[data[1].player].units[data[1].index],
				index: data[1].index,
				player: data[1].player,
				path: [],
			});
			break;
		}
		let new_path = [];
		new_path.push(data[0][i]);

		io.sockets.emit('updateunit', {
			unit: controller.players[data[1].player].units[data[1].index],
			index: data[1].index,
			player: data[1].player,
			path: new_path,
		});
		controller.players[data[1].player].create_visibility_map(
			controller.battlefield
		);
		controller.players[data[1].player].get_visible_tile(controller.battlefield);
		io.sockets.emit('getvisibility', {
			visibility_map: controller.players[data[1].player].visibility_map,
			player: data[1].player,
		});
		await sleep(100);
	}
	controller.players[data[1].player].units[data[1].index].has_moved = true;
	io.sockets.emit('updateunit', {
		unit: controller.players[data[1].player].units[data[1].index],
		index: data[1].index,
		player: data[1].player,
		path: [],
	});
}

function sleep(ms) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

function handleRequest(req, res) {
	// What did we request?
	let pathname = req.url;

	// If blank let's ask for index.html
	if (pathname == '/') {
		pathname = '/index.html';
	}

	// Ok what's our file extension
	let ext = path.extname(pathname);

	// Map extension to file type
	const typeExt = {
		'.html': 'text/html',
		'.js': 'text/javascript',
		'.css': 'text/css',
	};

	// What is it?  Default to plain text
	let contentType = typeExt[ext] || 'text/plain';

	// Now read and write back the file with the appropriate content type
	fs.readFile(__dirname + pathname, function(err, data) {
		if (err) {
			res.writeHead(500);
			return res.end('Error loading ' + pathname);
		}
		// Dynamically setting content type
		res.writeHead(200, { 'Content-Type': contentType });
		res.end(data);
	});
}

let server = http.createServer(handleRequest);
let controller = battle_controller.new();
server.listen(8082);
let io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket) {
	console.log('We have a new client: ' + socket.id);
	io.sockets.emit('Init', controller);
	socket.on('moveherotile', function(data) {
		let result = false;
		let orig_tile =
			controller.battlefield[controller.player_human.hero.X][controller.player_human.hero.Y];
		if (data === 'right') {
			result = controller.player_human.hero.move_unit(
				controller.battlefield[controller.player_human.hero.X + 1][controller.player_human.hero.Y]
			);
		}
		if (data === 'left') {
			result = controller.player_human.hero.move_unit(
				controller.battlefield[controller.player_human.hero.X - 1][controller.player_human.hero.Y]
			);
		}
		if (data === 'up') {
			result = controller.player_human.hero.move_unit(
				controller.battlefield[controller.player_human.hero.X][controller.player_human.hero.Y - 1]
			);
		}
		if (data === 'down') {
			result = controller.player_human.hero.move_unit(
				controller.battlefield[controller.player_human.hero.X][controller.player_human.hero.Y + 1]
			);
		}
		if (result) {
			orig_tile.unit = null;
			controller.player_human.get_visible_tile(controller.battlefield)
			io.sockets.emit('updateplayer', { player: controller.player_human });
			io.sockets.emit('updateunit', { unit: controller.units[0], index: 0 });
			controller.turn += 1
			controller.make_AI_turns()
			io.sockets.emit('updateunits', { units: controller.units });
		}

		// io.sockets.emit('updatebattlefield', controller)
	});

	socket.on('attackunit', function(data) {
		console.log(data);
		let attacker = controller.units[0];
		let defender = controller.units[data.defender];
		let range =
			Math.abs(attacker.X - defender.X) + Math.abs(attacker.Y - defender.Y);
		if (range <= attacker.max_range && range >= attacker.min_range) {
			attacker.attack_unit(defender);
			controller.check_unit_existing();
			io.sockets.emit('updateunits', { units: controller.units });
			controller.turn += 1
			controller.make_AI_turns()
			io.sockets.emit('updateunits', { units: controller.units });
			// io.sockets.emit('updatebattlefield', controller)
		} else {
			console.log('Out of range');
		}
	});

	socket.on('skipturn', function(data) {
		controller.turn += 1
		controller.make_AI_turns()
		io.sockets.emit('updateunits', { units: controller.units });
	})

	socket.on('endturn', function(data) {
		for (let j = 0; j < controller.players[controller.turn].units.length; j++) {
			let unit = controller.players[controller.turn].units[j];
			controller.turn = data.index;
			if (unit.owner === data.index) {
				unit.has_attacked = false;
				unit.has_moved = false;
				unit.cur_movement = unit.movement;
				io.sockets.emit('updateunit', {
					unit: unit,
					index: j,
					player: controller.turn,
					path: [],
				});
			}
		}
		if (controller.turn === 0) {
			controller.turn = 1;

			//move AI
			for (
				let l = 0;
				l < controller.players[controller.turn].units.length;
				l++
			) {
				let units_that_acted = [];
				let attacked_units = [];
				let unit = controller.player_reb.units[l];
				// console.log(unit.vision)
				if (unit.AI) {
					controller.players[controller.turn].create_visibility_map(
						controller.battlefield
					);
					controller.players[controller.turn].get_visible_tile(
						controller.battlefield
					);
					unit.AI.update_desire_map(
						controller.battlefield,
						unit.X,
						unit.Y,
						controller.players[controller.turn].visibility_map
					);
					let distances = unit.AI.BFS(
						{ X: unit.X, Y: unit.Y },
						controller.battlefield,
						1
					);
					let in_potential_range = [];
					for (let i = 0; i < controller.battlefield.length; i++) {
						for (let j = 0; j < controller.battlefield[0].length; j++) {
							if (distances[i][j] <= unit.cur_movement) {
								in_potential_range.push({
									X: i,
									Y: j,
									priority: unit.AI.final_desire_map[i][j],
								});
								// if (unit.AI.behavior === 'attack') {
								//     in_potential_range.push({X: i, Y: j, priority: unit.AI.desire_map_attack[i][j]})
								// }
								// if (unit.AI.behavior === 'flee') {
								//     in_potential_range.push({X: i, Y: j, priority: unit.AI.desire_map_flee[i][j]})
								// }
							}
						}
					}

					let tile_inf = controller.get_tile_to_move(in_potential_range);
					while (tile_inf[1] !== -1) {
						let tile = in_potential_range[tile_inf[1]];
						let checkAccess = controller.check_unit_access_tile(
							{ player: controller.turn, index: l },
							unit,
							controller.battlefield[tile.X][tile.Y]
						);
						if (checkAccess) {
							let canGo = checkAccess[3];
							if (canGo !== null) {
								move_unit_iteratively(checkAccess);
								// controller.move_unit_to_tile({player: controller.turn, index: l},{X: tile.X, Y: tile.Y}, canGo)
								// controller.players[controller.turn].create_visibility_map(controller.battlefield)
								// controller.players[controller.turn].get_visible_tile(controller.battlefield)
								units_that_acted.push({
									unit: unit,
									index: l,
									player: 1,
									path: [],
								});
								priority = 1001;
								for (let k = 0; k < controller.players[0].units.length; k++) {
									let target_unit = controller.players[0].units[k];
									if (
										controller.players[controller.turn].visibility_map[
											target_unit.X
										][target_unit.Y] !== 0
									) {
										let range =
											Math.abs(unit.X - target_unit.X) +
											Math.abs(unit.Y - target_unit.Y);
										if (range <= unit.max_range && range >= unit.min_range) {
											if (unit.has_attacked === false) {
												let tgt_tile =
													controller.battlefield[target_unit.X][target_unit.Y];
												unit.attack_unit(target_unit, range, tgt_tile);
												controller.players[
													target_unit.owner
												].check_unit_existing(controller.battlefield);
												attacked_units.push({
													unit: target_unit,
													index: k,
													player: 0,
													path: [],
												});
											}
										}
									}
								}
								// tile_inf[1] = -1
								break;
							} else {
								in_potential_range.splice(tile_inf[1], 1);
								tile_inf = controller.get_tile_to_move(in_potential_range);
							}
						} else {
							in_potential_range.splice(tile_inf[1], 1);
							tile_inf = controller.get_tile_to_move(in_potential_range);
						}
					}
					if (units_that_acted.length > 0) {
						for (let unit of units_that_acted) {
							io.sockets.emit('updateunit', unit);
						}
						if (attacked_units.length > 0) {
							for (let unit of attacked_units) {
								io.sockets.emit('updateunit', unit);
							}
						}
					}
				}
			}
			io.sockets.emit('getvisibility', {
				visibility_map: controller.players[controller.turn].visibility_map,
				player: controller.turn,
			});
		} else {
			controller.turn = 0;
		}

		io.sockets.emit('updateturn', { index: controller.turn });
	});
});

console.log('Server started on port 8082');
