from rest_framework import serializers
from .models import Survey, SurveyResponse, Feedback, FeedbackResponse
from django.utils import timezone
from datetime import timedelta

class SurveySerializer(serializers.ModelSerializer):
    responses_count = serializers.SerializerMethodField()
    has_user_responded = serializers.SerializerMethodField()
    
    class Meta:
        model = Survey
        fields = '__all__'
        read_only_fields = ('created_by',)
    
    def get_responses_count(self, obj):
        return obj.responses.count()
    
    def get_has_user_responded(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.responses.filter(user=request.user).exists()
        return False

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['created_by'] = request.user
        return super().create(validated_data)

    def validate(self, data):
        if not data.get('start_date'):
            data['start_date'] = timezone.now()
        if not data.get('end_date'):
            data['end_date'] = data['start_date'] + timedelta(days=7)
        return data

class SurveyResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurveyResponse
        fields = '__all__'
        read_only_fields = ('user',)
    
    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        return super().create(validated_data)

class FeedbackResponseSerializer(serializers.ModelSerializer):
    responder_name = serializers.CharField(source='responder.get_full_name', read_only=True)
    
    class Meta:
        model = FeedbackResponse
        fields = ('id', 'feedback', 'message', 'created_at', 'is_internal',
                 'responder', 'responder_name')
        read_only_fields = ('responder',)

class FeedbackSerializer(serializers.ModelSerializer):
    responses = FeedbackResponseSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)
    dj_name = serializers.CharField(source='dj.artist_name', read_only=True)
    
    class Meta:
        model = Feedback
        fields = ('id', 'user', 'user_name', 'feedback_type', 'subject',
                 'message', 'event', 'event_title', 'dj', 'dj_name',
                 'rating', 'status', 'created_at', 'updated_at', 'responses')
        read_only_fields = ('user', 'status')

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        return super().create(validated_data)

    def validate_feedback_type(self, value):
        if value not in dict(Feedback.FEEDBACK_TYPES):
            raise serializers.ValidationError(f"Invalid feedback type. Choices are: {dict(Feedback.FEEDBACK_TYPES).keys()}")
        return value

class SurveyAnalyticsSerializer(serializers.ModelSerializer):
    response_data = serializers.SerializerMethodField()
    
    class Meta:
        model = Survey
        fields = ('id', 'title', 'survey_type', 'response_data')
    
    def get_response_data(self, obj):
        """Aggregate and analyze survey responses."""
        responses = obj.responses.all()
        questions = obj.questions
        analytics = {}
        
        for question in questions:
            question_id = question['id']
            question_type = question['type']
            answers = [
                response.responses.get(str(question_id))
                for response in responses
                if response.responses.get(str(question_id))
            ]
            
            if question_type in ['multiple_choice', 'single_choice']:
                # Count frequency of each option
                from collections import Counter
                analytics[question_id] = dict(Counter(answers))
            elif question_type == 'rating':
                # Calculate average rating
                if answers:
                    analytics[question_id] = {
                        'average': sum(answers) / len(answers),
                        'count': len(answers)
                    }
            elif question_type == 'text':
                # Just count number of responses
                analytics[question_id] = {
                    'response_count': len(answers)
                }
        
        return analytics
