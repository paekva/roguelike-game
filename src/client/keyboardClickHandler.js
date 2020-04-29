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

const onOpenModificationScreenEvent = () => {
  document.getElementById("modificationsScreen").style.display = "flex";

  document.getElementById("backBtn").addEventListener("click", () => {
    document.getElementById("modificationsScreen").style.display = "none";
  });

  document.getElementById("saveBtn").addEventListener("click", () => {
    console.warn("saved");
  });

  const holder = document.getElementById("modificationsHolder");
  if (holder.childNodes.length === 0) addModifications();
};

const addModifications = () => {
  const holder = document.getElementById("modificationsHolder");
  controller.hero.modifications.forEach(modification => {
    const el = document.createElement("div");
    el.className = "modificationOption";

    let clone = document.importNode(
      document.getElementById("modificationOptions").content,
      true
    );
    el.appendChild(clone);
    const childList = el.children;
    childList[0].innerHTML = modification.name;

    holder.appendChild(el);
  });
};
