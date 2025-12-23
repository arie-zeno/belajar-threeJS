import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export function createGLBViewer(containerId, glbPath) {
  const container = document.getElementById(containerId);
  if (!container) return; 

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

  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
  camera.position.set(0, 2, 5);
  const initialY = camera.position.y; 

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  const directional = new THREE.DirectionalLight(0xffffff, 5);
  directional.position.set(10, 10, 10);
  scene.add(ambient, directional);

  // === CONTROL VARIABLES ===
  const move = { forward: false, backward: false, left: false, right: false };
  const camMove = { up: false, down: false, left: false, right: false };
  const speed = 10;
  const camSpeed = 1.5;
  let yaw = 0;
  let pitch = 0;
  let bounds = null;

  // === KEYBOARD INPUT ===
  document.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "KeyW": move.forward = true; break;
      case "KeyS": move.backward = true; break;
      case "KeyA": move.left = true; break;
      case "KeyD": move.right = true; break;
      case "ArrowUp": camMove.up = true; break;
      case "ArrowDown": camMove.down = true; break;
      case "ArrowLeft": camMove.left = true; break;
      case "ArrowRight": camMove.right = true; break;
    }
  });
  document.addEventListener("keyup", (e) => {
    switch (e.code) {
      case "KeyW": move.forward = false; break;
      case "KeyS": move.backward = false; break;
      case "KeyA": move.left = false; break;
      case "KeyD": move.right = false; break;
      case "ArrowUp": camMove.up = false; break;
      case "ArrowDown": camMove.down = false; break;
      case "ArrowLeft": camMove.left = false; break;
      case "ArrowRight": camMove.right = false; break;
    }
  });

  // === LOAD MODEL ===
  const loader = new GLTFLoader();
  const draco = new DRACOLoader();
  draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
  loader.setDRACOLoader(draco);

  let modelLoaded = false;

  loader.load(
    glbPath,
    (gltf) => {
      const model = gltf.scene;
      scene.add(model);

      // Hitung bounding box model
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      const margin = 3;
      bounds = {
        minX: box.min.x - margin,
        maxX: box.max.x + margin,
        minY: box.min.y - margin,
        maxY: box.max.y + margin * 2,
        minZ: box.min.z - margin,
        maxZ: box.max.z + margin,
      };

      camera.position.set(center.x, initialY, box.max.z + size.z * 0.2);

      renderer.compile(scene, camera);
      requestAnimationFrame(() => {
        renderer.render(scene, camera);
        loaderOverlay.style.opacity = "0";
        setTimeout(() => loaderOverlay.remove(), 500);
      });

      modelLoaded = true;
    },
    (xhr) => {
      const pct = ((xhr.loaded / xhr.total) * 100).toFixed(0);
      loaderOverlay.textContent = `Loading ${pct}%`;
    },
    (err) => console.error("Error loading GLB:", err)
  );

  // === ANIMATION LOOP ===
  const clock = new THREE.Clock();
  function animate() {
    const delta = clock.getDelta();
    const velocity = speed * delta;

    if (modelLoaded && bounds) {
      // Rotasi kamera
      if (camMove.left) yaw += camSpeed * delta;
      if (camMove.right) yaw -= camSpeed * delta;
      camera.rotation.set(pitch, yaw, 0);

      // Arah gerak relatif kamera
      const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw)).normalize();
      const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0));

      const newPos = camera.position.clone();
      if (move.forward) newPos.addScaledVector(forward, velocity);
      if (move.backward) newPos.addScaledVector(forward, -velocity);
      if (move.left) newPos.addScaledVector(right, -velocity);
      if (move.right) newPos.addScaledVector(right, velocity);
      if (camMove.up) newPos.y += velocity;
      if (camMove.down && newPos.y > initialY) newPos.y -= velocity; 
      // Batasi dalam bounding box
      newPos.x = Math.max(bounds.minX, Math.min(bounds.maxX, newPos.x));
      newPos.y = Math.max(initialY, Math.min(bounds.maxY, newPos.y)); 
      newPos.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, newPos.z));

      camera.position.copy(newPos);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  // === RESIZE HANDLER ===
  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}