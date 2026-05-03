import time
from pymongo import MongoClient
from generic_template import get_type

# MongoDB setup
client = MongoClient("mongodb://localhost:27017")
db = client['tourism']

cities = [
    "Islamabad", "Karachi", "Lahore", "Peshawar", "Quetta", 
    "Multan", "Faisalabad", "Rawalpindi", "Sialkot", "Sukkur", 
    "Gujranwala", "Mardan", "Abbottabad", "Dera Ghazi Khan", 
    "Bahawalpur", "Sargodha", "Muzaffargarh", "Mirpur Khas", 
    "Hyderabad", "Bannu", "Chiniot", "Kotli", "Skardu", 
    "Gilgit", "Mingora", "Turbat", "Zhob", "Chakwal", 
    "Larkana", "Jhelum", "Gujrat", "Kasur", "Okara"
]

def filter_fields(place):
    return {
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

def scrape_place_type(place_type):
    collection = db[place_type] 

    for city in cities:
        print(f"\nScraping '{place_type}' for city: {city}")
        try:
            places = get_type(city, place_type)
        except Exception as e:
            print(f" Failed to get data for {city}: {e}")
            continue

        filtered = [filter_fields(p) for p in places]

        for spot in filtered:
            # adding CITY TO SPOT
            spot["city"] = city
            # AVOIDING DUPLICATES
            if not collection.find_one({"place_id": spot["place_id"]}):
                collection.insert_one(spot)
                print(f"Stored: {spot['name']}")
            else:
                print(f"Skipped (duplicate): {spot['name']}")

        time.sleep(1)  # avoid API rate limits


if __name__ == "__main__":
    scrape_place_type("tourist_attraction")
    scrape_place_type("zoo")
    scrape_place_type("movie_theater")
    scrape_place_type("museum")
    scrape_place_type("park")
    scrape_place_type("mosque")
    scrape_place_type("shopping_mall")
    scrape_place_type("church")
    scrape_place_type("mosque")

    client.close()
