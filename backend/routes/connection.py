from pymongo import MongoClient
from upstash_redis import Redis


from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

# Print MONGO_URL and REDIS_URL to ensure they are being loaded correctly
MONGO_URL = os.getenv('MONGO_URL')
REDIS_URL = os.getenv('REDIS_URL')
REDIS_TOKEN = os.getenv('REDIS_TOKEN')
# MongoDB connection
mongo_client = MongoClient(MONGO_URL, maxPoolSize=100, minPoolSize=10, serverSelectionTimeoutMS=5000)


mongo_db = mongo_client['tourism']
# Create collections with indexes
airbnb_collection = mongo_db["air_bnb"]
hotel_collection = mongo_db["hotel"]



def ensure_indexes():
    if "location_2dsphere" not in hotel_collection.index_information():
        hotel_collection.create_index([("location", "2dsphere")], name="location_2dsphere")
    if "location_2dsphere" not in airbnb_collection.index_information():
        airbnb_collection.create_index([("location", "2dsphere")], name="location_2dsphere")
    if "price_1" not in airbnb_collection.index_information():
        airbnb_collection.create_index([("price", 1)], name="price_1")
    if "price_1" not in hotel_collection.index_information():
        hotel_collection.create_index([("price", 1)], name="price_1")

    

# Redis connection with pooling
if not REDIS_URL:
    raise ValueError("REDIS_URL is not set in your environment variables")

redis_client =Redis(url=REDIS_URL, token=REDIS_TOKEN)


