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
    case 14: {
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

const onOpenModificationScreenEvent = () => {
  document.getElementById("modificationsScreen").style.display = "flex";

  document.getElementById("backBtn").addEventListener("click", () => {
    document.getElementById("modificationsScreen").style.display = "none";
    document.getElementById("overlayLayer").style.display = "none";
  });

  document.getElementById("saveBtn").addEventListener("click", () => {
    socket.emit(SocketEmitEventType.CHANGE_MODIFICATIONS, currentModifications);
  });

  const holder = document.getElementById("modificationsHolder");
  if (holder.childNodes.length === 0) addModifications();
};

const modificationParams = [
  "damage",
  "defense",
  "health",
  "cost",
  "passive_cost"
];

const addModifications = () => {
  const holder = document.getElementById("modificationsHolder");
  controller.hero.modifications &&
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

      const modificationItems = document.createElement("div");
      modificationItems.style.display = "flex";
      modificationItems.style.flexDirection = "column";

      modificationParams.forEach(param => {
        const item = document.createElement("div");
        item.innerHTML = `${param}:\t${modification[param]}`;
        modificationItems.appendChild(item);
      });
      childList[1].appendChild(modificationItems);
      childList[2].setAttribute("name", modification.name);
      childList[2].addEventListener("mousedown", e => {
        onModificationUpdate(modification.name);
      });

      holder.appendChild(el);
    });
};

const currentModifications = [];
const onModificationUpdate = name => {
  const el = document.getElementsByName(name);
  const title = el[0].getElementsByClassName("text");
  title.text = "On";

  // const index = currentModifications.findIndex(el => el === name);
  // delete currentModifications[index];
  //
  // currentModifications.push(name);
  //
  // console.warn(currentModifications);
};
