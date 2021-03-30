import './main.scss';
import refs from './js/refs'; /* ждём, пока у нас появятся все нужные имена классов для querySelector */
import ApiService from './js/api';

//Проверка работы запроса популярных фильмов и отрисовка галлереи карточек
const Api = new ApiService();
Api.resetPage();
Api.fetchPopularMoviesList().then(movies => {
  const moviesArray = movies.results.map(movie => Api.movieAdapter(movie));
  Api.renderMovieCards(moviesArray);
});
//

function onSearch(event) {
  event.preventDefault();
}
