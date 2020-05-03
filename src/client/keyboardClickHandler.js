function keyPressed() {
  switch (keyCode) {
    case 39: {
      if (!isDefaultKeyboard) emitMove(MoveType.RIGHT);
      break;
    }
    case 37: {
      if (!isDefaultKeyboard) emitMove(MoveType.LEFT);
      break;
    }
    case 38: {
      if (!isDefaultKeyboard) emitMove(MoveType.UP);
      break;
    }
    case 40: {
      if (!isDefaultKeyboard) emitMove(MoveType.DOWN);
      break;
    }
    case 27: {
      document.getElementById("startScreen").style.display = "flex";
      document.getElementById("startBtn").innerText = "Continue";
      document.getElementById("startBtn").addEventListener("onclick", () => {
        document.getElementById("startScreen").style.display = "none";
      });
      break;
    }
    case 68: {
      if (isDefaultKeyboard) emitMove(MoveType.RIGHT);
      break;
    }
    case 65: {
      if (isDefaultKeyboard) emitMove(MoveType.LEFT);
      break;
    }
    case 87: {
      if (isDefaultKeyboard) emitMove(MoveType.UP);
      break;
    }
    case 83: {
      if (isDefaultKeyboard) emitMove(MoveType.DOWN);
      break;
    }
    case 59: {
      if (battlefield_active) {
        console.log("End turn of player: " + controller.turn);
        socket.emit(SocketEmitEventType.END_TURN, { index: controller.turn });
      }
      break;
    }
    case 32: {
      socket.emit(SocketEmitEventType.SKIP_TURN);
      break;
    }
    case 13: {
      socket.emit(SocketEmitEventType.PICK_UP_ITEMS);
      break
    }
    case 16: {
      document.getElementById("overlayLayer").style.display = "block";
      onOpenModificationScreenEvent();
      break;
    }
  }
}

const MoveType = {
  RIGHT: "right",
  LEFT: "left",
  UP: "up",
  DOWN: "down"
};
const emitMove = type => {
  if (!isGameOver) {
    playStepSound();
    socket.emit(SocketEmitEventType.MOVE_HERO_TILE, type);
  }
};