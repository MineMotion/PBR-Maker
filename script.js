const imageInput = document.getElementById("imageInput");
const originalCanvas = document.getElementById("originalCanvas");
const normalCanvas = document.getElementById("normalCanvas");
const ctxOriginal = originalCanvas.getContext("2d");
const ctxNormal = normalCanvas.getContext("2d");

const strengthControl = document.getElementById("strength");
const depthControl = document.getElementById("depthStrength");
const invertR = document.getElementById("invertR");
const invertG = document.getElementById("invertG");
const invertHeight = document.getElementById("invertHeight");

const downloadButton = document.getElementById("downloadButton");

let image = new Image();

imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      image.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

image.onload = () => {
  originalCanvas.width = image.width;
  originalCanvas.height = image.height;
  normalCanvas.width = image.width;
  normalCanvas.height = image.height;

  ctxOriginal.drawImage(image, 0, 0);
  generateNormalMap();
};

function generateNormalMap() {
  const width = originalCanvas.width;
  const height = originalCanvas.height;

  ctxOriginal.drawImage(image, 0, 0, width, height);
  const imageData = ctxOriginal.getImageData(0, 0, width, height);
  const data = imageData.data;

  let normalData = new Uint8ClampedArray(data.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;

      const left = data[((y * width + Math.max(x - 1, 0)) * 4)] * depthControl.value;
      const right = data[((y * width + Math.min(x + 1, width - 1)) * 4)] * depthControl.value;
      const top = data[((Math.max(y - 1, 0) * width + x) * 4)] * depthControl.value;
      const bottom = data[((Math.min(y + 1, height - 1) * width + x) * 4)] * depthControl.value;

      let dx = (right - left) * strengthControl.value;
      let dy = (bottom - top) * strengthControl.value;
      let dz = 255 / strengthControl.value;

      let length = Math.sqrt(dx * dx + dy * dy + dz * dz);
      dx = (dx / length) * 127 + 128;
      dy = (dy / length) * 127 + 128;
      dz = (dz / length) * 127 + 128;

      normalData[index] = invertR.checked ? 255 - dx : dx;
      normalData[index + 1] = invertG.checked ? 255 - dy : dy;
      normalData[index + 2] = invertHeight.checked ? 255 - dz : dz;
      normalData[index + 3] = 255;
    }
  }

  ctxNormal.putImageData(new ImageData(normalData, width, height), 0, 0);
}

strengthControl.addEventListener("input", generateNormalMap);
depthControl.addEventListener("input", generateNormalMap);
invertR.addEventListener("change", generateNormalMap);
invertG.addEventListener("change", generateNormalMap);
invertHeight.addEventListener("change", generateNormalMap);

downloadButton.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "normal_map.png";
  link.href = normalCanvas.toDataURL();
  link.click();
});