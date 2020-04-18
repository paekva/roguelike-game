const initAllSettingsHandlers = () => {
  document
    .getElementsByName("scaleOptions")
    .forEach(el => el.addEventListener("click", onScaleOptionChange));

  document
    .getElementsByName("keyboardOptions")
    .forEach(el => el.addEventListener("click", onKeyboardOptionChange));

  document
    .getElementsByName("musicOptions")
    .forEach(el => el.addEventListener("click", onMusicOptionChange));

  document
    .getElementsByName("soundOptions")
    .forEach(el => el.addEventListener("click", onSoundOptionChange));
};

const onScaleOptionChange = event => {
  const optionType = event.target.id;
  switch (optionType) {
    case "sc10": {
      tile_size = tile_default_size * 1.1;
      break;
    }
    case "sc50": {
      tile_size = tile_default_size * 1.5;
      break;
    }
    case "sc80": {
      tile_size = tile_default_size * 1.8;
      break;
    }
    default:
      tile_size = tile_default_size;
      break;
  }
};

const onKeyboardOptionChange = event => {
  const optionType = event.target.id;
  switch (optionType) {
    case "arrows": {
      isDefaultKeyboard = false;
      return;
    }
    default:
      isDefaultKeyboard = true;
      return;
  }
};

const onMusicOptionChange = event => {
  const optionType = event.target.id;
  switch (optionType) {
    case "musicOn": {
      isMusicOn = true;
      playBackMusic();
      return;
    }
    default:
      isMusicOn = false;
      stopMusic();
      return;
  }
};

const onSoundOptionChange = event => {
  const optionType = event.target.id;
  switch (optionType) {
    case "soundOn": {
      isSoundOn = true;
      return;
    }
    default:
      isSoundOn = false;
      return;
  }
};

const music = new Audio("/public/audio/back-music.mp3");
const playBackMusic = () => {
  if (isMusicOn) {
    music.play();
    music.addEventListener(
      "ended",
      function() {
        this.currentTime = 0;
        this.play();
      },
      false
    );
  }
};
const stopMusic = () => {
  music.pause();
};
