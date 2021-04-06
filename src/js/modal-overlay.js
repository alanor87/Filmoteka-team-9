//Закрытие модалки по нажатию на overlay
import refs from './refs';

function onOverlayModalClick(event) {
  event.preventDefault();
  if (event.target === event.currentTarget) {
    //скрываем overlay
    refs.modalOverlay.classList.remove('show');
    //закрытие модального окна комманды
    if (refs.modalOverlay.firstElementChild.classList.contains('modalTeam')) {
      refs.modalTeamList.innerHTML = '';
    }
  }
}

export default onOverlayModalClick;
