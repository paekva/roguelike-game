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
      return;
    }
    case "sc50": {
      tile_size = tile_default_size * 1.5;
      return;
    }
    case "sc80": {
      tile_size = tile_default_size * 1.8;
      return;
    }
    default:
      tile_size = tile_default_size;
      return;
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
      isMusicOn = false;
      return;
    }
    default:
      isMusicOn = true;
      return;
  }
};

const onSoundOptionChange = event => {
  const optionType = event.target.id;
  switch (optionType) {
    case "soundOn": {
      isSoundOn = false;
      return;
    }
    default:
      isSoundOn = true;
      return;
  }
};
