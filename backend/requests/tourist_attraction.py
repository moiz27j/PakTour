import requests
from settings import google_places_api_key,GEO_CODE_URL,NEARBY_SEARCH_URL


def location_to_cordinates(location):
    """
    - TAKES IN INPUT CITY OR LOCATION 
    - CONVERTS IT INTO COORDINATES
    - RETURN CORRDINATES

    """
    params = {
        "address" : location,
        "key"     : google_places_api_key
    }

    response = requests.get(url=GEO_CODE_URL,params=params)
    data = response.json()

    if response.status_code == 200 and "results" in data:
        cords = data["results"][0]["geometry"]["location"]
        lattitude = cords["lat"]
        longitude = cords["lng"]

    return lattitude,longitude



def get_tourist_attractions(location):
    """
    -- CALLS THE LOCATION_TO_CORD AND RETURNS TOURIST ATTRACTION 
    """

    

    lat,lng = location_to_cordinates(location)
    
    params = {
        "location" : f"{lat},{lng}",
        "radius"   : 5000,
        "type"     : "tourist_attraction",
        "key" : google_places_api_key

        }
    
    response = requests.get(NEARBY_SEARCH_URL,params=params)

    data = response.json()

    """
            OUTPUT PARAMS:
                'business_status', 'geometry', 'icon', 'icon_background_color',
                'icon_mask_base_uri', 'name', 'opening_hours', 'photos', 'place_id',
                'plus_code', 'rating', 'reference', 'scope', 'types', 'user_ratings_total',
                 'vicinity']
    """
    if response.status_code == 200 and "results" in data:
        return data["results"]

    


def get_type(location,type):
    """
    -- CALLS THE LOCATION_TO_CORD AND RETURNS TOURIST ATTRACTION 
    """

    

    lat,lng = location_to_cordinates(location)
    
    params = {
        "location" : f"{lat},{lng}",
        "radius"   : 5000,
        "type"     : f"{type}",
        "key" : google_places_api_key

        }
    
    response = requests.get(NEARBY_SEARCH_URL,params=params)

    data = response.json()

   
    if response.status_code == 200 and "results" in data:
        return data["results"]
    

# data = get_type("islamabad","movie_theater")

# for d in data:
#     print(d.get('name'))

