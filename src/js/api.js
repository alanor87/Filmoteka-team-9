const API_KEY = 'e25e680121e89083bb4ba7c0772c65fc';
const BASE_URL_TRENDING = 'https://api.themoviedb.org/3/trending/all/day';
const BASE_URL_SEARCH = 'https://api.themoviedb.org/3/search/movie';
const BASE_URL_MOVIEID = 'https://api.themoviedb.org/3/movie';
const POSTER_URL = 'https://themoviedb.org/t/p/w220_and_h330_face';

import movieCard from '../templates/movieCard.hbs';
import refs from './refs';

export default class ApiService {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
  }
  movieAdapter({
    poster_path,
    original_title,
    original_name,
    vote_average,
    release_date,
    first_air_date,
  }) {
    return {
      //имена imgSrc, title, rating, releaseDate СВЕРИТЬ с именами в ПРАВИЛЬНОМ шаблоне карточки
      imgSrc: this.generatePosterPath(poster_path),
      title: original_title || original_name,
      rating: vote_average,
      releaseDate: release_date || first_air_date,
    };
  }
  generatePosterPath(imageName) {
    return `${POSTER_URL}${imageName}`;
  }
  fetchPopularMoviesList() {
    return fetch(`${BASE_URL_TRENDING}?api_key=${API_KEY}&page=${this.page}`)
      .then(response => response.json())
      .then(movies => {
        this.incrementPage();
        console.log(movies);
        return movies;
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
      movieCard(moviesArray),
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
