from django.contrib import admin
from .models import Stats, EmailMovement, News , NewsContent

# Menampilkan data statistik di dashboard
@admin.register(Stats)
class StatsAdmin(admin.ModelAdmin):
    list_display = ('locations', 'years', 'adopter', 'ecosystems')
    
    # Mencegah pembuatan lebih dari satu baris data statistik
    def has_add_permission(self, request):
        if self.model.objects.count() >= 1:
            return False
        return True

# Menampilkan daftar email yang bergabung
@admin.register(EmailMovement)
class EmailMovementAdmin(admin.ModelAdmin):
    list_display = ('email', 'created_at')
    readonly_fields = ('created_at',)

class NewsContentInline(admin.TabularInline):
    model = NewsContent
    extra = 1 

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    inlines = [NewsContentInline]