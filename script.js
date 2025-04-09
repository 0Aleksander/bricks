// Matrix Background Effect (unchanged)
const state = {
  fps: 20,
  color: "#00ff00",
  charset: "01",
  size: 25
};

const matrixCanvas = document.getElementById("matrixCanvas");
const matrixCtx = matrixCanvas.getContext("2d");

let w, h, p;
const resize = () => {
  w = matrixCanvas.width = innerWidth;
  h = matrixCanvas.height = innerHeight;
  p = Array(Math.ceil(w / state.size)).fill(0);
};
window.addEventListener("resize", resize);
resize();

const random = (items) => items[Math.floor(Math.random() * items.length)];

const drawMatrix = () => {
  matrixCtx.fillStyle = "rgba(0,0,0,.05)";
  matrixCtx.fillRect(0, 0, w, h);
  matrixCtx.fillStyle = state.color;
  matrixCtx.font = state.size + "px monospace";
  
  for (let i = 0; i < p.length; i++) {
    let v = p[i];
    matrixCtx.fillText(random(state.charset), i * state.size, v);
    p[i] = v >= h || v >= 10000 * Math.random() ? 0 : v + state.size;
  }
};

setInterval(drawMatrix, 1000 / state.fps);

// Pong/Breakout Game Code
var x, y, dx, dy, r, WIDTH, HEIGHT, ctx, paddlex, paddleh, paddlew, intervalId;
var rightDown = false, leftDown = false, bricks, NROWS, NCOLS, BRICKWIDTH, BRICKHEIGHT, PADDING, f = 5;

function init() {
  var canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  WIDTH = canvas.width;
  HEIGHT = canvas.height;
  
  // Reset game state
  x = WIDTH / 2;
  y = HEIGHT / 2;
  dx = 2;
  dy = 4;
  r = 10;
  paddleh = 10;
  paddlew = 75;
  
  init_paddle();
  initbricks();
  
  // Clear any existing interval
  if (intervalId) {
    clearInterval(intervalId);
  }
  intervalId = setInterval(draw, 10);
  
  // Hide game over message
  document.getElementById("gameMessage").style.display = "none";
}

function initbricks() {
  NROWS = 5;
  NCOLS = 5;
  BRICKWIDTH = (WIDTH / NCOLS) - 1;
  BRICKHEIGHT = 15;
  PADDING = 1;
  bricks = new Array(NROWS);
  for (var i = 0; i < NROWS; i++) {
    bricks[i] = new Array(NCOLS).fill(1);
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

  // Move paddle
  if (rightDown && paddlex + paddlew < WIDTH) {
    paddlex += 5;
  } else if (leftDown && paddlex > 0) {
    paddlex -= 5;
  }

  // Draw paddle
  rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);

  // Draw bricks
  for (var i = 0; i < NROWS; i++) {
    for (var j = 0; j < NCOLS; j++) {
      if (bricks[i][j] == 1) {
        rect(
          j * (BRICKWIDTH + PADDING) + PADDING,
          i * (BRICKHEIGHT + PADDING) + PADDING,
          BRICKWIDTH,
          BRICKHEIGHT
        );
      }
    }
  }

  // Wall collisions
  if (x + dx > WIDTH - r || x + dx < r) {
    dx = -dx;
  }
  if (y + dy < r) {
    dy = -dy;
  }

  // Paddle collision
  if (y + dy > HEIGHT - r - paddleh && x > paddlex && x < paddlex + paddlew) {
    dy = -dy;
  }

  // Bottom collision (game over)
  if (y + dy > HEIGHT - r) {
    if (!(x > paddlex && x < paddlex + paddlew)) {
      clearInterval(intervalId);  // Stop the game loop
      showGameOver();  // Show SweetAlert Game Over message
      return;  // Exit the draw function
    }
  }

  // Brick collisions
  var rowheight = BRICKHEIGHT + PADDING;
  var colwidth = BRICKWIDTH + PADDING;
  var row = Math.floor(y / rowheight);
  var col = Math.floor(x / colwidth);

  if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
    dy = -dy;
    bricks[row][col] = 0;
  }

  // Update ball position
  x += dx;
  y += dy;
}

function showGameOver() {
  // SweetAlert popup for Game Over
  Swal.fire({
    title: 'Game Over!',
    text: 'You lost the game!',
    icon: 'error',
    confirmButtonText: 'Play Again'
  }).then((result) => {
    if (result.isConfirmed) {
      startGame(); // Restart game if the player presses "Play Again"
    }
  });
}

function startGame() {
  document.getElementById("playButton").style.display = "none";  // Hide play button
  init();  // Initialize game
}

// Initialize the game
document.getElementById("playButton").addEventListener("click", startGame);

// Make body visible after load
window.addEventListener("load", function() {
  document.body.style.visibility = "visible";
  document.getElementById("playButton").style.display = "block";
});
