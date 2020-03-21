const SocketReceiveEventType = {
	INIT: 'Init',
	UPDATE_BATTLE_FIELD: 'updatebattlefield',
	UPDATE_UNITS: 'updateunits',
	UPDATE_UNIT: 'updateunit',
	GET_VISIBILITY: 'getvisibility',
	DRAW_PATH: 'drawpath',
	DRAW_PATH_STOP: 'drawpathstop',
	UPDATE_TURN: 'updateturn',
};

const SocketEmitEventType = {
	ATTACK_UNIT: 'attackunit',
	MOVE_UNIT_TILE: 'moveunittile',
	MOVE_UNIT_TILE_2: 'moveunittile2',
	MOVE_HERO_TILE: 'moveherotile',
	END_TURN: 'endturn',
};

function setup() {
	socket = io.connect();
	createCanvas(canvassize + 100, canvassize);
	textSize(15);
	unit_info = createGraphics(400, 100);
	dialogue_zone = createGraphics(400, 100);
	battlefield_map = createGraphics(400, 300);
	unit_info_popup = createGraphics(225, 150);

	socket.on(SocketReceiveEventType.INIT, function(data) {
		console.warn(data);
		controller = data;
	});

	socket.on(SocketReceiveEventType.UPDATE_BATTLE_FIELD, function(data) {
		controller = data;
	});

	socket.on(SocketReceiveEventType.UPDATE_UNITS, function(data) {
		controller.units = data.units;
	});

	socket.on(SocketReceiveEventType.UPDATE_UNIT, function(data) {
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

	socket.on(SocketReceiveEventType.GET_VISIBILITY, function(data) {
		controller.players[data.player].visibility_map = data.visibility_map;
	});

	socket.on(SocketReceiveEventType.DRAW_PATH, function(data) {
		draw_path = true;
		path = data.res[0];
		confirm_move_info = data.res;
	});

	socket.on(SocketReceiveEventType.DRAW_PATH_STOP, function(data) {
		draw_path = false;
		path = null;
		confirm_move_info = null;
	});

	socket.on(SocketReceiveEventType.UPDATE_TURN, function(data) {
		chosen_unit = null;
		draw_path = false;
		path = null;
		confirm_move_info = null;
		controller.turn = data.index;
		console.log('Turn of player: ' + controller.turn);
	});
}
