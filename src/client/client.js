const SocketReceiveEventType = {
	INIT: 'Init',
	UPDATE_BATTLE_FIELD: 'updatebattlefield',
	UPDATE_UNITS: 'updateunits',
	UPDATE_PLAYER: 'updateplayer',
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
	SKIP_TURN: 'skipturn',
	UPDATE_METABOLISM: 'updatemetabolism',
	CHARACTER_SELECTED: ''
};

function setup() {
	socket = io.connect();
	applySocketListeners(socket);
	initSettingMenu();
	initCanvas();
	initSideBar();

	characterIcons = {
		monster: battlefield_map.loadImage('src/client/assets/monster.png'),
		hero: battlefield_map.loadImage('src/client/assets/hero.png'),
	};
}

const applySocketListeners = socket => {
	socket.on(SocketReceiveEventType.INIT, function(data) {
		controller = data;
	});

	socket.on(SocketReceiveEventType.UPDATE_BATTLE_FIELD, function(data) {
		controller = data;
	});

	socket.on(SocketReceiveEventType.UPDATE_UNITS, function(data) {
		controller.units = data.units;
	});

	socket.on(SocketReceiveEventType.UPDATE_PLAYER, function(data) {
		controller.player_human = data.player;
	});

	socket.on(SocketReceiveEventType.UPDATE_UNIT, function(data) {
		controller.units[data.index] = data.unit;
	});

	socket.on(SocketReceiveEventType.GET_VISIBILITY, function(data) {
		controller.players[data.player].visibility_map = data.visibility_map;
	});
};

const initCanvas = () => {
	createCanvas(tile_size * 16, tile_size * 12).parent('battlefield');
	battlefield_map = createGraphics(tile_size * 16, tile_size * 12);
	battlefield_map_overlay = createGraphics(tile_size * 16, tile_size * 12);
};
