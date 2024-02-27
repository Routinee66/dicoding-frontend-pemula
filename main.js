const STORAGE_KEY = 'BOOKSHELF_APP';
const RENDER_EVENT = 'bookshelf_render'

const incompleteBookshelfListField = document.getElementById('incompleteBookshelfList');
const completeBookshelfListField = document.getElementById('completeBookshelfList');
const inputForm = document.getElementById('inputBook');
const searchForm = document.getElementById('searchSubmit');


window.addEventListener('DOMContentLoaded', function () {
  const renderEvent = new CustomEvent(RENDER_EVENT);
  document.dispatchEvent(renderEvent);
})

inputForm.addEventListener('submit', function () {
  const title = document.getElementById('inputBookTitle').value;
  const author = document.getElementById('inputBookAuthor').value;
  const year = document.getElementById('inputBookYear').value;
  const isComplete = document.getElementById('inputBookIsComplete').checked;

  const data = {
    id: `book-${+new Date()}`,
    title,
    author,
    year: parseInt(year),
    isComplete
  }
  console.log(data);
  putData(data);
  setTimeout(function () { alert('Buku berhasil ditambahkan!'); }, 100);
  event.preventDefault();
})

document.addEventListener(RENDER_EVENT, function (event) {
  let books = [];
  try {
    books = event.detail.books;
  } catch (error) {
    books = getData();
  }

  completeBookshelfListField.innerHTML = '';
  incompleteBookshelfListField.innerHTML = '';
  for (book of books) {
    if (book.isComplete) {
      completeBookshelfListField.appendChild(createElement(book));
    }
    else {
      incompleteBookshelfListField.appendChild(createElement(book));
    }
  }
})

const checkLocalStorage = () => {
  if (typeof (Storage) === undefined) return false;
  return true;
}

function putData(book) {
  if (checkLocalStorage()) {
    let data = [];
    if (localStorage.getItem(STORAGE_KEY) !== null) {
      data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    }
    data.unshift(book);
    saveData(data);
  }
}

function getData() {
  if (checkLocalStorage()) {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return parsed;
  }
}

const createElement = (book) => {
  const article = document.createElement('article');
  article.classList.add('book_item');
  const title = document.createElement('h2');
  title.innerText = book.title;
  const author = document.createElement('p');
  author.innerText = 'Penulis: ' + book.author;
  const year = document.createElement('p');
  year.innerText = 'Tahun: ' + book.year;

  const container = document.createElement('div');
  container.classList.add('action');

  const greenButton = document.createElement('button');
  greenButton.classList.add('green');
  if (!book.isComplete) {
    greenButton.innerText = 'Selesai di Baca';
    greenButton.addEventListener('click', () => {
      completeBook(book.id);
    })
  }
  else {
    greenButton.innerText = 'Belum selesai di Baca';
    greenButton.addEventListener('click', () => {
      incompleteBook(book.id);
    })
  }

  const redButton = document.createElement('button');
  redButton.classList.add('red');
  redButton.innerText = 'Hapus buku';
  redButton.addEventListener('click', () => {
    if (window.confirm('Yakin ingin hapus buku?')) deleteData(book.id);
  })

  container.append(greenButton, redButton);

  article.append(title, author, year, container);
  return article;
}

const changeBookStatus = (id, status) => {
  const books = getData();
  for (book of books) {
    if (id == book.id) {
      book.isComplete = status;
    }
  };
  saveData(books);
  setTimeout(function () { alert('Berhasil!'); }, 100);
  return;
}

const completeBook = (id) => {
  changeBookStatus(id, true);
}

const incompleteBook = (id) => {
  changeBookStatus(id, false);
}

const saveData = (data) => {
  const stringify = JSON.stringify(data);
  localStorage.setItem(STORAGE_KEY, stringify);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

searchForm.addEventListener('click', () => {
  const find = document.getElementById('searchBookTitle').value;
  const books = findData(find);
  document.dispatchEvent(new CustomEvent(RENDER_EVENT, { detail: { books } }))
  event.preventDefault();
})

const findData = (title) => {
  const books = getData();
  let newBooks = [];
  for (book of books) {
    if (book.title.includes(title)) {
      newBooks.unshift(book);
    }
  };
  return newBooks;
}

const deleteData = (id) => {
  const books = getData();
  for (bookIndex in books) {
    if (books[bookIndex].id === id) {
      books.splice(bookIndex, 1);
    }
  }
  saveData(books);
  setTimeout(function () { alert('Berhasil dihapus!'); }, 100);
}