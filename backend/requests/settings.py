import os
from dotenv import load_dotenv


load_dotenv()


google_places_api_key = os.getenv("google_places_api_key")
GEO_CODE_URL = "https://maps.googleapis.com/maps/api/geocode/json"
NEARBY_SEARCH_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"



if not google_places_api_key:
    print("Google Places API key not found! Please check your .env file.")
    exit()