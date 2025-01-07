import os
import openai
from typing import List, Dict, Any
from django.conf import settings

class GPTService:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY
        self.model = "gpt-4"  # or "gpt-4-turbo" depending on availability

    async def get_event_recommendations(
        self, 
        user_preferences: Dict[str, Any], 
        available_events: List[Dict[str, Any]],
        num_recommendations: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Get personalized event recommendations using GPT-4.
        
        Args:
            user_preferences: Dict containing user preferences and history
            available_events: List of available events to recommend from
            num_recommendations: Number of recommendations to return
            
        Returns:
            List of recommended events with explanations
        """
        try:
            # Construct the prompt
            prompt = self._construct_recommendation_prompt(
                user_preferences, 
                available_events, 
                num_recommendations
            )
            
            # Get recommendations from GPT-4
            response = await openai.ChatCompletion.acreate(
                model=self.model,
                messages=[
                    {"role": "system", "content": """You are an expert event recommendation system. 
                     Analyze user preferences and available events to provide personalized recommendations.
                     Format your response as a JSON array of objects, each containing 'event_id', 
                     'score' (0-1), and 'explanation'."""},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            # Parse and validate the response
            recommendations = self._parse_gpt_response(response.choices[0].message['content'])
            
            # Sort recommendations by score and get top N
            recommendations.sort(key=lambda x: x['score'], reverse=True)
            return recommendations[:num_recommendations]
            
        except Exception as e:
            print(f"Error getting GPT recommendations: {str(e)}")
            return []
    
    def _construct_recommendation_prompt(
        self, 
        user_preferences: Dict[str, Any], 
        available_events: List[Dict[str, Any]], 
        num_recommendations: int
    ) -> str:
        """Construct a prompt for GPT-4 based on user preferences and available events."""
        
        # Extract relevant user information
        genres = user_preferences.get('favorite_genres', [])
        past_events = user_preferences.get('past_events', [])
        location = user_preferences.get('location', '')
        
        prompt = f"""Given the following user preferences and available events, recommend {num_recommendations} events:

User Preferences:
- Favorite Genres: {', '.join(genres)}
- Location: {location}
- Past Events: {', '.join(e['name'] for e in past_events[:5])}

Available Events:
"""
        
        # Add available events to the prompt
        for event in available_events:
            prompt += f"""
- ID: {event['id']}
  Name: {event['name']}
  Genre: {event['genre']}
  Location: {event['location']}
  Date: {event['date']}
  Description: {event['description']}
"""
        
        prompt += "\nProvide recommendations in the following JSON format:\n"
        prompt += """[
    {
        "event_id": "event_id",
        "score": 0.95,
        "explanation": "Reason for recommendation"
    }
]"""
        
        return prompt
    
    def _parse_gpt_response(self, response_text: str) -> List[Dict[str, Any]]:
        """Parse and validate GPT-4's response."""
        try:
            import json
            recommendations = json.loads(response_text)
            
            # Validate the format
            if not isinstance(recommendations, list):
                raise ValueError("Response is not a list")
                
            for rec in recommendations:
                required_keys = {'event_id', 'score', 'explanation'}
                if not all(key in rec for key in required_keys):
                    raise ValueError(f"Missing required keys: {required_keys - set(rec.keys())}")
                
                if not isinstance(rec['score'], (int, float)) or not 0 <= rec['score'] <= 1:
                    raise ValueError(f"Invalid score value: {rec['score']}")
            
            return recommendations
            
        except json.JSONDecodeError as e:
            print(f"Error parsing GPT response: {str(e)}")
            return []
        except Exception as e:
            print(f"Error validating GPT response: {str(e)}")
            return []
