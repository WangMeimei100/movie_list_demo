const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = []
let filteredMovies = []
const MOVIES_PER_PAGE = 12

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

// //【1】使用 for...of(自己嘗試)(沒有東西)(因為剛剛axios沒有載入renderMovieList函式啊...)
// function renderMovieList(data) {
//   let rawHTML = ''
//   for (let item of data) {
//     // console.log(item);
//     rawHTML += ` <div class="col-sm-3">
//     <div class="mb-2">
//     <div class="card">
//     <img
//     src= ${POSTER_URL + item.image}
//     class="card-img-top" alt="Movie Poster" />
//     <div class="card-body">
//     <h5 class="card-title">${item.title}</h5>
//     </div>
//     <div class="card-footer">
//     <button class="btn btn-primary btn-show-movie" data-toggle="modal"
//     data-target="#movie-modal">More</button>
//     <button class="btn btn-info btn-add-favorite">+</button>
//     </div>
//     </div>
//     </div>
//     </div>`
//   }
//   dataPanel.innerHTML = rawHTML
// }

// 【2】使用 forEach(課程講解)
function renderMovieList (data) {
  let rawHTML = ''
  data.forEach((item) => {
    // title, image, id 隨著每個 item 改變
    rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${POSTER_URL + item.image
      }" class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
        </div>
      </div>
    </div>
  </div>`
  })
  dataPanel.innerHTML = rawHTML
  // ==== try ing ==== 在這邊找電影總共有幾部
  // console.log(movies.length)
}

// == start to try
function getMoviesByPage (page) {
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = MOVIES_PER_PAGE * (page - 1)
  console.log(filteredMovies)
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function renderPaginator (amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

function showMovieModal (id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">`
  })
}
function addToFavorite (id) {
  // ====（較優）先定義getItem，當未事先setItem而直接取用getItem，會回傳 null 的特性，可以讓getItem第一次未存入喜愛的電影清單時，得到空陣列====

  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))

  // ===測試jsonString與jsonObject的用法===
  // console.log(list)
  // const jsonString = JSON.stringify(list)
  // console.log('jsonString:', jsonString)
  // console.log('jsonObject:', JSON.parse(jsonString))

  // ====（較不佳）先定義setItem，再使用getItem，會讓整個流程變得很複====
  // if (localStorage.getItem('favoriteMovies') === null) {
  //   localStorage.setItem('favoriteMovies', []);
  // }
  // const movie = movies.find((movie) => movie.id === id)
  // const list = JSON.parse(localStorage.getItem('favoriteMovies'))
  // if (list.some((movie) => movie.id === id)) {
  //   return alert('此電影已經在收藏清單中！')
  // }

  // list.push(movie)
  // localStorage.setItem('favoriteMovies', JSON.stringify(list))
}
// ==== try ing ====
// function onPageClicked(event) {

// }

// 監聽 data panel（點擊detail時,可以取得id）
// 設計顯示的畫面，判斷點擊的是哪個按鈕
dataPanel.addEventListener('click', function onPanelClicked (event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id)) // 修改這裡
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})
// 監聽 searchForm
searchForm.addEventListener('submit', function onSearchFormSubmitted (event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(keyword))
  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }
  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1))
})

// ===== try ing ====
paginator.addEventListener('click', function onPageClicked (event) {
  // console.log(pageNumber)
  if (event.target.tagName !== 'A') return
  const page = event.target.innerText
  // console.log(page)
  // const page = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(page)) // 新增這裡
})

// 【1】使用 forEach(自己嘗試)
// axios.get(INDEX_URL)
//   .then((response) => {
//     response.data.results.forEach(movie => {
//       movies.push(movie)
//       renderMovieList(movies) //新增這裡

//     });
//     console.log(movies)
//   })

// 【2】使用 for...of(課程講解：常見用法)
// axios.get(INDEX_URL)
//   .then((response) => {
//     for (const movie of response.data.results) {
//       movies.push(movie)
//     }
//     console.log(movies)
//   }).catch((err) => console.log(err))

// 【3】使用 展開運算子(spread operator)(課程講解：推薦用法)
axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    // movies.innerHTML = response.data.results
    // console.log(response.data.results)
    // console.log(movies)
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(1))
    // 新增這裡
    // renderMovieList(movies) //新增這裡
  })
  .catch((err) => console.log(err))
