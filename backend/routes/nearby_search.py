from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from typing import Optional
import json
from routes.connection import mongo_db, redis_client

# Valid collections list
COLLECTIONS = [
    "tourist_attraction",
    "zoo",
    "movie_theater",
    "museum",
    "park",
    "mosque",
    "shopping_mall",
    "church"
]

async def get_data(request: Request):
    try:
        data = await request.json()
        collection_name = data.get("collection")
        city = data.get("city")

        if not collection_name or not city:
            return JSONResponse(status_code=400, content={"error": "Both collection and city are required"})

        if collection_name not in COLLECTIONS:
            return JSONResponse(status_code=400, content={"error": f"Invalid collection: {collection_name}"})

        cache_key = f"{collection_name}:{city.lower()}"

        # Try to get from Redis cache
        cached_data = redis_client.get(cache_key)
        if cached_data:
            print(f"Cache hit for {cache_key}")
            return JSONResponse(content=json.loads(cached_data))

        print(f"Cache miss for {cache_key}, querying MongoDB...")

        collection = mongo_db[collection_name]
        query = {"city": {"$regex": f"^{city}$", "$options": "i"}}
        projection = {
            "place_id": 1,
            "name": 1,
            "types": 1,
            "location": 1,
            "address": 1,
            "rating": 1,
            "user_ratings_total": 1,
            "open_now": 1,
            "photo_reference": 1,
            "icon": 1,
            "business_status": 1,
            "price_level": 1,
            "city": 1
        }

        results = list(collection.find(query, projection))
        for result in results:
            result["_id"] = str(result["_id"])

        # Store in cache for 1 hour
        redis_client.setex(cache_key, 3600, json.dumps(results))

        return JSONResponse(content=results)

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Server error: {str(e)}"})


def get_data_sync(collection_name: str, city: str):
    try:
        # Validate inputs
        if not collection_name or not city:
            return {"error": "Both collection and city are required"}

        if collection_name not in COLLECTIONS:
            return {"error": f"Invalid collection: {collection_name}"}

        # Get collection and query data
        collection = mongo_db[collection_name]
        query = {"city": {"$regex": f"^{city}$", "$options": "i"}}
        
        # Project only required fields
        projection = {
            "place_id": 1,
            "name": 1,
            "types": 1,
            "location": 1,
            "address": 1,
            "rating": 1,
            "user_ratings_total": 1,
            "open_now": 1,
            "photo_reference": 1,
            "icon": 1,
            "business_status": 1,
            "price_level": 1,
            "city": 1
        }

        # Find documents
        results = list(collection.find(query, projection))

        # Convert ObjectId to string
        for result in results:
            result["_id"] = str(result["_id"])

        return results

    except Exception as e:
        return {"error": f"Server error: {str(e)}"}