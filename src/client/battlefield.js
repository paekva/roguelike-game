let tileCountVertical;
let tileCountHorizontal;

const setFieldBoundaries = (width, height) => {
  tileCountVertical = Math.floor(height / tile_size) - 1;
  tileCountHorizontal = Math.floor(width / tile_size) - 1;
};

function drawBattlefieldMap() {
  battlefield_map.background(255);
  const { bordersVertical, bordersHorizontal } = transition();

  let k = 0;
  for (let i = bordersHorizontal.top; i < bordersHorizontal.bottom; i++) {
    let l = 0;

    for (let j = bordersVertical.top; j < bordersVertical.bottom; j++) {
      const currentTile = {
        ...controller.battlefield[i][j],
        X: k,
        Y: l
      };
      drawTile(
        currentTile,
        false // controller.player_human.visibility_map[i][j] === 0
      );
      l++;
    }
    k++;
  }
}

const transition = () => {
  const bordersVertical = transitionCalc(
    controller.player_human.hero.X,
    controller.battlefield[0].length
  );
  const bordersHorizontal = transitionCalc(
    controller.player_human.hero.Y,
    controller.battlefield.length
  );

  return {
    bordersVertical,
    bordersHorizontal
  };
};

const transitionCalc = (person, maxLength) => {
  const calcTopBorder = person - Math.floor(tileCountVertical / 2);
  const calcBottomBorder = person + Math.floor(tileCountVertical / 2);

  const filedTopBorder = 0;
  const filedBottomBorder = maxLength;

  if (calcTopBorder < filedTopBorder) {
    return {
      top: filedTopBorder,
      bottom: filedTopBorder + tileCountVertical
    };
  } else if (calcBottomBorder > filedBottomBorder) {
    return {
      top: filedBottomBorder - tileCountVertical,
      bottom: filedBottomBorder
    };
  } else {
    return {
      top: calcTopBorder,
      bottom: calcBottomBorder
    };
  }
};
