const initSettingMenu = () => {
	document.getElementById('startBtn').addEventListener('click', onStartGame);
	const listwrapper = document.getElementById('charactersList');
	Object.keys(characterIcons).forEach(image => {
		const holder = document.createElement('div');
		holder.className = 'holder';
		holder.innerText = 'monster ' + image;
		listwrapper.appendChild(holder);
	});
};

const onStartGame = () => {
	document.getElementById('startScreen').style.display = 'none';

	socket.emit(SocketEmitEventType.CHARACTER_SELECTED, 'data');
};
