const drawItem = tile => {
  battlefield_map.image(
    itemIcon,
    tile.X * tile_size + tile_size / 3 + shiftX,
    tile.Y * tile_size + tile_size / 3 + shiftY,
    (tile_size * 2) / 3,
    (tile_size * 2) / 3
  );
};

const drawPerson = (unit, type) => {
  switch (type) {
    case PersonType.HERO: {
      battlefield_map.image(
        heroIcon,
        unit.X * tile_size + shiftX,
        unit.Y * tile_size + shiftY,
        tile_size,
        tile_size
      );
      break;
    }
    case PersonType.MONSTER: {
      const energyPercentage = unit.health / unit.max_health;
      battlefield_map.tint(255, 255 * energyPercentage);
      battlefield_map.image(
        monsterIcons[0],
        unit.X * tile_size + shiftX,
        unit.Y * tile_size + shiftY,
        tile_size,
        tile_size
      );
      battlefield_map.tint(255, 255);
      break;
    }
    default:
      break;
  }
};
