export const LibraryPage = {
  WATCHED: 'watched',
  QUEUE: 'queue',
};

export function getLibraryPage() {
  let page = localStorage.getItem('libraryPage');
  return page ? page : LibraryPage.WATCHED;
}

export function setLibraryPage(page) {
  localStorage.setItem('libraryPage', page);
}
