import requests
from bs4 import BeautifulSoup
import json
import re
from pymongo import MongoClient
import time
import random
from datetime import datetime, timedelta

"""
NOTE: This code returns null whenever some data is not found in the HTML page. 
So, if you are getting null values, please ensure dates are valid. 
Make sure to handle this appropriately in your frontend code.
"""

user_agents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.113 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:41.0) Gecko/20100101 Firefox/41.0"
]

# Read hotel names from JSON file
with open('page_names.json', 'r') as file:
    hotel_names = json.load(file)

if not hotel_names:
    raise ValueError("No hotel names found in page_names.json")

hotel_names = hotel_names["pageNames"]

# Get current date
current_date = datetime.now()

checkin_date = (current_date + timedelta(7)).strftime('%Y-%m-%d')
checkout_date = (current_date + timedelta(8)).strftime('%Y-%m-%d')

print(f"Check-in date: {checkin_date}")
print(f"Check-out date: {checkout_date}")
for hotel_name in hotel_names:
    print(f"Scraping hotel: {hotel_name}")

    url = f"https://www.booking.com/hotel/pk/{hotel_name}.html?&checkin={checkin_date}&checkout={checkout_date}&group_adults=1&group_children=0"

    headers = {
        "User-Agent": random.choice(user_agents)
    }

    response = requests.get(url, headers=headers).text
    if "Sorry, we couldn't find that page" in response:
        continue
    if "Sorry, we couldn't find any results" in response:
        continue
    soup = BeautifulSoup(response, "html.parser")

    # Hotel title
    title_h2 = soup.find('h2', class_='ddb12f4f86 pp-header__title')
    property_title = title_h2.get_text(strip=True) if title_h2 else None

    # Description paragraphs
    description_div = soup.find('p', {'data-testid': 'property-description'})
    paragraphs = []
    if description_div:
        current_text = ""
        for elem in description_div.children:
            if elem.name == 'b':
                if current_text.strip():
                    paragraphs.append(current_text.strip())
                current_text = f"{elem.get_text(strip=True)}"
            else:
                current_text += f" {elem.strip() if isinstance(elem, str) else elem.get_text(strip=True)}"
        if current_text.strip():
            paragraphs.append(current_text.strip())

    # Images
    photo_wrapper = soup.find('div', {'id': 'photo_wrapper'})
    images = [img['src'] for img in photo_wrapper.find_all('img') if 'src' in img.attrs] if photo_wrapper else []

    # Popular features
    features_ul = soup.find('ul', class_='e9f7361569 eb3a456445 b049f18dec')
    features = [li.get_text(strip=True) for li in features_ul.find_all('li')] if features_ul else []

    # Price and room type
    price_span = soup.find('span', class_='prco-valign-middle-helper')
    price = price_span.get_text(strip=True).replace('PKR', '').replace(',', '').strip() if price_span else None
    if price==None:
        continue
    first_span = soup.find('span', class_='hprt-roomtype-icon-link')
    span_text = first_span.get_text(strip=True) if first_span else None

    # Review info
    no_reviews_banner = soup.find("div", {"data-testid": "no-reviews-banner"})
    if no_reviews_banner:
        review_status = "No reviews yet"
        review_score = None
        review_count = None
    else:
        review_component = soup.find("div", {"data-testid": "review-score-right-component"})
        if review_component:
            score_div = review_component.find("div", class_="f63b14ab7a dff2e52086")
            count_div = review_component.find("div", class_="fff1944c52 fb14de7f14 eaa8455879")
            review_status = "Reviews available"
            review_score = score_div.get_text(strip=True) if score_div else None
            review_count = count_div.get_text(strip=True) if count_div else None
        else:
            review_status = "Unknown"
            review_score = None
            review_count = None

    # Address (only outer text)
    address_div = soup.find('div', class_='b99b6ef58f cb4b7a25d9')
    address = ''.join(address_div.find_all(string=True, recursive=False)).strip() if address_div else None

    # City
    city_input = soup.find('input', attrs={'name': 'ss'})
    city = city_input['value'] if city_input and 'value' in city_input.attrs else None

    # Latitude / Longitude
    latlng_tag = soup.find('a', attrs={'data-atlas-latlng': True})
    latitude = longitude = None
    if latlng_tag:
        latlng = latlng_tag['data-atlas-latlng']
        try:
            latitude, longitude = map(float, latlng.split(','))
        except ValueError:
            pass
    if latitude is None or longitude is None:
        script_tags = soup.find_all('script')
        for script in script_tags:
            script_text = script.string or ''
            if 'booking.env.b_map_center_latitude' in script_text:
                lat_match = re.search(r'booking\.env\.b_map_center_latitude\s*=\s*([0-9.]+)', script_text)
                lon_match = re.search(r'booking\.env\.b_map_center_longitude\s*=\s*([0-9.]+)', script_text)
                if lat_match and lon_match:
                    latitude = float(lat_match.group(1))
                    longitude = float(lon_match.group(1))
                    break

    # Final JSON structure
    data = {
        "name": property_title,
        "page_id": hotel_name,
        "description_paragraphs": paragraphs,
        "image_links": images,
        "most_popular_features": features,
        "price": float(price) if price else None,
        "room_type": span_text,
        "review_status": review_status,
        "review_score": review_score,
        "review_count": review_count,
        "city": city,
        "address": address,
        "location": {
            "type": "Point",
            "coordinates": [
                float(longitude) if longitude else None,
                float(latitude) if latitude else None
            ]   
        }
    }


    # === MongoDB Integration ===
    client = MongoClient("mongodb://localhost:27017/")
    db = client["tourism"]
    collection = db["hotel"]

    # Create compound index for optimized search
    if "location.city_1_cheapest_price_1" not in collection.index_information():
        collection.create_index([("location.city", 1), ("cheapest_price", 1)])

    # Insert into MongoDB
    collection.insert_one(data)
    print("Data inserted into MongoDB successfully.")
    
    time.sleep(random.uniform(1, 3)) # Optional: Sleep for 1-3 seconds to avoid overwhelming the server
