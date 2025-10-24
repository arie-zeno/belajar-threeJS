import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

function createGLBViewer(containerId, glbPath) {
  const container = document.getElementById(containerId);
  const width = container.clientWidth;
  const height = container.clientHeight;

  // === LOADER OVERLAY ===
  const loaderOverlay = document.createElement("div");
  loaderOverlay.style.cssText = `
    position:absolute;top:0;left:0;width:100%;height:100%;
    background:rgba(0,0,0,0.85);color:white;
    display:flex;align-items:center;justify-content:center;
    font-size:18px;z-index:9999;transition:opacity 0.5s ease;
  `;
  loaderOverlay.textContent = "Loading 3D...";
  container.appendChild(loaderOverlay);

  // === SCENE SETUP ===
  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(0, 3, 30);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // === LIGHTING ===
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
  directionalLight.position.set(0, -30, 100);
  scene.add(ambientLight, directionalLight);

  // === CONTROLS ===
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;

  // === LOADING MODEL ===
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
  loader.setDRACOLoader(dracoLoader);

  let model = null;

  loader.load(
    glbPath,
    (gltf) => {
      model = gltf.scene;
      model.position.set(0, 0, 0);
      scene.add(model);

      // Fit kamera ke model
      // const box = new THREE.Box3().setFromObject(model);
      // const size = box.getSize(new THREE.Vector3());
      // const center = box.getCenter(new THREE.Vector3());

      // camera.near = size.length() / 100;
      // camera.far = size.length() * 100;
      // camera.updateProjectionMatrix();

      // camera.position.copy(center);
      // camera.position.x += size.x;
      // camera.position.y += size.y / 2;
      // camera.position.z += size.z * 2;
      // controls.target.copy(center);

      // Pastikan render pertama sebelum menampilkan
      renderer.compile(scene, camera);
      requestAnimationFrame(() => {
        renderer.render(scene, camera);
        loaderOverlay.style.opacity = "0";
        setTimeout(() => loaderOverlay.remove(), 500);
      });
    },
    (xhr) => {
      const pct = ((xhr.loaded / xhr.total) * 100).toFixed(0);
      loaderOverlay.textContent = `Loading ${pct}%`;
    },
    (error) => {
      console.error("Error loading GLB:", error);
      loaderOverlay.textContent = "Error loading model!";
    }
  );

  // === ROTASI MANUAL (WASD / ARROW) ===
  window.addEventListener("keydown", (event) => {
    if (!model) return;
    const step = 0.05;
    switch (event.key.toLowerCase()) {
      case "arrowup":
      case "w":
        model.rotation.x -= step;
        break;
      case "arrowdown":
      case "s":
        model.rotation.x += step;
        break;
      case "arrowleft":
      case "a":
        model.rotation.y -= step;
        break;
      case "arrowright":
      case "d":
        model.rotation.y += step;
        break;
    }
  });

  // === ANIMATION LOOP ===
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // === RESIZE HANDLER ===
  window.addEventListener("resize", () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });
}

// Contoh pemakaian
createGLBViewer("modal3d5", "/assets/puskesmas/Puskes_Sungai_Andai.glb");
