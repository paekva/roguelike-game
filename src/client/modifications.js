const onOpenModificationScreenEvent = () => {
  document.getElementById("modificationsScreen").style.display = "flex";
  addEventListenersForModificationsScreen();

  const holder = document.getElementById("modificationsHolder");
  if (holder.childNodes.length === 0) addModifications();
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
    socket.emit(SocketEmitEventType.CHANGE_MODIFICATIONS, currentModifications);
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
      const newElement = createItemForSingleModification();
      const childList = newElement.children;

      applyModificationName(childList[0], modification);
      applyModificationCharacteristics(childList[1], modification);
      applyModificationStatus(childList[2], modification);

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
  const modificationItems = document.createElement("div");
  modificationItems.style.display = "flex";
  modificationItems.style.flexDirection = "column";

  modificationParams.forEach(param => {
    const item = document.createElement("div");
    item.innerHTML = `${param}:\t${modification[param]}`;
    modificationItems.appendChild(item);
  });
  child.appendChild(modificationItems);
};

const applyModificationStatus = (child, modification) => {
  child.setAttribute("name", modification.name);
  child.addEventListener("mousedown", () => {
    onModificationUpdate(modification.name);
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
