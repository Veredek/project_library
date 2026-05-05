from django.test import TestCase


class BooksViewTests(TestCase):
    def test_get_books_returns_not_found_when_no_books_exist(self):
        response = self.client.get('/api/books/')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json(), {'detail': 'Nenhum livro encontrado no banco de dados.'})
