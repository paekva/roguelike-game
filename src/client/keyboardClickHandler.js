function keyPressed() {
  switch (keyCode) {
    case 39: {
      if (!isDefaultKeyboard) {
        playStepSound();
        socket.emit(SocketEmitEventType.MOVE_HERO_TILE, "right");
      }
      break;
    }
    case 37: {
      if (!isDefaultKeyboard) {
        playStepSound();
        socket.emit(SocketEmitEventType.MOVE_HERO_TILE, "left");
      }
      break;
    }
    case 38: {
      if (!isDefaultKeyboard) {
        playStepSound();
        socket.emit(SocketEmitEventType.MOVE_HERO_TILE, "up");
      }
      break;
    }
    case 40: {
      if (!isDefaultKeyboard) {
        playStepSound();
        socket.emit(SocketEmitEventType.MOVE_HERO_TILE, "down");
      }
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
      if (isDefaultKeyboard) {
        playStepSound();
        socket.emit(SocketEmitEventType.MOVE_HERO_TILE, "right");
      }
      break;
    }
    case 65: {
      if (isDefaultKeyboard) {
        playStepSound();
        socket.emit(SocketEmitEventType.MOVE_HERO_TILE, "left");
      }
      break;
    }
    case 87: {
      if (isDefaultKeyboard) {
        playStepSound();
        socket.emit(SocketEmitEventType.MOVE_HERO_TILE, "up");
      }
      break;
    }
    case 83: {
      if (isDefaultKeyboard) {
        playStepSound();
        socket.emit(SocketEmitEventType.MOVE_HERO_TILE, "down");
      }
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
    }
  }
}
