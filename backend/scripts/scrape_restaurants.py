import requests
import time
from dotenv import load_dotenv
import os
from store_restaurant import store_restaurant
from pymongo import MongoClient


"""
    INSTRUCTIONS:
            - FOR ONE-TIME RUN ONLY
            - FETCH RESTAURENTS USING GOOGLE_PLACE_API (in .env)
            - STORE IN restaurant_data
            - PUSH restaurant_data to MONGODB
            - DATA STORED IN LOCAL CLIENT

    TODO :
        - ADD MORE CITIES  ( DONT RE-RUN FOR SAME CITIES )
    
            
"""

load_dotenv()
google_places_api_key = os.getenv("google_places_api_key")

# mongod (presnet in store_restartuent.py aswell) 
client = MongoClient("mongodb://localhost:27017")
db = client['tourism']
collection = db['restaurants']

cities = [
    "Islamabad", "Karachi", "Lahore", "Peshawar", "Quetta", 
    "Multan", "Faisalabad", "Rawalpindi", "Sialkot", "Sukkur", 
    "Gujranwala", "Mardan", "Abbottabad", "Dera Ghazi Khan", 
    "Bahawalpur", "Sargodha", "Muzaffargarh", "Mirpur Khas", 
    "Hyderabad", "Bannu", "Chiniot", "Kotli", "Skardu", 
    "Gilgit", "Mingora", "Turbat", "Zhob", "Chakwal", 
    "Larkana", "Jhelum", "Gujrat", "Kasur", "Okara"
]


def search_restaurants_in_city(city_name):
    url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    
    # Parameters for the API request
    params = {
        'query': f'restaurants in {city_name}', 
        'key': google_places_api_key, 
    }
    
    restaurants_data = []
    while True:
        try:
            response = requests.get(url, params=params)
            data = response.json()

            if response.status_code == 200 and 'results' in data:
                print(f"Restaurants in {city_name}:\n")

                
                for place in data['results']:

                    photos = place.get('photos', [])
                    if photos:
                        photo_reference = photos[0].get('photo_reference')
                        # photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={API_KEY}"
                    else:
                        photo_reference = "No photo available"
                        
                    restaurant_data = {
                        "city" : city_name,
                        "name": place.get('name', 'N/A'),
                        "address": place.get('formatted_address', 'N/A'),
                        "rating": place.get('rating', 'N/A'),
                        "types": place.get('types', 'N/A'),
                        "image" : photo_reference
                    }
                    restaurants_data.append(restaurant_data)

                # Check for the next page of results
                next_page_token = data.get('next_page_token', None)
                if next_page_token:
                    params['pagetoken'] = next_page_token  
                else:
                    break  #no more pages to fetch

                time.sleep(2)  # to avoid rate-limiting

            else:
                return {"status": "failure", "restaurants": None}

        except requests.exceptions.RequestException as e:
            print(f"Error fetching data for {city_name}: {e}")
            break  #stop trying on error

    return {"status": "success", "restaurants": restaurants_data}


#store in mongodb (also present in store_restartient.py)
def store_restaurant(restaurants_data):
    for restaurant_data in restaurants_data:
        collection.insert_one(restaurant_data)
        print(f"Stored: {restaurant_data['name']}")

# MAIN PROCESSING
for city in cities:
    restaurant_data = search_restaurants_in_city(city)
    if restaurant_data['status'] == "success" and restaurant_data['restaurants'] is not None:
        store_restaurant(restaurants_data=restaurant_data['restaurants'])
        time.sleep(1)  #to avoid hitting API rate limits


client.close()
