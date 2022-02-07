// Book class: represent a book
class Book {
    constructor(title, author, isbn) {
        this.title = title
        this.author = author
        this.isbn = isbn
    }
}

// UI class: to handle ui tasks
class UI {
    static displayBooks() {

        const books = Store.getBooks()

        books.forEach(book => UI.addBookToList(book))
    }
    static addBookToList(book) {
        const row = document.createElement('tr')
        row.innerHTML = `
        <th>${book.title}</th>
        <th>${book.author}</th>
        <th>${book.isbn}</th>
        <th><a ' class='delete btn btn-danger btn-sm '>X</a></th>
        `
        const list = document.getElementById('book-list')
        list.appendChild(row)
    }

    static showAlert(message, className) {
        const container = document.querySelector('.container')
        const form = document.querySelector('#book-form')
        const div = document.createElement('div')
        div.className = `alert ${className}`
        div.appendChild(document.createTextNode(message))
        container.insertBefore(div, form)
        setTimeout(() => {
            document.querySelector('.alert').remove()
        }, 2000);
    }
    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove()
            UI.showAlert('Book Deleted', 'success')
        }

    }
    static ClearForm() {
        document.getElementById('title').value = ''
        document.getElementById('author').value = ''
        document.getElementById('isbn').value = ''
    }
}


// Store class: Handle storage

class Store {
    // Get Books form storage
    static getBooks() {
        let books
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'))
        }
        return books
    }

    // add books form storage

    static addBooks(book) {
        const books = Store.getBooks()
        books.push(book)
        localStorage.setItem('books', JSON.stringify(books))
    }


    // delete books form storage
    static removeBook(isbn) {
        const books = this.getBooks()
        books.forEach((book, i) => {
            if (book.isbn === isbn) {
                books.splice(i, 1)
            }
        })
        localStorage.setItem('books', JSON.stringify(books))
    }
}
// Event to display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);


// Event to add a book
const form = document.getElementById('book-form')

form.addEventListener('submit', (e) => {
    const title = document.getElementById('title').value
    const author = document.getElementById('author').value
    const isbn = document.getElementById('isbn').value
    const book = new Book(title, author, isbn)
    console.log(book);
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Enter all fields to complete', 'error')
    } else {
        UI.addBookToList(book)
        Store.addBooks(book)
        UI.showAlert('Book Added', 'success')
        UI.ClearForm()
    }
    e.preventDefault()
})

// Event to remove a book

let deleteBtn = document.querySelector('#book-list')

deleteBtn.addEventListener('click', (e) => {
    UI.deleteBook(e.target)
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
})



