// 常數設置
const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const MOVIES_PER_PAGE = 12;
const movies = [];
let filteredMovies = [];

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator");
// 函式
function renderMovieList(data) {
  let rawHTML = ``;

  data.forEach((item) => {
    rawHTML += `
    <div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img
            src=${POSTER_URL + item.image}
            class="card-img-top"
            alt="Movie Poster"
          />
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="card-footer">
            <button
              class="btn btn-primary btn-show-movie"
              data-bs-toggle="modal"
              data-bs-target="#movie-modal"
              data-id="${item.id}"
            >
              More
            </button>
            <button class="btn btn-info btn-add-favorite" data-id="${
              item.id
            }">+</button>
          </div>
        </div>
      </div>
    </div>
    `;
  });

  dataPanel.innerHTML = rawHTML;
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE);
  let rawHTML = "";
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
    `;
  }
  paginator.innerHTML = rawHTML;
}

function getMoviesBypage(page) {
  const data = filteredMovies.length ? filteredMovies : movies;

  const starIndex = (page - 1) * MOVIES_PER_PAGE;
  return data.slice(starIndex, starIndex + MOVIES_PER_PAGE);
}

function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results;
    console.log(data);
    modalTitle.innerText = data.title;
    modalImage.innerHTML = `<img src="${
      POSTER_URL + data.image
    }" alt="movie-poster" class="img-fluid">`;
    modalDate.innerText = data.release_date;
    modalDescription.innerText = data.description;
  });
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const movie = movies.find((movie) => movie.id === id);

  if (list.some((movie) => movie.id === id)) {
    return alert("已經加入過最愛囉");
  }

  list.push(movie);
  console.log(list);
  localStorage.setItem("favoriteMovies", JSON.stringify(list));
}
// 監聽器
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});

paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return;
  const page = Number(event.target.dataset.page);
  renderMovieList(getMoviesBypage(page));
});

searchForm.addEventListener("submit", function onSearchFormSubmit(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();

  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  );
  if (filteredMovies.length === 0) {
    return alert("找不到電影");
  }
  renderPaginator(filteredMovies.length);
  renderMovieList(getMoviesBypage(1));
});
// request
axios
  .get(INDEX_URL)
  .then((response) => {
    for (const movie of response.data.results) {
      movies.push(movie);
      renderPaginator(movies.length);
      renderMovieList(getMoviesBypage(1));
    }
  })
  .catch((err) => console.log(err));
