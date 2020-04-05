const sideBarSize = tile_size * 5;

const drawSideBar = () => {
	const container = document.getElementById('sidebar');
	container.style.margin = `${shiftY}px`;
	container.style.background = 'grey';
	container.style.border = '1px';
	container.style.width = `${sideBarSize}px`;
	container.style.height = `${sideBarSize}px`;

};

const initProgressBarsArea = () => {
	const progressCanvas = function( sketch ) {
		sketch.setup = function() {
			sketch.createCanvas(sideBarSize, sideBarSize/3).parent("progressBar");
		};
		sketch.draw = function() {
			//for canvas 1
			sketch.background(100);
		}
	};

	new p5(progressCanvas);
};