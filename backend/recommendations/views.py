from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings
from .services.gpt_service import GPTService
from .services.tensorflow_service import TensorFlowService
from typing import List, Dict, Any

class EventRecommendationView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.gpt_service = GPTService()
    
    async def get(self, request):
        try:
            # Get user preferences from request
            user_preferences = {
                'favorite_genres': request.query_params.getlist('genres', []),
                'location': request.query_params.get('location', ''),
                'past_events': request.user.attended_events.all()[:5],  # Get last 5 attended events
            }
            
            # Get available events (implement based on your Event model)
            available_events = await self._get_available_events()
            
            # Get number of recommendations requested
            num_recommendations = int(request.query_params.get('limit', 5))
            
            # Get recommendations from GPT-4
            recommendations = await self.gpt_service.get_event_recommendations(
                user_preferences,
                available_events,
                num_recommendations
            )
            
            return Response(recommendations)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    async def _get_available_events(self) -> List[Dict[str, Any]]:
        """Get list of available events."""
        # Implement based on your Event model
        # This is a placeholder
        return []

class MusicRecommendationView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.tf_service = TensorFlowService()
    
    def get(self, request):
        try:
            # Get user preferences
            user_preferences = self._get_user_preferences(request.user)
            
            # Get available genres
            available_genres = self._get_available_genres()
            
            # Get number of recommendations requested
            num_recommendations = int(request.query_params.get('limit', 5))
            
            # Get recommendations
            recommendations = self.tf_service.get_music_recommendations(
                user_preferences,
                available_genres,
                num_recommendations
            )
            
            return Response(recommendations)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _get_user_preferences(self, user) -> Dict[str, Any]:
        """Get user preferences for recommendation."""
        # Implement based on your User model
        # This is a placeholder
        return {
            'favorite_genres': [],
            'listened_tracks': [],
            'activity_score': 0.0,
            'diversity_score': 0.0
        }
    
    def _get_available_genres(self) -> List[str]:
        """Get list of available music genres."""
        # Implement based on your Genre model
        # This is a placeholder
        return [
            'Rock', 'Pop', 'Hip Hop', 'Jazz', 'Classical',
            'Electronic', 'R&B', 'Country', 'Blues', 'Metal'
        ]

class TrainModelView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.tf_service = TensorFlowService()
    
    def post(self, request):
        try:
            # Check if user has permission to train model
            if not request.user.is_staff:
                return Response(
                    {'error': 'Permission denied'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Get training data from request
            training_data = request.data.get('training_data')
            if not training_data:
                return Response(
                    {'error': 'No training data provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Train model
            model, history = self.tf_service.train_model(
                training_data,
                validation_split=0.2,
                epochs=50,
                batch_size=32
            )
            
            if model is None:
                return Response(
                    {'error': 'Model training failed'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            return Response({
                'message': 'Model trained successfully',
                'history': history
            })
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
