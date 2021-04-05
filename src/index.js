import './main.scss';
import './js/back-to-top';
import './js/firebase-login';
import './js/modal-team';
import { LibraryPage, getLibraryPage, setLibraryPage } from './js/library-page';
import refs from './js/refs';
import ApiService from './js/api';

const debounce = require('lodash.debounce');
import { pluginError } from './js/pluginOn';
import './js/theme-switch';
import { spinner } from './js/spinner';

const Api = new ApiService(refs.paginationControls);
const TIME_OUT = 1000;

//Функция проверки текущей страницы
function loadPage() {
  Api.loadWatchedMovies();
  Api.loadQueueMovies();
  const currentPage = document.getElementsByTagName('html')[0];
  Api.resetPage();
  if (currentPage.classList.contains('main-page')) {
    fetchPopularMoviesList();
    refs.searchInput.addEventListener('input', debounce(onSearch, 500));
  }
  if (currentPage.classList.contains('library-page')) {
    refs.loadWatchedBtn.addEventListener('click', loadWatched);
    refs.loadQueueBtn.addEventListener('click', loadQueue);
    loadLibrary();
    console.log('Library'); //по умолчанию, отрисовываются просмотренные фильмы
  }
}

//Функция запроса популярных фильмов и отрисовка галлереи карточек - запускается при загрузке главной страницы
function fetchPopularMoviesList() {
  clear();
  Api.fetchPopularMoviesList()
    .then(movies => movieAdaptedandRender(movies))
    .catch(pluginError);
}

//Функция поиска фильмов по слову - запускается по вводу в инпуте
function onSearchApi() {
  clear();
  Api.fetchSearchMoviesList(Api.searchQuery).then(movies => {
    movieAdaptedandRender(movies);
    if (!movies.total_results) {
      return pluginError('Please enter CORRECT query');
    }
  });
}

function onSearch(event) {
  spinner.show();
  Api.resetPage();
  Api.searchQuery = event.target.value;
  console.log('Api.searchQuery:', Api.searchQuery); //что ищем???
  if (!Api.searchQuery) {
    return fetchPopularMoviesList();
  }
  onSearchApi();
}

function onSearchToPagination() {
  Api.searchQuery = refs.searchInput.value;
  onSearchApi();
}

//Функция очистки галлереи фильмов
function clear() {
  refs.moviesCardsGallery.innerHTML = '';
}

//Функция адаптации пути img и отрисовка
function movieAdaptedandRender(movies) {
  if (movies.results) {
    const moviesArray = movies.results.map(movie => Api.movieAdapter(movie));
    return Api.renderMovieCards(moviesArray);
  }
  const moviesArray = movies.map(movie => Api.movieAdapter(movie));
  return Api.renderMovieCards(moviesArray);
}

function loadLibrary() {
  clear();
  let page = getLibraryPage();
  let request;
  if (page === LibraryPage.WATCHED) {
    refs.loadWatchedBtn.classList.add('active-btn');
    refs.loadQueueBtn.classList.remove('active-btn');
    request = Api.fetchWatchedMoviesList();
  } else if (page === LibraryPage.QUEUE) {
    refs.loadQueueBtn.classList.add('active-btn');
    refs.loadWatchedBtn.classList.remove('active-btn');
    request = Api.fetchQueueMoviesList();
  }
  request
    .then(movies =>
      movies.slice(
        (Api.page - 1) * Api.moviesPerPage,
        Api.page * Api.moviesPerPage,
      )
    )
    .then(movies => movies.map(movie => Api.fetchMovieByID(movie)))
    .then(movies => Promise.all(movies))
    .then(movieAdaptedandRender)
    .catch(pluginError);
}

//Функция отрисовывает просмотренные фильмы пользователя
function loadWatched() {
  setLibraryPage(LibraryPage.WATCHED);
  Api.resetPage();
  loadLibrary();
}

//Функция отрисовывает фильмы добавленные в очередь пользователя
function loadQueue() {
  setLibraryPage(LibraryPage.QUEUE);
  Api.resetPage();
  loadLibrary();
}

// Start of Modal Movie window
function openModalMovie(event) {
  refs.movieInfoModal.innerHTML = '';
  if (!event.target.classList.contains('movie-card__img')) return;
  const movieId = event.target.dataset.movieId;
  Api.fetchMovieByID(movieId)
    .then(responce => {
      return Api.movieAdapter(responce);
    })
    .then(Api.renderMovie)
    .then(() => {
      refs.movieInfoModal.classList.toggle('is-hidden');
      modalListenersOn();
    })
    .catch(pluginError);
}

function modalListenersOn() {
  document
    .querySelector('[data-add-watched]')
    .addEventListener('click', Api.addWatchedMovies);
  document
    .querySelector('[data-add-queue]')
    .addEventListener('click', Api.addQueueMovies);
  document
    .querySelector('.modal-close-btn')
    .addEventListener('click', closeModalMovie);
  window.addEventListener('keydown', escCloseModal);
  refs.movieInfoModal.addEventListener('ckick', clickModalMovie);
}

function closeModalMovie() {
  refs.movieInfoModal.classList.toggle('is-hidden');
  document
    .querySelector('[data-add-watched]')
    .removeEventListener('click', Api.addWatchedMovies);
  document
    .querySelector('[data-add-queue]')
    .removeEventListener('click', Api.addQueueMovies);
  document
    .querySelector('.modal-close-btn')
    .removeEventListener('click', closeModalMovie);
  window.removeEventListener('keydown', escCloseModal);
  refs.movieInfoModal.removeEventListener('ckick', clickModalMovie);
  refs.movieInfoModal.innerHTML = '';
}

function escCloseModal(event) {
  if (event.code === 'Escape') {
    closeModalMovie();
  }
}

function clickModalMovie(event) {
  event.preventDefault();
  if (event.target === event.currentTarget) {
    closeModalMovie();
  }
}

function goToPage(number) {
  const currentPage = document.getElementsByTagName('html')[0];
  if (currentPage.classList.contains('main-page')) {
    Api.page = clamp(Number(number), 1, Api.totalPages);
    if (!Api.searchQuery) {
      fetchPopularMoviesList();
      return;
    }
    onSearchToPagination();
  }
  if (currentPage.classList.contains('library-page')) {
    let libPage = getLibraryPage();

    Api.page = clamp(
      Number(number),
      1,
      libPage === LibraryPage.WATCHED
        ? Math.ceil(Api.getWatchedMovies().length / Api.moviesPerPage)
        : Math.ceil(Api.getQueuedMovies().length / Api.moviesPerPage),
    );

    loadLibrary();
  }
}

function paginationByInput(event) {
  if (event.target.nodeName === 'INPUT') {
    if (event.target.value === '') {
      return;
    }

    goToPage(event.target.value);
  }
}

function paginationByBtn(event) {
  if (event.target.nodeName === 'BUTTON') {
    goToPage(event.target.textContent);
  }
}

function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max);
}

refs.moviesCardsGallery.addEventListener('click', openModalMovie);
window.addEventListener('load', loadPage);
// End of Modal Movie window

refs.btnPrevPagination.addEventListener('click', function () {
  goToPage(Api.page - 1);
});
refs.btnNextPagination.addEventListener('click', function () {
  goToPage(Api.page + 1);
});
refs.paginationControls.addEventListener('click', paginationByBtn);

refs.paginationControls.addEventListener(
  'click',
  debounce(paginationByInput, 1000),
);