let controller;
const shiftX = 25;
const shiftY = 25;
const tile_default_size = 50;

let tile_size = tile_default_size;
let isDefaultKeyboard = true;
let isSoundOn = true;
let isMusicOn = true;
let isGameOn = false;
let isGameOver = false;

let battlefield_map;
let battlefield_map_overlay;
let battlefield_active = true;
let side_bar;

const monsterIcons = [];
const characterIconsLinks = [
  "/public/assets/m1.png",
  "/public/assets/m2.png",
  "/public/assets/m3.png",
  "/public/assets/m4.png",
  "/public/assets/m5.png"
];

let heroIconLink;
let heroIcon;
let itemIcon;

const PersonType = {
  HERO: "hero",
  MONSTER: "monster"
};

function checkClickOnUnit() {
  let valX = (mouseX - shiftX) / tile_size;
  let valY = (mouseY - shiftY) / tile_size;
  for (let i = 0; i < controller.units.length; i++) {
    let unit = controller.units[i];
    if (
      valX > unit.X &&
      valX < unit.X + 1 &&
      valY > unit.Y &&
      valY < unit.Y + 1
    ) {
      // console.log("checking")
      // We found a unit
      // return unit
      // console.log(controller.player_human.visibility_map[unit.X][unit.Y])
      if (controller.player_human.visibility_map[unit.X][unit.Y] !== 0) {
        return i;
      } else {
        return -1;
      }
    }
  }
  return -1;
}

function draw() {
  background(255);
  strokeWeight(1);

  if (controller && battlefield_map_overlay && battlefield_map && heroIcon) {
    if (!isGameOver) checkIfGameIsOver();
    drawBattlefieldMap();

    image(battlefield_map, 0, 0);
    image(battlefield_map_overlay, 0, 0);
  }
}
