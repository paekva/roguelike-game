const initSettingMenu = () => {
	document.getElementById('startBtn').addEventListener('click', onStartGame);

	const listwrapper = document.getElementById('charactersList');
	characterIconsLinks.forEach(imageLink => {
		const img = document.createElement('img');
		img.src = imageLink;
		img.width = 100;
		img.height = 100;
		const holder = document.createElement('div');
		holder.className = 'holder';
		holder.dataset.link = imageLink;

		holder.addEventListener('click', event => {
			heroIconLink = event.currentTarget.dataset.link;
			drawIcons();
		});

		holder.appendChild(img);
		listwrapper.appendChild(holder);
	});
};

const onStartGame = () => {
	document.getElementById('startScreen').style.display = 'none';

	characterIconsLinks.forEach(link => {
		if (link !== heroIconLink)
			monsterIcons.push(battlefield_map.loadImage(link));
	});

	heroIcon = battlefield_map.loadImage(heroIconLink);

	socket.emit(SocketEmitEventType.CHARACTER_SELECTED, 'data');
};

const drawIcons = () => {
	const items = document.getElementById('charactersList').childNodes;
	items.forEach(item => {
		item.className =
			item.dataset && item.dataset.link === heroIconLink
				? 'selected'
				: 'holder';
	});

	const startBtn = document.getElementById('startBtn');
	if (startBtn.disabled) {
		startBtn.className = 'startBtn';
		startBtn.disabled = false;
	}
};
