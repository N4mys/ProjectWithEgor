const API = "http://localhost:3000/goods";
const detailBlock = document.getElementById("detail");

async function getOneGood(id) {
  const res = await fetch(`${API}/${id}`);
  const data = await res.json();

  detailBlock.innerHTML = `
  <div class="card py-3" style="max-width: 1000px;">
  <div class="row g-0">
    <div class="col-md-4">
      <img src="${data.image}" class="img-fluid rounded-start" alt="...">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">${data.title}</h5>
        <p class="card-text">${data.description}</p>
        <p class="card-text"><small class="text-muted">${data.year}</small></p>
      </div>
      <a href="https://oc.kg/" class="btn btn-primary">Смотреть</a>
    </div>
  </div>
</div>
  `;
  console.log(data);
}

const id = localStorage.getItem("detail-id");
console.log(id);
getOneGood(id);
