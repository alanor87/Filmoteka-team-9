const input = document.querySelector('#theme-switch-toggle');
const Theme = {
  LIGHT: 'light-theme',
  DARK: 'dark-theme',
};

input.addEventListener('change', changeTheme);

function changeTheme() {
    const theme =
    localStorage.getItem('theme') === Theme.LIGHT
    ? Theme.DARK
    : Theme.LIGHT;

    document.body.className = theme;
    localStorage.setItem('theme', theme);
}

function saveData() {
    if (localStorage.getItem('theme')) {
        document.body.className = localStorage.getItem('theme');
        input.checked = localStorage.getItem('theme') === Theme.LIGHT ? false : true;
      } else {
        localStorage.setItem('theme', Theme.LIGHT);
      }
}

saveData()