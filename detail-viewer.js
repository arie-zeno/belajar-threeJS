import { createGLBViewer } from "./main3.js";
import { FASKE_MODELS } from "./faskes-data.js";

function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

document.addEventListener("DOMContentLoaded", () => {
    const modelId = getQueryParameter('id');
    const containerId = 'dynamic-glb-container';
    const detailTitle = document.getElementById('detailTitle');
    const pageTitle = document.getElementById('pageTitle');
    
    if (modelId) {
        const faskes = FASKE_MODELS.find(m => m.id === modelId);

        if (faskes) {
            // Update Judul Halaman
            const titleText = `3D Model: ${faskes.name}`;
            detailTitle.textContent = titleText;
            pageTitle.textContent = titleText;

            // Panggil Fungsi Viewer
            createGLBViewer(containerId, faskes.path);
        } else {
            detailTitle.textContent = "Error: Model tidak ditemukan!";
            document.getElementById(containerId).textContent = "ID Model tidak valid.";
        }
    } else {
        detailTitle.textContent = "Error: ID Model tidak diberikan.";
        document.getElementById(containerId).textContent = "Silakan kembali ke halaman utama untuk memilih model.";
    }
});