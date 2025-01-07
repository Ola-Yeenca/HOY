import os
import numpy as np
from django.core.management.base import BaseCommand
from django.conf import settings
from recommendations.services.tensorflow_service import TensorFlowService
from recommendations.data.sample_data import generate_sample_data, save_sample_data

class Command(BaseCommand):
    help = 'Train the music recommendation model with sample data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--num-users',
            type=int,
            default=1000,
            help='Number of users to generate in sample data'
        )
        parser.add_argument(
            '--num-genres',
            type=int,
            default=10,
            help='Number of genres to use in sample data'
        )
        parser.add_argument(
            '--epochs',
            type=int,
            default=50,
            help='Number of training epochs'
        )
        parser.add_argument(
            '--batch-size',
            type=int,
            default=32,
            help='Batch size for training'
        )

    def handle(self, *args, **options):
        try:
            self.stdout.write('Generating sample data...')
            
            # Generate and save sample data
            save_sample_data(settings.BASE_DIR)
            
            # Load the saved data
            data_path = os.path.join(settings.BASE_DIR, 'recommendations/data/training_data.npz')
            data = np.load(data_path)
            
            training_data = {
                'user_features': data['user_features'],
                'genre_features': data['genre_features'],
                'labels': data['labels']
            }
            
            self.stdout.write('Training model...')
            
            # Initialize TensorFlow service
            tf_service = TensorFlowService()
            
            # Train the model
            model, history = tf_service.train_model(
                training_data,
                validation_split=0.2,
                epochs=options['epochs'],
                batch_size=options['batch_size']
            )
            
            if model and history:
                self.stdout.write(self.style.SUCCESS('Model trained successfully!'))
                
                # Print training metrics
                final_loss = history['loss'][-1]
                final_accuracy = history['accuracy'][-1]
                final_val_loss = history['val_loss'][-1]
                final_val_accuracy = history['val_accuracy'][-1]
                
                self.stdout.write(f'\nFinal training metrics:')
                self.stdout.write(f'Loss: {final_loss:.4f}')
                self.stdout.write(f'Accuracy: {final_accuracy:.4f}')
                self.stdout.write(f'Validation Loss: {final_val_loss:.4f}')
                self.stdout.write(f'Validation Accuracy: {final_val_accuracy:.4f}')
            else:
                self.stdout.write(self.style.ERROR('Model training failed!'))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))
