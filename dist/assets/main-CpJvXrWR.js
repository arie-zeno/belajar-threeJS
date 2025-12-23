import{F as a}from"./faskes-data-Isz66isy.js";function i(){const e=document.querySelector("#faskesTableBody");e&&(e.innerHTML="",a.forEach((t,n)=>{const o=e.insertRow(),d=`detail.html?id=${t.id}`,r=`explore.html?id=${t.id}`;o.innerHTML=`
      <th scope="row">${n+1}</th>
      <td>${t.name}</td>
      <td class="text-center">
        <a href="${d}" class="btn btn-sm btn-outline-primary rounded-3 me-2">
          Lihat 3D
        </a>
        <a href="${r}" class="btn btn-sm btn-outline-success rounded-3">
          Mode Jelajah
        </a>
      </td>
      <td>${t.date||""}</td>
    `}))}document.addEventListener("DOMContentLoaded",()=>{i()});
