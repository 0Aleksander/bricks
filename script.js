// Matrix Background Effect
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
  