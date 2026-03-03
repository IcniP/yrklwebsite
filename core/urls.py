from django.contrib import admin
from django.urls import path
from django.conf import settings # Tambahkan ini
from django.conf.urls.static import static
from main_web import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='home'),
    path('wwd/', views.wwd, name='wwd'), # Ini yang tadi error
    path('article/<int:pk>/', views.article_detail, name='article_detail'),
    
    # API
    path('api/stats/', views.get_stats),
    path('api/join-movement/', views.join_movement),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)