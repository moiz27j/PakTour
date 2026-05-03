import requests
import time
from settings import google_places_api_key,GEO_CODE_URL,NEARBY_SEARCH_URL
from pymongo import MongoClient
from generic_template import get_type

"""
    INSTRUCTIONS:
            - FOR ONE-TIME RUN ONLY
            - FETCH RESTAURENTS USING GOOGLE_PLACE_API (in .env)
            - STORE IN restaurant_data
            - PUSH restaurant_data to MONGODB
            - DATA STORED IN LOCAL CLIENT

    TODO :
        - ADD MORE CITIES  ( DONT RE-RUN FOR SAME CITIES)
    
            
"""

# mongod (presnet in store_restartuent.py aswell) 
client = MongoClient("mongodb://localhost:27017")
db = client['tourism']
collection = db['tourist_attractions']

cities = [
    "Islamabad", "Karachi", "Lahore", "Peshawar", "Quetta", 
    "Multan", "Faisalabad", "Rawalpindi", "Sialkot", "Sukkur", 
    "Gujranwala", "Mardan", "Abbottabad", "Dera Ghazi Khan", 
    "Bahawalpur", "Sargodha", "Muzaffargarh", "Mirpur Khas", 
    "Hyderabad", "Bannu", "Chiniot", "Kotli", "Skardu", 
    "Gilgit", "Mingora", "Turbat", "Zhob", "Chakwal", 
    "Larkana", "Jhelum", "Gujrat", "Kasur", "Okara"
]


def get_tourist_attractions(city):
   
    tourist_attraction_data = get_type(city,"tourist_attraction")

    filtered_data = []
    for place in tourist_attraction_data:
        filtered = {
            "place_id": place.get("place_id"),
            "name": place.get("name"),
            "types": place.get("types"),
            "location": place.get("geometry", {}).get("location"),
            "address": place.get("vicinity") or place.get("formatted_address"),
            "rating": place.get("rating"),
            "user_ratings_total": place.get("user_ratings_total"),
            "open_now": place.get("opening_hours", {}).get("open_now"),
            "photo_reference": (
                place.get("photos", [{}])[0].get("photo_reference")
                if place.get("photos") else None
            ),
            "icon": place.get("icon"),
            "business_status": place.get("business_status"),
            "price_level": place.get("price_level")
        }
        filtered_data.append(filtered)

    return filtered_data


#store in mongodb (also present in store_restartient.py)
def store_tourist_attraction(tourist_attraction_data):
    for tourist_spot in tourist_attraction_data:
        collection.insert_one(tourist_spot)
        print(f"Stored: {tourist_spot['name']}")

# MAIN PROCESSING
for city in cities:
    tourist_attraction_data = get_tourist_attractions(city)
   
    store_tourist_attraction(tourist_attraction_data= tourist_attraction_data)
    time.sleep(1)  #to avoid hitting API rate limits


client.close()
