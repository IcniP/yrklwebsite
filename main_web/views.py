from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import News, Stats, EmailMovement
import json
from django.views.decorators.csrf import csrf_exempt

def index(request):
    return render(request, 'index.html')

# Fungsi untuk menampilkan daftar berita (Halaman Kiri)
def wwd(request):
    articles = News.objects.all().order_by('-id')
    return render(request, 'wwd.html', {'articles': articles})

# Fungsi untuk detail berita (Halaman Kanan)
def article_detail(request, pk):
    article = get_object_or_404(News, pk=pk)
    return render(request, 'article_detail.html', {'article': article})

# API Endpoints tetap dipertahankan
def get_stats(request):
    obj = Stats.objects.first()
    data = {
        "locations": obj.locations if obj else 0,
        "years": obj.years if obj else 0,
        "adopter": obj.adopter if obj else 0,
        "ecosystems": obj.ecosystems if obj else 0,
    }
    return JsonResponse(data)

@csrf_exempt
def join_movement(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        if email:
            EmailMovement.objects.get_or_create(email=email)
            return JsonResponse({'message': 'Berhasil bergabung!'})
    return JsonResponse({'error': 'Invalid request'}, status=400)