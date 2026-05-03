from fastapi import FastAPI,Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os
import random
import json
from routes.connection import mongo_db, redis_client
load_dotenv()

api_key = os.getenv("google_places_api_key")
if not api_key:
    print("\nERROR ::: API_KEY NOT LOADED\n")

collection = mongo_db['restaurants']


"""
    TODO:
        GET THE RESTAURENTS DATA FROM MONGODB tourism/restaurant
        GET RESTAURANT BY CITY
        GET USER INPUT AS CITY 
        RETURN JSON RESPONSE

        
    EXAMPLE OUTPUT ::

        _id     :  68161016efffecb8b140c675
        city    : "Islamabad"
        name    : "1969 Restaurant"
        address : "Garden Ave, Shakarpairan, 44000, Pakistan"
        rating  :  4.2
        types   : Array (4)  
        image   : "AeeoHcL4uxQOkOgtN28C4qU9xDIFYcdL057rcJZyGfVvOgiLBYVyV7cNuGDoC-radExhbP…"

    """

def get_restaurant_by_city(city):
    cache_key = f"restaurants:{city.lower()}"
    cached_data = redis_client.get(cache_key)
    if cached_data:
        return json.loads(cached_data)
    restaurants_cursor = collection.find({
       "city": { "$regex": f"^{city}$", "$options": "i" } ## ISLAMABAD , Islmamabad , islamabad ARE ALL GOOD
        })

    restaurants = []
    ## THE _id is in OBJECT NOT JSON FORMAT
    for res in restaurants_cursor:
        res["_id"] = str(res["_id"])
        # img_reference = res["image"]
        # google_image_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={img_reference}&key={api_key}"
        
        # res["image"] = google_image_url
        restaurants.append(res)

    redis_client.setex(cache_key, 3600, json.dumps(restaurants))
    return restaurants

# print(get_restaurant_by_city("Islamabad"))


# app = FastAPI()



# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"], 
#     allow_credentials=True,
#     allow_methods=["GET", "POST", "OPTIONS"],  
#     allow_headers=["*"],
# )


from fastapi.responses import RedirectResponse


def place_photo(photo_reference: str):
    if not photo_reference:
        return JSONResponse(content={"error": "Missing photo_reference"}, status_code=400)

    image_url = (
        f"https://maps.googleapis.com/maps/api/place/photo"
        f"?maxwidth=400&photoreference={photo_reference}&key={api_key}"
    )
    return RedirectResponse(url=image_url,status_code=302)


def random_photo():
    # Efficient random document selection with image reference
    pipeline = [
        {"$match": {"image": {"$exists": True, "$ne": None}}},
        {"$sample": {"size": 1}}
    ]
    result = list(collection.aggregate(pipeline))

    if not result:
        return JSONResponse(content={"error": "No images available"}, status_code=404)

    random_image_reference = result[0]["image"]

    image_url = (
        f"https://maps.googleapis.com/maps/api/place/photo"
        f"?maxwidth=400&photoreference={random_image_reference}&key={api_key}"
    )

    return RedirectResponse(url=image_url, status_code=302)


async def restaurant(request : Request):
    data = await request.json()
    response = data["city"]
    output_response = get_restaurant_by_city(response)
    return JSONResponse(content=output_response)


