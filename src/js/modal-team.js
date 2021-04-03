import refs from './refs';

refs.openModalTeamBtn.addEventListener('click', onOpenModalTeam);
refs.closeModalTeamBtn.addEventListener('click', onCloseModalTeam);
refs.modalTeamOverlay.addEventListener('click', onOverlayModalTeamClick);

function onOpenModalTeam() {
  refs.modalTeamOverlay.classList.add('show');
  window.addEventListener('keydown', onPressEscape);
}
function onCloseModalTeam() {
  refs.modalTeamOverlay.classList.remove('show');
  window.addEventListener('keydown', onPressEscape);
}
function onOverlayModalTeamClick(event) {
  event.preventDefault();
  if (event.target === event.currentTarget) {
    onCloseModalTeam();
  }
}

function onPressEscape(event) {
  if (event.code === 'Escape') {
    onCloseModalTeam();
  }
}
refs.modalTeam.addEventListener('click', event => {
  let location;
  let myWindow;
  if (event.target.nodeName === 'I') {
    location = event.target.parentNode.getAttribute('href');
    if (location !== '#') {
      if (!myWindow) {
        myWindow = window.open(location, '', 'scrollbars=1');
      }
    }
  }

  if (event.target.nodeName === 'A') {
    location = event.target.getAttribute('href');
    if (location !== '#') {
      if (!myWindow) {
        myWindow = window.open(location, '', 'scrollbars=1');
      }
    }
  }
});
