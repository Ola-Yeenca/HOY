from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from .models import Gallery, Image, ImageLike, ImageDownload
from .serializers import (
    GallerySerializer,
    GalleryListSerializer,
    ImageSerializer,
    ImageLikeSerializer,
    ImageDownloadSerializer
)
from events.permissions import IsStaffOrReadOnly

class GalleryViewSet(viewsets.ModelViewSet):
    queryset = Gallery.objects.all()
    permission_classes = [IsStaffOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['event']
    search_fields = ['title', 'description', 'event__title']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return GalleryListSerializer
        return GallerySerializer

class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    permission_classes = [IsStaffOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['gallery', 'is_featured', 'photographer']
    search_fields = ['caption', 'photographer', 'tags']
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        image = self.get_object()
        like, created = ImageLike.objects.get_or_create(
            user=request.user,
            image=image
        )
        
        if not created:
            # Unlike if already liked
            like.delete()
            return Response({'status': 'unliked'})
            
        serializer = ImageLikeSerializer(like)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def download(self, request, pk=None):
        image = self.get_object()
        
        # Record download
        download = ImageDownload.objects.create(
            user=request.user,
            image=image,
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        serializer = ImageDownloadSerializer(download)
        return Response({
            'download_info': serializer.data,
            'download_url': request.build_absolute_uri(image.image.url)
        })
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_images = Image.objects.filter(is_featured=True)
        serializer = self.get_serializer(featured_images, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def most_liked(self, request):
        from django.db.models import Count
        most_liked = Image.objects.annotate(
            likes_count=Count('likes')
        ).order_by('-likes_count')[:10]
        
        serializer = self.get_serializer(most_liked, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def most_downloaded(self, request):
        from django.db.models import Count
        most_downloaded = Image.objects.annotate(
            downloads_count=Count('downloads')
        ).order_by('-downloads_count')[:10]
        
        serializer = self.get_serializer(most_downloaded, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_tag(self, request):
        tag = request.query_params.get('tag', None)
        if not tag:
            return Response(
                {'error': 'Tag parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        images = Image.objects.filter(tags__contains=[tag])
        serializer = self.get_serializer(images, many=True)
        return Response(serializer.data)
