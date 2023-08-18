const API = "http://localhost:3000/goods";

// ! admin modal
const inpName = document.querySelector("#inpName");
const inpDesc = document.querySelector("#inpDesc");
const inpImage = document.querySelector("#inpImage");
const inpYear = document.querySelector("#inpYear");
const section = document.querySelector("#section");
const createCloseModal = document.querySelector("#create-close-modal");

//! Переменные для поиска
let searchValue = "";

//! переменные для кнопок пагинации
const LIMIT = 6;
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");

//! переменные для пагинации
let currentPage = 1;
let countPage = 1;

btnAdd.addEventListener("click", () => {
  if (
    !inpName.value.trim() ||
    !inpDesc.value.trim() ||
    !inpImage.value.trim()
  ) {
    return alert("Заполните все поля!");
  }

  const newProduct = {
    title: inpName.value,
    description: inpDesc.value,
    image: inpImage.value,
    year: inpYear.value,
  };

  createItem(newProduct);
  renderGoods();
});

async function createItem(product) {
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(product),
  });
  //   btnOpenForm.classList.toggle("show");
  inpName.value = "";
  inpDesc.value = "";
  inpImage.value = "";
}

renderGoods();

async function renderGoods() {
  let res;
  if (searchValue) {
    res = await fetch(
      `${API}?title=${searchValue}&_page${currentPage}&_limit=${LIMIT}`
    );
  } else {
    res = await fetch(`${API}?_page=${currentPage}&_limit=${LIMIT}`);
  }
  const data = await res.json();

  section.innerHTML = "";
  data.forEach(({ year, title, description, image, id }) => {
    section.innerHTML += `
              <div class="card m-4 cardBook bg-light" style="width: 18rem">
                  <img id="${id}" src=${image} class="card-img-top detailsCard" style="heigth: 280px" alt="${title}"/>
                  <div class="card-body">
                      <h5 class="card-title">${title}</h5>
                      <p class="card-text">${description}</p>
                      <p class="card-text">${year}</p>
                      <button class="btn btn-outline-light btnDelete" id="${id}">
                          
                      </button>
                      <button
                          class="btn btn-outline-light btnEdit" id="${id}"
                          data-bs-target="#editModal"
                          data-bs-toggle="modal"
                      >
                          
                      </button>
                      <a href="./detail.html">
                      <button
                      class="btn btn-outline-info btnDetails" id="${id}"
                  >
                      Details
                  </button>
                  </a>
                  </div>
              </div>
          `;
  });
  pageFunc();
}

// !search
const inpSearch = document.querySelector("#inpSearch");
const searchBtn = document.querySelector("#searchBtn");

inpSearch.addEventListener("input", ({ target: { value } }) => {
  searchValue = value;
});

searchBtn.addEventListener("click", renderGoods);

//! pagenation

async function pageFunc() {
  const res = await fetch(API);
  const data = await res.json();

  countPage = Math.ceil(data.length / LIMIT);
  console.log(countPage, currentPage);
  if (currentPage === countPage) {
    nextBtn.classList.add("disabled");
  } else {
    nextBtn.classList.remove("disabled");
  }

  if (currentPage === 1) {
    prevBtn.classList.add("disabled");
  } else {
    prevBtn.classList.remove("disabled");
  }
}

//! ------delete---------
document.addEventListener("click", async ({ target: { classList, id } }) => {
  const delClass = [...classList];
  if (delClass.includes("btnDelete")) {
    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
      });
      renderGoods();
    } catch (error) {
      console.log(error);
    }
  }
});

renderGoods();

//! ----------- edit ----------

const editInpName = document.querySelector("#editInpName");
const editInpDesc = document.querySelector("#editInpDesc");
const editInpYear = document.querySelector("#editInpYear");
const editInpImage = document.querySelector("#editInpImage");
const editBtnSave = document.querySelector("#editBtnSave");

document.addEventListener("click", async ({ target: { classList, id } }) => {
  const classes = [...classList];
  if (classes.includes("btnEdit")) {
    const res = await fetch(`${API}/${id}`);
    const { title, description, image, year, id: productId } = await res.json();
    editInpName.value = title;
    editInpDesc.value = description;
    editInpImage.value = image;
    editInpYear.value = year;
    editBtnSave.setAttribute("id", productId);
  }
});

editBtnSave.addEventListener("click", () => {
  const editedProduct = {
    title: editInpName.value,
    description: editInpDesc.value,
    image: editInpImage.value,
    link: editInpYear.value,
  };
  editProduct(editedProduct, editBtnSave.id);
});

async function editProduct(product, id) {
  try {
    await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(product),
    });
    renderGoods();
    createCloseModal.click();
  } catch (error) {
    console.log(error);
  }
}

prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  renderGoods();
});

nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage++;
  renderGoods();
});

// !Details

document.addEventListener("click", ({ target }) => {
  if (target.classList.contains("btnDetails")) {
    localStorage.setItem("detail-id", target.id);
  }
});
