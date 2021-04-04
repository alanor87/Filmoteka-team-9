const refs = {
  searchInput: document.querySelector('.search-input'),
  moviesCardsGallery: document.querySelector('.movie__list'),
  movieInfoModal: document.querySelector('.modal-movie'),
  openModalTeamBtn: document.querySelector('.js-openModalTeam'),
  modalTeamOverlay: document.querySelector('.js-modalTeam__overlay'),
  closeModalTeamBtn: document.querySelector('.js-closeModalTeam'),
  loadQueueBtn: document.querySelector('[data-load-queue]'),
  loadWatchedBtn: document.querySelector('[data-load-watched]'),
  btnNextPagination: document.querySelector('[data-next-pagination]'),
  btnPrevPagination: document.querySelector('[data-prev-pagination]'),
  paginationControls: document.querySelector('[data-pagination-controls-list]'),
  modalTeam: document.querySelector('.modalTeam'),
  modalTeamList: document.querySelector('.modalTeam__list'),
};
export default refs;
