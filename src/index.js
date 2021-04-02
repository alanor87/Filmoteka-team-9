import './main.scss';
import './js/back-to-top';
import './js/firebase-login';
import './js/modal-team';

import refs from './js/refs'; /* ждём, пока у нас появятся все нужные имена классов для querySelector */
import ApiService from './js/api';
const debounce = require('lodash.debounce');
import { pluginError } from './js/pluginOn';
import './js/theme-switch';

const Api = new ApiService();

window.addEventListener('load', loadPage);

//Функция проверки текущей страницы
function loadPage() {
  Api.checkValueLocalStorage();
  const currentPage = document.getElementsByTagName('html')[0];
  if (currentPage.classList.contains('main-page')) {
    fetchPopularMoviesList();
    refs.searchInput.addEventListener('input', debounce(onSearch, 500));
  }
  if (currentPage.classList.contains('library-page')) {
    refs.loadWatchedBtn.addEventListener('click', loadWatched);
    refs.loadQueueBtn.addEventListener('click', loadQueue);
    loadWatched(); //по умолчанию, отрисовываются просмотренные фильмы
  }
}

//Функция запроса популярных фильмов и отрисовка галлереи карточек - запускается при загрузке главной страницы
function fetchPopularMoviesList() {
  clear();
  Api.resetPage();
  Api.fetchPopularMoviesList().then(movies => movieAdaptedandRender(movies));
}

//Функция поиска фильмов по слову - запускается по вводу в инпуте
function onSearch(event) {
  event.preventDefault();
  clear();
  Api.resetPage();
  Api.searchQuery = event.target.value;
  console.log('Api.searchQuery:', Api.searchQuery); //что ищем???
  if (!Api.searchQuery) {
    return fetchPopularMoviesList();
  }
  Api.fetchSearchMoviesList(Api.searchQuery).then(movies => {
    movieAdaptedandRender(movies);
    if (!movies.total_results) {
      return pluginError();
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
  return Api.renderMovieCards(movies);
}

//Функция отрисовывает просмотренные фильмы пользователя
function loadWatched() {
  clear();
  Api.resetPage();
  refs.loadWatchedBtn.classList.add('active-btn');
  refs.loadQueueBtn.classList.remove('active-btn');
  console.log('отрисовать просмотренные фильмы');
  Api.fetchWatchedMoviesList().then(movies => movieAdaptedandRender(movies));
}
//Функция отрисовывает фильмы добавленные в очередь пользователя
function loadQueue() {
  clear();
  Api.resetPage();
  refs.loadWatchedBtn.classList.remove('active-btn');
  refs.loadQueueBtn.classList.add('active-btn');
  console.log('отрисовать фильмы добавленные в очередь пользователя');
  Api.fetchQueueMoviesList().then(movies => movieAdaptedandRender(movies));
}
