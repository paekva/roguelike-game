let canvassize = 400;
let dialogue = 4;
let battlefield_active = true;
let controller;
let chosen_unit;
let turn = 0;
let shiftX = 25;
let shiftY = 0;
let tile_size = 25;

let unit_info;
let dialogue_zone;
let battlefield_map;
let unit_info_popup;
let unit_info_required = false;
let unit_info_requested;

let draw_path = false;
let move_through_path = -1;
let unit_that_is_moved = null;
let path_to_move;
let confirm_move_info;
let chosen_tile;

function checkClickOnUnit() {
	if (move_through_path === -1) {
		let valX = (mouseX - shiftX) / tile_size;
		let valY = (mouseY - shiftY) / tile_size;
		for (let i = 0; i < controller.units.length; i++) {
			let unit = controller.units[i];
			if (
				valX > unit.X &&
				valX < unit.X + 1 &&
				valY > unit.Y &&
				valY < unit.Y + 1
			) {
				// console.log("checking")
				// We found a unit
				// return unit
				// console.log(controller.player_human.visibility_map[unit.X][unit.Y])
				if (controller.player_human.visibility_map[unit.X][unit.Y] !== 0) {
					return i;
				} else {
					return -1;
				}
			}
		}
	}
	return -1;
}

function circling_lines(turn, unit) {
	battlefield_map.strokeWeight(3);
	battlefield_map.stroke(0, 192, 0);
	if (turn > 0 && turn <= tile_size) {
		battlefield_map.line(
			unit.X * tile_size + shiftX,
			(unit.Y + 1) * tile_size - turn + shiftY,
			unit.X * tile_size + shiftX,
			unit.Y * tile_size + shiftY
		); //vert
		battlefield_map.line(
			unit.X * tile_size + shiftX,
			unit.Y * tile_size + shiftY,
			unit.X * tile_size + turn + shiftX,
			unit.Y * tile_size + shiftY
		); //hor
	}
	if (turn > tile_size && turn <= tile_size * 2) {
		turn = turn - tile_size;
		battlefield_map.line(
			(unit.X + 1) * tile_size + shiftX,
			unit.Y * tile_size + shiftY,
			(unit.X + 1) * tile_size + shiftX,
			unit.Y * tile_size + turn + shiftY
		); //vert
		battlefield_map.line(
			unit.X * tile_size + shiftX + turn,
			unit.Y * tile_size + shiftY,
			(unit.X + 1) * tile_size + shiftX,
			unit.Y * tile_size + shiftY
		); //hor
	}
	if (turn > tile_size * 2 && turn <= tile_size * 3) {
		turn = turn - tile_size * 2;
		battlefield_map.line(
			(unit.X + 1) * tile_size + shiftX,
			unit.Y * tile_size + turn + shiftY,
			(unit.X + 1) * tile_size + shiftX,
			(unit.Y + 1) * tile_size + shiftY
		); //vert
		battlefield_map.line(
			(unit.X + 1) * tile_size + shiftX,
			(unit.Y + 1) * tile_size + shiftY,
			(unit.X + 1) * tile_size - turn + shiftX,
			(unit.Y + 1) * tile_size + shiftY
		); //hor
	}
	if (turn > tile_size * 3 && turn <= tile_size * 4) {
		turn = turn - tile_size * 3;
		battlefield_map.line(
			unit.X * tile_size + shiftX,
			(unit.Y + 1) * tile_size + shiftY,
			unit.X * tile_size + shiftX,
			(unit.Y + 1) * tile_size - turn + shiftY
		); //vert
		battlefield_map.line(
			unit.X * tile_size + shiftX,
			(unit.Y + 1) * tile_size + shiftY,
			(unit.X + 1) * tile_size - turn + shiftX,
			(unit.Y + 1) * tile_size + shiftY
		); //hor
	}
	battlefield_map.strokeWeight(0);
	battlefield_map.stroke('black');
}

function preload() {
	//rawnames = loadStrings('http://localhost:8080/p5/empty-example/test.txt')
}
function setup() {
	socket = io.connect();
	createCanvas(canvassize + 100, canvassize);
	textSize(15);
	unit_info = createGraphics(400, 100);
	dialogue_zone = createGraphics(400, 100);
	battlefield_map = createGraphics(400, 300);
	unit_info_popup = createGraphics(225, 150);

	socket.on('Init', function(data) {
		controller = data;
	});

	socket.on('updatebattlefield', function(data) {
		controller = data;
	});

	socket.on('updateunits', function(data) {
		controller.units = data.units;
	});

	socket.on('updateunit', function(data) {
		// console.log(controller.players[controller.turn].visibility_map)
		if (data.path.length === 0) {
			controller.players[data.player].units[data.index] = data.unit;
			if (data.unit.units.length === 0) {
				controller.players[data.player].units.splice(data.index, 1);
			}
		} else {
			move_through_path = 0;
			path_to_move = data.path;
			unit_that_is_moved = controller.players[data.player].units[data.index];
		}
	});

	socket.on('getvisibility', function(data) {
		controller.players[data.player].visibility_map = data.visibility_map;
	});
	socket.on('drawpath', function(data) {
		draw_path = true;
		path = data.res[0];
		confirm_move_info = data.res;
	});
	socket.on('drawpathstop', function(data) {
		draw_path = false;
		path = null;
		confirm_move_info = null;
	});

	socket.on('updateturn', function(data) {
		chosen_unit = null;
		draw_path = false;
		path = null;
		confirm_move_info = null;
		controller.turn = data.index;
		console.log('Turn of player: ' + controller.turn);
	});
}
function draw() {
	background(255);
	if (controller) {
		drawBattlefieldMap();
		image(battlefield_map, 0, 0);
	}
	strokeWeight(1);

	if (dialogue === 4) {
		drawUnitInfo();
		image(unit_info, 0, 250);
	} else {
		drawDialogue();
		image(dialogue_zone, 0, 250);
	}

	// if (unit_info_required) {
	// 	drawunitInfoPopup(unit_info_requested)
	// 	image(unit_info_popup, shiftX + 25, shiftY + 20);
	// }
}

function moveThroughPath(path, unit) {
	if (move_through_path < path.length * 5) {
		let tile_index = Math.floor(move_through_path / 5);
		tile_index = path.length - tile_index - 1;
		let path_part = ((move_through_path % 5) + 1) / 5;
		let line_path = path[tile_index];
		let x1 = line_path[0].X;
		let x2 = line_path[1].X;
		let y1 = line_path[0].Y;
		let y2 = line_path[1].Y;
		unit.X = x2 - (x2 - x1) * path_part;
		unit.Y = y2 - (y2 - y1) * path_part;
		move_through_path++;
		// console.log(unit.X + ' ' + unit.Y)
	} else {
		move_through_path = -1;
		unit_that_is_moved = null;
	}
}

function drawPath(path) {
	// console.log(data.res)
	// console.log(path)
	for (let line_path of path) {
		battlefield_map.stroke('green');
		battlefield_map.strokeWeight(10);
		let x1 = line_path[0].X * tile_size + shiftX + tile_size / 2;
		let x2 = line_path[1].X * tile_size + shiftX + tile_size / 2;
		let y1 = line_path[0].Y * tile_size + shiftY + tile_size / 2;
		let y2 = line_path[1].Y * tile_size + shiftY + tile_size / 2;
		battlefield_map.line(x1, y1, x2, y2);
		battlefield_map.stroke('black');
		battlefield_map.strokeWeight(1);
	}
}

function drawTile(tile, fog) {
	// console.log(tile.X + ' ' + tile.Y)

	if (tile.type === 'desert') {
		battlefield_map.fill('yellow');
		battlefield_map.square(
			tile.X * tile_size + shiftX,
			tile.Y * tile_size + shiftY,
			tile_size - 1
		);
		battlefield_map.fill('black');
		let pointx = tile.X * tile_size + shiftX;
		let pointy = tile.Y * tile_size + shiftY;
		battlefield_map.noFill();
		battlefield_map.strokeWeight(1.5);
		battlefield_map.bezier(
			pointx + 5,
			pointy + 16,
			pointx + 10,
			pointy + 8,
			pointx + 15,
			pointy + 25,
			pointx + 20,
			pointy + 16
		);
		battlefield_map.fill(0);
		battlefield_map.strokeWeight(1);
	}

	if (tile.type === 'desert_hill') {
		battlefield_map.fill('yellow');
		battlefield_map.square(
			tile.X * tile_size + shiftX,
			tile.Y * tile_size + shiftY,
			tile_size - 1
		);
		battlefield_map.fill('black');
		let pointx = tile.X * tile_size + shiftX;
		let pointy = tile.Y * tile_size + shiftY;
		battlefield_map.noFill();
		battlefield_map.strokeWeight(1.5);
		battlefield_map.bezier(
			pointx + 2,
			pointy + 8,
			pointx + 7,
			pointy,
			pointx + 12,
			pointy + 16,
			pointx + 17,
			pointy + 8
		);
		battlefield_map.bezier(
			pointx + 7,
			pointy + 16,
			pointx + 12,
			pointy + 8,
			pointx + 17,
			pointy + 25,
			pointx + 22,
			pointy + 16
		);
		battlefield_map.fill(0);
		battlefield_map.strokeWeight(1);
	}

	if (tile.type === 'house') {
		battlefield_map.fill('yellow');
		battlefield_map.square(
			tile.X * tile_size + shiftX,
			tile.Y * tile_size + shiftY,
			tile_size - 1
		);
		battlefield_map.noFill();
		battlefield_map.square(
			tile.X * tile_size + shiftX + 2,
			tile.Y * tile_size + shiftY + 2,
			tile_size - 1 - 2
		);

		battlefield_map.fill(0);
		battlefield_map.strokeWeight(1);
	}

	if (fog === true) {
		battlefield_map.strokeWeight(2);
		battlefield_map.stroke('white');
		battlefield_map.noFill();
		battlefield_map.square(
			tile.X * tile_size + shiftX,
			tile.Y * tile_size + shiftY,
			tile_size - 1
		);
		battlefield_map.fill(0);
		battlefield_map.stroke('black');
		battlefield_map.strokeWeight(1);
	}
}

function drawBattlefieldMap() {
	battlefield_map.background(255);
	battlefield_map.fill(0);
	for (let i = 0; i < controller.battlefield.length; i++) {
		for (let j = 0; j < controller.battlefield[i].length; j++) {
			if (controller.player_human.visibility_map[i][j] === 0) {
				drawTile(controller.battlefield[i][j], true);
			} else {
				drawTile(controller.battlefield[i][j], false);
			}
		}
	}
	battlefield_map.strokeWeight(0);

	for (let i = 0; i < controller.units.length; i++) {
		let unit = controller.units[i];
		if (unit.energy) {
			circling_lines(turn, unit);
			turn++;
			if (turn > 100) {
				turn = 0;
			}
			battlefield_map.fill(0);
			battlefield_map.ellipse(
				unit.X * tile_size + tile_size / 2 + shiftX,
				unit.Y * tile_size + tile_size / 2 + shiftY,
				23,
				23
			);
			// }
		} else {
			battlefield_map.fill(0, 255, 0);
			battlefield_map.ellipse(
				unit.X * tile_size + tile_size / 2 + shiftX,
				unit.Y * tile_size + tile_size / 2 + shiftY,
				23,
				23
			);
			battlefield_map.fill('yellow');
			battlefield_map.ellipse(
				unit.X * tile_size + 16 / 2 + shiftX,
				unit.Y * tile_size + 16 / 2 + shiftY,
				14,
				14
			);
		}
	}

	if (draw_path) {
		drawPath(path);
	}

	if (move_through_path >= 0) {
		moveThroughPath(path_to_move, unit_that_is_moved);
	}

	battlefield_map.strokeWeight(1);
	battlefield_map.fill(0);
}

function drawDialogue() {
	dialogue_zone.background(255);
	dialogue_zone.strokeWeight(0);
	dialogue_zone.textSize(15);
	battlefield_active = true;
}

function drawUnitInfo() {
	if (controller) {
		unit_info.background(255);
		unit_info.strokeWeight(1);
		unit_info.fill(0);
		let getting_unit_info = false;
		let index = -1;
		index = checkClickOnUnit();
		if (index !== -1) {
			let unit = controller.units[index];
			unit_info.strokeWeight(0);
			unit_info.textSize(10);
			unit_info.text(
				unit.firstname +
					' ' +
					unit.lastname +
					' ' +
					unit.health +
					' ' +
					unit.energy,
				10,
				15
			);
			unit_info.textSize(15);
			unit_info.strokeWeight(1);
			getting_unit_info = true;
		}
		if (chosen_unit && !getting_unit_info) {
			let unit = controller.units[0];

			unit_info.strokeWeight(0);
			unit_info.textSize(10);
			unit_info.text(
				unit.firstname +
					' ' +
					unit.lastname +
					' ' +
					unit.health +
					' ' +
					unit.energy,
				10,
				15
			);
			unit_info.textSize(15);
			unit_info.strokeWeight(1);
		}
	}
}

// function drawunitInfoPopup(unit) {
// 	unit_info_popup.background(255, 0, 0)
// 	unit_info_popup.textSize(10);
// 	unit_info_popup.text('Name', 5, 10)
// 	unit_info_popup.text('HP', 48, 10)
// 	unit_info_popup.text('RNG', 73, 10)
// 	unit_info_popup.text('DMG', 98, 10)
// 	unit_info_popup.text('SPD', 123, 10)
// 	unit_info_popup.text('ACC', 148, 10)
// 	unit_info_popup.text('EVA', 173, 10)
// 	unit_info_popup.text('DEF', 198, 10)

// 	for (let i = 0; i < unit.units.length; i++){
// 		unit_info_popup.text(unit.units[i].firstname + ' ' + unit.units[i].lastname.substring(0, 1), 5, 25 + (i * 10))
// 		unit_info_popup.text(unit.units[i].health + '/' + unit.units[i].death_health, 48, 25 + (i * 10))
// 		unit_info_popup.text(unit.units[i].weapon.min_range + '-' + unit.units[i].weapon.max_range, 73, 25 + (i * 10))
// 		unit_info_popup.text(unit.units[i].weapon.min_damage + '-' + unit.units[i].weapon.max_damage, 98, 25 + (i * 10))
// 		unit_info_popup.text(unit.units[i].movement, 123, 25 + (i * 10))
// 		unit_info_popup.text((unit.units[i].accuracy + unit.units[i].weapon.accuracy), 148, 25 + (i * 10))
// 		unit_info_popup.text((unit.units[i].evasion + unit.units[i].armor.evasion), 173, 25 + (i * 10))
// 		unit_info_popup.text((unit.units[i].armor.damage_reduction), 198, 25 + (i * 10))
// 	}
// }

function keyPressed() {
	if (keyCode === ENTER) {
		if (dialogue < 4) {
			dialogue++;
		}
	}

	if (keyCode === 27) {
		if (unit_info_required === true) {
			battlefield_active = true;
			unit_info_required = false;
		}
	}

	if (keyCode === 68) {
		socket.emit('moveherotile', 'right');
		// shiftX += tile_size
	}
	if (keyCode === 65) {
		socket.emit('moveherotile', 'left');
		// shiftX -= tile_size
	}
	if (keyCode === 87) {
		socket.emit('moveherotile', 'up');
		// shiftY -= tile_size
	}
	if (keyCode === 83) {
		socket.emit('moveherotile', 'down');
		// shiftY += tile_size
	}

	// if (keyCode === 68) {
	// 	shiftX += tile_size
	// }
	// if (keyCode === 65) {
	// 	shiftX -= tile_size
	// }
	// if (keyCode === 87) {
	// 	shiftY -= tile_size
	// }
	// if (keyCode === 83) {
	// 	shiftY += tile_size
	// }

	if (chosen_unit && battlefield_active) {
	}

	if (keyCode === 59 && battlefield_active) {
		console.log('End turn of player: ' + controller.turn);
		socket.emit('endturn', { index: controller.turn });
	}
}

function checkInsideBattlefied(valX, valY) {
	if (
		valX >= 0 &&
		valY >= 0 &&
		valX < controller.battlefield_X &&
		valY < controller.battlefield_Y
	) {
		return true;
	}
	return false;
}

function mousePressed() {
	if (battlefield_active && move_through_path === -1) {
		if (mouseButton === 'left') {
			// Left click
			let index = checkClickOnUnit();
			if (index !== -1) {
				if (!draw_path) {
					let unit = controller.units[index];
					if (index !== 0) {
						// if (chosen_unit) {
						socket.emit('attackunit', { defender: index });
						// }
					}
				}
			} else {
				if (chosen_unit) {
					let valX = Math.floor((mouseX - shiftX) / tile_size);
					let valY = Math.floor((mouseY - shiftY) / tile_size);
					// console.log(valX, valY)
					if (draw_path && chosen_tile.X === valX && chosen_tile.Y === valY) {
						socket.emit('moveunittile2', confirm_move_info);
					} else {
						if (checkInsideBattlefied(valX, valY)) {
							if (
								controller.players[chosen_unit.player].units[chosen_unit.index]
									.has_moved === false
							) {
								socket.emit('moveunittile', {
									player: controller.turn,
									index: chosen_unit.index,
									X: valX,
									Y: valY,
								});
								chosen_tile = { X: valX, Y: valY };
							}
						}
					}
				}
			}
		}
		if (mouseButton === 'right') {
			//Right click
			let index = checkClickOnUnit();
			if (index !== -1) {
				unit_info_requested = controller.units[index];
				unit_info_required = true;
				battlefield_active = false;
			}
		}
	}
}
