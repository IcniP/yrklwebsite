from django.contrib import admin
from django.urls import path
from main_web import views

urlpatterns = [
    # Perhatikan baris admin ini, cukup gunakan admin.site.urls
    path('admin/', admin.site.urls), 
    
    path('', views.index, name='home'),
    path('wwd/', views.wwd, name='wwd'),
    
    # API Endpoints
    path('api/stats/', views.get_stats),
    path('api/news/', views.get_news),
    path('api/join-movement/', views.join_movement),
]