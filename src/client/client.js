function setup() {
	socket = io.connect();
	createCanvas(canvassize + 100, canvassize);
	textSize(15);
	unit_info = createGraphics(400, 100);
	dialogue_zone = createGraphics(400, 100);
	battlefield_map = createGraphics(400, 300);
	unit_info_popup = createGraphics(225, 150);

	socket.on('Init', function(data) {
		console.warn(data);
		controller = data;
	});

	socket.on('updatebattlefield', function(data) {
		controller = data;
	});

	socket.on('updateunits', function(data) {
		controller.units = data.units;
	});

	socket.on('updateunit', function(data) {
		// console.log(controller.players[controller.turn].visibility_map)
		if (data.path.length === 0) {
			controller.players[data.player].units[data.index] = data.unit;
			if (data.unit.units.length === 0) {
				controller.players[data.player].units.splice(data.index, 1);
			}
		} else {
			move_through_path = 0;
			path_to_move = data.path;
			unit_that_is_moved = controller.players[data.player].units[data.index];
		}
	});

	socket.on('getvisibility', function(data) {
		controller.players[data.player].visibility_map = data.visibility_map;
	});
	socket.on('drawpath', function(data) {
		draw_path = true;
		path = data.res[0];
		confirm_move_info = data.res;
	});
	socket.on('drawpathstop', function(data) {
		draw_path = false;
		path = null;
		confirm_move_info = null;
	});

	socket.on('updateturn', function(data) {
		chosen_unit = null;
		draw_path = false;
		path = null;
		confirm_move_info = null;
		controller.turn = data.index;
		console.log('Turn of player: ' + controller.turn);
	});
}
