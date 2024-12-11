from rest_framework import serializers
from .models import Event, DJ, EventInteraction

class DJSerializer(serializers.ModelSerializer):
    class Meta:
        model = DJ
        fields = '__all__'

class EventListSerializer(serializers.ModelSerializer):
    djs = DJSerializer(many=True, read_only=True)
    is_past = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Event
        fields = ('id', 'title', 'slug', 'date', 'start_time',
                 'location', 'featured_image', 'djs', 'status', 'is_featured',
                 'is_past', 'capacity', 'age_restriction')

class EventDetailSerializer(serializers.ModelSerializer):
    djs = DJSerializer(many=True, read_only=True)
    is_past = serializers.BooleanField(read_only=True)
    created_by = serializers.StringRelatedField()
    user_interaction = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = '__all__'
        
    def get_user_interaction(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            interaction = EventInteraction.objects.filter(
                user=request.user,
                event=obj
            ).first()
            if interaction:
                return {
                    'interested': interaction.interested,
                    'going': interaction.going,
                    'rating': interaction.rating,
                    'feedback': interaction.feedback
                }
        return None

class EventCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        exclude = ('created_by', 'slug', 'created_at', 'updated_at')
        
    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['created_by'] = request.user
        return super().create(validated_data)

class EventInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventInteraction
        fields = ('id', 'event', 'interested', 'going', 'rating', 'feedback',
                 'created_at', 'updated_at')
        read_only_fields = ('user',)
        
    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        return super().create(validated_data)
