import './main.scss';
import './js/back-to-top';
import './js/firebase-login';
import './js/modal-team';
import refs from './js/refs';
import ApiService from './js/api';
const debounce = require('lodash.debounce');
import { pluginError } from './js/pluginOn';
import './js/theme-switch';
import { spinner } from './js/spinner';

const Api = new ApiService(refs.paginationControls);

refs.btnPrevPagination.addEventListener('click', () => {
  Api.goToPrevPage();
  if (!Api.searchQuery) {
    return fetchPopularMoviesListTEST();
  }
  onSearchTEST();
});
refs.btnNextPagination.addEventListener('click', () => {
  Api.goToNextPage();
  if (!Api.searchQuery) {
    return fetchPopularMoviesListTEST();
  }
  onSearchTEST();
});
refs.paginationControls.addEventListener('click', event => {
  if (event.target.nodeName === 'BUTTON') {
    const a = Number(event.target.textContent);
    Api.page = a;
    if (!Api.searchQuery) {
      fetchPopularMoviesListTEST();
      return;
    }
    onSearchTEST();
  }
});
refs.paginationControls.addEventListener('focusout', event => {
  if (event.target.nodeName === 'INPUT') {
    if (event.target.value === '') {
      return;
    }
    const a = Number(event.target.value);
    if (a > Api.totalPagas) {
      Api.page = Api.totalPagas;
      console.log(Api.page);
    }
    Api.page = a;
    if (!Api.searchQuery) {
      fetchPopularMoviesListTEST();
      return;
    }
    onSearchTEST();
  }
});

//Функция проверки текущей страницы
function loadPage() {
  Api.loadWatchedMovies();
  Api.loadQueueMovies();
  const currentPage = document.getElementsByTagName('html')[0];
  if (currentPage.classList.contains('main-page')) {
    fetchPopularMoviesList();
    refs.searchInput.addEventListener('input', debounce(onSearch, 500));
  }
  if (currentPage.classList.contains('library-page')) {
    refs.loadWatchedBtn.addEventListener('click', loadWatched);
    refs.loadQueueBtn.addEventListener('click', loadQueue);
    loadWatched();
    console.log('Library'); //по умолчанию, отрисовываются просмотренные фильмы
  }
}

//Функция запроса популярных фильмов и отрисовка галлереи карточек - запускается при загрузке главной страницы
function fetchPopularMoviesList() {
  clear();
  Api.resetPage();
  Api.fetchPopularMoviesList().then(movies => movieAdaptedandRender(movies));
}

function fetchPopularMoviesListTEST() {
  clear();
  Api.fetchPopularMoviesList()
    .then(movies => movieAdaptedandRender(movies))
    .catch(pluginError);
}

//Функция поиска фильмов по слову - запускается по вводу в инпуте
function onSearch(event) {
  spinner.show();
  clear();
  Api.resetPage();
  Api.searchQuery = event.target.value;
  console.log('Api.searchQuery:', Api.searchQuery); //что ищем???
  if (!Api.searchQuery) {
    refs.warningNotificationRef.textContent = '';
    return fetchPopularMoviesList();
  }
  Api.fetchSearchMoviesList(Api.searchQuery).then(movies => {
    movieAdaptedandRender(movies);
    if (!movies.total_results) {
      refs.warningNotificationRef.textContent =
        'Search result not successful. Enter the correct movie name and try again';
    }
  });
}

function onSearchTEST() {
  clear();
  Api.searchQuery = refs.searchInput.value;
  Api.fetchSearchMoviesList(Api.searchQuery).then(movies => {
    movieAdaptedandRender(movies);
    if (!movies.total_results) {
      return pluginError('Please enter CORRECT query');
    }
  });
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

//Функция отрисовывает просмотренные фильмы пользователя
function loadWatched() {
  clear();
  Api.resetPage();
  refs.loadWatchedBtn.classList.add('active-btn');
  refs.loadQueueBtn.classList.remove('active-btn');
  console.log('отрисовать просмотренные фильмы');
  Api.fetchWatchedMoviesList()
    .then(movies => movies.map(movie => Api.fetchMovieByID(movie)))
    .then(movies => Promise.all(movies))
    .then(movieAdaptedandRender)
    .catch(pluginError);
}
//Функция отрисовывает фильмы добавленные в очередь пользователя
function loadQueue() {
  clear();
  Api.resetPage();
  refs.loadWatchedBtn.classList.remove('active-btn');
  refs.loadQueueBtn.classList.add('active-btn');
  console.log('отрисовать фильмы добавленные в очередь пользователя');
  Api.fetchQueueMoviesList()
    .then(movies => movies.map(movie => Api.fetchMovieByID(movie)))
    .then(movies => Promise.all(movies))
    .then(movieAdaptedandRender)
    .catch(pluginError);
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
  // window.addEventListener('keydown', escCloseModal);
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
  refs.movieInfoModal.innerHTML = '';
}

refs.moviesCardsGallery.addEventListener('click', openModalMovie);
window.addEventListener('load', loadPage);
// End of Modal Movie window
