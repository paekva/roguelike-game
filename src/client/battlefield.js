function drawBattlefieldMap() {
  battlefield_map.background(255);

  for (let i = 0; i < controller.battlefield.length; i++) {
    for (let j = 0; j < controller.battlefield[i].length; j++) {
      const currentTile = controller.battlefield[i][j];
      const isFoggy = controller.player_human.visibility_map[i][j] === 0;
      drawTile(currentTile, isFoggy);
      const unit = isFoggy
        ? null
        : getUnitOnTheTile(currentTile.X, currentTile.Y);
      if (unit)
        drawPerson(unit, unit.energy ? PersonType.HERO : PersonType.MONSTER);

      if(currentTile.items.length>0 && !isFoggy){
        drawItem(currentTile);
      }
    }
  }
}

const getUnitOnTheTile = (x, y) => {
  return controller.units.find(unit => unit.X === x && unit.Y === y);
};
