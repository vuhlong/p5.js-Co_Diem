function make2DArray(cols, rows) {
	let arr = new Array(cols);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = new Array(rows);
	}
	return arr;
}

const cols = 8;
const rows = 8;
const w = 50;
let previous;
let wpoint = 0;
let bpoint = 0;
let myai;
let m;
let moves = 0;

function setup() {
	createCanvas(600, 401);
	grid = make2DArray(cols, rows);
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j] = new Cell(i, j, w);
		}
	}
	setupGame();
}

function draw() {
	background(255);
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j].show();
		}
	}
	textSize(20);
	fill(0);
	text("White: "+wpoint, 500, 50);
	text("Black: "+bpoint, 500, 150);
	if (mouseX >= 460 && mouseX <= 560 && mouseY >= 200 && mouseY <= 250) {
		// fill(0);
		// text("Thinking", 510, 300);
		// fill(227, 249, 10);
		fill(227, 249, 10);
		rect(460, 200, 100, 50);
		fill(0);
		text("Thinking", 510, 230);
	} else {
		fill(200);
		rect(460, 200, 100, 50);
		fill(0);
		text("Computer", 510, 230);
	}
	// rect(460, 200, 100, 50);
	// fill(0);
	// text("Computer", 510, 230);
	fill(0);
	text("Moves: " + moves, 510, 330);
	if (bpoint >= 6 || wpoint >= 6) {
		gameOver();
	}
}

function gameOver() {
	background(255);
	textSize(100);
	fill(0);
	text("Game Over", 300, 200);
	textSize(80);
	if (bpoint >= 6) {
		text("Black Won", 300, 300);
	} else {
		text("White Won", 300, 300);
	}
}

function mousePressed() {
	if (mouseX >= 460 && mouseX <= 560 && mouseY >= 200 && mouseY <= 250) {
		moveFunction();
	}
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			if (grid[i][j].contains(mouseX, mouseY)) {
				if (previous == undefined) {
					previous = grid[i][j];
				} else {
					if (previous == grid[i][j]) {
						previous = undefined;
					} else if (previous.isPossibleMove(grid[i][j])) {
						previous.clicked();
						previous.playerMove(grid[i][j]);
						moves ++;
						//console.log('bpoint: ' + bpoint + ' wpoint: ' + wpoint);
						previous = undefined;
					} else {
						previous.clicked();
						previous = grid[i][j];
					}
				}
				grid[i][j].clicked();
			}
		}
	}
}

function moveFunction() {
	myai = new AI(bpoint, wpoint, grid);
	m = myai.calculateMove();
	moves++;
	grid[m[0]][m[1]].computerMove(grid[m[2]][m[3]]);
}

function setupGame() {
	grid[3][0].point = 1;
	grid[4][0].point = 2;
	grid[3][7].point = 2;
	grid[4][7].point = 1;

	grid[0][0].hasPiece = true;
	grid[1][0].hasPiece = true;
	grid[2][0].hasPiece = true;
	grid[5][0].hasPiece = true;
	grid[6][0].hasPiece = true;
	grid[7][0].hasPiece = true;

	grid[0][7].hasPiece = true;
	grid[1][7].hasPiece = true;
	grid[2][7].hasPiece = true;
	grid[5][7].hasPiece = true;
	grid[6][7].hasPiece = true;
	grid[7][7].hasPiece = true;

	grid[0][7].pieceColor = true;
	grid[1][7].pieceColor = true;
	grid[2][7].pieceColor = true;
	grid[5][7].pieceColor = true;
	grid[6][7].pieceColor = true;
	grid[7][7].pieceColor = true;
}
