const viewport = document.getElementById("viewport");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, viewport.clientWidth / viewport.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(viewport.clientWidth, viewport.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0);
viewport.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({
  normalMap: null,
  roughness: 0.5,
  metalness: 0.5
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

camera.position.set(0, 1, 2);
camera.lookAt(0, 0, 0);

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.y += 0.006;
  renderer.render(scene, camera);
}

animate();

function updateNormalMapFromCanvas() {
  if (!normalCanvas) return;

  const normalTexture = new THREE.Texture(normalCanvas);
  normalTexture.colorSpace = THREE.SRGBColorSpace;
  normalTexture.needsUpdate = true;

  material.normalMap = normalTexture;
  material.needsUpdate = true;
}

setInterval(updateNormalMapFromCanvas, 300);