const API_KEY = 'e25e680121e89083bb4ba7c0772c65fc';
const BASE_URL_TRENDING = 'https://api.themoviedb.org/3/trending/all/day';
const BASE_URL_SEARCH = 'https://api.themoviedb.org/3/search/movie';
const BASE_URL_MOVIEID = 'https://api.themoviedb.org/3/movie';
const POSTER_URL = 'https://themoviedb.org/t/p/w220_and_h330_face';
const GENRE_MOVIE_LIST = 'https://api.themoviedb.org/3/genre/movie/list';

import movieCard from '../templates/movieCard.hbs';
import modalMovieCard from '../templates/modal-movie-card.hbs';
import genres from './genres';
import refs from './refs';
import { spinner } from './spinner';

export default class ApiService {
  #delta = 2;
  constructor(selectControl) {
    this.totalPagas = 0;
    this.page = 1;
    this.searchQuery = '';
    this.watched = [];
    this.queue = [];
    this._watchedFromLocalStorage = [];
    this._queueFromLocalStorage = [];
    this.selectControl = selectControl;
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
    vote_count,
    popularity,
    overview,
    genre_ids,
  }) {
    return {
      //имена imgSrc, title, rating, releaseDate СВЕРИТЬ с именами в ПРАВИЛЬНОМ шаблоне карточки
      imgSrc: this.generatePosterPath(poster_path),
      title: original_title || original_name || title,
      rating: vote_average,
      releaseDate:
        Number.parseInt(release_date) || Number.parseInt(first_air_date),
      voteCount: vote_count,
      popularity: popularity,
      overview: overview,
      id: id,
      genre: this.changeGenresList(genre_ids),
    };
  }
  changeGenresList(ids) {
    const genresIdsArr = genres.map((_el, index) => genres[index].id);
    const newArr = ids
      .map(el => {
        return genresIdsArr.indexOf(el);
      })
      .filter(el => el !== -1)
      .map(el => genres[el].name);

    if (!newArr.length) {
      return 'NO GЕNRE';
    }
    return newArr.length > 2
      ? newArr.slice(0, 2).join(', ') + ', OTHER'
      : newArr.join(',');
  }
  //Запрос базы жанров  - на будущее
  fetchGenresMovieList() {
    return fetch(
      `${GENRE_MOVIE_LIST}?api_key=${API_KEY}&page=${this.page}`,
    ).then(response => response.json());
  }

  generatePosterPath(imageName) {
    return `${POSTER_URL}${imageName}`;
  }

  fetchSearchMoviesList(query) {
    return fetch(
      `${BASE_URL_SEARCH}?api_key=${API_KEY}&query=${query}&page=${this.page}`,
    )
      .then(responce => responce.json())
      .then(movies => {
        this.totalPagas = movies.total_pages;
        this.testfoo();
        return movies;
      });
  }

  fetchPopularMoviesList() {
    return fetch(`${BASE_URL_TRENDING}?api_key=${API_KEY}&page=${this.page}`)
      .then(response => response.json())
      .then(movies => {
        this.totalPagas = movies.total_pages;
        this.testfoo();
        return movies;
      });
  }

  testfoo() {
    if (this.selectControl === undefined) {
      return;
    }
    this.pagination(this.page, this.totalPagas);
  }

  fetchWatchedMoviesList() {
    this.loadWatchedMovies();
    const watchedMoviesArr = this._watchedFromLocalStorage.forEach(movie => {
      this.fetchMovieByID();
    });
    Promise.all(watchedMoviesArr)
      .then(movie => console.log(movie))
      .catch(error => console.log(error));
  }

  fetchQueueMoviesList() {
    this.loadQueueMovies();
    const queueMoviesArr = this._queueFromLocalStorage.forEach(movie => {
      this.fetchMovieByID();
    });
    Promise.all(queueMoviesArr)
      .then(movie => console.log(movie))
      .catch(error => console.log(error));
  }

  fetchModalMovie() {}

  loadWatchedMovies() {
    //после вызова функции в this._watchedFromLocalStorage будет массив с localStorage
    const watchedString = localStorage.getItem('watched');
    this._watchedFromLocalStorage = JSON.parse(watchedString);
  }

  loadQueueMovies() {
    //после вызова функции в this._queueFromLocalStorage будет массив с localStorage
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
    spinner.close();
    refs.moviesCardsGallery.insertAdjacentHTML(
      'beforeend',
      movieCard(moviesArray),
    );
  }

  renderMovie(movieObj) {}

  checkValueLocalStorage() {
    this.loadQueueMovies();
    if (!this.queue === []) return;
    localStorage.setItem('queue', JSON.stringify(this.queue));
    this.loadWatchedMovies();
    if (!this.watched === []) return;
    localStorage.setItem('watched', JSON.stringify(this.watched));
  }
  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  // сборная солянки
  pagination(current, last) {
    let code = this.addButtonWithIndex(1);

    if (current - this.#delta > 2) code += this.addButtonInput();

    for (let i = current - this.#delta; i <= current + this.#delta; i++) {
      if (i > 1 && i < last) {
        code += this.addButtonWithIndex(i);
      }
    }

    if (current + this.#delta < last - 1) code += this.addButtonInput();

    code += this.addButtonWithIndex(last);

    this.selectControl.innerHTML = code;
  }

  addButtonWithIndex(index) {
    return ` <li class="pagination-controls__item"><button id='pagination_${index}' class='pagination-controls__btn' type='button' >${index}</button></li>`;
  }
  addButtonInput() {
    return ` <li class="pagination-controls__item"><input class="pagination-controls__input" type="number" placeholder="..." maxlength="4"/></li>`;
  }

  goToPrevPage() {
    if (this.page === 1) {
      return;
    }
    this.page -= 1;
  }

  goToNextPage() {
    if (this.page === this.totalPagas) {
      return;
    }
    this.page += 1;
  }

  // конец сборная солянки
}
