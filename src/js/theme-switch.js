const input = document.querySelector('#theme-switch-toggle');
const Theme = {
  LIGHT: 'light-theme',
  DARK: 'dark-theme',
};
const bodyRef = document.querySelector('body');
const savedTheme = localStorage.getItem('theme');

input.addEventListener('change', changeTheme);

function changeTheme(event) {
    event.preventDefault();
    if (input.checked) {
        bodyRef.classList.add(Theme.DARK);
        bodyRef.classList.remove(Theme.LIGHT);
        localStorage.setItem('theme', Theme.DARK);
    } else {
        bodyRef.classList.remove(Theme.DARK);
        bodyRef.classList.add(Theme.LIGHT);
        localStorage.setItem('theme', Theme.LIGHT);
    }
}

if (savedTheme === Theme.DARK) {
    bodyRef.classList.add(savedTheme);
    input.checked = true;
}