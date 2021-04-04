const API_KEY = 'e25e680121e89083bb4ba7c0772c65fc';
const BASE_URL_TRENDING = 'https://api.themoviedb.org/3/trending/all/day';
const BASE_URL_SEARCH = 'https://api.themoviedb.org/3/search/movie';
const BASE_URL_MOVIEID = 'https://api.themoviedb.org/3/movie';
const POSTER_URL = 'https://themoviedb.org/t/p/w220_and_h330_face';
const GENRE_MOVIE_LIST = 'https://api.themoviedb.org/3/genre/movie/list';
const watchedFromLocalStorage = [];
const queueFromLocalStorage = [];

import movieCard from '../templates/movieCard.hbs';
import movieCardLibrary from '../templates/movieCardLibrary.hbs';
import modalMovieCard from '../templates/modal-movie-card.hbs';
import genres from './genres';
import refs from './refs';
import { spinner } from './spinner';
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import { pluginError, pluginNotice } from './pluginOn';

export default class ApiService {
  #delta = 2;
  constructor(selectControl) {
    this.totalPagas = 0;
    this.page = 1;
    this.searchQuery = '';
    this.selectControl = selectControl;
  }

  fetchMovieByID(id_movie) {
    return fetch(`${BASE_URL_MOVIEID}/${id_movie}?api_key=${API_KEY}`)
      .then(response => {
        if (!response.ok) return Promise.reject('Server error!');
        return response.json();
      },
      )
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

  fetchWatchedMoviesList() {
    if (watchedFromLocalStorage.length !== 0)
      return Promise.resolve(watchedFromLocalStorage);
    return Promise.reject('List is empty');
  }

  fetchQueueMoviesList() {
    if (queueFromLocalStorage.length !== 0)
      return Promise.resolve(queueFromLocalStorage);
    return Promise.reject('List is empty');
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
      watchedFromLocalStorage.push(movieId);
      localStorage.setItem('watched', JSON.stringify(watchedFromLocalStorage));
      pluginNotice('Added to watched list!');
      return;
    }
    pluginError('Already in the list!');
  }

  addQueueMovies(event) {
    const movieId = event.target.dataset.movieId;
    if (!queueFromLocalStorage.includes(movieId)) {
      queueFromLocalStorage.push(movieId);
      localStorage.setItem('queue', JSON.stringify(queueFromLocalStorage));
      pluginNotice('Added to queue list!');
      return;
    }
    pluginError('Already in the list!');

  }

  renderMovieCards(moviesArray) {
    const currentPage = document.getElementsByTagName('html')[0];
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
      releaseDate: Number.parseInt(release_date) || Number.parseInt(first_air_date),
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

  testfoo() {
    if (this.selectControl === undefined) {
      return;
    }
    this.pagination(this.page, this.totalPagas);
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
