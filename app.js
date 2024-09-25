const createEmptyArray = (rows, cols) => {
  if (rows < 1 || cols < 1) return [];
  const SIZE = rows * cols;
  res = [];
  for (let i = 0; i < SIZE; i++) {
    res.push([0, ""]);
  }
  return res;
};
let canvas = document.createElement("canvas");
let clearButton = document.createElement("button");
let title = document.createElement("h1");
canvas.className = "canvas";
title.className = "title";
clearButton.className = "clearButton";
title.innerText = "Sand Falling";
clearButton.innerText = "Clear";
clearButton.type = "button";
let ROWS = 100;
let matrix = createEmptyArray(ROWS, ROWS); //[row,col] -> COLS*row + col
let context = canvas.getContext("2d");
let WIDTH = 500;
let HEIGHT = WIDTH;
const BOX_WIDTH = WIDTH / ROWS;
canvas.width = WIDTH;
canvas.height = HEIGHT;
let isDrawing = false;
let updateTimerId;
let createSandTimerId;
const colorPicker = (row, col) => {
  //if (Math.abs(Math.sqrt(row * row + col * col) - 99) < 1) return `red`;
  return `#C2B280`;
};
const updateMatrix = (x, y) => {
  //adds sand grain to matrix
  if (isDrawing) {
    //addtoMatrix
    let j = Math.floor(x / (WIDTH / ROWS)) % ROWS;
    let i = Math.floor(y / (WIDTH / ROWS)) % ROWS;
    if (matrix[ROWS * i + j][0] < 1)
      matrix[ROWS * i + j] = [1, colorPicker(i, j)];
  }
};
window.onload = () => {
  clearButton.addEventListener("click", () => {
    matrix = createEmptyArray(ROWS, ROWS);
    clearInterval(updateTimerId);
    clearInterval(createSandTimerId);
    isDrawing = false;
    updateTimerId = setInterval(update, 1);
  });
  canvas.addEventListener("mousedown", (e) => {
    console.log(e);
    isDrawing = true;
    clearInterval(createSandTimerId);
    createSandTimerId = setInterval(updateMatrix, 1, e.offsetX, e.offsetY);
  });
  canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    clearInterval(createSandTimerId);
  });
  canvas.addEventListener("mouseleave", () => {
    isDrawing = false;
    clearInterval(createSandTimerId);
  });
  canvas.addEventListener("mousemove", (e) => {
    clearInterval(createSandTimerId);
    createSandTimerId = setInterval(updateMatrix, 1, e.offsetX, e.offsetY);
    // updateMatrix(e.offsetX, e.offsetY);
  });
  clearInterval(updateTimerId);
  updateTimerId = setInterval(update, 1);
};

const updateSand = () => {
  for (let el = matrix.length - 1; el >= 0; el--) {
    let currRow = Math.floor(el / ROWS);
    let currCol = el % ROWS;
    let randomSide = Math.random() > 0.5 ? 1 : -1;
    if (
      currRow < ROWS - 1 &&
      matrix[ROWS * (currRow + 1) + currCol][0] < 1 &&
      matrix[el][0]
    ) {
      //fall straight down
      matrix[ROWS * (currRow + 1) + currCol] = [
        matrix[el][0],
        colorPicker(currRow, currCol),
      ];
      matrix[el] = [0, "black"];
    } else if (
      currRow < ROWS - 1 &&
      currCol + randomSide >= 0 &&
      currCol + randomSide <= ROWS - 1 &&
      matrix[ROWS * (currRow + 1) + currCol + randomSide][0] < 1 &&
      matrix[el][0]
    ) {
      //fall to side
      matrix[ROWS * (currRow + 1) + currCol + randomSide] = [
        matrix[el][0],
        colorPicker(currRow, currCol),
      ];
      matrix[el] = [0, "black"];
    }
  }
};
const update = () => {
  updateSand();
  //clear grid before update
  context.clearRect(0, 0, WIDTH, WIDTH);
  //draw grid
  context.strokeStyle = "white";
  context.strokeRect(0, 0, WIDTH, WIDTH);
  //draw boxes
  for (let i = 0; i < matrix.length; i++) {
    if (matrix[i][0] > 0) {
      context.fillStyle = "white";
      context.fillStyle = matrix[i][1];
      context.fillRect(
        (i % ROWS) * BOX_WIDTH,
        Math.floor(i / ROWS) * BOX_WIDTH,
        BOX_WIDTH,
        BOX_WIDTH
      );
    }
  }
};
document.body.appendChild(title);
document.body.appendChild(clearButton);
document.body.appendChild(canvas);
