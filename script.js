// script.js
const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');
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
const gridCheckbox = document.getElementById('gridCheckbox'); // Add the grid checkbox
const saveButton = document.getElementById('saveButton');
let pixelSize = 3;
let pixelCount = 500;
let loopInterval = 1000; // 1 second interval
let loopIntervalId;
let isGridEnabled = false; // Variable to toggle grid generation

increaseSizeButton.addEventListener('click', () => changePixelSize(1));
decreaseSizeButton.addEventListener('click', () => changePixelSize(-1));

increasePixelsButton.addEventListener('click', () => {
    changePixelCount(10);
    generatePixels();
});

decreasePixelsButton.addEventListener('click', () => {
    changePixelCount(-10);
    generatePixels();
});
generateButton.addEventListener('click', generatePixels);
loopCheckbox.addEventListener('change', toggleLoop);
fasterButton.addEventListener('click', () => changeLoopInterval(-100));
slowerButton.addEventListener('click', () => changeLoopInterval(100));
gridCheckbox.addEventListener('change', toggleGrid); // Listen for changes to the "Grid" checkbox

// Add a click event listener to the "Save" button
saveButton.addEventListener('click', () => {
    const canvas = document.getElementById('pixelCanvas');
    const dataURL = canvas.toDataURL('image/png');

    // Create an anchor element to trigger the download
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'canvas_image.png';
    link.click();
});

function changePixelSize(change) {
    pixelSize += change;
    if (pixelSize < 1) {
        pixelSize = 1;
    }
    generatePixels();
}

function changePixelCount(change) {
    pixelCount += change;
    if (pixelCount < 1) {
        pixelCount = 1;
    }

    if (isGridEnabled) {
        const maxGridPixels = Math.floor((canvas.width / pixelSize) * (canvas.height / pixelSize));
        pixelCount = Math.min(pixelCount, maxGridPixels);
    } else {
        const maxPixels = Math.floor((canvas.width * canvas.height) / (pixelSize * pixelSize));
        pixelCount = Math.min(pixelCount, maxPixels);
    }

    pixelCountDisplay.textContent = pixelCount + " Pixels";
}

function generatePixels() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const maxPixels = isGridEnabled
      ? Math.floor((canvas.width / pixelSize) * (canvas.height / pixelSize))
      : Math.floor((canvas.width * canvas.height) / (pixelSize * pixelSize));

    // Generate pixels in a grid or randomly, but not exceeding the updated pixelCount
    for (let i = 0; i < Math.min(pixelCount, maxPixels); i++) {
        const x = isGridEnabled ? (i * pixelSize) % canvas.width : Math.random() * canvas.width;
        const y = isGridEnabled ? Math.floor((i * pixelSize) / canvas.width) * pixelSize : Math.random() * canvas.height;

        const color = colorCheckbox.checked ? getRandomColor() : 'black';

        ctx.fillStyle = color;

        if (allowOverlappingCheckbox.checked || !isPixelOccupied(x, y)) {
            ctx.fillRect(x, y, pixelSize, pixelSize);
        }
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function isPixelOccupied(x, y) {
    const imageData = ctx.getImageData(x, y, pixelSize, pixelSize).data;
    for (let i = 0; i < imageData.length; i++) {
        if (imageData[i] !== 0) {
            return true;
        }
    }
    return false;
}

function toggleLoop() {
    if (loopCheckbox.checked) {
        startLoop();
    } else {
        stopLoop();
    }
}

function startLoop() {
    if (loopIntervalId) {
        clearInterval(loopIntervalId);
    }
    loopInterval = Math.max(loopInterval, 100); // Ensure a minimum interval of 100ms
    loopInterval = Math.min(loopInterval, 5000); // Limit to a maximum interval of 5 seconds
    loopIntervalId = setInterval(generatePixels, loopInterval);
}

function stopLoop() {
    clearInterval(loopIntervalId);
    loopIntervalId = null;
}

function changeLoopInterval(change) {
    loopInterval += change;
    loopInterval = Math.max(loopInterval, 100); // Ensure a minimum interval of 100ms
    loopInterval = Math.min(loopInterval, 5000); // Limit to a maximum interval of 5 seconds
    if (loopCheckbox.checked && loopIntervalId) {
        clearInterval(loopIntervalId);
        loopIntervalId = setInterval(generatePixels, loopInterval);
    }
}

function toggleGrid() {
    isGridEnabled = gridCheckbox.checked;
    generatePixels();
}
