function drawBattlefieldMap() {
	battlefield_map.background(255);
	battlefield_map.fill(0);

	for (let i = 0; i < controller.battlefield.length; i++) {
		for (let j = 0; j < controller.battlefield[i].length; j++) {
			drawTile(
				controller.battlefield[i][j],
				controller.player_human.visibility_map[i][j] === 0
			);
		}
	}

	for (let i = 0; i < controller.units.length; i++) {
		let unit = controller.units[i];
		drawPerson(unit, unit.energy ? PersonType.HERO : PersonType.MONSTER);
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

const checkInsideBattlefield = (valX, valY) => {
	return (
		valX >= 0 &&
		valY >= 0 &&
		valX < controller.battlefield_X &&
		valY < controller.battlefield_Y
	);
};
