const sideBarSize = tile_size * 5;
const progressBarAreaHeight = sideBarSize / 2.8;
const progressBarMargin = tile_size;
const progressBarAreaPadding = progressBarAreaHeight / 8;

const barSize = {
	w: tile_size / 3,
	h: tile_size,
};
const borderRadius = 20;

const coordinatesE = {
	x: progressBarAreaPadding + progressBarMargin,
	y: progressBarAreaPadding,
};
const coordinatesH = {
	x: progressBarAreaPadding + progressBarMargin * 3,
	y: progressBarAreaPadding,
};

const drawProgressBar = (title, percentage, color, coordinates) => {
	side_bar.stroke(0);

	side_bar.fill(255);
	side_bar.rect(
		coordinates.x,
		coordinates.y,
		barSize.w,
		barSize.h,
		borderRadius
	);

	side_bar.fill(color);
	side_bar.rect(
		coordinates.x,
		coordinates.y + barSize.h * (1 - percentage),
		barSize.w,
		barSize.h * percentage,
		percentage < 0.9 ? 0 : borderRadius,
		percentage < 0.9 ? 0 : borderRadius,
		borderRadius,
		borderRadius
	);
	side_bar.noStroke();

	side_bar.fill(0);
	side_bar.textSize(14);
	side_bar.text(
		title,
		coordinates.x,
		progressBarAreaHeight - progressBarAreaPadding
	);
	side_bar.noFill();
};

const drawSideBar = () => {
	if (controller && controller.player_human) {
		const human = controller.player_human.hero;
		drawProgressBar(
			'Energy',
			human.energy / human.max_energy,
			'blue',
			coordinatesE
		);
		drawProgressBar(
			'Health',
			human.health / human.max_health,
			'red',
			coordinatesH
		);
	}
};

const initSideBar = () => {
	const container = document.getElementById('sidebar');
	container.style.margin = `${shiftY}px`;
	container.style.background = 'grey';
	container.style.border = '1px';
	container.style.width = `${sideBarSize}px`;
	container.style.height = `${sideBarSize}px`;

	initProgressBarsArea();
	initSettingsArea();
};

const initSettingsArea = () => {
	document.getElementById(
		'controlsWrapper'
	).style.padding = `${progressBarAreaPadding * 1.5}px`;

	document.getElementsByName("light").forEach(el => {
		el.addEventListener('click', (event) => {
			// sendToServer(event.id); TODO: when server is ready
		})
	})
};
const initProgressBarsArea = () => {
	const progressCanvas = function(sketch) {
		sketch.setup = function() {
			sketch
				.createCanvas(sideBarSize, progressBarAreaHeight)
				.parent('progressBar');
			side_bar = sketch;
		};
	};

	new p5(progressCanvas);
};
