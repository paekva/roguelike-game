const drawPerson = (unit, type) => {
	switch (type) {
		case PersonType.HERO: {
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
			break;
		}
		case PersonType.MONSTER: {
			battlefield_map.fill('red');
			battlefield_map.stroke(0);
			battlefield_map.strokeWeight(1);
			battlefield_map.ellipse(
				unit.X * tile_size + tile_size / 2 + shiftX,
				unit.Y * tile_size + tile_size / 2 + shiftY,
				23,
				23
			);
			battlefield_map.fill(0);
			battlefield_map.ellipse(
				unit.X * tile_size + 16 / 2 + shiftX,
				unit.Y * tile_size + 16 / 2 + shiftY,
				14,
				14
			);
			break;
		}
		default:
			break;
	}
};

const circling_lines = (turn, unit) => {
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
};

const drawPersonInfo = (unit, type) => {
	switch (type) {
		case PersonType.HERO: {
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
			break;
		}
		default: {
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
};

const drawUnitInfo = () => {
	if (controller && unit_info) {
		unit_info.background(255);
		unit_info.strokeWeight(1);
		unit_info.fill(0);
		let getting_unit_info = false;
		let index = checkClickOnUnit();
		if (index !== -1) {
			let unit = controller.units[index];
			drawPersonInfo(unit, PersonType.MONSTER);
			getting_unit_info = true;
		}
		if (chosen_unit && !getting_unit_info) {
			let unit = controller.units[0];
			drawPersonInfo(unit, PersonType.HERO);
		}
	}
};
