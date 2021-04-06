const API_KEY = 'e25e680121e89083bb4ba7c0772c65fc';
const BASE_URL_TRENDING = 'https://api.themoviedb.org/3/trending/all/day';
const BASE_URL_SEARCH = 'https://api.themoviedb.org/3/search/movie';
const BASE_URL_MOVIEID = 'https://api.themoviedb.org/3/movie';
const POSTER_URL = 'https://themoviedb.org/t/p/w220_and_h330_face';
const GENRE_MOVIE_LIST = 'https://api.themoviedb.org/3/genre/movie/list';
const watchedFromLocalStorage = [];
const queueFromLocalStorage = [];
const screenWidth = window.screen.width;
console.log(screenWidth);
console.log(typeof screenWidth);
import movieCard from '../templates/movieCard.hbs';
import movieCardLibrary from '../templates/movieCardLibrary.hbs';
import modalMovieCard from '../templates/modal-movie-card.hbs';
import genres from './genres';
import refs from './refs';
import { spinner } from './spinner';
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import { pluginError, pluginNotice } from './pluginOn';
import { LibraryPage, getLibraryPage, setLibraryPage } from './library-page';

export default class ApiService {
  #delta = 2;

  constructor(selectControl) {
    this.moviesPerPage = 18;
    this.totalPages = 0;
    this.page = 1;
    this.searchQuery = '';
    this.selectControl = selectControl;
  }

  fetchMovieByID(id_movie) {
    return fetch(`${BASE_URL_MOVIEID}/${id_movie}?api_key=${API_KEY}`).then(
      response => {
        if (!response.ok) return Promise.reject('Server error!');
        return response.json();
      },
    );
  }

  fetchSearchMoviesList(query) {
    return fetch(
      `${BASE_URL_SEARCH}?api_key=${API_KEY}&query=${query}&page=${this.page}`,
    )
      .then(responce => responce.json())
      .then(movies => {
        this.totalPages = movies.total_pages;
        this.addPaginationOnPage();
        return movies;
      });
  }

  fetchPopularMoviesList() {
    return fetch(`${BASE_URL_TRENDING}?api_key=${API_KEY}&page=${this.page}`)
      .then(response => response.json())
      .then(movies => {
        this.totalPages = movies.total_pages;
        this.addPaginationOnPage();
        return movies;
      });
  }

  fetchMoviesList(list) {
    if (list.length !== 0)
      return Promise.resolve(list).then(this.addPaginationOnPage());
    return Promise.reject('List is empty');
  }

  fetchWatchedMoviesList() {
    return this.fetchMoviesList(watchedFromLocalStorage);
  }

  fetchQueueMoviesList() {
    return this.fetchMoviesList(queueFromLocalStorage);
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

  loadWatchedMovies() {
    //после вызова функции в this.watchedFromLocalStorage будет массив с localStorage
    if (localStorage['watched']) {
      const watchedString = localStorage.getItem('watched');
      watchedFromLocalStorage.push(...JSON.parse(watchedString));
      console.log(watchedFromLocalStorage.length);
    } else {
      localStorage.setItem('watched', JSON.stringify([]));
    }
  }

  loadQueueMovies() {
    if (localStorage['queue']) {
      const queueString = localStorage.getItem('queue');
      queueFromLocalStorage.push(...JSON.parse(queueString));
    } else {
      localStorage.setItem('queue', JSON.stringify([]));
    }
  }

  addWatchedMovies(event) {
    const movieId = event.target.dataset.movieId;
    if (!watchedFromLocalStorage.includes(movieId)) {
      document
        .querySelector('[data-add-watched]')
        .classList.add('btn-active__details');
      watchedFromLocalStorage.push(movieId);
      localStorage.setItem('watched', JSON.stringify(watchedFromLocalStorage));
      pluginNotice('Added to watched list');
      return;
    }
    pluginError('Already in the list!');
  }

  addQueueMovies(event) {
    const movieId = event.target.dataset.movieId;
    if (!queueFromLocalStorage.includes(movieId)) {
      document
        .querySelector('[data-add-queue]')
        .classList.add('btn-active__details');
      queueFromLocalStorage.push(movieId);
      localStorage.setItem('queue', JSON.stringify(queueFromLocalStorage));
      pluginNotice('Added to queue list');
      return;
    }
    pluginError('Already in the list!');
  }

  renderMovieCards(moviesArray) {
    const currentPage = document.getElementsByTagName('html')[0];
    console.log(currentPage.classList);
    spinner.close();
    if (currentPage.classList.contains('main-page')) {
      refs.moviesCardsGallery.insertAdjacentHTML(
        'beforeend',
        movieCard(moviesArray),
      );
    }
    if (currentPage.classList.contains('library-page')) {
      refs.moviesCardsGallery.insertAdjacentHTML(
        'beforeend',
        movieCardLibrary(moviesArray),
      );
    }
  }

  renderMovie(modalMovie) {
    const modalMarkup = modalMovieCard(modalMovie);
    refs.movieInfoModal.insertAdjacentHTML('beforeend', modalMarkup);
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
    genres,
  }) {
    let newGenres = 0;
    if (genres) {
      if (genres.length > 3) {
        newGenres =
          genres
            .slice(2)
            .map(genre => genre.name)
            .join(', ') + ', OTHER';
        console.log(newGenres);
      } else {
        newGenres = genres.map(genre => genre.name).join(', ');
      }
    }
    return {
      //имена imgSrc, title, rating, releaseDate СВЕРИТЬ с именами в ПРАВИЛЬНОМ шаблоне карточки
      imgSrc: this.generatePosterPath(poster_path),
      title: original_title || original_name || title,
      rating: vote_average,
      releaseDate:
        Number.parseInt(release_date) || Number.parseInt(first_air_date),
      voteСount: vote_count,
      popularity,
      overview,
      id,
      genres: newGenres || this.changeGenresList(genre_ids),
    };
  }

  generatePosterPath(imageName) {
    return `${POSTER_URL}${imageName}`;
  }

  addPaginationOnPage() {
    if (this.selectControl === undefined) {
      return;
    }
    const currentPage = document.getElementsByTagName('html')[0];
    if (currentPage.classList.contains('main-page')) {
      this.pagination(this.page, this.totalPages);
    }
    if (currentPage.classList.contains('library-page')) {
      const page = getLibraryPage();
      if (page === LibraryPage.WATCHED) {
        this.pagination(
          this.page,
          Math.ceil(this.getWatchedMovies().length / this.moviesPerPage),
        );
      }
      if (page === LibraryPage.QUEUE) {
        this.pagination(
          this.page,
          Math.ceil(this.getQueuedMovies().length / this.moviesPerPage),
        );
      }
    }
  }

  getWatchedMovies() {
    return watchedFromLocalStorage;
  }

  getQueuedMovies() {
    return queueFromLocalStorage;
  }

  resetPage() {
    this.page = 1;
  }

  // сборная солянки
  pagination(current, last) {
    if (window.matchMedia('(min-width: 768px)').matches) {
      let code = this.addButtonWithIndex(1);

      if (current - this.#delta > 2) code += this.addButtonInput();

      for (let i = current - this.#delta; i <= current + this.#delta; i++) {
        if (i > 1 && i < last) {
          code += this.addButtonWithIndex(i);
        }
      }

      if (current + this.#delta < last - 1) code += this.addButtonInput();

      if (last !== 1 && last !== 0) code += this.addButtonWithIndex(last);
      this.selectControl.innerHTML = code;
    } else {
      let code = [];

      for (let i = current - this.#delta; i <= current + this.#delta; i++) {
        if (i > 0 && i < last + 1) {
          code += this.addButtonWithIndex(i);
        }
      }
      this.selectControl.innerHTML = code;
    }

    this.identificationByID();
    this.addClassBtn();
  }
  restartPagination() {
    // this.selectControl.innerHTML = '';
    this.pagination(this.page, this.totalPages);
  }

  addClassBtn() {
    const buttons = document.getElementsByClassName(
      'js-pagination-controls__btn',
    );
    const array = Array.from(buttons);

    const qazwsx = array.find(
      item => parseInt(item.id.match(/\d+/)) === this.page,
    );
    qazwsx.classList.add('active');
  }

  identificationByID() {
    console.log('api');
    let currentPageID = `'pagination_${this.page}'`;
    const buttons = document.getElementById(currentPageID);
    console.log(buttons);
  }
  addButtonWithIndex(index) {
    return ` <li id='pagination1_${index}' class="pagination-controls__item"><button id='pagination_${index}' class='pagination-controls__btn js-pagination-controls__btn' type='button' >${index}</button></li>`;
  }

  addButtonInput() {
    return ` <li class="pagination-controls__item"><input class="pagination-controls__input" type="number" placeholder="..." maxlength="4"/></li>`;
  }
  // конец сборная солянки
}
