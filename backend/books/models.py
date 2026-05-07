from django.db import models

class Book(models.Model):

    # (database value, UI value)
    CATEGORY_CHOICES = [
        ('fiction', 'Fiction'),
        ('adventure', 'Adventure'),
    ]

    title = models.CharField(max_length=30)
    description = models.CharField(max_length=255)
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='fiction'
    )

    class Meta:
        db_table = 'books'