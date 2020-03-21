function mousePressed() {
	if (battlefield_active && move_through_path === -1) {
		if (mouseButton === 'left') {
			// Left click
			let index = checkClickOnUnit();
			if (index !== -1) {
				if (!draw_path) {
					let unit = controller.units[index];
					if (index !== 0) {
						// if (chosen_unit) {
						socket.emit('attackunit', { defender: index });
						// }
					}
				}
			} else {
				if (chosen_unit) {
					let valX = Math.floor((mouseX - shiftX) / tile_size);
					let valY = Math.floor((mouseY - shiftY) / tile_size);
					// console.log(valX, valY)
					if (draw_path && chosen_tile.X === valX && chosen_tile.Y === valY) {
						socket.emit('moveunittile2', confirm_move_info);
					} else {
						if (checkInsideBattlefied(valX, valY)) {
							if (
								controller.players[chosen_unit.player].units[chosen_unit.index]
									.has_moved === false
							) {
								socket.emit('moveunittile', {
									player: controller.turn,
									index: chosen_unit.index,
									X: valX,
									Y: valY,
								});
								chosen_tile = { X: valX, Y: valY };
							}
						}
					}
				}
			}
		}
		if (mouseButton === 'right') {
			//Right click
			let index = checkClickOnUnit();
			if (index !== -1) {
				unit_info_requested = controller.units[index];
				unit_info_required = true;
				battlefield_active = false;
			}
		}
	}
}
