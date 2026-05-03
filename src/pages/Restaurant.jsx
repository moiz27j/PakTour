import React, { useState } from 'react';
import styles from './restaurant.module.css';
import { Search, MapPin, Star, Coffee, Utensils } from 'lucide-react';

// WORKS BUT API KEY IS LEAKED .. 

// FIX :: 
/*

*/
const Restaurant = () => {
  const [city, setCity] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearched, setIsSearched] = useState(false);

  //const API_KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;

  const REACT_APP_API_URL = process.env.REACT_APP_API_BASE_URL;

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleSearch = async () => {
    if (!city.trim()) return;
    
    setIsLoading(true);
    setIsSearched(true);
    
    try {
      const response = await fetch(REACT_APP_API_URL+'/restaurant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city }),
      });
      
      const data = await response.json();
      setRestaurants(data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Function to get icon based on restaurant type
  const getTypeIcon = (type) => {
    if (type.toLowerCase().includes('cafe')) return <Coffee className={styles.typeIcon} />;
    return <Utensils className={styles.typeIcon} />;
  };

  return (
    <div className={styles.restaurantContainer}>
      <div className={styles.searchSection}>
        <h1>Discover Amazing Restaurants</h1>
        <p className={styles.subtitle}>Find the best dining experiences in your city</p>
        
        <div className={styles.searchBox}>
          <input
            type="text"
            value={city}
            onChange={handleCityChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter city name..."
            className={styles.searchInput}
          />
          <button onClick={handleSearch} className={styles.searchButton}>
            <Search size={20} />
            <span>Search</span>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Finding restaurants in {city}...</p>
        </div>
      )}

      {!isLoading && isSearched && restaurants.length === 0 && (
        <div className={styles.noResults}>
          <p>No restaurants found in {city}. Try another city!</p>
        </div>
      )}

      {!isLoading && restaurants.length > 0 && (
        <div className={styles.resultsContainer}>
          <h2>Restaurants in {city}</h2>
          <p className={styles.resultCount}>Found {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}</p>
          
          <div className={styles.restaurantsGrid}>
            {restaurants.map((restaurant) => (
              <div key={restaurant._id} className={styles.restaurantCard}>
                <div className={styles.cardImage}>
                  {restaurant.image ? (
                    <>
                    <img
                      src={`${REACT_APP_API_URL}/place-photo?photo_reference=${restaurant.image}`}
                      alt={restaurant.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        const fallback = REACT_APP_API_URL+'/random-photo';
                        if(e.target.src !== fallback){
                          e.target.src=fallback;
                        }
                      }}
                    />
                  </>
                  ) : (
                    <div className={styles.placeholderImage}>
                      <Utensils size={40} />
                    </div>
                  )}
                  <div className={styles.rating}>
                    <Star className={styles.starIcon} size={16} />
                    <span>{restaurant.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <div className={styles.cardContent}>
                  <h3>{restaurant.name}</h3>
                  <div className={styles.address}>
                    <MapPin size={16} className={styles.pinIcon} />
                    <p>{restaurant.address}</p>
                  </div>
                  
                  {restaurant.types && restaurant.types.length > 0 && (
                    <div className={styles.typesContainer}>
                      {restaurant.types.slice(0, 3).map((type, index) => (
                        <span key={index} className={styles.typeBadge}>
                          {getTypeIcon(type)}
                          {type}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurant;
