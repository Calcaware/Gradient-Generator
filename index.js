const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')
const size = 1536;
const canvas = createCanvas(size, size);
const context = canvas.getContext('2d');

const colors = {
	"Red": "#FB999A",
	"Yellow": "#ffe27e",
	"Green": "#7dfebc",
	"Cyan": "#a6e0fb",
	"Blue": "#72a9fb",
	"Magenta": "#fb99cb",
	//"White": "#ffffff"
};

const codes = {
	"Red": "\u001b[31m",
	"Yellow": "\u001b[33m",
	"Green": "\u001b[32m",
	"Cyan": "\u001b[36m",
	"Blue": "\u001b[34m",
	"Magenta": "\u001b[35m",
	"White": "\u001b[37m",
	"Reset": "\u001b[0m"
};

const color_keys = Object.keys(colors);
const code_keys = Object.keys(codes);
const orientations = [ "Horizontal", "Diagonal", "Vertical", "Radial" ];

let stats = {
	"Horizontal": 0,
	"Diagonal": 0,
	"Vertical": 0,
	"Radial": 0
};

for (let l = 0; l < 100; l++) {

	let color_start_index = Math.floor(Math.random() * color_keys.length);
	let color_stop_index = Math.floor(Math.random() * color_keys.length);
	let color_start = colors[color_keys[color_start_index]];
	let color_stop = colors[color_keys[color_stop_index]];

	if (color_start == color_stop) { // Prevent Duplicates
		l--;
		continue;
	}

	let orientation = orientations[Math.floor(Math.random() * orientations.length)];
	let x_start = 0, x_end = 0, y_start = 0, y_end = 0, grd = null;

	switch (orientation) {
		
		case "Horizontal":
			grd = context.createLinearGradient(0, 0, size, 0);
			break;
		
		case "Diagonal":
			grd = context.createLinearGradient(0, 0, size, size);
			break;
		
		case "Vertical":
			grd = context.createLinearGradient(0, 0, 0, size);
			break;

		case "Radial":
			grd = context.createRadialGradient(size/2, size/2, 0, size/2, size/2, size);
			break;

	}

	stats[orientation]++;

	grd.addColorStop(0, color_start);
	grd.addColorStop(1, color_stop);
	context.fillStyle = grd;
	context.fillRect(0, 0, size, size);

	console.log(`${codes["White"]}${l+1}\t${orientation}${orientation == "Radial" ? "\t" : ""}${codes["Reset"]}\t${codes[code_keys[color_start_index]]}${color_keys[color_start_index]}${codes["Reset"]}\t${codes["White"]}->${codes["Reset"]}\t${codes[code_keys[color_stop_index]]}${color_keys[color_stop_index]}${codes["Reset"]}`)

	fs.writeFileSync(`./output/${orientation} ${color_keys[color_start_index]} ${color_keys[color_stop_index]}.png`, canvas.toBuffer('image/png'));

}

console.log(`${codes["White"]}${JSON.stringify(stats, null, '\t')}${codes["Reset"]}`);
