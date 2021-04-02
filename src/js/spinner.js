import * as basicLightbox from 'basiclightbox';

const markup = `<div class="windows8">
<div class="wBall" id="wBall_1">
    <div class="wInnerBall"></div>
</div>
<div class="wBall" id="wBall_2">
    <div class="wInnerBall"></div>
</div>
<div class="wBall" id="wBall_3">
    <div class="wInnerBall"></div>
</div>
<div class="wBall" id="wBall_4">
    <div class="wInnerBall"></div>
</div>
<div class="wBall" id="wBall_5">
    <div class="wInnerBall"></div>
</div>
</div>`;

const spinner = basicLightbox.create(markup);

export default { spinner };



// ПОКАЗАТЬ спиннер - spinner.show();
// ЗАКРЫТЬ  спиннер - spinner.close();

// // Как пример - спиннер пока срабатывает при вводе слов для поиска в инпут

// ЭТО ПРИМЕР 
const onInputClick = document.querySelector('.search-input');
 onInputClick.addEventListener('click', onLoadingSpinner);
function onLoadingSpinner() {
   spinner.show();
};

// Надо будет сделать инпорт в пагинацию (import loader from './js/spinner';)
// Вызвать в пагинации на функциях по отслеживанию кликов вправо/влево ( loader.spinner.show();)