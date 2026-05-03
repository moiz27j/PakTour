import requests
import os
from dotenv import load_dotenv


load_dotenv()


google_places_api_key = os.getenv("google_places_api_key")


if not google_places_api_key:
    print("Google Places API key not found! Please check your .env file.")
    exit()

# Function to search restaurants in a city
def search_restaurants_in_city(city_name):
    url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    
   
    params = {
        'query': f'restaurants in {city_name}',  # Search term, i.e., "restaurants in Islamabad"
        'key': google_places_api_key,  
    }
    
    
    response = requests.get(url, params=params)
    
    # Parse the response JSON
    data = response.json()

    if response.status_code == 200 and 'results' in data:
        print(f"Restaurants in {city_name}:\n")
        for place in data['results']:
            
            name = place.get('name', 'N/A')
            address = place.get('formatted_address', 'N/A')
            rating = place.get('rating', 'N/A')
            place_id = place.get('place_id', None)
            
            
            if place_id:
                get_place_details(place_id)

            print(f"Name: {name}")
            print(f"Address: {address}")
            print(f"Rating: {rating}")
            print("-" * 30)
    else:
        print(f"No results found for restaurants in {city_name}, or an error occurred.")

# Function to get more detailed information for a restaurant
def get_place_details(place_id):
    url = "https://maps.googleapis.com/maps/api/place/details/json"
    
    
    params = {
        'place_id': place_id,  # Place ID from the previous search
        'key': google_places_api_key,  # API key
    }
    
    response = requests.get(url, params=params)
    data = response.json()
    

    """" OUTPUT FORM::
            {
            "results": [
                {
                "name": "The Best Italian Restaurant",
                "formatted_address": "123 Main St, Islamabad",
                "rating": 4.5,
                "types": ["restaurant", "food", "point_of_interest", "establishment"],
                "place_id": "ChIJw5e7Ghtz5T4Rs3LBj0rfsbg",
                "user_ratings_total": 152,
                "price_level": 2
                },
                ...
            ]
                }
    """
    if response.status_code == 200:
        place_details = data.get('result', {})
        name = place_details.get('name', 'N/A')
        address = place_details.get('formatted_address', 'N/A')
        phone_number = place_details.get('formatted_phone_number', 'N/A')
        website = place_details.get('website', 'N/A')
        
        print(f"Detailed Information for {name}:")
        print(f"Phone Number: {phone_number}")
        print(f"Website: {website}")
        print("-" * 30)
    else:
        print(f"Failed to get details for place ID: {place_id}")


search_restaurants_in_city("Islamabad")
