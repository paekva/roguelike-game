const onZoomedInterfaceSelected = event => {
	const optionType = event.target.id;
	switch (optionType) {
		case 'sc10': {
			tile_size = tile_size * 1.1;
			return;
		}
		case 'sc50': {
			tile_size = tile_size * 1.5;
			return;
		}
		case 'sc80': {
			tile_size = tile_size * 1.8;
			return;
		}
		default:
			return;
	}
};
