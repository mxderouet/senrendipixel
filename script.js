// script.js
// Canvas setup
const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');

// UI elements
const generateButton = document.getElementById('generateButton');
const colorCheckbox = document.getElementById('colorCheckbox');
const increaseSizeButton = document.getElementById('increaseSize');
const decreaseSizeButton = document.getElementById('decreaseSize');
const increasePixelsButton = document.getElementById('increasePixels');
const decreasePixelsButton = document.getElementById('decreasePixels');
const allowOverlappingCheckbox = document.getElementById('allowOverlapping');
const pixelCountDisplay = document.getElementById('pixelCount');
const loopCheckbox = document.getElementById('loopCheckbox');
const fasterButton = document.getElementById('fasterButton');
const slowerButton = document.getElementById('slowerButton');
const gridCheckbox = document.getElementById('gridCheckbox');
const saveButton = document.getElementById('saveButton');
const paletteSelect = document.getElementById('paletteSelect');

// State
let pixelSize = 3;
let pixelCount = 500;
let loopInterval = 1000;
let loopId = null;
let isGridEnabled = false;
let occupied = new Set();
let currentPalette = 'random';

// Color palettes
const palettes = {
  vaporwave: ['#ff71ce','#01cdfe','#05ffa1','#b967ff','#fffb96'],
  cyberpunk: ['#00ffff','#ff00ff','#ffff00','#111111','#ff3333'],
  pastel: ['#ffd1dc','#c1e1c1','#fdfd96','#cfcfc4'],
  monochrome: ['#000000','#222222','#444444','#666666','#888888']
};

// Events
generateButton.onclick = generatePixels;
increaseSizeButton.onclick = () => changePixelSize(1);
decreaseSizeButton.onclick = () => changePixelSize(-1);
increasePixelsButton.onclick = () => changePixelCount(10);
decreasePixelsButton.onclick = () => changePixelCount(-10);
loopCheckbox.onchange = () => loopCheckbox.checked ? startLoop() : stopLoop();
fasterButton.onclick = () => changeLoopInterval(-100);
slowerButton.onclick = () => changeLoopInterval(100);
gridCheckbox.onchange = () => { isGridEnabled = gridCheckbox.checked; generatePixels(); };
saveButton.onclick = saveImage;
paletteSelect.onchange = e => {
  currentPalette = e.target.value;
  generatePixels();
};

// Core functions
function generatePixels() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  occupied.clear();

  const cols = Math.floor(canvas.width / pixelSize);
  const rows = Math.floor(canvas.height / pixelSize);
  const maxPixels = cols * rows;

  for (let i = 0; i < Math.min(pixelCount, maxPixels); i++) {
    let gx, gy, key;
    let attempts = 0;

    do {
      if (isGridEnabled) {
        gx = i % cols;
        gy = Math.floor(i / cols);
      } else {
        gx = Math.floor(Math.random() * cols);
        gy = Math.floor(Math.random() * rows);
      }
      key = `${gx},${gy}`;
      attempts++;
    } while (!allowOverlappingCheckbox.checked && occupied.has(key) && attempts < 10);

    occupied.add(key);
    ctx.fillStyle = colorCheckbox.checked ? randomColor() : '#000';
    ctx.fillRect(gx * pixelSize, gy * pixelSize, pixelSize, pixelSize);
  }

  pixelCountDisplay.textContent = pixelCount + ' Pixels';
}

function randomColor() {
  if (currentPalette === 'random') {
    return '#' + Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0');
  }
  const palette = palettes[currentPalette];
  return palette[Math.floor(Math.random() * palette.length)];
}

function changePixelSize(delta) {
  pixelSize = Math.max(1, pixelSize + delta);
  generatePixels();
}

function changePixelCount(delta) {
  pixelCount = Math.max(1, pixelCount + delta);
  generatePixels();
}

function startLoop() {
  stopLoop();
  loopId = setInterval(generatePixels, loopInterval);
}

function stopLoop() {
  clearInterval(loopId);
  loopId = null;
}

function changeLoopInterval(delta) {
  loopInterval = Math.min(5000, Math.max(100, loopInterval + delta));
  if (loopCheckbox.checked) startLoop();
}

function saveImage() {
  const link = document.createElement('a');
  link.download = 'pixels.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// Initial render
generatePixels();
