from django.test import TestCase
from books.models import Book

class BookModelTest(TestCase):
    def test_create(self):
        # Create db test data
        Book.objects.create(title="Test Book", description="A test description")

    def test_remove(self):
        # Create db test data
        Book.objects.create(title="Test Book", description="A test description")
        # Remove the data created
        book = Book.objects.get(title="Test Book")
        book.delete()

        # Check that the data has been removed
        books = Book.objects.all()
        self.assertEqual(len(books), 0)
