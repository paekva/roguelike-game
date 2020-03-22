const TileType = {
	DESERT: 'desert',
	DESERT_HILL: 'desert_hill',
	HOUSE: 'house',
};

const getTileCoords = tile => {
	return {
		x: tile.X * tile_size + shiftX,
		y: tile.Y * tile_size + shiftY,
	};
};

const makeSquareTile = (field, x, y, size) => {
	return field.square(x, y, size);
};

const makeCommonTile = (coordinates, fillColor, strokeColor) => {
	battlefield_map.fill(fillColor);
	battlefield_map.strokeWeight(2);
	battlefield_map.stroke(strokeColor);
	makeSquareTile(battlefield_map, coordinates.x, coordinates.y, tile_size - 1);
	battlefield_map.noFill();
	battlefield_map.noStroke();
};

const drawTile = (tile, isFoggy) => {
	const coordinates = getTileCoords(tile);

	if (isFoggy) {
		makeCommonTile(coordinates, '#919491', '#919491');
	} else {
		switch (tile.type) {
			case TileType.DESERT: {
				makeCommonTile(coordinates, 'yellow', 0);
				battlefield_map.stroke(0);
				battlefield_map.strokeWeight(2);
				battlefield_map.bezier(
					coordinates.x + 5,
					coordinates.y + 16,
					coordinates.x + 10,
					coordinates.y + 8,
					coordinates.x + 15,
					coordinates.y + 25,
					coordinates.x + 20,
					coordinates.y + 16
				);
				break;
			}
			case TileType.DESERT_HILL: {
				makeCommonTile(coordinates, '#91701b', 0);
				battlefield_map.stroke(0);
				battlefield_map.strokeWeight(2);
				battlefield_map.bezier(
					coordinates.x + 2,
					coordinates.y + 8,
					coordinates.x + 7,
					coordinates.y,
					coordinates.x + 12,
					coordinates.y + 16,
					coordinates.x + 17,
					coordinates.y + 8
				);
				battlefield_map.bezier(
					coordinates.x + 7,
					coordinates.y + 16,
					coordinates.x + 12,
					coordinates.y + 8,
					coordinates.x + 17,
					coordinates.y + 25,
					coordinates.x + 22,
					coordinates.y + 16
				);
				break;
			}
			case TileType.HOUSE: {
				makeCommonTile(coordinates, 'red', 0);
			}
		}
	}
};
