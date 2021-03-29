import './main.scss';
import refs from './js/refs'; /* ждём, пока у нас появятся все нужные имена классов для querySelector */
import ApiService from './js/api';

const Api = new ApiService();
Api.resetPage();
Api.fetchPopularMoviesList().then(moviesArray => {
  Api.renderMovieCards(moviesArray);
});

function onSearch(event) {
  event.preventDefault();
}
