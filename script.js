var x = 150; // Starting position of the ball (x)
var y = 150; // Starting position of the ball (y)
var dx = 2;  // Ball speed on the x-axis
var dy = 4;  // Ball speed on the y-axis
var r = 10;  // Ball radius
var WIDTH = 300;
var HEIGHT = 300;
var ctx;
var paddlex;
var paddleh = 10;
var paddlew = 75;
var intervalId;
var rightDown = false;
var leftDown = false;

// Variables for bricks
var bricks;
var NROWS;
var NCOLS;
var BRICKWIDTH;
var BRICKHEIGHT;
var PADDING;

// Additional variable for paddle collision margin
var f = 5; // Used in checking paddle-ball collision

// Initialize the game
function init() {
  var canvas = $('#canvas')[0];
  ctx = canvas.getContext("2d");
  WIDTH = $("#canvas").width();
  HEIGHT = $("#canvas").height();
  init_paddle();
  initbricks();
  intervalId = setInterval(draw, 10);
}

// Initialize bricks
function initbricks() {
  NROWS = 5;
  NCOLS = 5;
  BRICKWIDTH = (WIDTH / NCOLS) - 1;
  BRICKHEIGHT = 15;
  PADDING = 1;
  bricks = new Array(NROWS);
  for (var i = 0; i < NROWS; i++) {
    bricks[i] = new Array(NCOLS);
    for (var j = 0; j < NCOLS; j++) {
      bricks[i][j] = 1; // Brick is present (1 means it hasn't been hit yet)
    }
  }
}

// Draw circle (ball)
function circle(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.closePath();
  
  // Set ball color (neon green in this example)
  ctx.fillStyle = "#00ff00"; // Neon Green color
  
  // Set up the glow effect
  ctx.shadowColor = "#00ff00";  // Glow color (same as the ball color)
  ctx.shadowBlur = 20;  // The blur radius, larger values for a more pronounced glow
  ctx.shadowOffsetX = 0;  // Horizontal shadow offset (set to 0 for centered glow)
  ctx.shadowOffsetY = 0;  // Vertical shadow offset (set to 0 for centered glow)

  ctx.fill();  // Fill the ball with the chosen color
}

// Draw rectangle (paddle and bricks)
function rect(x, y, w, h) {
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.closePath();
  ctx.fill();
}

// Clear the canvas
function clear() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

// Initialize paddle
function init_paddle() {
  paddlex = WIDTH / 2 - paddlew / 2;
}

// Handle key down events
function onKeyDown(evt) {
  if (evt.keyCode == 39) rightDown = true; // Right arrow
  else if (evt.keyCode == 37) leftDown = true; // Left arrow
}

// Handle key up events
function onKeyUp(evt) {
  if (evt.keyCode == 39) rightDown = false;
  else if (evt.keyCode == 37) leftDown = false;
}

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

// Main drawing function
function draw() {
  clear();
  circle(x, y, 10);

  // Move the paddle left or right
  if (rightDown) {
    if ((paddlex + paddlew) < WIDTH) {
      paddlex += 5;
    } else {
      paddlex = WIDTH - paddlew;
    }
  } else if (leftDown) {
    if (paddlex > 0) {
      paddlex -= 5;
    } else {
      paddlex = 0;
    }
  }

  rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);

  // Draw bricks
  for (var i = 0; i < NROWS; i++) {
    for (var j = 0; j < NCOLS; j++) {
      if (bricks[i][j] == 1) {
        rect((j * (BRICKWIDTH + PADDING)) + PADDING,
             (i * (BRICKHEIGHT + PADDING)) + PADDING,
             BRICKWIDTH, BRICKHEIGHT);
      }
    }
  }

  // Ball collision with walls
  if (x + dx > WIDTH - r || x + dx < r) {
    dx = -dx;
  }
  if (y + dy < r) {
    dy = -dy;
  } else if (y + dy > HEIGHT - (r + f)) {
    if (x > paddlex && x < paddlex + paddlew) {
      dy = -dy;
    } else if (y + dy > HEIGHT - r) {
      clearInterval(intervalId); // Stop the game if the ball falls
      showGameOver();
    }
  }

  // Update ball position
  x += dx;
  y += dy;

  // Brick collision detection
  rowheight = BRICKHEIGHT + PADDING + f / 2; // Brick height plus padding
  colwidth = BRICKWIDTH + PADDING + f / 2; // Brick width plus padding
  row = Math.floor(y / rowheight);
  col = Math.floor(x / colwidth);

  if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
    dy = -dy; 
    bricks[row][col] = 0; // Mark the brick as hit (destroyed)
  }
}

// Show Game Over screen
function showGameOver() {
  var gameMessage = document.getElementById('gameMessage');
  gameMessage.textContent = 'Game Over!';
  gameMessage.classList.add('game-over');
  gameMessage.style.display = 'block'; // Show the game over message
}

// Handle Play button click
function startGame() {
  document.getElementById('playButton').style.display = 'none'; // Hide the Play button
  init(); // Initialize the game
  $('#gameMessage').hide(); // Hide any previous game message
}

// When the Play button is clicked, start the game
document.getElementById('playButton').addEventListener('click', startGame);
