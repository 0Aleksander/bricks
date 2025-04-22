var x, y, dx, dy, r, WIDTH, HEIGHT, ctx, paddlex, paddleh, paddlew, intervalId;
var rightDown = false, leftDown = false, bricks, NROWS, NCOLS, BRICKWIDTH, BRICKHEIGHT, PADDING;
var score = 0;
var startTime;
var timerInterval;

function init() {
  var canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  WIDTH = canvas.width;
  HEIGHT = canvas.height;

  x = WIDTH / 2;
  y = HEIGHT / 2;
  dx = 2;
  dy = 4;
  r = 10;
  paddleh = 10;
  paddlew = 75;

  init_paddle();
  initbricks();

  if (intervalId) {
    clearInterval(intervalId);
  }
  intervalId = setInterval(draw, 10);

  score = 0;
  startTime = Date.now();
  document.getElementById("score").innerText = "Score: 0";
  document.getElementById("timer").innerText = "Time: 0s";

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);

  document.getElementById("gameMessage").style.display = "none";
}

function updateTimer() {
  const now = Date.now();
  const elapsedSeconds = Math.floor((now - startTime) / 1000);
  document.getElementById("timer").innerText = `Time: ${elapsedSeconds}s`;
}

function initbricks() {
  NROWS = 5;
  NCOLS = 5;
  BRICKWIDTH = (WIDTH / NCOLS) - 1;
  BRICKHEIGHT = 30;
  PADDING = 1;

  bricks = new Array(NROWS);
  for (var i = 0; i < NROWS; i++) {
    bricks[i] = new Array(NCOLS);
    for (var j = 0; j < NCOLS; j++) {
      bricks[i][j] = 1;
    }
  }
}

function circle(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fillStyle = "#00ff00";
  ctx.shadowColor = "#00ff00";
  ctx.shadowBlur = 20;
  ctx.fill();
}

function rect(x, y, w, h) {
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.closePath();
  ctx.fillStyle = "#00ff00";
  ctx.shadowColor = "#00ff00";
  ctx.shadowBlur = 10;
  ctx.fill();
}

function clear() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function init_paddle() {
  paddlex = WIDTH / 2 - paddlew / 2;
}

function onKeyDown(evt) {
  if (evt.keyCode == 39) rightDown = true;
  else if (evt.keyCode == 37) leftDown = true;
}

function onKeyUp(evt) {
  if (evt.keyCode == 39) rightDown = false;
  else if (evt.keyCode == 37) leftDown = false;
}

document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

function draw() {
  clear();
  circle(x, y, r);

  if (rightDown && paddlex + paddlew < WIDTH) paddlex += 5;
  else if (leftDown && paddlex > 0) paddlex -= 5;

  rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);

  for (var i = 0; i < NROWS; i++) {
    for (var j = 0; j < NCOLS; j++) {
      if (bricks[i][j] === 1) {
        let brickX = j * (BRICKWIDTH + PADDING) + PADDING;
        let brickY = i * (BRICKHEIGHT + PADDING) + PADDING;
        rect(brickX, brickY, BRICKWIDTH, BRICKHEIGHT);
      }
    }
  }

  if (x + dx > WIDTH - r || x + dx < r) dx = -dx;
  if (y + dy < r) dy = -dy;

  if (y + dy > HEIGHT - r - paddleh && x > paddlex && x < paddlex + paddlew) dy = -dy;

  if (y + dy > HEIGHT - r) {
    if (!(x > paddlex && x < paddlex + paddlew)) {
      clearInterval(intervalId);
      clearInterval(timerInterval);
      showGameOver();
      return;
    }
  }

  var rowheight = BRICKHEIGHT + PADDING;
  var colwidth = BRICKWIDTH + PADDING;
  var row = Math.floor(y / rowheight);
  var col = Math.floor(x / colwidth);

  if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] === 1) {
    dy = -dy;
    bricks[row][col] = 0;
    score += 10;
    document.getElementById("score").innerText = `Score: ${score}`;
  }

  x += dx;
  y += dy;
}

function showGameOver() {
  Swal.fire({
    title: 'Game Over!',
    text: 'You lost the game!',
    icon: 'error',
    confirmButtonText: 'Play Again'
  }).then((result) => {
    if (result.isConfirmed) {
      startGame();
    }
  });
}

function startGame() {
  document.getElementById("playButton").style.display = "none";
  init();
}

document.getElementById("playButton").addEventListener("click", startGame);

window.addEventListener("load", function () {
  document.body.style.visibility = "visible";
  document.getElementById("playButton").style.display = "block";
});
