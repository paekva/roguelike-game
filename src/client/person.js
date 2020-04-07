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

const drawCharacters = () => {
	for (let i = 0; i < controller.units.length; i++) {
		let unit = controller.units[i];
		const isPersonInFog =
			controller.player_human.visibility_map[unit.X][unit.Y] !== 0;
		if (isPersonInFog) {
			drawPerson(unit, unit.energy ? PersonType.HERO : PersonType.MONSTER);
		}
	}
};
