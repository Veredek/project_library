from django.urls import path
from . import views

#URLConf
urlpatterns = [
    path('', views.get_books),
    path('create/', views.Create.as_view()),
    path('delete/<int:pk>/', views.Delete.as_view()),
]