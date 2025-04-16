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
  NROWS = 5; // Number of rows of bricks
  NCOLS = 5; // Number of columns of bricks
  BRICKWIDTH = (WIDTH / NCOLS) - 1;
  BRICKHEIGHT = 30; // Increased height for readability
  PADDING = 1;
  
  bricks = new Array(NROWS);
  
  // Initialize each brick with a random binary string
  for (var i = 0; i < NROWS; i++) {
    bricks[i] = new Array(NCOLS);
    for (var j = 0; j < NCOLS; j++) {
      bricks[i][j] = generateRandomBinary(8); // Each brick gets a random 8-bit binary value
    }
  }
}

function generateRandomBinary(bits) {
  let binary = "";
  for (let i = 0; i < bits; i++) {
    binary += Math.floor(Math.random() * 2); // Random 0 or 1
  }
  return binary;
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

function drawRoundedRect(x, y, w, h, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  ctx.lineTo(x + radius, y + h);
  ctx.arcTo(x, y + h, x, y + h - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
  ctx.fillStyle = "#00ff00"; // Brick color
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

  // Draw bricks with unique binary code
  for (var i = 0; i < NROWS; i++) {
    for (var j = 0; j < NCOLS; j++) {
      if (bricks[i][j] != null) {
        let brickX = j * (BRICKWIDTH + PADDING) + PADDING;
        let brickY = i * (BRICKHEIGHT + PADDING) + PADDING;

        // Add a fading effect for the bricks
        ctx.globalAlpha = 0.9; // Set transparency
        drawRoundedRect(brickX, brickY, BRICKWIDTH, BRICKHEIGHT, 10);

        // Draw the binary code in the center of the brick
        ctx.fillStyle = "#000000"; // Black text color
        ctx.font = "bold 18px Courier New"; // Larger font for better readability
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(bricks[i][j], brickX + BRICKWIDTH / 2, brickY + BRICKHEIGHT / 2);

        // Reset transparency after drawing the brick
        ctx.globalAlpha = 1.0;
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

  if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] != null) {
    dy = -dy;
    bricks[row][col] = null; // Remove the brick by setting it to null
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
