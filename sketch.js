let canvassize = 400
let dialogue = 0
let battlefield_active = false
let controller
let chosen_squad
let turn = 0
let shiftX = 25
let shiftY = 0
let tile_size = 25

let unit_info
let dialogue_zone
let battlefield_map
let squad_info_popup
let squad_info_required = false
let squad_info_requested

let draw_path = false
let move_through_path = -1
let squad_that_is_moved = null
let path_to_move
let confirm_move_info
let chosen_tile

function checkClickOnSquad() {
	if (move_through_path === -1) {
		let valX = (mouseX - shiftX) / tile_size
		let valY = (mouseY - shiftY) / tile_size
		for (let i = 0; i < controller.players.length; i++){
			// for (let squad of controller.players[i].squads){
			for (let j = 0; j < controller.players[i].squads.length; j++){
				let squad = controller.players[i].squads[j]
				if (valX > squad.X && valX < squad.X + 1 && valY > squad.Y && valY < squad.Y + 1 ) {
					//We found a squad
					// return squad
					if (controller.players[controller.turn].visibility_map[squad.X][squad.Y] !== 0) {
						return [i, j]
					} else {
						return null
					}
				}
			}
		}
	}
	return null
}

function circling_lines (turn, squad) {
	battlefield_map.strokeWeight(3);
	battlefield_map.stroke(0, 192, 0)
	if (turn > 0 && turn <= tile_size){
		battlefield_map.line((squad.X * tile_size) + shiftX, (((squad.Y+1) * tile_size) - turn) + shiftY, (squad.X * tile_size) + shiftX, (squad.Y * tile_size) + shiftY)//vert
		battlefield_map.line(((squad.X) * tile_size) + shiftX, (squad.Y * tile_size) + shiftY, ((squad.X * tile_size) + turn) + shiftX, (squad.Y * tile_size) + shiftY)//hor
	}
	if (turn > tile_size && turn <= tile_size * 2){
		turn = turn - tile_size
		battlefield_map.line(((squad.X+1) * tile_size) + shiftX, (squad.Y * tile_size) + shiftY, ((squad.X+1) * tile_size) + shiftX, ((squad.Y * tile_size) + turn) + shiftY)//vert
		battlefield_map.line(((squad.X) * tile_size) + shiftX + turn, (squad.Y * tile_size) + shiftY, ((squad.X+1) * tile_size) + shiftX, (squad.Y * tile_size) + shiftY)//hor
	}
	if (turn > (tile_size * 2) && turn <= tile_size * 3){
		turn = turn - (tile_size * 2)
		battlefield_map.line(((squad.X+1) * tile_size) + shiftX, ((squad.Y * tile_size) + turn) + shiftY, ((squad.X+1) * tile_size) + shiftX, ((squad.Y + 1) * tile_size) + shiftY)//vert
		battlefield_map.line(((squad.X + 1) * tile_size) + shiftX, ((squad.Y + 1) * tile_size) + shiftY, (((squad.X+1) * tile_size) - turn) + shiftX, ((squad.Y + 1) * tile_size) + shiftY)//hor
	}
	if (turn > tile_size * 3 && turn <= tile_size * 4){
		turn = turn - (tile_size * 3)
		battlefield_map.line((squad.X * tile_size) + shiftX, ((squad.Y + 1) * tile_size) + shiftY, (squad.X * tile_size) + shiftX, ((squad.Y+1) * tile_size) - turn + shiftY)//vert
		battlefield_map.line((squad.X * tile_size) + shiftX, ((squad.Y + 1) * tile_size) + shiftY, (((squad.X + 1) * tile_size) - turn) + shiftX, ((squad.Y + 1) * tile_size) + shiftY)//hor
	}
	battlefield_map.strokeWeight(0)
	battlefield_map.stroke('black')
}

function preload () {
	//rawnames = loadStrings('http://localhost:8080/p5/empty-example/test.txt')
}
function setup() {
	socket = io.connect();
  	createCanvas(canvassize + 100, canvassize);
	textSize(15);
	unit_info = createGraphics(400, 100);
	dialogue_zone = createGraphics(400, 100);
	battlefield_map = createGraphics(400, 300)
	squad_info_popup = createGraphics(225, 150)
	  

socket.on('Init',
    function(data) {
	  controller = data;
    }
  );

  socket.on('updatesquad',
    function(data) {
		// console.log(controller.players[controller.turn].visibility_map)
		if (data.path.length === 0) {
			controller.players[data.player].squads[data.index] = data.squad;
			if (data.squad.units.length === 0) {
				controller.players[data.player].squads.splice(data.index, 1)
			}
		} else {
			move_through_path = 0
			path_to_move = data.path
			squad_that_is_moved = controller.players[data.player].squads[data.index]
		}
    }
  );

  socket.on('getvisibility',
  function (data) {
	controller.players[data.player].visibility_map = data.visibility_map
  }
);
  socket.on('drawpath',
  function(data) {
	draw_path = true
	path = data.res[0]
	confirm_move_info = data.res

  }
);
socket.on('drawpathstop',
function(data) {
  draw_path = false
  path = null
  confirm_move_info = null
}
);

  socket.on('updateturn',
    function(data) {
		chosen_squad = null
		draw_path = false
		path = null
		confirm_move_info = null
		controller.turn = data.index
		console.log("Turn of player: " + controller.turn)
    }
  );
}
function draw() {
	background(255);
	if (controller) {
		drawBattlefieldMap()
		image(battlefield_map, 0, 0);
	}
	strokeWeight(1);

	if (dialogue === 4) {
		drawUnitInfo()
		image(unit_info, 0, 250);
	} else {
		drawDialogue()
		image(dialogue_zone, 0, 250);
	}

	if (squad_info_required) {
		drawSquadInfoPopup(squad_info_requested)
		image(squad_info_popup, shiftX + 25, shiftY + 20);
	}

}

function moveThroughPath (path, squad) {
	if (move_through_path < path.length * 5) {
		let tile_index = Math.floor(move_through_path / 5)
		tile_index = path.length - tile_index - 1
		let path_part = ((move_through_path % 5) + 1) / 5
		let line_path = path[tile_index]
		let x1 = line_path[0].X 
		let x2 = line_path[1].X 
		let y1 = line_path[0].Y 
		let y2 = line_path[1].Y 
		squad.X = x2 - ((x2 - x1) * (path_part))
		squad.Y = y2 - ((y2 - y1) * (path_part))
		move_through_path++
		// console.log(squad.X + ' ' + squad.Y)
	} else {
		move_through_path = -1
		squad_that_is_moved = null
	}
}

function drawPath (path) {
	// console.log(data.res)
	// console.log(path)
	for (let line_path of path) {
		battlefield_map.stroke('green')
		battlefield_map.strokeWeight(10)
		let x1 = (line_path[0].X * tile_size) + shiftX + (tile_size / 2)
		let x2 = (line_path[1].X * tile_size) + shiftX + (tile_size / 2)
		let y1 = (line_path[0].Y * tile_size) + shiftY + (tile_size / 2)
		let y2 = (line_path[1].Y * tile_size) + shiftY + (tile_size / 2)
		battlefield_map.line(x1, y1, x2, y2)
		battlefield_map.stroke('black')
		battlefield_map.strokeWeight(1)
	}
}

function drawTile (tile, fog) {
	// console.log(tile.X + ' ' + tile.Y)

	if (tile.type === 'desert') {
		battlefield_map.fill('yellow')
		battlefield_map.square((tile.X * tile_size) + shiftX, (tile.Y * tile_size) + shiftY,tile_size - 1)
		battlefield_map.fill('black')
		let pointx = (tile.X * tile_size) + shiftX
		let pointy = (tile.Y * tile_size) + shiftY
		battlefield_map.noFill();
		battlefield_map.strokeWeight(1.5)
		battlefield_map.bezier(pointx + 5, pointy+16, pointx+10, pointy + 8, pointx+15, pointy+25, pointx+20, pointy+16)
		battlefield_map.fill(0);
		battlefield_map.strokeWeight(1)
	}

	if (tile.type === 'desert_hill') {
		battlefield_map.fill('yellow')
		battlefield_map.square((tile.X * tile_size) + shiftX, (tile.Y * tile_size) + shiftY,tile_size - 1)
		battlefield_map.fill('black')
		let pointx = (tile.X * tile_size) + shiftX
		let pointy = (tile.Y * tile_size) + shiftY
		battlefield_map.noFill();
		battlefield_map.strokeWeight(1.5)
		battlefield_map.bezier(pointx + 2, pointy+8, pointx+7, pointy, pointx+12, pointy+16, pointx+17, pointy+8)
		battlefield_map.bezier(pointx + 7, pointy+16, pointx+12, pointy + 8, pointx+17, pointy+25, pointx+22, pointy+16)
		battlefield_map.fill(0);
		battlefield_map.strokeWeight(1)
	}
	// battlefield_map.line((tile.X * tile_size) + shiftX, (tile.Y * tile_size) + shiftY, ((tile.X + 1) * tile_size) + shiftX, (tile.Y * tile_size) + shiftY); 
	// battlefield_map.line((tile.X * tile_size) + shiftX, (tile.Y * tile_size) + shiftY, (tile.X * tile_size) + shiftX, ((tile.Y + 1) * tile_size) + shiftY); 

	// battlefield_map.line((tile.X * tile_size) + shiftX, ((tile.Y + 1) * tile_size) + shiftY, ((tile.X + 1) * tile_size) + shiftX, ((tile.Y + 1) * tile_size) + shiftY); 
	// battlefield_map.line(((tile.X +1) * tile_size) + shiftX, (tile.Y * tile_size) + shiftY, ((tile.X +1) * tile_size) + shiftX, ((tile.Y + 1) * tile_size) + shiftY); 

	if (tile.type === 'house') {
		battlefield_map.fill('yellow')
		battlefield_map.square((tile.X * tile_size) + shiftX, (tile.Y * tile_size) + shiftY,tile_size - 1)
		battlefield_map.noFill()
		battlefield_map.square((tile.X * tile_size) + shiftX + 2, (tile.Y * tile_size) + shiftY + 2, tile_size - 1 -2)
	
		battlefield_map.fill(0);
		battlefield_map.strokeWeight(1)
	}

	if (fog === true) {
		battlefield_map.strokeWeight(2)
		battlefield_map.stroke('white')
		battlefield_map.noFill()
		battlefield_map.square((tile.X * tile_size) + shiftX, (tile.Y * tile_size) + shiftY,tile_size - 1)
		battlefield_map.fill(0);
		battlefield_map.stroke('black')
		battlefield_map.strokeWeight(1)
	}
}

function drawBattlefieldMap () {
	battlefield_map.background(255)
	battlefield_map.fill(0)
	for (let i = 0; i < controller.battlefield.length; i++){
		for (let j = 0; j < controller.battlefield[i].length; j++){
			if (controller.players[controller.turn].visibility_map[i][j] === 0) {
				drawTile(controller.battlefield[i][j], true)
			} else {
				drawTile(controller.battlefield[i][j], false)
			}
		}
	}
	battlefield_map.strokeWeight(0);
	
	for (let i = 0; i < controller.players[1].squads.length; i++){
		let squad = controller.players[1].squads[i]
		
		// if (controller.players[controller.turn].visibility_map[squad.X][squad.Y] !== 0) {
			if (chosen_squad) {	
				if (chosen_squad.player === 1 && chosen_squad.index === i){
					circling_lines(turn, squad)
					turn++
					if (turn > 100) {
						turn = 0
					}
				}
			}
			battlefield_map.fill(0, 255, 0)
			battlefield_map.ellipse(squad.X * tile_size + (tile_size/2) + shiftX, squad.Y * tile_size + (tile_size/2) + shiftY, 23, 23);
			// battlefield_map.fill(255)
			battlefield_map.fill('yellow')
			battlefield_map.ellipse(squad.X * tile_size + (16/2) + shiftX, squad.Y * tile_size + (16/2) + shiftY, 14, 14);
		// }
	}
	for (let i = 0; i < controller.players[0].squads.length; i++){
		let squad = controller.players[0].squads[i]
		// if (controller.players[controller.turn].visibility_map[squad.X][squad.Y] !== 0) {
			if (chosen_squad) {	
				if (chosen_squad.player === 0 && chosen_squad.index === i){
					circling_lines(turn, squad)
					turn++
					if (turn > 100){
						turn = 0
					}
				}
			}
			battlefield_map.fill(0)
			battlefield_map.ellipse(squad.X * tile_size + (tile_size / 2) + shiftX, squad.Y * tile_size + (tile_size/2) + shiftY, 23, 23);
		// }
	}

	if (draw_path) {
		drawPath(path)
	}

	if (move_through_path >= 0) {
		moveThroughPath(path_to_move, squad_that_is_moved)
	}

	battlefield_map.strokeWeight(1);
	battlefield_map.fill(0);
}

function drawDialogue () {
	dialogue_zone.background(255);
	dialogue_zone.strokeWeight(0);
	dialogue_zone.textSize(15);
  	if (dialogue === 0) {
		dialogue_zone.text('Good morning.', 25, 25);
	}
  	if (dialogue === 1) {
		dialogue_zone.text('Your task today is simple.', 25, 25);
	}
  	if (dialogue === 2) {
		dialogue_zone.text('This village is believed to be terrorist', 25, 25);
		dialogue_zone.text('training camp.', 25, 40);
	}
  	if (dialogue === 3) {
		dialogue_zone.text('Kill everyone there.', 25, 25);
   		battlefield_active = true
	}
	// dialogue_zone.strokeWeight(1);
}

function drawUnitInfo() {
	if (controller) {
		unit_info.background(255);
		unit_info.strokeWeight(1);
		unit_info.fill(0);
		let getting_squad_info = false
		let indexes = checkClickOnSquad()
		if (indexes) {
		let squad = controller.players[indexes[0]].squads[indexes[1]]
			unit_info.strokeWeight(0);
			unit_info.textSize(10);
			for (let i = 0; i < squad.units.length; i++){
				unit_info.text(squad.units[i].firstname + ' ' + squad.units[i].lastname.substring(0, 1) + ' ' + (squad.units[i].health + squad.units[i].death_health) + ' ' + squad.units[i].weapon.name, 10, 15 + (i * 10))
				// unit_info.text(squad.units[i].gender, 10, 15 + (i * 10))
			}
			unit_info.textSize(15);
			unit_info.strokeWeight(1);
			getting_squad_info = true
		}

		if (chosen_squad && !getting_squad_info) {
			let squad = controller.players[chosen_squad.player].squads[chosen_squad.index]
			for (let i = 0; i < squad.units.length; i++){
				unit_info.strokeWeight(0);
				unit_info.textSize(10);
				unit_info.text(squad.units[i].firstname + ' ' + squad.units[i].lastname.substring(0, 1) + ' ' + (squad.units[i].health + squad.units[i].death_health) + ' ' + squad.units[i].weapon.name, 10, 15 + (i * 10))
				unit_info.textSize(15);
				unit_info.strokeWeight(1);
			}
		}
	}
}

function drawSquadInfoPopup(squad) {
	squad_info_popup.background(255, 0, 0)
	squad_info_popup.textSize(10);
	squad_info_popup.text('Name', 5, 10)
	squad_info_popup.text('HP', 48, 10)
	squad_info_popup.text('RNG', 73, 10)
	squad_info_popup.text('DMG', 98, 10)
	squad_info_popup.text('SPD', 123, 10)
	squad_info_popup.text('ACC', 148, 10)
	squad_info_popup.text('EVA', 173, 10)
	squad_info_popup.text('DEF', 198, 10)

	for (let i = 0; i < squad.units.length; i++){
		squad_info_popup.text(squad.units[i].firstname + ' ' + squad.units[i].lastname.substring(0, 1), 5, 25 + (i * 10))
		squad_info_popup.text(squad.units[i].health + '/' + squad.units[i].death_health, 48, 25 + (i * 10))
		squad_info_popup.text(squad.units[i].weapon.min_range + '-' + squad.units[i].weapon.max_range, 73, 25 + (i * 10))
		squad_info_popup.text(squad.units[i].weapon.min_damage + '-' + squad.units[i].weapon.max_damage, 98, 25 + (i * 10))
		squad_info_popup.text(squad.units[i].movement, 123, 25 + (i * 10))
		squad_info_popup.text((squad.units[i].accuracy + squad.units[i].weapon.accuracy), 148, 25 + (i * 10))
		squad_info_popup.text((squad.units[i].evasion + squad.units[i].armor.evasion), 173, 25 + (i * 10))
		squad_info_popup.text((squad.units[i].armor.damage_reduction), 198, 25 + (i * 10))
	}
}

function keyPressed() {
	if (keyCode === ENTER) {
		if (dialogue < 4) {
			dialogue++;
		}
	}

	if (keyCode === 27) {
		if (squad_info_required === true) {
			battlefield_active = true
			squad_info_required = false
		}
	}

	if (keyCode === 68) {
		shiftX += tile_size
	}
	if (keyCode === 65) {
		shiftX -= tile_size
	}
	if (keyCode === 87) {
		shiftY -= tile_size
	}
	if (keyCode === 83) {
		shiftY += tile_size
	}

	if (chosen_squad && battlefield_active){
	}

	if (keyCode === 59 && battlefield_active) {
		console.log("End turn of player: " + controller.turn)
		socket.emit('endturn', {index: controller.turn})
	}
}

function checkInsideBattlefied (valX, valY) {
	if (valX >= 0 && valY >= 0 && valX < controller.battlefield_X && valY < controller.battlefield_Y) {
		return true
	}
	return false
}

function mousePressed() {
	if (battlefield_active && move_through_path === -1) {
		if (mouseButton === 'left') {
			// Left click   
			let indexes = checkClickOnSquad()
			if (indexes) {
				if (!draw_path){
					let squad = controller.players[indexes[0]].squads[indexes[1]]	
					if (squad.owner === controller.turn) {
						chosen_squad = {player: indexes[0], index: indexes[1]}
					}
					if (squad.owner !== controller.turn) {
						if (chosen_squad){
							socket.emit('attacksquad', {attacker: chosen_squad, defender: {player: indexes[0], index: indexes[1]}})
						}	
					}
				}
			} else {
				if (chosen_squad) {
					let valX = Math.floor((mouseX - shiftX) / tile_size)
					let valY = Math.floor((mouseY - shiftY) / tile_size)
					// console.log(valX, valY)
					if (draw_path && chosen_tile.X === valX && chosen_tile.Y === valY) {
						socket.emit('movesquadtile2', confirm_move_info)
					} else {
						if (checkInsideBattlefied (valX, valY)) {
							if (controller.players[chosen_squad.player].squads[chosen_squad.index].has_moved === false) {
								socket.emit('movesquadtile', {player: controller.turn, index: chosen_squad.index, X: valX, Y: valY})
								chosen_tile = {X:valX, Y: valY}
							}
						}
					}
				}
			}

		}
		if (mouseButton === 'right') {
			//Right click
			let indexes = checkClickOnSquad()
			if (indexes) {
				squad_info_requested =  controller.players[indexes[0]].squads[indexes[1]]
				squad_info_required = true
				battlefield_active = false
			}
		}
	}
}
