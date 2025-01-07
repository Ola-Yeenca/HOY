import numpy as np
import json
import os
from typing import Dict, Tuple

def generate_sample_data(num_users: int = 1000, num_genres: int = 10) -> Tuple[Dict[str, np.ndarray], Dict[str, str]]:
    """
    Generate sample data for training the music recommendation model.
    
    Args:
        num_users: Number of users to generate
        num_genres: Number of music genres
        
    Returns:
        Tuple of (training_data, genre_mapping)
    """
    
    # Define genres
    genres = [
        'Rock', 'Pop', 'Hip Hop', 'Jazz', 'Classical',
        'Electronic', 'R&B', 'Country', 'Blues', 'Metal'
    ][:num_genres]
    
    # Create genre mapping
    genre_mapping = {genre: i for i, genre in enumerate(genres)}
    
    # Generate user features
    user_features = np.random.rand(num_users, 4)  # 4 features per user
    
    # Generate genre preferences (one-hot encoded)
    genre_features = np.eye(num_genres)  # Identity matrix for one-hot encoding
    
    # Generate labels (like/dislike for each genre)
    # We'll create some patterns in the data
    labels = []
    for user_feature in user_features:
        # User's activity level affects their likelihood of liking genres
        activity_level = user_feature[0]
        
        # Generate preferences with some patterns
        user_labels = []
        for i in range(num_genres):
            # Different formulas for different genre groups
            if i < num_genres // 3:  # First third of genres
                prob = 0.7 * activity_level + 0.2 * user_feature[1]
            elif i < 2 * num_genres // 3:  # Middle third
                prob = 0.6 * user_feature[2] + 0.3 * activity_level
            else:  # Last third
                prob = 0.5 * user_feature[3] + 0.4 * user_feature[1]
                
            # Add some randomness
            prob = np.clip(prob + np.random.normal(0, 0.1), 0, 1)
            
            # Convert to binary label
            label = 1 if prob > 0.5 else 0
            user_labels.append(label)
        
        labels.append(user_labels)
    
    labels = np.array(labels)
    
    # Create training data dictionary
    training_data = {
        'user_features': user_features,
        'genre_features': genre_features,
        'labels': labels
    }
    
    return training_data, genre_mapping

def save_sample_data(base_dir: str):
    """
    Generate and save sample training data.
    
    Args:
        base_dir: Base directory to save the data
    """
    # Create data directory if it doesn't exist
    data_dir = os.path.join(base_dir, 'recommendations/data')
    models_dir = os.path.join(base_dir, 'recommendations/models')
    
    os.makedirs(data_dir, exist_ok=True)
    os.makedirs(models_dir, exist_ok=True)
    
    # Generate sample data
    training_data, genre_mapping = generate_sample_data()
    
    # Save genre mapping
    mapping_path = os.path.join(models_dir, 'genre_mapping.json')
    with open(mapping_path, 'w') as f:
        json.dump(genre_mapping, f, indent=2)
    
    # Save training data
    data_path = os.path.join(data_dir, 'training_data.npz')
    np.savez(
        data_path,
        user_features=training_data['user_features'],
        genre_features=training_data['genre_features'],
        labels=training_data['labels']
    )
    
    print(f"Sample data saved to {data_dir}")
    print(f"Genre mapping saved to {mapping_path}")

if __name__ == '__main__':
    # Get the project base directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(current_dir)))
    
    # Generate and save sample data
    save_sample_data(base_dir)
