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
    this._watched = [];
    this._queue = [];
  }
    fetchSearchMoviesList() { }

    fetchMovieByID(id_movie) {
        return fetch(`${BASE_URL_MOVIEID}/${id_movie}?api_key=${API_KEY}`)
            .then(response => {
                if (response.status === '404') throw new Error;
                response.json();
            })
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
        return movies;
      });
  }
  fetchWatchedMoviesList() {}
  fetchQueueMoviesList() {}
  fetchModalMovie() {}
    get watched() { //для проверки
    return this._watched;
    }
    loadWatchedMovies() { //после вызова функции в this._watched будет массив с localStorage
    const watchedString = localStorage.getItem('watched');
    this._watched = JSON.parse(watchedString);
    }
    get queue() { //для проверки
        return this._queue;
    }
    loadQueueMovies() { //после вызова функции в this._queue будет массив с localStorage
    const queueString = localStorage.getItem('queue');
    this._queue = JSON.parse(queueString);
  }
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
