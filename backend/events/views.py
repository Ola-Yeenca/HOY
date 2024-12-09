from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import SessionAuthentication
from .models import Event, DJ, EventInteraction
from .serializers import (
    EventListSerializer,
    EventDetailSerializer,
    EventCreateUpdateSerializer,
    DJSerializer,
    EventInteractionSerializer
)
from .permissions import IsStaffOrReadOnly

class DJViewSet(viewsets.ModelViewSet):
    queryset = DJ.objects.all()
    serializer_class = DJSerializer
    permission_classes = [IsStaffOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'artist_name', 'genres']

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsStaffOrReadOnly]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'is_featured', 'date']
    search_fields = ['title', 'description', 'djs__name', 'djs__artist_name']
    ordering_fields = ['date', 'created_at', 'title']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return EventListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return EventCreateUpdateSerializer
        return EventDetailSerializer
    
    def get_queryset(self):
        queryset = Event.objects.all()
        if self.action == 'list':
            # Filter out draft and cancelled events for non-staff users
            if not self.request.user.is_staff:
                queryset = queryset.filter(status='published')
            
            # Additional filtering options
            upcoming = self.request.query_params.get('upcoming', None)
            if upcoming is not None:
                today = timezone.now().date()
                if upcoming.lower() == 'true':
                    queryset = queryset.filter(date__gte=today)
                else:
                    queryset = queryset.filter(date__lt=today)
        return queryset
    
    def list(self, request, *args, **kwargs):
        """Override list to ensure we always return an array of events"""
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def interact(self, request, pk=None):
        event = self.get_object()
        interaction, created = EventInteraction.objects.get_or_create(
            user=request.user,
            event=event
        )
        
        serializer = EventInteractionSerializer(
            interaction,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def interactions(self, request, pk=None):
        event = self.get_object()
        interactions = EventInteraction.objects.filter(event=event)
        serializer = EventInteractionSerializer(interactions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_events = Event.objects.filter(
            is_featured=True,
            status='published',
            date__gte=timezone.now().date()
        )
        serializer = EventListSerializer(featured_events, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recommended(self, request):
        """Get personalized event recommendations based on user preferences."""
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Get user's favorite genres and past interactions
        user_genres = request.user.favorite_genres
        user_interactions = EventInteraction.objects.filter(
            user=request.user,
            rating__isnull=False
        ).values_list('event', flat=True)
        
        # Filter events based on user preferences
        recommended_events = Event.objects.filter(
            status='published',
            date__gte=timezone.now().date()
        ).exclude(
            id__in=user_interactions
        )
        
        # If user has favorite genres, prioritize events with matching DJs
        if user_genres:
            recommended_events = recommended_events.filter(
                djs__genres__overlap=user_genres
            ).distinct()
        
        serializer = EventListSerializer(
            recommended_events[:10],
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)
