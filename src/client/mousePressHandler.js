const tileActivatedHandler = (mouseX, mouseY) => {
	// highlight the click area
	drawClick(mouseX, mouseY);

	setTimeout(() => {
		if (!battlefield_map_overlay) return;
		battlefield_map_overlay.clear();
	}, 200);
};

function mousePressed() {
	if (checkIfSettingWindowOpened() || checkIfModificationsScreenOpened())
		return;

	if (battlefield_active) {
		if (mouseButton === 'left') {
			tileActivatedHandler(mouseX, mouseY);

			let index = checkClickOnUnit();
			if (index !== -1) {
				if (index !== 0) {
					socket.emit(SocketEmitEventType.ATTACK_UNIT, { defender: index });
				}
			}
		}
	}
}
