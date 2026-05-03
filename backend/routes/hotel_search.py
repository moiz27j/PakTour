from fastapi import Request
from fastapi.responses import JSONResponse
from opencage.geocoder import OpenCageGeocode
import os
from routes.connection import mongo_db, redis_client


api_key = os.getenv("opencage_api_key")

airbnb_collection = mongo_db["air_bnb"]
hotel_collection = mongo_db["hotel"]


def get_hotel_data_for_city(request: Request):
    data = request.query_params
    city = data.get("city")

    if not city:
        return JSONResponse(
            status_code=400,
            content={"error": "City parameter is required"}
        )
    
    # Fetch hotel data from MongoDB
    hotel_data = list(hotel_collection.find({"address.city": city}))

    if not hotel_data:
        return JSONResponse(
            status_code=404,
            content={"error": f"No hotel data found for city: {city}"}
        )
    
    # Convert ObjectId to string
    for hotel in hotel_data:
        hotel["_id"] = str(hotel["_id"])
    return JSONResponse(content=hotel_data)

def get_airbnb_data_for_city(request: Request):
    data = request.query_params
    city = data.get("city")

    if not city:
        return JSONResponse(
            status_code=400,
            content={"error": "City parameter is required"}
        )
    
    # Fetch Airbnb data from MongoDB
    airbnb_data = list(airbnb_collection.find({"city": city}))

    if not airbnb_data:
        return JSONResponse(
            status_code=404,
            content={"error": f"No Airbnb data found for city: {city}"}
        )
    
    # Convert ObjectId to string
    for airbnb in airbnb_data:
        airbnb["_id"] = str(airbnb["_id"])
    return JSONResponse(content=airbnb_data)

def get_hotel_data_for_location(request: Request):
    geocoder = OpenCageGeocode(api_key)
    data = request.query_params
    address = data.get("address")
    price_min = data.get("price_min")
    price_max = data.get("price_max")
    if not address:
        return JSONResponse(
            status_code=400,
            content={"error": "Address parameter is required"}
        )
    result = geocoder.geocode(address)
    if not result:
        return JSONResponse(
            status_code=404,
            content={"error": f"No location data found for address: {address}"}
        )
    latitude = result[0]["geometry"]["lat"]
    longitude = result[0]["geometry"]["lng"]


    # Create a geospatial query to find hotels within 10km with price range
    query = {
        "location": {
            "$nearSphere": {
                "$geometry": {
                    "type": "Point",
                    "coordinates": [longitude, latitude]
                },
                "$maxDistance": 30000  # 10km in meters
            }
        }
    }

    # Add price range conditions if provided
    if price_min or price_max:
        price_conditions = {}
        if price_min:
            price_conditions["$gte"] = float(price_min)
        if price_max:
            price_conditions["$lte"] = float(price_max)
        if price_conditions:
            query["price"] = price_conditions

    # Fetch hotel data from MongoDB using geospatial query
    hotel_data = list(hotel_collection.find(query))

    if not hotel_data:
        return JSONResponse(
            status_code=404,
            content={"error": "No hotels found within 10km of the specified location"}
        )

    # Convert ObjectId to string
    for hotel in hotel_data:
        hotel["_id"] = str(hotel["_id"])

    return JSONResponse(content=hotel_data)

def get_airbnb_data_for_location(request: Request):
    geocoder = OpenCageGeocode(api_key)
    data = request.query_params
    address = data.get("address")
    price_min = data.get("price_min")
    price_max = data.get("price_max")
    if not address:
        return JSONResponse(
            status_code=400,
            content={"error": "Address parameter is required"}
        )
    result = geocoder.geocode(address)
    if not result:
        return JSONResponse(
            status_code=404,
            content={"error": f"No location data found for address: {address}"}
        )
    latitude = result[0]["geometry"]["lat"]
    longitude = result[0]["geometry"]["lng"]


    # Create a geospatial query to find hotels within 10km
    query = {
        "location": {
            "$nearSphere": {
                "$geometry": {
                    "type": "Point",
                    "coordinates": [longitude, latitude]
                },
                "$maxDistance": 30000  # 10km in meters
            }
        }
    }

    # Add price range conditions if provided
    if price_min or price_max:
        price_conditions = {}
        if price_min and int(price_min) > int("0"):
            price_conditions["$gte"] = float(price_min)
        if price_max and int(price_min) > int("0"):
            price_conditions["$lte"] = float(price_max)
        if price_conditions:
            query["price"] = price_conditions

    # Fetch hotel data from MongoDB using geospatial query
    hotel_data = list(airbnb_collection.find(query))

    if not hotel_data:
        return JSONResponse(
            status_code=404,
            content={"error": "No airbnbs found within 30km of the specified location"}
        )

    # Convert ObjectId to string
    for hotel in hotel_data:
        hotel["_id"] = str(hotel["_id"])

    return JSONResponse(content=hotel_data)