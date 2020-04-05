const TileType = {
	DESERT: 'floor',
	DESERT_HILL: 'slowdown',
	HOUSE: 'wall',
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
				break;
			}
		}
	}
};

const drawClick = (x, y) => {
	battlefield_map_overlay.fill('red');
	battlefield_map_overlay.stroke(0);
	battlefield_map_overlay.strokeWeight(4);
	star(x, y, tile_size / 4, tile_size / 2, 10);
	battlefield_map_overlay.noFill();
};

function star(x, y, radius1, radius2, npoints) {
	let angle = TWO_PI / npoints;
	let halfAngle = angle / 2.0;
	battlefield_map_overlay.beginShape();
	for (let a = 0; a < TWO_PI; a += angle) {
		let sx = x + cos(a) * radius2;
		let sy = y + sin(a) * radius2;
		battlefield_map_overlay.vertex(sx, sy);
		sx = x + cos(a + halfAngle) * radius1;
		sy = y + sin(a + halfAngle) * radius1;
		battlefield_map_overlay.vertex(sx, sy);
	}
	battlefield_map_overlay.endShape(CLOSE);
}
