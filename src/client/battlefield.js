function drawBattlefieldMap() {
	battlefield_map.background(255);

	for (let i = 0; i < controller.battlefield.length; i++) {
		for (let j = 0; j < controller.battlefield[i].length; j++) {
			drawTile(
				controller.battlefield[i][j],
				controller.player_human.visibility_map[i][j] === 0
			);
		}
	}
}
