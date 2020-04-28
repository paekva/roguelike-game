const SocketReceiveEventType = {
  INIT: "Init",
  UPDATE_BATTLE_FIELD: "updatebattlefield",
  UPDATE_UNITS: "updateunits",
  UPDATE_PLAYER: "updateplayer",
  UPDATE_UNIT: "updateunit",
  GET_VISIBILITY: "getvisibility",
  DRAW_PATH: "drawpath",
  DRAW_PATH_STOP: "drawpathstop",
  UPDATE_TURN: "updateturn"
};

const SocketEmitEventType = {
  ATTACK_UNIT: "attackunit",
  MOVE_UNIT_TILE: "moveunittile",
  MOVE_UNIT_TILE_2: "moveunittile2",
  MOVE_HERO_TILE: "moveherotile",
  END_TURN: "endturn",
  SKIP_TURN: "skipturn",
  UPDATE_METABOLISM: "updatemetabolism",
  CHARACTER_SELECTED: ""
};

const canvasWidth = () =>
  controller ? (controller.battlefield.length + 1) * tile_size : tile_size * 16;
const canvasHeight = () =>
  controller
    ? (controller.battlefield[0].length + 1) * tile_size
    : tile_size * 12;

function setup() {
  socket = io.connect();
  applySocketListeners(socket);
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
    checkIfGameIsOver();
    drawSideBar();
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
  const width = canvasWidth();
  const height = canvasHeight();

  createCanvas(width, height).parent("battlefield");
  battlefield_map = createGraphics(width, height);
  battlefield_map_overlay = createGraphics(width, height);
};

const checkIfGameIsOver = () => {
  if (
    controller &&
    controller.player_human &&
    controller.player_human.hero.health === 0
  ) {
    isGameOver = true;
    const audio = new Audio("/public/audio/fail-sound.mp3");
    audio.play();
    document.getElementById("finishScreen").style.display = "flex";
  }
};
