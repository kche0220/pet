const API_KEY = "7a7d9519-9a85-4fe8-9e19-9cc325097880";

let currentPage = 1;
let itemsPerPage = 12;

let totalItemsCount = 0;
let totalPageCount = 0;

let searchKeyword = "";

const fetchData = async (keyword, page) => {
  let url = new URL(
    `http://api.kcisa.kr/openapi/API_TOU_050/request?serviceKey=${API_KEY}`
  );
  url.searchParams.append("pageNo", page);
  url.searchParams.append("numOfRows", itemsPerPage);

  if (keyword !== "") url.searchParams.append("keyword", keyword);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const renderItems = (items) => {
    const itemListHtml = items
      .map(
        (item) => `
        <li class="item">
            <h4 class="title">${item.title}</h4>
            <p class="category">${item.category2}</p>
            <span class="address">${item.address}</span>
            <p class="tel">${item.tel}</p>
        </li>
      `
      )
      .join("");
    document.querySelector(".items").innerHTML = itemListHtml;
  };

  const inputText = document.getElementById("searchInput");
  inputText.addEventListener("keypress", (e) => {
    currentPage = 1;
    if (e.code === "Enter") {
      searchKeyword = inputText.value;
      fetchData(searchKeyword, currentPage);
    }
  });

  const searchButton = document.querySelector(".searchBtn");
  searchButton.addEventListener("click", () => {
    searchKeyword = inputText.value;
    fetchData(searchKeyword);
  });

  const prevBtn = document.querySelector(".prevBtn");
  const nextBtn = document.querySelector(".nextBtn");

  prevBtn.addEventListener("click", () => {
    if (currentPage === 1) return;
    currentPage--;
    fetchData(searchKeyword, currentPage);
  });

  nextBtn.addEventListener("click", () => {
    if (currentPage === totalPageCount) return;
    currentPage++;
    fetchData(searchKeyword, currentPage);
  });

  const data = await response.json();
  if (data.response.body.items) {
    const dataList = data.response.body.items.item;

    totalItemsCount = data.response.body.totalCount;
    totalPageCount = Math.ceil(totalItemsCount / itemsPerPage);

    if (dataList.length < itemsPerPage) {
      nextBtn.disabled = true;
    } else {
      nextBtn.disabled = false;
    }

    if (currentPage === 1) {
      prevBtn.disabled = true;
    } else {
      prevBtn.disabled = false;
    }

    updatePagination(totalPageCount);
    renderItems(dataList);
    createPaginationButtons(totalPageCount);
  } else {
    document.querySelector(".items").innerHTML = "검색 결과가 없어요~";
    nextBtn.disabled = true;
    prevBtn.disabled = true;
  }
};

const updatePagination = (totalPages) => {};
const createPaginationButtons = (totalPages) => {
  const paginationContainer = document.getElementById("paginationContainer");
  paginationContainer.innerHTML = "";

  let startPage = 1;
  let endPage = 10;

  if (currentPage > 5) {
    startPage = currentPage - 4;
    endPage = currentPage + 5;
  }

  if (endPage > totalPages) {
    endPage = totalPages;
  }

  for (let i = startPage; i <= endPage; i++) {
    const button = document.createElement("button");
    button.innerText = i;
    button.addEventListener("click", () => {
      currentPage = i;
      fetchData(searchKeyword, currentPage);
    });
    paginationContainer.appendChild(button);
  }
};

fetchData(searchKeyword, currentPage);
