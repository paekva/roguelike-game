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