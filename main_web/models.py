from django.db import models

class Stats(models.Model):
    locations = models.IntegerField(default=0)
    years = models.IntegerField(default=0)
    adopter = models.IntegerField(default=0)
    ecosystems = models.IntegerField(default=0)

class EmailMovement(models.Model):
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

class News(models.Model):
    title = models.CharField(max_length=255)
    date = models.CharField(max_length=100)
    headline_image = models.TextField() # Menyimpan Base64 sesuai script lama
    content_data = models.JSONField() # Menyimpan struktur konten berita