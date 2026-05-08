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

    def test_get_books_by_category(self):
        # Create test data
        Book.objects.create(title="Test Book 1", description="A test description", category="fiction")
        Book.objects.create(title="Test Book 2", description="Another test description", category="adventure")

        # Test with a valid category
        response = self.client.get('/api/books/by-category/?category=fiction')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

        # Test with an invalid category
        response = self.client.get('/api/books/by-category/?category=nonexistent')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 0)