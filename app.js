import { FASKE_MODELS } from "./faskes-data.js";

// Import fungsi mode jelajah. Asumsikan ini ada di file 'explore-mode.js'
// CATATAN: Karena kode mode jelajah Anda menggunakan THREE, Anda HARUS 
// memastikan 'explore-mode.js' diimpor sebagai MÒDUL di HTML dan 
// memiliki akses ke THREE.
// Jika Anda ingin mengaktifkan mode jelajah di halaman index.html, 
// Anda perlu menambahkan modal dan fungsionalitas di index.html.

// Untuk saat ini, kita akan membuat tombolnya menunjuk ke halaman 
// 'explore.html' yang spesifik, mirip dengan 'detail.html'.

function generateTableRows() {
  const tbody = document.querySelector("#faskesTableBody");
  if (!tbody) return;

  tbody.innerHTML = ''; 

  FASKE_MODELS.forEach((faskes, index) => {
    const row = tbody.insertRow();
    
    // Tautan ke halaman detail 3D biasa (orbit control, dll.)
    const detailUrl = `detail.html?id=${faskes.id}`;
    
    // Tautan ke halaman mode jelajah (first-person control)
    // Asumsi: Kita akan membuat halaman baru bernama 'explore.html'
    const exploreUrl = `explore.html?id=${faskes.id}`; 

    row.innerHTML = `
      <th scope="row">${index + 1}</th>
      <td>${faskes.name}</td>
      <td class="text-center">
        <a href="${detailUrl}" class="btn btn-sm btn-outline-primary rounded-3 me-2">
          Lihat 3D
        </a>
        <a href="${exploreUrl}" class="btn btn-sm btn-outline-success rounded-3">
          Mode Jelajah
        </a>
      </td>
      <td>${faskes.date || ''}</td>
    `;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  generateTableRows();
});