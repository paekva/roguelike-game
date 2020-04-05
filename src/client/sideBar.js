const sideBarSize = tile_size * 5;
const progressBarAreaHeight = sideBarSize/3;
const progressBarMargin = tile_size;
const progressBarAreaPadding = progressBarAreaHeight / 8;

const barSize = {
	w: tile_size/3,
	h: tile_size
};
const borderRadius = 20;

const drawProgressBar = (title, percentage, color, coordinates) => {
	side_bar.stroke(0);

	side_bar.fill(255);
	side_bar.rect(coordinates.x, coordinates.y, barSize.w, barSize.h, borderRadius);

	side_bar.fill(color);
	side_bar.rect(coordinates.x, coordinates.y + barSize.h * (1 - percentage), barSize.w, barSize.h * percentage, percentage < 0.9 ? 0 : borderRadius, percentage < 0.9 ? 0 : borderRadius, borderRadius, borderRadius);

	side_bar.noFill();
	side_bar.noStroke();


};

const drawSideBar = () => {
	const coordinatesE = {
		x: progressBarAreaPadding + progressBarMargin,
		y: progressBarAreaPadding
	};
	const coordinatesH = {
		x: progressBarAreaPadding + progressBarMargin * 3,
		y: progressBarAreaPadding
	};
	drawProgressBar('Energy', 0.95, 'blue', coordinatesE);
	drawProgressBar('Health', 0.7, 'red', coordinatesH);
};

const initSideBar = () => {
	const container = document.getElementById('sidebar');
	container.style.margin = `${shiftY}px`;
	container.style.background = 'grey';
	container.style.border = '1px';
	container.style.width = `${sideBarSize}px`;
	container.style.height = `${sideBarSize}px`;

	initProgressBarsArea();
};

const initProgressBarsArea = () => {
	const progressCanvas = function( sketch ) {
		sketch.setup = function() {
			sketch.createCanvas(sideBarSize, progressBarAreaHeight).parent("progressBar").c;
			side_bar = sketch;
		};
	};

	new p5(progressCanvas);
};