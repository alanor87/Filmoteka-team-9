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
    this.watched = [];
    this.queue = [];
    this._watchedFromLocalStorage = [];
    this._queueFromLocalStorage = [];
  }

  fetchMovieByID(id_movie) {
    return fetch(`${BASE_URL_MOVIEID}/${id_movie}?api_key=${API_KEY}`).then(
      response => {
        if (response.status === '404') throw new Error();
        response.json();
      },
    );
  }

  movieAdapter({
    poster_path,
    original_title,
    original_name,
    title,
    id,
    vote_average,
    release_date,
    first_air_date,
    backdrop_path,
    vote_count,
    popularity,
    genres,
    overview,
    genre_ids,
  }) {
    return {
      //имена imgSrc, title, rating, releaseDate СВЕРИТЬ с именами в ПРАВИЛЬНОМ шаблоне карточки
      imgSrc: this.generatePosterPath(poster_path),
      title: original_title || original_name || title,
      rating: vote_average,
      releaseDate: release_date || first_air_date,
      backdropPath: backdrop_path,
      voteCount: vote_count,
      popularity: popularity,
      genres: genres,
      overview: overview,
      id: id,
      genre_ids: genre_ids,
    };
  }

  generatePosterPath(imageName) {
    return `${POSTER_URL}${imageName}`;
  }

  fetchSearchMoviesList(query) {
    return fetch(
      `${BASE_URL_SEARCH}?api_key=${API_KEY}&query=${query}`,
    ).then(responce => responce.json());
  }

  fetchPopularMoviesList() {
    return fetch(
      `${BASE_URL_TRENDING}?api_key=${API_KEY}&page=${this.page}`,
    ).then(response => response.json());
  }
  fetchWatchedMoviesList() {}
  fetchQueueMoviesList() {}
  fetchModalMovie() {}

  loadWatchedMovies() {
    //после вызова функции в this._watchedFromLocalStorage будет массив с localStorage
    const watchedString = localStorage.getItem('watched');
    this._watchedFromLocalStorage = JSON.parse(watchedString);
  }

  loadQueueMovies() {
    //после вызова функции в this._queue будет массив с localStorage
    const queueString = localStorage.getItem('queue');
    this._queueFromLocalStorage = JSON.parse(queueString);
  }
  get watchedFromLocalStorage() {
    //для проверки
    return this._watchedFromLocalStorage;
  }
  get queueFromLocalStorage() {
    //для проверки
    return this._queueFromLocalStorage;
  }

  addWatchedMovies(movieId) {
    this.watched.push(movieId);
    localStorage.setItem('watched', JSON.stringify(this.watched));
  }
  addQueueMovies(movieId) {
    this.queue.push(movieId);
    localStorage.setItem('queue', JSON.stringify(this.queue));
  }

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
