from django.test import TestCase
from books.models import Book


class BooksViewTests(TestCase):
    def test_get(self):
        # Create db test data
        Book.objects.create(title="Test Book", description="A test description")
        # Access the data created
        book = Book.objects.get(title="Test Book")
        self.assertEqual(book.description, "A test description")

        # Access all data
        books = Book.objects.all()
        self.assertEqual(len(books), 1)

    def test_get_books_returns_not_found_when_no_books_exist(self):
        response = self.client.get('/api/books/')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json(), {'detail': 'Nenhum livro encontrado no banco de dados.'})
