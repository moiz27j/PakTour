from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
from routes.connection import mongo_db, redis_client
from flights_main.fast_flights import FlightData, Passengers, Result, get_flights



# app = FastAPI()


# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"], 
#     allow_credentials=True,
#     allow_methods=["GET", "POST", "OPTIONS"],  
#     allow_headers=["*"],
# )

async def options_flight():
    return JSONResponse(
        status_code=200,
        content={"message": "OK"}
    )

async def flight(request: Request):
    try:
        data = await request.json()
        response = data.get("user_input")
        if response is None:
            raise HTTPException(status_code=400, detail="Missing 'user_input' in request.")

        date = response.get("date")
        from_airport = response.get("from_airport")
        to_airport = response.get("to_airport")

        if not all([date, from_airport, to_airport]):
            raise HTTPException(status_code=400, detail="Incomplete flight data.")

        cache_key = f"flights:{from_airport}:{to_airport}:{date}"
        cached_data = redis_client.get(cache_key)
        if cached_data:
            return JSONResponse(content=json.loads(cached_data))

        result = get_flights(
            flight_data=[FlightData(date=date, from_airport=from_airport, to_airport=to_airport)],
            trip="one-way",
            seat="economy",
            passengers=Passengers(adults=1, children=0, infants_in_seat=0, infants_on_lap=0),
            fetch_mode="fallback",
        )

        flights_data = [
            {
                "is_best": f.is_best,
                "name": f.name,
                "departure": f.departure,
                "arrival": f.arrival,
                "arrival_time_ahead": f.arrival_time_ahead,
                "duration": f.duration,
                "stops": f.stops,
                "delay": f.delay,
                "price": f.price,
            }
            for f in result.flights
        ]
        redis_client.setex(cache_key, 3600, json.dumps(flights_data))
        return JSONResponse(content=flights_data)

    except Exception as e:
        print(f"Flight API error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def fetch_flight_details(from_airport: str, to_airport: str, date: str):
    result: Result = get_flights(
        flight_data=[
            FlightData(date=date, from_airport=from_airport, to_airport=to_airport)
        ],
        trip="one-way",
        seat="economy",
        passengers=Passengers(adults=2, children=1, infants_in_seat=0, infants_on_lap=0),
        fetch_mode="fallback",
    )
    return {
        "flights": result.flights,
        "current_price": result.current_price
    }