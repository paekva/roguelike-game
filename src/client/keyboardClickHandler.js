function keyPressed() {
	if (keyCode === ENTER) {
		if (dialogue < 4) {
			dialogue++;
		}
	}

	if (keyCode === 27) {
		if (unit_info_required === true) {
			battlefield_active = true;
			unit_info_required = false;
		}
	}

	if (keyCode === 68) {
		socket.emit('moveherotile', 'right');
		// shiftX += tile_size
	}
	if (keyCode === 65) {
		socket.emit('moveherotile', 'left');
		// shiftX -= tile_size
	}
	if (keyCode === 87) {
		socket.emit('moveherotile', 'up');
		// shiftY -= tile_size
	}
	if (keyCode === 83) {
		socket.emit('moveherotile', 'down');
		// shiftY += tile_size
	}

	// if (keyCode === 68) {
	// 	shiftX += tile_size
	// }
	// if (keyCode === 65) {
	// 	shiftX -= tile_size
	// }
	// if (keyCode === 87) {
	// 	shiftY -= tile_size
	// }
	// if (keyCode === 83) {
	// 	shiftY += tile_size
	// }

	if (chosen_unit && battlefield_active) {
	}

	if (keyCode === 59 && battlefield_active) {
		console.log('End turn of player: ' + controller.turn);
		socket.emit('endturn', { index: controller.turn });
	}
}
