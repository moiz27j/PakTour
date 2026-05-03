from dotenv import load_dotenv
import os 

load_dotenv()


# places_api_key = os.getenv("google_places_api_key")

# import googlemaps

# # Initialize Google Maps client with your API key
# gmaps = googlemaps.Client(key=places_api_key)

# # Example: Search for places in Lahore (this could include landmarks like the Badshahi Mosque)
# place_result = gmaps.places(query="restaurant in Lahore")

# # Print the results
# if place_result['status'] == 'OK':
#     for place in place_result['results']:
#         print(f"Name: {place['name']}")
#         print(f"Address: {place['formatted_address']}")
#         print(f"Rating: {place.get('rating', 'N/A')}")
#         print(f"Types: {', '.join(place['types'])}")
#         print('---')
# else:
#     print("No results found")


# from chatbot.chatbot_chaining import *

# response = get_destination("lahore")

# template = response["template"]
# status = response["status"]
# message = response["message"]
# print(template)

# response = validate("Is {user_input} a valid destination, ONLY RETURN TRUE OR FALSE STRICTLY","lahore")
# print(response)