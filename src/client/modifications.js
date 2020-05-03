const onOpenModificationScreenEvent = () => {
  document.getElementById("modificationsScreen").style.display = "flex";

  const holder = document.getElementById("modificationsHolder");
  if (holder.childNodes.length === 0) {
    addEventListenersForModificationsScreen();
    addModifications();
  }
};

const closeModificationsWindow = () => {
  document.getElementById("modificationsScreen").style.display = "none";
  document.getElementById("overlayLayer").style.display = "none";
};

const addEventListenersForModificationsScreen = () => {
  document
    .getElementById("backBtn")
    .addEventListener("click", closeModificationsWindow);

  document.getElementById("saveBtn").addEventListener("click", () => {
    socket.emit(
      SocketEmitEventType.CHANGE_MODIFICATIONS,
      currentModifications.filter(el => el !== null)
    );
    closeModificationsWindow();
  });
};

const checkIfModificationsScreenOpened = () => {
  return (
    document.getElementById("modificationsScreen").style.display === "flex"
  );
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
      if (modification.is_active) currentModifications.push(modification.name);

      const newElement = createItemForSingleModification();
      newElement.setAttribute("name", modification.name);

      const childList = newElement.children;
      applyModificationStatus(childList[0], modification);
      applyModificationName(childList[1], modification);
      applyModificationCharacteristics(childList[2], modification);

      holder.appendChild(newElement);
    });
};

const createItemForSingleModification = () => {
  const el = document.createElement("div");
  el.className = "modificationOption";

  let clone = document.importNode(
    document.getElementById("modificationOptions").content,
    true
  );
  el.appendChild(clone);
  return el;
};

const applyModificationName = (child, modification) => {
  child.innerHTML = modification.name;
};

const applyModificationCharacteristics = (child, modification) => {
  modificationParams.forEach(param => {
    const item = document.createElement("div");
    item.innerHTML = `${param}:\t${modification[param]}`;
    child.appendChild(item);
  });
};

const applyModificationStatus = (child, modification) => {
  child.innerHTML = modification.is_active ? "ON" : "OFF";

  child.addEventListener("mousedown", event => {
    event.stopPropagation();
    onModificationUpdate(modification.name);
  });
};

const currentModifications = [];

const onModificationUpdate = name => {
  const el = document.getElementsByName(name)[0];
  const is_active = el.childNodes[1].innerHTML === "ON";
  el.childNodes[1].innerHTML = is_active ? "OFF" : "ON";

  if (is_active) {
    const index = currentModifications.findIndex(el => el === name);
    delete currentModifications[index];
  } else currentModifications.push(name);

  console.warn(currentModifications);
};
