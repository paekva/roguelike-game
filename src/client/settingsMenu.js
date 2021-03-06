const initSettingMenu = () => {
  document.getElementById("nextBtn").addEventListener("click", onNextClick);
  document.getElementById("startBtn").addEventListener("click", onStartGame);

  const listwrapper = document.getElementById("charactersList");
  characterIconsLinks.forEach(imageLink => {
    const img = document.createElement("img");
    img.src = imageLink;
    const size = window.innerHeight / 13;
    img.height = size;
    img.width = size;

    const holder = document.createElement("div");
    holder.className = "holder";
    holder.dataset.link = imageLink;

    holder.addEventListener("click", event => {
      heroIconLink = event.currentTarget.dataset.link;
      drawIcons();
    });

    holder.appendChild(img);
    listwrapper.appendChild(holder);
  });
};

const onStartGame = () => {
  initCanvas();
  document.getElementById("startScreen").style.display = "none";

  if (!isGameOn) {
    initSideBar();
    playBackMusic();

    characterIconsLinks.forEach(link => {
      if (link !== heroIconLink)
        monsterIcons.push(battlefield_map.loadImage(link));
    });
    heroIcon = battlefield_map.loadImage(heroIconLink);
    itemIcon = battlefield_map.loadImage("/public/assets/item.png");
    socket.emit(SocketEmitEventType.CHARACTER_SELECTED, "data");
    isGameOn = true;
  }
};

const drawIcons = () => {
  const items = document.getElementById("charactersList").childNodes;
  items.forEach(item => {
    item.className =
      item.dataset && item.dataset.link === heroIconLink
        ? "selected"
        : "holder";
  });

  const nextBtn = document.getElementById("nextBtn");
  if (nextBtn.disabled) {
    nextBtn.className = "startBtn";
    nextBtn.disabled = false;
  }
};

const onNextClick = () => {
  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("startBtn").style.display = "block";

  document
    .getElementById("startMenu")
    .removeChild(document.getElementById("characters"));
  let clone = document.importNode(
    document.getElementById("startMenuSettingsTemplate").content,
    true
  );
  document.getElementById("startMenu").appendChild(clone);

  initAllSettingsHandlers();
};

const openSettingsWindow = () => {
  document.getElementById("startScreen").style.display = "flex";
  document.getElementById("startBtn").innerText = "Continue";
  document
    .getElementById("startBtn")
    .addEventListener("onclick", closeSettingWindow);
};

const closeSettingWindow = () => {
  document.getElementById("startScreen").style.display = "none";
};

const checkIfSettingWindowOpened = () => {
  return document.getElementById("startScreen").style.display === "flex";
};
