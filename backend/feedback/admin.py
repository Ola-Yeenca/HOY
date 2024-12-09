from django.contrib import admin
from .models import Survey, SurveyResponse, Feedback, FeedbackResponse

@admin.register(Survey)
class SurveyAdmin(admin.ModelAdmin):
    list_display = ('title', 'survey_type', 'is_active', 'start_date', 'end_date', 'created_by')
    list_filter = ('survey_type', 'is_active')
    search_fields = ('title', 'description')
    readonly_fields = ('created_by',)
    
    def save_model(self, request, obj, form, change):
        if not change:  # Only set created_by during the first save
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

@admin.register(SurveyResponse)
class SurveyResponseAdmin(admin.ModelAdmin):
    list_display = ('survey', 'user', 'created_at')
    list_filter = ('survey', 'created_at')
    search_fields = ('user__username', 'user__email')
    readonly_fields = ('user', 'survey', 'responses')

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('subject', 'feedback_type', 'user', 'status', 'created_at')
    list_filter = ('feedback_type', 'status', 'created_at')
    search_fields = ('subject', 'message', 'user__username', 'user__email')
    readonly_fields = ('user',)

@admin.register(FeedbackResponse)
class FeedbackResponseAdmin(admin.ModelAdmin):
    list_display = ('feedback', 'responder', 'is_internal', 'created_at')
    list_filter = ('is_internal', 'created_at')
    search_fields = ('message', 'responder__username', 'feedback__subject')
    readonly_fields = ('responder', 'feedback')
