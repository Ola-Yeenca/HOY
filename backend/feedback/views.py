from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import Survey, SurveyResponse, Feedback, FeedbackResponse
from .serializers import (
    SurveySerializer,
    SurveyResponseSerializer,
    FeedbackSerializer,
    FeedbackResponseSerializer,
    SurveyAnalyticsSerializer
)
from events.permissions import IsStaffOrReadOnly
from django.db.models import Count
from django.db import models

class SurveyViewSet(viewsets.ModelViewSet):
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer
    permission_classes = [IsStaffOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['survey_type', 'is_active']
    search_fields = ['title', 'description']
    
    def get_queryset(self):
        queryset = Survey.objects.all()
        if not self.request.user.is_staff:
            # Regular users can only see active surveys within their date range
            now = timezone.now()
            queryset = queryset.filter(
                is_active=True,
                start_date__lte=now,
                end_date__gte=now
            )
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'analytics':
            return SurveyAnalyticsSerializer
        return SurveySerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def analytics(self, request, pk=None):
        """Get analytics for survey responses."""
        survey = self.get_object()
        serializer = self.get_serializer(survey)
        return Response(serializer.data)

class SurveyResponseViewSet(viewsets.ModelViewSet):
    queryset = SurveyResponse.objects.all()
    serializer_class = SurveyResponseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return SurveyResponse.objects.all()
        return SurveyResponse.objects.filter(user=self.request.user)

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['feedback_type', 'status', 'event', 'dj']
    search_fields = ['subject', 'message']
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Feedback.objects.all()
        return Feedback.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def respond(self, request, pk=None):
        """Add a response to feedback."""
        feedback = self.get_object()
        serializer = FeedbackResponseSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(
                feedback=feedback,
                responder=request.user
            )
            
            # Update feedback status if not already resolved
            if feedback.status == 'pending':
                feedback.status = 'in_progress'
                feedback.save()
            
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def update_status(self, request, pk=None):
        """Update feedback status."""
        feedback = self.get_object()
        status_value = request.data.get('status')
        
        if status_value not in dict(Feedback.STATUS_CHOICES):
            return Response(
                {'error': f'Invalid status. Choices are: {dict(Feedback.STATUS_CHOICES).keys()}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        feedback.status = status_value
        feedback.save()
        serializer = self.get_serializer(feedback)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def statistics(self, request):
        """Get feedback statistics."""
        feedback_count = Feedback.objects.count()
        feedback_by_type = Feedback.objects.values('feedback_type').annotate(count=Count('id'))
        feedback_by_status = Feedback.objects.values('status').annotate(count=Count('id'))
        
        return Response({
            'total_feedback': feedback_count,
            'feedback_by_type': feedback_by_type,
            'feedback_by_status': feedback_by_status
        })
