import os
import numpy as np
import tensorflow as tf
from typing import List, Dict, Any, Tuple
from django.conf import settings
import json

class MusicRecommendationModel:
    def __init__(self, num_genres: int, num_features: int):
        self.model = self._build_model(num_genres, num_features)
        
    def _build_model(self, num_genres: int, num_features: int) -> tf.keras.Model:
        """Build the neural network model for music recommendations."""
        
        # User preferences input
        user_input = tf.keras.layers.Input(shape=(num_features,), name='user_input')
        
        # Genre input
        genre_input = tf.keras.layers.Input(shape=(num_genres,), name='genre_input')
        
        # Process user preferences
        user_features = tf.keras.layers.Dense(64, activation='relu')(user_input)
        user_features = tf.keras.layers.Dropout(0.3)(user_features)
        user_features = tf.keras.layers.Dense(32, activation='relu')(user_features)
        
        # Process genre features
        genre_features = tf.keras.layers.Dense(32, activation='relu')(genre_input)
        genre_features = tf.keras.layers.Dropout(0.3)(genre_features)
        
        # Combine features
        combined = tf.keras.layers.Concatenate()([user_features, genre_features])
        
        # Final layers
        x = tf.keras.layers.Dense(32, activation='relu')(combined)
        x = tf.keras.layers.Dropout(0.2)(x)
        x = tf.keras.layers.Dense(16, activation='relu')(x)
        
        # Output layer (probability of user liking the genre)
        output = tf.keras.layers.Dense(1, activation='sigmoid')(x)
        
        # Create model
        model = tf.keras.Model(
            inputs=[user_input, genre_input],
            outputs=output
        )
        
        # Compile model
        model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
        
        return model

class TensorFlowService:
    def __init__(self):
        self.model_path = os.path.join(settings.BASE_DIR, 'recommendations/models/music_recommender')
        self.genre_mapping_path = os.path.join(settings.BASE_DIR, 'recommendations/models/genre_mapping.json')
        self.model = None
        self.genre_mapping = None
        self.load_model()
    
    def load_model(self):
        """Load the trained model and genre mapping."""
        try:
            if os.path.exists(self.model_path):
                self.model = tf.keras.models.load_model(self.model_path)
            
            if os.path.exists(self.genre_mapping_path):
                with open(self.genre_mapping_path, 'r') as f:
                    self.genre_mapping = json.load(f)
        except Exception as e:
            print(f"Error loading model: {str(e)}")
    
    def train_model(
        self,
        training_data: Dict[str, np.ndarray],
        validation_split: float = 0.2,
        epochs: int = 50,
        batch_size: int = 32
    ) -> Tuple[tf.keras.Model, Dict[str, Any]]:
        """
        Train the recommendation model with user data.
        
        Args:
            training_data: Dictionary containing:
                - user_features: User preference features
                - genre_features: Genre features
                - labels: Binary labels (1 if user likes genre, 0 otherwise)
            validation_split: Fraction of data to use for validation
            epochs: Number of training epochs
            batch_size: Batch size for training
            
        Returns:
            Trained model and training history
        """
        try:
            if self.model is None:
                num_genres = training_data['genre_features'].shape[1]
                num_features = training_data['user_features'].shape[1]
                self.model = MusicRecommendationModel(num_genres, num_features).model
            
            # Train the model
            history = self.model.fit(
                x=[
                    training_data['user_features'],
                    training_data['genre_features']
                ],
                y=training_data['labels'],
                validation_split=validation_split,
                epochs=epochs,
                batch_size=batch_size,
                callbacks=[
                    tf.keras.callbacks.EarlyStopping(
                        monitor='val_loss',
                        patience=5,
                        restore_best_weights=True
                    )
                ]
            )
            
            # Save the trained model
            self.model.save(self.model_path)
            
            return self.model, history.history
            
        except Exception as e:
            print(f"Error training model: {str(e)}")
            return None, None
    
    def get_music_recommendations(
        self,
        user_preferences: Dict[str, Any],
        available_genres: List[str],
        num_recommendations: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Get personalized music genre recommendations.
        
        Args:
            user_preferences: Dictionary of user preferences
            available_genres: List of available genres to recommend from
            num_recommendations: Number of recommendations to return
            
        Returns:
            List of recommended genres with scores
        """
        try:
            if self.model is None:
                raise ValueError("Model not loaded")
            
            # Prepare user features
            user_features = self._prepare_user_features(user_preferences)
            
            # Prepare genre features
            genre_features = self._prepare_genre_features(available_genres)
            
            # Get predictions
            predictions = self.model.predict(
                [
                    np.tile(user_features, (len(available_genres), 1)),
                    genre_features
                ]
            )
            
            # Create recommendations list
            recommendations = []
            for i, genre in enumerate(available_genres):
                recommendations.append({
                    'genre': genre,
                    'score': float(predictions[i][0]),
                    'confidence': self._calculate_confidence(predictions[i][0])
                })
            
            # Sort by score and return top N
            recommendations.sort(key=lambda x: x['score'], reverse=True)
            return recommendations[:num_recommendations]
            
        except Exception as e:
            print(f"Error getting recommendations: {str(e)}")
            return []
    
    def _prepare_user_features(self, user_preferences: Dict[str, Any]) -> np.ndarray:
        """Convert user preferences to feature vector."""
        # This is a placeholder - implement actual feature extraction based on your data
        features = []
        
        # Example features (customize based on your data):
        features.extend([
            len(user_preferences.get('favorite_genres', [])),  # Number of favorite genres
            len(user_preferences.get('listened_tracks', [])),  # Number of tracks listened
            user_preferences.get('activity_score', 0.0),      # User activity score
            user_preferences.get('diversity_score', 0.0),     # Genre diversity score
        ])
        
        return np.array(features).reshape(1, -1)
    
    def _prepare_genre_features(self, genres: List[str]) -> np.ndarray:
        """Convert genres to one-hot encoded features."""
        if self.genre_mapping is None:
            raise ValueError("Genre mapping not loaded")
            
        num_genres = len(self.genre_mapping)
        genre_features = np.zeros((len(genres), num_genres))
        
        for i, genre in enumerate(genres):
            if genre in self.genre_mapping:
                genre_features[i, self.genre_mapping[genre]] = 1
                
        return genre_features
    
    def _calculate_confidence(self, score: float) -> str:
        """Calculate confidence level based on prediction score."""
        if score >= 0.8:
            return "Very High"
        elif score >= 0.6:
            return "High"
        elif score >= 0.4:
            return "Medium"
        elif score >= 0.2:
            return "Low"
        else:
            return "Very Low"
