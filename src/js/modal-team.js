import refs from './refs';
import modalTeam from '../templates/modalTeam.hbs';
import teamInfo from './modal-team-bd';
import onOverlayModalClick from './modal-overlay';
import { pluginError } from './pluginOn';

refs.openModalTeamBtn.addEventListener('click', onOpenModalTeam);
refs.closeModalTeamBtn.addEventListener('click', onCloseModalTeam);

function onOpenModalTeam() {
  refs.modalOverlay.classList.add('show');
  renderModalTeam();
  window.addEventListener('keydown', onPressEscape);
  refs.modalOverlay.addEventListener('click', onOverlayModalClick);
}
function onCloseModalTeam() {
  refs.modalOverlay.classList.remove('show');
  window.addEventListener('keydown', onPressEscape);
  clearModalTeam();
  refs.modalOverlay.removeEventListener('click', onOverlayModalClick);
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
    } else {
      pluginError('No information');
    }
  }

  if (event.target.nodeName === 'A') {
    location = event.target.getAttribute('href');
    if (location !== '#') {
      if (!myWindow) {
        myWindow = window.open(location, '', 'scrollbars=1');
      }
    } else {
      pluginError('No information');
    }
  }
});

function renderModalTeam() {
  refs.modalTeamList.insertAdjacentHTML('beforeend', modalTeam(teamInfo));
}

function clearModalTeam() {
  refs.modalTeamList.innerHTML = '';
}
