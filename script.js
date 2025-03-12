var x = 150; // Začetna pozicija žoge (x)
 var y = 150; // Začetna pozicija žoge (y)
 var dx = 2;  // Hitrost po x
 var dy = 4;  // Hitrost po y
 var r = 10;  // Polmer žoge
 var WIDTH = 300;
 var HEIGHT = 300;
 var ctx;
 var paddlex;
 var paddleh = 10;
 var paddlew = 75;
 var intervalId;
 var rightDown = false;
 var leftDown = false;
 
 // Spremenljivke za opeke
 var bricks;
 var NROWS;
 var NCOLS;
 var BRICKWIDTH;
 var BRICKHEIGHT;
 var PADDING;
 
 // Dodatna spremenljivka za odmik loparja od roba
 var f = 5; // Uporablja se pri preverjanju trka žoge z loparjem
 
 // Inicializacija igre
 function init() {
   var canvas = $('#canvas')[0];
   ctx = canvas.getContext("2d");
   WIDTH = $("#canvas").width();
   HEIGHT = $("#canvas").height();
   init_paddle();
   initbricks();
   intervalId = setInterval(draw, 10);
 }
 
 // Inicializacija opek
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
       bricks[i][j] = 1; // Opeka je prisotna (1 pomeni, da še ni zadeta)
     }
   }
 }
 
 // Riše krog (žoga)
 function circle(x, y, r) {
   ctx.beginPath();
   ctx.arc(x, y, r, 0, Math.PI * 2, true);
   ctx.closePath();
   ctx.fill();
 }
 
 // Riše pravokotnik (lopar in opeke)
 function rect(x, y, w, h) {
   ctx.beginPath();
   ctx.rect(x, y, w, h);
   ctx.closePath();
   ctx.fill();
 }
 
 // Počisti platno
 function clear() {
   ctx.clearRect(0, 0, WIDTH, HEIGHT);
 }
 
 // Inicializacija loparja
 function init_paddle() {
   paddlex = WIDTH / 2 - paddlew / 2;
 }
 
 // Upravljanje tipk
 function onKeyDown(evt) {
   if (evt.keyCode == 39) rightDown = true; // Desna puščica
   else if (evt.keyCode == 37) leftDown = true; // Leva puščica
 }
 
 function onKeyUp(evt) {
   if (evt.keyCode == 39) rightDown = false;
   else if (evt.keyCode == 37) leftDown = false;
 }
 
 $(document).keydown(onKeyDown);
 $(document).keyup(onKeyUp);
 
 // Glavna funkcija risanja
 function draw() {
   clear();
   circle(x, y, 10);
 
   // Premik loparja levo in desno
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
 
   // Riši opeke
   for (var i = 0; i < NROWS; i++) {
     for (var j = 0; j < NCOLS; j++) {
       if (bricks[i][j] == 1) {
         rect((j * (BRICKWIDTH + PADDING)) + PADDING,
             (i * (BRICKHEIGHT + PADDING)) + PADDING,
             BRICKWIDTH, BRICKHEIGHT);
       }
     }
   }
 
   // Odbijanje žoge od sten
   if (x + dx > WIDTH - r || x + dx < r) {
     dx = -dx;
   }
   if (y + dy < r) {
     dy = -dy;
   } else if (y + dy > HEIGHT - (r + f)) {
     if (x > paddlex && x < paddlex + paddlew) {
       dy = -dy;
     } else if (y + dy > HEIGHT - r) {
       clearInterval(intervalId);
       alert("Game Over! Žoga je padla.");
     }
   }
 
   // Posodobi pozicijo žoge
   x += dx;
   y += dy;
 }
 
 $(document).ready(init);