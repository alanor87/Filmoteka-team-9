const API_KEY = 'e25e680121e89083bb4ba7c0772c65fc';
const BASE_URL_TRENDING = 'https://api.themoviedb.org/3/trending/all/day';
const BASE_URL_SEARCH = 'https://api.themoviedb.org/3/search/movie';
const BASE_URL_MOVIEID = 'https://api.themoviedb.org/3/movie';

import refs from './refs';
import moviesTpl from '../templates/moviesTpl.hbs';

export default class ApiService {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
  }

  fetchPopularMoviesList() {
    return fetch(`${BASE_URL_TRENDING}?api_key=${API_KEY}&page=${this.page}`)
      .then(response => response.json())
      .then(movies => {
        this.incrementPage();
        return movies.results;
      });
  }
  fetchSearchMoviesList() {}
  fetchMovieByID() {}
  fetchWatchedMoviesList() {}
  fetchQueueMoviesList() {}
  fetchModalMovie() {}

  loadWatchedMovies() {}
  loadQueueMovies() {}
  addWatchedMovies(movieId) {}
  addQueueMovies(movieId) {}

  renderMovieCards(moviesArray) {
    refs.moviesCardsGallery.insertAdjacentHTML(
      'beforeend',
      moviesTpl(moviesArray),
    );
  }
  renderMovie(movieObj) {}

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
