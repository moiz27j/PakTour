from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from routes.flight_routes import options_flight,flight
from routes.restaurant_api import place_photo,random_photo,restaurant
from routes.nearby_search import get_data
from routes.hotel_search import get_hotel_data_for_location,get_airbnb_data_for_location
from chatbot.chatbot_chaining import chat,reset_conversation
from routes.connection import ensure_indexes
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    ensure_indexes()
    yield

app = FastAPI(lifespan=lifespan)

# Middleware for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


## FLIGHT_ROUTES ROUTERS
app.add_api_route("/flight",endpoint=flight,methods=["POST"])

## RESTAURANT_API ROUTERS
app.add_api_route("/place-photo",endpoint=place_photo,methods = ["GET"])
app.add_api_route("/random-photo",endpoint=random_photo,methods=["GET"])
app.add_api_route("/restaurant",endpoint=restaurant,methods=["POST"])

## NEARBY SEARCH
app.add_api_route("/get-data",endpoint=get_data,methods=["POST","GET"])

## CHATBOT_CHAINING ROUTERS
app.add_api_route("/chat",endpoint=chat,methods=["POST"])
app.add_api_route("/reset",endpoint=reset_conversation,methods=["POST"])

## HOTELS
app.add_api_route("/get-hotels",endpoint=get_hotel_data_for_location,methods=["GET"])
app.add_api_route("/get-airbnbs",endpoint=get_airbnb_data_for_location,methods=["GET"])


if __name__ == "__main__":
    uvicorn.run(app,host = "0.0.0.0",port = 8000)