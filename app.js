import { FASKE_MODELS } from "./faskes-data.js";


function generateTableRows() {
  const tbody = document.querySelector("#faskesTableBody");
  if (!tbody) return;

  tbody.innerHTML = ''; 

  FASKE_MODELS.forEach((faskes, index) => {
    const row = tbody.insertRow();
    
    const detailUrl = `detail.html?id=${faskes.id}`;
    
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