let dialogue = 4;
let battlefield_active = true;
let controller;
let chosen_unit;
let turn = 0;
let shiftX = 25;
let shiftY = 25;
let tile_size = 50;
let canvassize = tile_size * 20;

let unit_info;
let dialogue_zone;
let battlefield_map;
let battlefield_map_overlay;
let unit_info_popup;
let unit_info_required = false;
let unit_info_requested;

let draw_path = false;
let move_through_path = -1;
let unit_that_is_moved = null;
let path_to_move;
let confirm_move_info;
let chosen_tile;
let characterIcons;

const PersonType = {
	HERO: 'hero',
	MONSTER: 'monster',
};

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

function preload() {
	//rawnames = loadStrings('http://localhost:8080/p5/empty-example/test.txt')
}

function draw() {
	background(255);
	if (controller) {
		drawBattlefieldMap();
		drawSideBar();
		image(battlefield_map, 0, 0);
		image(battlefield_map_overlay, 0, 0);
	}
	strokeWeight(1);

	if (dialogue === 4 && unit_info) {
		drawUnitInfo();
		image(unit_info, 0, 250);
	} else if (dialogue_zone) {
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

function drawDialogue() {
	dialogue_zone.background(255);
	dialogue_zone.strokeWeight(0);
	dialogue_zone.textSize(15);
	battlefield_active = true;
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
