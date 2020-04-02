const drawPerson = (unit, type) => {
	switch (type) {
		case PersonType.HERO: {
			battlefield_map.image(
				characterIcons.hero,
				unit.X * tile_size + shiftX,
				unit.Y * tile_size + shiftY,
				tile_size,
				tile_size
			);
			break;
		}
		case PersonType.MONSTER: {
			const energyPercentage = unit.health / unit.max_health;
			battlefield_map.tint(255, 255 * energyPercentage);
			battlefield_map.image(
				characterIcons.monster,
				unit.X * tile_size + shiftX,
				unit.Y * tile_size + shiftY,
				tile_size,
				tile_size
			);
			battlefield_map.tint(255, 255);
			break;
		}
		default:
			break;
	}
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
