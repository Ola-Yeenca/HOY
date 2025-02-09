# Generated by Django 5.1.3 on 2024-11-26 01:32

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='DJ',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('artist_name', models.CharField(blank=True, max_length=100)),
                ('bio', models.TextField()),
                ('profile_image', models.ImageField(upload_to='dj_profiles/')),
                ('genres', models.JSONField(default=list)),
                ('social_media', models.JSONField(default=dict)),
                ('website', models.URLField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'DJ',
                'verbose_name_plural': 'DJs',
            },
        ),
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=200)),
                ('slug', models.SlugField(max_length=255, unique=True)),
                ('description', models.TextField()),
                ('date', models.DateField()),
                ('start_time', models.TimeField()),
                ('end_time', models.TimeField()),
                ('location', models.JSONField()),
                ('featured_image', models.ImageField(upload_to='event_images/')),
                ('gallery_images', models.JSONField(default=list)),
                ('capacity', models.PositiveIntegerField()),
                ('age_restriction', models.PositiveIntegerField(default=18)),
                ('dress_code', models.TextField(blank=True)),
                ('ticket_types', models.JSONField(default=list)),
                ('perks', models.JSONField(default=list)),
                ('status', models.CharField(choices=[('draft', 'Draft'), ('published', 'Published'), ('cancelled', 'Cancelled'), ('completed', 'Completed')], default='draft', max_length=20)),
                ('is_featured', models.BooleanField(default=False)),
                ('is_private', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_events', to=settings.AUTH_USER_MODEL)),
                ('djs', models.ManyToManyField(related_name='events', to='events.dj')),
            ],
            options={
                'ordering': ['-date', '-start_time'],
            },
        ),
        migrations.CreateModel(
            name='EventInteraction',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('interested', models.BooleanField(default=False)),
                ('going', models.BooleanField(default=False)),
                ('rating', models.PositiveSmallIntegerField(blank=True, null=True)),
                ('feedback', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.event')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddIndex(
            model_name='event',
            index=models.Index(fields=['date', 'start_time'], name='events_even_date_7b878d_idx'),
        ),
        migrations.AddIndex(
            model_name='event',
            index=models.Index(fields=['status'], name='events_even_status_5709b6_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='eventinteraction',
            unique_together={('user', 'event')},
        ),
    ]
