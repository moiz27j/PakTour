import pyairbnb
import time
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['tourism']
collection = db['airbnb_listings']

collection.create_index([("location", "2dsphere")])

bbox = {
    1: [
        31.1822055230568,     # North-East latitude
        69.3733308570757,     # North-East longitude
        23.972537318672742,   # South-West latitude
        62.96370536028036,    # South-West longitude
        6.656279531755003     # Zoom level for the map
    ],
    2: [30.840803148058324,
        69.82420907964459,
        27.412476097201747,
        66.73392371751456,
        7.708779531755002
    ],
    3:[
        31.82353173924951,
        71.15428401001509,
        27.885382731585416,
        67.57854840593944,
        7.498279531755002
    ],
    4:[
        32.690786781751534,
        73.10438763380304,
        28.788032063859088,
        69.5286520297274,
        7.498279531755002
    ],
    5:[
        34.92956969705334,
        74.2725145026132,
        30.50977218236199,
        70.13506969996192,
        7.287779531755002
    ],
    6:[
        33.2305322074719,
        74.46461315561871,
        31.085542040459714,
        72.46981874576636,
        8.340279531755002
    ],
    7:[
        34.18351921371534,
        72.23587554070869,
        32.60342978363051,
        70.74595017390376,
        8.761279531755001
    ],
    8:[
        34.93556985371869,
        74.01572578377667,
        32.497069876407785,
        71.70757085364315,
        8.129779531755002
    ],
    9:[
        34.23340630162818,
        73.56604395433342,
        33.47562593181909,
        72.84770330338503,
        9.813779531755
    ],
    10:[
        33.93473712812315,
        73.94980397556577,
        33.16765894525317,
        73.22521233591686,
        9.801279531755
    ],
    11:[
        34.42641913812847,
        73.87886086899758,
        33.66375448813289,
        73.1542692293487,
        9.801279531755
    ],
    12:[
        34.85820099482114,
        73.74735611574013,
        33.97964335053411,
        72.9089390051202,
        9.590779531755
    ],
    13:[
        35.624923317403464,
        72.9867181342388,
        34.27260236848514,
        71.6878634194313,
        8.959279531755001
    ],
    14:[
        36.44141445162456,
        72.82770229000411,
        35.28586549173783,
        71.70518313390994,
        9.169779531755001
    ],
    15:[
        36.461104014140936,
        74.46644883199446,
        34.37836331122582,
        72.45429575352247,
        8.327779531755002,
        8.327779531755002
    ],
    16:[
        36.96990893499874,
        75.66542102691602,
        34.570614269410584,
        73.3371805699947,
        8.117279531755003
    ],
    17:[
        36.82046406234736,
        74.85640505100196,
        35.27701513918837,
        73.35351437780619,
        8.748779531755002
    ],
    18:[
        36.85190679248245,
        75.50857002196773,
        35.520310774858096,
        74.20971530716022,
        8.959279531755001
    ],
    19:[
        36.256259650035986,
        76.20442976947237,
        34.701715513035175,
        74.70153909627663,
        8.748779531755002
    ],
    20:[
        35.917117842685215,
        76.68671515887797,
        34.75391790482458,
        75.56419600278383,
        9.169779531755001
    ]
}
for key in bbox:
    # Define search parameters
    currency = "PKR"             # Currency for the search
    check_in = "2025-10-01"      # Check-in date
    check_out = "2025-10-02"     # Check-out date
    ne_lat = bbox[key][0]        # North-East latitude
    ne_long = bbox[key][1]       # North-East longitude
    sw_lat = bbox[key][2]        # South-West latitude
    sw_long = bbox[key][3]       # South-West longitude
    zoom_value = bbox[key][4]    # Zoom level for the map
    price_min = 0                # Minimum price for the listing
    price_max = 0                # Maximum price (0 means no maximum)
    place_type = ""              # or "Entire home/apt" or empty
    amenities = []               # Example: Filter for listings with WiFi and Pool or leave empty
    language = ""                # Language preference

    # Search listings within specified coordinates and date range
    search_results = pyairbnb.search_all(check_in, check_out, ne_lat, ne_long, sw_lat, sw_long, 
                                        zoom_value, currency, place_type, price_min, price_max, 
                                        amenities, language, "")
    

    # Iterate over each listing in search_results
    for search_result in search_results:
        # Transform the data for each listing
        transformed_data = {
            # exclude unwanted fields
            "page_id": str(search_result['room_id']),  # rename room_id and convert to string
            "name": search_result['title'],
            "badges": search_result['badges'],
            "category": search_result['category'],
            "price": {search_result['price']['unit']['amount']},  # simplified price with dollar symbol
            "review_score": search_result['rating']['value'],
            "review_count": search_result['rating']['reviewCount'],
            "reviews_status": "No reviews yet" if search_result['rating']['reviewCount'] == 0 else "Reviews available",
            "city": search_result['title'].split()[-1],  # take the last word from title
            "image_links": [img['url'] for img in search_result['images']],  # extract only URLs from images
            "location": {
            "type": "Point",
            "coordinates": [
                search_result['coordinates']['longitud'],
                search_result['coordinates']['latitude']
            ]
            },
        }

        # Update or insert the document based on page_id
        try:
            collection.update_one(
                {"page_id": transformed_data["page_id"]},
                {"$set": transformed_data},
                upsert=True
            )
        except Exception as e:
            print(f"Failed to update MongoDB for page_id {transformed_data['page_id']}: {e}")



    time.sleep(2)  # Sleep for 4 seconds to avoid hitting the server too hard