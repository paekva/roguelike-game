const initSettingMenu = () => {
    document.getElementById("startBtn").addEventListener('click', onStartGame);
};

const onStartGame = () => {
    document.getElementById("startScreen").style.display = "none";

    socket.emit(SocketEmitEventType.CHARACTER_SELECTED, "data");
};