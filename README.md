
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


                                                  - onSearch -

 По общему соглашению - делаем поиск по вводу в строку нашего ввода, простите за тавтологию) В дальнейшем при наличии времени - 
добавим поиск по кнопке.

Функции :

  function onSearch() {} - лежит у нас в index.js и срабатывает на ввод в input. Ссылка на input импортируется из refs - 
                           refs.searchInput. Функция подключается как callback к событию 'input'.
                           Обязательно нужно использовать с debounce, задержка 500ms. lodash.debounce будет уже добавлен в сборку!


++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


                                                  - fetch -


Функции  :
  
 function fetchPopularMoviesList() {} - это работает по умолчанию, когда загружается главная страница
          Формат запроса : https://api.themoviedb.org/3/trending/all/day?api_key=<<api_key>>

 function fetchSearchMoviesList() {} - работает на поиске - нажатие кнопки поиска по слову
          Формат запроса : https://api.themoviedb.org/3/search/movie?api_key=<<api_key>>&language=en-US&page=1&include_adult=false

 function fetchMovieByID() {} - работает при загрузке просмотренных и фильмов в очереди - каждый фильм загружается отдельно
          Формат запроса : https://api.themoviedb.org/3/movie/{movie_id}?api_key=<<api_key>>&language=en-US

 function fetchWatchedMoviesList() {} - при нажатии на кнопку Watched и при загрузке библиотеки пользователя
          Формат запроса : тут нам нужно пройтись .forEach для нашего массива с ID просмотренных фильмов (см. loadWatchedMovies()) - 
          и для каждого сделать fetchMovieByID(). Можно собрать все асинхронные запросы в Promise.all([]), чтоб отрисовалось всё вместе,
          как только загрузятся все запрошенный ID.

 function fetchQueueMoviesList() {} - при нажатии на кнопку Queue
          Формат запроса : то же самое, что и fetchWatchedMoviesList(), 
          только используем другой источник наших ID - loadQueueMovies()

 function fetchModalMovie() {} - при открытии модального окна с нашим фильмом
          Формат запроса : используем fetchMovieByID() и рисуем по результату пришедшего объекта.



 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


                                               - localStorage -


  В localStorage будет два ключа : watched и queue
  Каждый, конечно, будет в localStorage строкой, но в итоге после JSON.parse() становится массивом, 
  элементами которого являются ID фильмов.
       
       const watched = []

       const queue = []

Функции : 

 function loadWatchedMovies() {} - возвращает распарсеный объект из localStorage.watched 

 function loadQueueMovies() {} - возвращает распарсеный объект из localStorage.queue

 function addWatchedMovies(movieId) {} - пушит новый ID в localStorage.watched

 function addQueueMovies(movieId) {} - пушит новый ID в localStorage.queue


+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                                                  - render -

Функции рендера (отрисовки) : 

 function renderMovieCards(moviesArray) {} - отрисовка всех КОЛЛЕКЦИЙ карточек

 function renderMovie(movieObj) {} - отрисовка одного фильма со всеми требуемыми в макете полями в модальном окне




+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                                           - handlebars templates -

  movieCard - шаблон для карточки
  
  movieModal - шаблон для модального окна с информацией по фильму



