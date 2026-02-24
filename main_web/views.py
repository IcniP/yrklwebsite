from django.shortcuts import render
from django.http import JsonResponse
from .models import News, Stats, EmailMovement
import json
from django.views.decorators.csrf import csrf_exempt

# 1. Pastikan fungsi 'index' ini ada
def index(request):
    return render(request, 'index.html')

# 2. Pastikan fungsi 'wwd' ini ada
def wwd(request):
    return render(request, 'wwd.html')

# API: Ambil Data Statistik
def get_stats(request):
    obj = Stats.objects.first()
    data = {
        "locations": obj.locations if obj else 0,
        "years": obj.years if obj else 0,
        "adopter": obj.adopter if obj else 0,
        "ecosystems": obj.ecosystems if obj else 0,
    }
    return JsonResponse(data)

# API: Ambil Daftar Berita
def get_news(request):
    news = list(News.objects.all().values().order_by('-id'))
    return JsonResponse(news, safe=False)

# API: Join Movement (Email)
@csrf_exempt
def join_movement(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            if email:
                EmailMovement.objects.get_or_create(email=email)
                return JsonResponse({'message': 'Berhasil bergabung!'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request'}, status=400)