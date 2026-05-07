from rest_framework import viewsets
from .models import Book
from .serializers import BookSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        if not queryset.exists():
            return Response(
                {'detail': 'Nenhum livro encontrado no banco de dados.'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='by-category')
    def get_books_by_category(self, request):
        category = request.query_params.get('category')
        if category:
            books = Book.objects.filter(category=category)
            serializer = self.get_serializer(books, many=True)
            return Response(serializer.data)
        else:
            return Response(
                {'detail': 'Parâmetro de categoria é obrigatório.'},
                status=status.HTTP_400_BAD_REQUEST
            )