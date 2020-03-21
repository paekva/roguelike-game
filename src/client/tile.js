const TileType = {
	DESERT: 'desert',
	DESERT_HILL: 'desert_hill',
	HOUSE: 'house',
};

const makeSquareTile = (field, x, y, size) => {
	return field.square(x, y, size);
};

const makeCommonTile = tile => {
	return makeSquareTile(
		battlefield_map,
		tile.X * tile_size + shiftX,
		tile.Y * tile_size + shiftY,
		tile_size - 1
	);
};

const drawTile = (tile, isFoggy) => {
	switch (tile.type) {
		case TileType.DESERT: {
			battlefield_map.fill('yellow');
			makeCommonTile(tile);
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
			break;
		}
		case TileType.DESERT_HILL: {
			battlefield_map.fill('yellow');
			makeCommonTile(tile);
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
			break;
		}
		default: {
			battlefield_map.fill('red');
			makeCommonTile(tile);
			battlefield_map.noFill();
			makeSquareTile(
				battlefield_map,
				tile.X * tile_size + shiftX + 2,
				tile.Y * tile_size + shiftY + 2,
				tile_size - 1 - 2
			);

			battlefield_map.fill(0);
			battlefield_map.strokeWeight(1);
		}
	}

	if (isFoggy) {
		// TODO: make fog when server is ready
		// battlefield_map.strokeWeight(2);
		// battlefield_map.stroke('white');
		// battlefield_map.noFill();
		// makeCommonTile(tile).fill(0, 0, 0, 155);
		// battlefield_map.stroke('black');
		// battlefield_map.strokeWeight(5);
	}
};
