const refs = {
  searchInput: document.querySelector('.search-input'),
  searchButton: document.querySelector('.search-button'),
  moviesCardsGallery: document.querySelector('.movie__list'),
  movieInfoModal: document.querySelector('.modal-movie'),
  openModalTeamBtn: document.querySelector('.js-openModalTeam'),
  modalOverlay: document.querySelector('.js-modalOverlay'),
  closeModalTeamBtn: document.querySelector('.js-closeModalTeam'),
  loadQueueBtn: document.querySelector('[data-load-queue]'),
  loadWatchedBtn: document.querySelector('[data-load-watched]'),
  btnNextPagination: document.querySelector('[data-next-pagination]'),
  btnPrevPagination: document.querySelector('[data-prev-pagination]'),
  paginationControls: document.querySelector('[data-pagination-controls-list]'),
  modalTeam: document.querySelector('.modalTeam'),
  modalTeamList: document.querySelector('.modalTeam__list'),
  warningNotificationRef: document.querySelector('.warning-notification'),
};
export default refs;
