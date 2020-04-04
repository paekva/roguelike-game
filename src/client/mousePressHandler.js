const tileActivatedHandler = (mouseX, mouseY) => {
	// highlight the click area
	drawClick(mouseX, mouseY);

	setTimeout(() => {
		battlefield_map_overlay.clear();
	}, 200);
};

function mousePressed() {
	if (battlefield_active) {
		if (mouseButton === 'left') {
			// Left click
			tileActivatedHandler(mouseX, mouseY);

			let index = checkClickOnUnit();
			if (index !== -1) {
					let unit = controller.units[index];
					if (index !== 0) {
						// if (chosen_unit) {
						socket.emit(SocketEmitEventType.ATTACK_UNIT, { defender: index });
						// }
					}
			}
		}
	}
}
