/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from 'react';
import styles from './nearbysearch.module.css';

const REACT_APP_API_URL = process.env.REACT_APP_API_BASE_URL;
const NearbySearch = () => {
  const [city, setCity] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('tourist_attraction');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activePlace, setActivePlace] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const collections = [
    { id: "tourist_attraction", name: "Tourist Attractions", icon: "🏛️" },
    { id: "park", name: "Parks", icon: "🌳" },
    { id: "shopping_mall", name: "Shopping Malls", icon: "🛍️" },
    { id: "zoo", name: "Zoos", icon: "🦁" },
    { id: "museum", name: "Museums", icon: "🖼️" },
    { id: "movie_theater", name: "Movie Theaters", icon: "🎬" },
    { id: "mosque", name: "Mosques", icon: "🕌" },
    { id: "church", name: "Churches", icon: "⛪" },
  ];

  const fetchPlaces = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }
  
    setLoading(true);
    setError(null);
    setSearchPerformed(true);
    
    try {
      const response = await fetch(REACT_APP_API_URL+'/get-data', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          collection: selectedCollection,
          city: city.trim()
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response from server");
      }
  
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setPlaces(data);
        setActivePlace(null);
      } else {
        throw new Error("Received invalid data format");
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Failed to fetch data: ${err.message}`);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchPlaces();
  };

  const getStarRating = (rating) => {
    if (!rating) return <span className={styles.no-rating}>No ratings yet</span>;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className={`${styles.star} ${styles.full}`}>★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className={`${styles.star} ${styles.half}`}>★</span>);
      } else {
        stars.push(<span key={i} className={`${styles.star} ${styles.empty}`}>☆</span>);
      }
    }
    
    
    return (
      <div className={styles.star_rating}>
        {stars} <span className={styles.rating_number}>({rating})</span>
      </div>
    );
  };

  const getPriceLevel = (level) => {
    if (level === undefined) return <span className={styles.price_not_available}>Price not available</span>;
    
    const symbols = [];
    for (let i = 0; i < 4; i++) {
      if (i < level) {
        symbols.push(<span key={i} className={`${styles.price_symbol} ${styles.active}`}>$</span>);
      } else {
        symbols.push(<span key={i} className={styles.price_symbol}>$</span>);
      }
    }
    
    return <div className={styles.price_level}>{symbols}</div>;
  };

  const showPlaceDetails = (place) => {
    setActivePlace(place);
    document.body.classList.add('modal_open');
  };

  const closePlaceDetails = () => {
    setActivePlace(null);
    document.body.classList.remove('modal_open');
  };

  // Get the current collection name for display
  const getCurrentCollectionName = () => {
    const collection = collections.find(c => c.id === selectedCollection);
    return collection ? collection.name : "Places";
  };

  const getCurrentCollectionIcon = () => {
    const collection = collections.find(c => c.id === selectedCollection);
    return collection ? collection.icon : "🌍";
  };

  return (
    <div className={styles.wanderlust_app}>
      <div className={styles.parallax_header}>
        <div className={styles.header_content}>
          <h1 className={styles.app_title}>Wander<span>Lust</span></h1>
          <p className={styles.app_tagline}>Unveil the extraordinary in every corner of the world</p>
          
          <div className={styles.search_container}>
            <form onSubmit={handleSubmit} className={styles.search_form}>
              <div className={styles.input_wrapper}>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Where to next? Enter a city..."
                  className={styles.city_input}
                />
                <button type="submit" className={styles.search_button}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className={styles.category_nav_container}>
        <div className={styles.category_scroll}>
          {collections.map((collection) => (
            <button
              key={collection.id}
              className={`${styles['category_button']} ${selectedCollection === collection.id ? styles.active : ''}`}
              onClick={() => {
                setSelectedCollection(collection.id);
                if (searchPerformed && city) fetchPlaces();
              }}
            >
              <span className={styles.category_icon}>{collection.icon}</span>
              <span className={styles.category_name}>{collection.name}</span>
            </button>
          ))}
        </div>
      </div>

      <main className={styles.main_content}>
        {loading && (
          <div className={styles.loading_container}>
            <div className={styles.loading_animation}>
              <div className={`${styles.dot} ${styles.dot1}`}></div>
              <div className={`${styles.dot} ${styles.dot2}`}></div>
              <div className={`${styles.dot} ${styles.dot3}`}></div>
            </div>
            <p>Discovering amazing places...</p>
          </div>
        )}

        {error && (
          <div className={styles.error_message}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>{error}</p>
          </div>
        )}

        {!loading && places.length > 0 && (
          <div className={styles.results_section}>
            <div className={styles.results_header}>
              <h2>{getCurrentCollectionIcon()} {getCurrentCollectionName()} in <span className={styles.highlight_city}>{city}</span></h2>
              <p className={styles.results_count}>{places.length} places found</p>
            </div>
            
            <div className={styles.places_grid}>
              {places.map((place) => (
                <div 
                  key={place.place_id} 
                  className={styles.place_card}
                  onClick={() => showPlaceDetails(place)}
                >
                  <div className={styles.place_image}>
                    {place.photo_reference ? (
                      <img 
                        src={`${REACT_APP_API_URL}/place-photo?photo_reference=${place.photo_reference}`} 
                        alt={place.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          const fallback ="/api/placeholder/400/300";
                          if(e.target.src !== fallback){
                            e.target.src=fallback;
                          }
                        }}
                      />
                    ) : (
                      <img src="/api/placeholder/400/300" alt="No image available" />
                    )}
                    {place.open_now !== undefined && (
                      <div className={`${styles['status_indicator']} ${place.open_now ? styles.open : styles.closed}`}>
                        {place.open_now ? 'Open Now' : 'Closed'}
                      </div>
                    )}
                  </div>
                  <div className={styles.place_content}>
                    <h3 className={styles.place_name}>{place.name}</h3>
                    <p className={styles.place_address}>{place.address}</p>
                    <div className={styles.place_stats}>
                      <div className={styles.rating_container}>
                        {getStarRating(place.rating)}
                        <span className={styles.reviews_count}>({place.user_ratings_total || 0})</span>
                      </div>
                      <div className={styles.price_container}>
                        {getPriceLevel(place.price_level)}
                      </div>
                    </div>
                    <div className={styles.view_details}>
                      <span>View Details</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && places.length === 0 && searchPerformed && !error && (
          <div className={styles.no_results}>
            <div className={styles.no_results_illustration}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </div>
            <h3>No {getCurrentCollectionName().toLowerCase()} found in {city}</h3>
            <p>Try searching for a different city or category</p>
          </div>
        )}
        
        {!searchPerformed && !loading && (
          <div className={styles.welcome_section}>
            <div className={styles.welcome_illustration}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>
            <h2>Begin Your Journey</h2>
            <p>Enter a city name and choose a category to discover amazing places around the world</p>
            <div className={styles.welcome_tips}>
              <div className={styles.tip}>
                <div className={styles.tip_icon}>🌎</div>
                <div className={styles.tip_text}>Search any city worldwide</div>
              </div>
              <div className={styles.tip}>
                <div className={styles.tip_icon}>🔍</div>
                <div className={styles.tip_text}>Explore 8 different categories</div>
              </div>
              <div className={styles.tip}>
                <div className={styles.tip_icon}>📍</div>
                <div className={styles.tip_text}>View details and locations</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {activePlace && (
        <div className={styles.modal_overlay} onClick={closePlaceDetails}>
          <div className={styles.place_modal} onClick={e => e.stopPropagation()}>
            <button className={styles.close_modal} onClick={closePlaceDetails}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className={styles.modal_image}>
              {activePlace.photo_reference ? (
                <img 
                  src={`${REACT_APP_API_URL}/place-photo?photo_reference=${activePlace.photo_reference}`}
                  alt={activePlace.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/api/placeholder/800/500";
                  }}
                />
              ) : (
                <img src="/api/placeholder/800/500" alt="No image available" />
              )}
            </div>
            
            <div className={styles.modal_content}>
              <h2 className={styles.modal_title}>{activePlace.name}</h2>
              
              <div className={styles.modal_stats}>
                <div className={styles.modal_rating}>
                  {getStarRating(activePlace.rating)}
                  <span className={styles.modal_reviews}>({activePlace.user_ratings_total || 0} reviews)</span>
                </div>
                
                {activePlace.price_level !== undefined && (
                  <div className={styles.modal_price}>
                    {getPriceLevel(activePlace.price_level)}
                  </div>
                )}
              </div>
              
              <div className={styles.modal_info}>
                <div className={styles.info_item}>
                  <div className={styles.info_icon}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div className={styles.info_text}>
                    <span className={styles.info_label}>Address</span>
                    <span className={styles.info_value}>{activePlace.address}</span>
                  </div>
                </div>
                
                {activePlace.business_status && (
                  <div className={styles.info_item}>
                    <div className={styles.info_icon}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                    <div className={styles.info_text}>
                      <span className={styles.info_label}>Status</span>
                      <span className={`${styles["info_value"]} ${styles[`status_${activePlace.business_status.toLowerCase()}`]}`}>
                        {activePlace.business_status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                )}
                
                {activePlace.open_now !== undefined && (
                  <div className={styles.info_item}>
                    <div className={styles.info_icon}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <div className={styles.info_text}>
                      <span className={styles.info_label}>Currently</span>
                      <span className={`${styles["info_value"]} ${activePlace.open_now ? styles["status_open"] : styles["status_closed"]}`}>
                        {activePlace.open_now ? 'Open Now' : 'Closed'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {activePlace.types && activePlace.types.length > 0 && (
                <div className={styles.modal_tags}>
                  <h4>Place Types</h4>
                  <div className={styles.tags_container}>
                    {activePlace.types.map((type, index) => (
                      <span key={index} className={styles.place_tag}>
                        {type.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {activePlace.location && (
                <div className={styles.modal_actions}>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${activePlace.location.lat},${activePlace.location.lng}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.map_link}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                      <line x1="8" y1="2" x2="8" y2="18"></line>
                      <line x1="16" y1="6" x2="16" y2="22"></line>
                    </svg>
                    View on Map
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className={styles.app_footer}>
        <div className={styles.footer_content}>
          <p className={styles.copyright}>© {new Date().getFullYear()} WanderLust | Discover the world, one place at a time</p>
          <div className={styles.footer_links}>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NearbySearch;
