import './main.scss';
import refs from './js/refs'; /* ждём, пока у нас появятся все нужные имена классов для querySelector */
import ApiService from './js/api';
const debounce = require('lodash.debounce');
import { pluginError } from './js/pluginOn';

const Api = new ApiService();
fetchPopularMoviesList();
refs.searchInput.addEventListener('input', debounce(onSearch, 500));

//Функция запроса популярных фильмов и отрисовка галлереи карточек - запускается при загрузке главной страницы
function fetchPopularMoviesList() {
  Api.resetPage();
  Api.fetchPopularMoviesList().then(movies => movieAdaptedandRender(movies));
}

//Функция поиска фильмов по слову - запускается по вводу в инпуте
function onSearch(event) {
  event.preventDefault();
  clear();
  Api.resetPage();
  Api.searchQuery = event.target.value;
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
  const moviesArray = movies.results.map(movie => Api.movieAdapter(movie));
  return Api.renderMovieCards(moviesArray);
}
