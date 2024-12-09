from rest_framework import serializers
from .models import Gallery, Image, ImageLike, ImageDownload

class ImageSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()
    downloads_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = Image
        fields = ('id', 'image', 'caption', 'photographer', 'is_featured',
                 'camera_info', 'tags', 'created_at', 'likes_count',
                 'downloads_count', 'is_liked')
    
    def get_likes_count(self, obj):
        return obj.likes.count()
    
    def get_downloads_count(self, obj):
        return obj.downloads.count()
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

class GallerySerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    images_count = serializers.SerializerMethodField()
    event_title = serializers.CharField(source='event.title', read_only=True)
    
    class Meta:
        model = Gallery
        fields = ('id', 'event', 'event_title', 'title', 'description',
                 'cover_image', 'created_at', 'updated_at', 'images',
                 'images_count')
    
    def get_images_count(self, obj):
        return obj.images.count()

class GalleryListSerializer(serializers.ModelSerializer):
    images_count = serializers.SerializerMethodField()
    event_title = serializers.CharField(source='event.title', read_only=True)
    
    class Meta:
        model = Gallery
        fields = ('id', 'event', 'event_title', 'title', 'description',
                 'cover_image', 'created_at', 'images_count')
    
    def get_images_count(self, obj):
        return obj.images.count()

class ImageLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageLike
        fields = ('id', 'image', 'created_at')
        read_only_fields = ('user',)

class ImageDownloadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageDownload
        fields = ('id', 'image', 'created_at', 'ip_address', 'user_agent')
        read_only_fields = ('user', 'ip_address', 'user_agent')
