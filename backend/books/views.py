from django.shortcuts import render
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer

@api_view(['GET'])
def get_books(request):
    books = Book.objects.all()
    if not books.exists():
        return Response(
            {'detail': 'Nenhum livro encontrado no banco de dados.'},
            status=404,
        )

    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)

class Create(generics.CreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

class Delete(generics.DestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer