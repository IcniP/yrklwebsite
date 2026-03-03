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
    date = models.DateField(auto_now_add=True)
    headline_image = models.ImageField(upload_to='news/')

    def __str__(self):
        return self.title

class NewsContent(models.Model):
    news = models.ForeignKey(News, related_name='contents', on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0)
    text_content = models.TextField(blank=True, null=True)
    image_content = models.ImageField(upload_to='news_sub/', blank=True, null=True)

    class Meta:
        ordering = ['order']