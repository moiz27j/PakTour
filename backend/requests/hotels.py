import requests
import os 
from dotenv import load_dotenv


load_dotenv()

google_place_api = os.getenv("google_places_api_key")

def get_hotels(city:str):

    url = "https://maps.googleapis.com/maps/api/place/textsearch/json"

    params = {
        "query" : f"hotels in {city}",
        "key"   : google_place_api
    }

    response = requests.get(url,params=params)
    data = response.json()

    if response.status_code == 200 and "results" in data:

        # print(data['results'][0])

        """ USEFUL OUTPUT PARAMETERS :: 

                1. name
                2. formatted_address
                3. opening_hours: {'open_now': True}
                4. rating
                5. user_ratings_total
                6. types': ['lodging', 'restaurant', 'food', 'point_of_interest', 'establishment']
        """
        
        for hotel in data['results']:
            print(hotel.get('name'))
            



print(get_hotels("islamabad"))