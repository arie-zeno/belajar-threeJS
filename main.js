import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const container = document.getElementById("model");
const width = container.clientWidth;
const height = container.clientHeight;

// 1. Scene
const scene = new THREE.Scene();

// 2. Camera
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.set(0, 20, 35);

// 3. Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(width, height);
container.appendChild(renderer.domElement);
scene.background = null;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// 5. OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // rotasi lebih smooth
controls.dampingFactor = 0.05;
controls.enableZoom = true;

// 6. Load Material + Object
const mtlLoader = new MTLLoader();
mtlLoader.load("/assets/menara_pandang/menara_pandang.mtl", (materials) => {
  materials.preload();

  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load("/assets/menara_pandang/menara_pandang.obj", (object) => {
    object.position.set(0, 0, 0); // posisi objek
    scene.add(object);
  });
});

// 7. Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // update orbit
  renderer.render(scene, camera);
}
animate();

// 8. Resize handler
window.addEventListener("resize", () => {
  const newWidth = container.clientWidth;
  const newHeight = container.clientHeight;
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(newWidth, newHeight);
});
