// main3.js
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Fungsi reusable untuk bikin viewer GLB (dengan Draco support)
function createGLBViewer(containerId, glbPath) {
  const container = document.getElementById(containerId);
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(0, 3, 5);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);
  scene.background = null;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;

  // GLTF Loader + Draco
  const loader = new GLTFLoader();

  // Pasang Draco decoder
  const dracoLoader = new DRACOLoader();
//   dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

  // ini URL resmi draco decoder
  loader.setDRACOLoader(dracoLoader);

  loader.load(
    glbPath,
    (gltf) => {
      const model = gltf.scene;
      model.position.set(0, 0, 0);
      scene.add(model);
      // AUTO FIT kamera ke model
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());

      controls.reset();
      camera.near = size / 100;
      camera.far = size * 100;
      camera.updateProjectionMatrix();

      camera.position.copy(center);
      camera.position.x += size / 2.0;
      camera.position.y += size / 5.0;
      camera.position.z += size / 2.0;
      controls.target.copy(center);
    },
    undefined,
    (error) => {
      console.error("Error loading GLB:", error);
    }
  );

  // Animate
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  window.addEventListener("resize", () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });
}

// Contoh pemakaian
// createGLBViewer("modal3d3", "/assets/model_draco.glb");

// Contoh pemakaian
createGLBViewer("modal3d4", "/assets/sekolah/optimize.glb");
