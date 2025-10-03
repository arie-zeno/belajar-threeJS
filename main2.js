import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Fungsi reusable untuk bikin viewer baru
function create3DViewer(containerId, mtlPath, objPath) {
    const container = document.getElementById(containerId);
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 10, 20);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    scene.background = null;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 15, 10);
    scene.add(directionalLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;

    // Load Model
    const mtlLoader = new MTLLoader();
    mtlLoader.load(mtlPath, (materials) => {
        materials.preload();

        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(objPath, (object) => {
            object.position.set(0, 0, 0);
            scene.add(object);
        });
    });

    // Animate
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });
}

// Buat dua viewer berbeda (tiap modal punya sendiri)
create3DViewer(
    "modal3d1",
    "/assets/menara_pandang/menara_pandang.mtl",
    "/assets/menara_pandang/menara_pandang.obj"
);

// create3DViewer(
//     "modal3d2",
//     "/assets/menara_pandang/menara_pandang.mtl",
//     "/assets/menara_pandang/menara_pandang.obj"
// );
