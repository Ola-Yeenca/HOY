from django.contrib import admin
from .models import Gallery, Image, ImageLike, ImageDownload

@admin.register(Gallery)
class GalleryAdmin(admin.ModelAdmin):
    list_display = ('title', 'event', 'created_at', 'updated_at')
    list_filter = ('event', 'created_at')
    search_fields = ('title', 'description', 'event__title')
    raw_id_fields = ('event',)

@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('caption', 'gallery', 'photographer', 'is_featured', 'created_at')
    list_filter = ('gallery', 'is_featured', 'created_at')
    search_fields = ('caption', 'photographer', 'tags')
    raw_id_fields = ('gallery',)

@admin.register(ImageLike)
class ImageLikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'image', 'created_at')
    list_filter = ('created_at',)
    raw_id_fields = ('user', 'image')

@admin.register(ImageDownload)
class ImageDownloadAdmin(admin.ModelAdmin):
    list_display = ('user', 'image', 'created_at', 'ip_address')
    list_filter = ('created_at',)
    raw_id_fields = ('user', 'image')
