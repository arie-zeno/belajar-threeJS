// dracoLoader.setDecoderPath("/node_modules/three/examples/jsm/libs/draco/"); 
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Ekspor fungsi agar dapat digunakan di app.js
export function createGLBViewer(containerId, glbPath) {
  const container = document.getElementById(containerId);
  if (!container) return; 
  
  const width = container.clientWidth;
  const height = container.clientHeight;

  // === LOADER OVERLAY ===
  const loaderOverlay = document.createElement("div");
  loaderOverlay.id = `loader-${containerId}`;
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
  camera.position.set(0, 10, 35);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // === LIGHTING ===
 // 1. AmbientLight (Cahaya Langit/Pengisi)
// Warna biru pucat (B0E0E6) untuk meniru pantulan langit, intensitas rendah (0.3)
const ambientLight = new THREE.AmbientLight(0xB0E0E6, 0.3);

// 2. DirectionalLight (Matahari)
// Warna putih hangat (FFFFE0) dan intensitas tinggi (1.5) untuk dominasi cahaya matahari
const directionalLight = new THREE.DirectionalLight(0xFFFFE0, 1.5);

// Posisi tetap baik untuk mereplikasi arah datangnya cahaya matahari
directionalLight.position.set(10, 25, 20);
directionalLight.target.position.set(0, 0, 0); // Menunjuk ke pusat adegan
  scene.add(ambientLight, directionalLight);

  // === CONTROLS ===
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;

  // === LOADING MODEL ===
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  // Menggunakan CDN yang andal
  // dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/"); 
dracoLoader.setDecoderPath("/node_modules/three/examples/jsm/libs/draco/"); 

  loader.setDRACOLoader(dracoLoader);

  let model = null;

  loader.load(
    glbPath,
    (gltf) => {
      model = gltf.scene;
      model.position.set(0, 0, 0);
      scene.add(model);

      // --- REVISI LOADING (Lebih Agresif dalam Menunda Hapus Overlay) ---
      
      // 1. Paksa kompilasi model dan shader (Ini langkah sinkronus yang berat)
      renderer.compile(scene, camera);
      
      // 2. Render satu frame wajib segera setelah kompilasi
      renderer.render(scene, camera);
      
      // 3. Tambahkan tunda waktu yang lebih lama (300ms) untuk memastikan 
      //    browser selesai me-repaint dan model terlihat jelas di layar.
      setTimeout(() => {
        loaderOverlay.style.opacity = "0";
        // Hapus elemen setelah transisi fade out (500ms) selesai
        setTimeout(() => loaderOverlay.remove(), 500);
      }, 300); // Tunda diperpanjang menjadi 300ms

      // --- AKHIR REVISI LOADING ---
    },
    (xhr) => {
      // Progress unduhan
      const pct = ((xhr.loaded / xhr.total) * 100).toFixed(0);
      loaderOverlay.textContent = `Loading ${pct}%`;
      
      // Tampilkan status "Processing" setelah unduhan 100%
      if (xhr.loaded === xhr.total && loaderOverlay.textContent !== "Processing 3D...") {
          loaderOverlay.textContent = "Processing 3D...";
      }
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
    // Cek apakah container masih ada (Penting saat modal ditutup)
    if (!document.getElementById(containerId)) return; 
    
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // === RESIZE HANDLER ===
  window.addEventListener("resize", () => {
    if (!document.getElementById(containerId)) return;
    
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });
}