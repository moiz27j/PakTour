import React, { useState, useEffect, useRef } from 'react';
import './journey_curator.css';
const REACT_APP_API_URL = process.env.REACT_APP_API_BASE_URL;

// Message component for chat bubbles
const Message = ({ message, sender }) => {
  return (
    <div className={`message ${sender}`}>
      <div className="message-content">
        {message}
      </div>
    </div>
  );
};

// Typing indicator component
const TypingIndicator = () => {
  return (
    <div className="message bot">
      <div className="message-content typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

// Trip summary card components
const FlightCard = ({ flight }) => {
  return (
    <div className="summary-card flight-card">
      <div className="card-header">
        <i className="fa-solid fa-plane"></i>
        <h3>{flight.name || "Flight"}</h3>
        {flight.is_best && <span className="best-badge">Best Value</span>}
      </div>
      <div className="card-content">
        <div className="flight-time">
          <div className="departure">
            <span className="time">{flight.departure || "N/A"}</span>
          </div>
          <div className="flight-duration">
            <span className="duration-line"></span>
            <span>{flight.duration || "N/A"}</span>
          </div>
          <div className="arrival">
            <span className="time">{flight.arrival || "N/A"}</span>
          </div>
        </div>
        <div className="flight-details">
          <p><strong>Stops:</strong> {flight.stops || "Direct"}</p>
          <p className="price"><strong>Price:</strong> ${flight.price || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="summary-card restaurant-card">
      <div className="card-header">
        <i className="fa-solid fa-utensils"></i>
        <h3>{restaurant.name || "Restaurant"}</h3>
      </div>
      <div className="card-content">
        <div className="restaurant-image">
          {restaurant.image ? 
            <img
            src={`${REACT_APP_API_URL}/place-photo?photo_reference=${restaurant.image}`}
            alt={restaurant.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `${REACT_APP_API_URL}/random-photo`;
            }}
          /> : 
            <div className="placeholder-img">No Image</div>
          }
        </div>
        <div className="restaurant-details">
          <p><strong>Address:</strong> {restaurant.address || "N/A"}</p>
          <p><strong>Cuisine:</strong> {restaurant.types?.join(", ") || "Various"}</p>
          <div className="rating">
            <strong>Rating:</strong> 
            <span className="stars">{renderStars(restaurant.rating || 0)}</span>
            <span className="rating-value">({restaurant.rating || "N/A"})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AttractionCard = ({ attraction }) => {
  return (
    <div className="summary-card attraction-card">
      <div className="card-header">
        <i className="fa-solid fa-landmark"></i>
        <h3>{attraction.name || "Attraction"}</h3>
      </div>
      <div className="card-content">
        <div className="attraction-image">
          {attraction.photo_reference ? 
            <img
            src={`${REACT_APP_API_URL}/place-photo?photo_reference=${attraction.photo_reference}`}
            alt={attraction.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `${REACT_APP_API_URL}/random-photo`;
            }}
          /> : 
            <div className="placeholder-img">No Image</div>
          }
        </div>
        <div className="attraction-details">
          <p><strong>Address:</strong> {attraction.address || "N/A"}</p>
          <p><strong>Type:</strong> {attraction.types?.join(", ") || "Tourist Spot"}</p>
          <div className="rating">
            <strong>Rating:</strong>
            <span className="stars">{renderStars(attraction.rating || 0)}</span>
            <span className="rating-value">({attraction.rating || "N/A"}) from {attraction.user_ratings_total || 0} reviews</span>
          </div>
          {attraction.open_now !== undefined && 
            <p className={`open-status ${attraction.open_now ? "open" : "closed"}`}>
              {attraction.open_now ? "Open Now" : "Closed"}
            </p>
          }
        </div>
      </div>
    </div>
  );
};


// Helper function to render star ratings
const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<i key={i} className="fas fa-star"></i>);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<i key={i} className="fas fa-star-half-alt"></i>);
    } else {
      stars.push(<i key={i} className="far fa-star"></i>);
    }
  }
  
  return stars;
};

// Main App component
function Chat() {
  // Existing state
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState('destination');
  const [tripSummary, setTripSummary] = useState(null);
  const [flights, setFlights] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Initialize session with backend
        const response = await fetch(`${REACT_APP_API_URL}/chat/init`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        const data = await response.json();
        if (data.sessionId) {
          setSessionId(data.sessionId);
          setIsSessionActive(true);
        }
        
        // Show initial bot message
        handleBotResponse("Hello! I can help you plan your trip. Please tell me your destination.");
      } catch (error) {
        console.error('Error initializing session:', error);
        handleBotResponse("Sorry, I couldn't start a new session. Please try refreshing the page.");
      }
    };

    initializeSession();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !isSessionActive) return;
    
    const userMessage = inputText.trim();
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInputText('');
    setIsTyping(true);
    
    try {
      const response = await fetch(`${REACT_APP_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId
        },
        body: JSON.stringify({ 
          user_input: userMessage,
          session_id: sessionId
        }),
      });
      
      const data = await response.json();
      
      if (data.session_expired) {
        setIsSessionActive(false);
        handleBotResponse("Your session has expired. Please start a new conversation.");
        return;
      }
      
      // Rest of your existing handleSubmit logic
      if (data.step) {
        setCurrentStep(data.step);
      }
      
      if (data.trip_summary) {
        setTripSummary(data.trip_summary);
        setFlights(data.flights || []);
        setRestaurants(data.restaurants || []);
        setAttractions(data.tourist_attractions || []);
        setShowSummary(true);
      }

      setTimeout(() => {
        setIsTyping(false);
        if (!data.trip_summary) {
          handleBotResponse(data.message);
        }
      }, 1000 + Math.random() * 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      handleBotResponse("Sorry, I encountered an error. Please try again.");
    }
  };
  
  // Add bot message to chat
  const handleBotResponse = (message) => {
    setMessages(prev => [...prev, { text: message, sender: 'bot' }]);
  };
  
  // Reset the conversation
  const handleReset = async () => {
    try {
      const response = await fetch(`${REACT_APP_API_URL}/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId
        }
      });
      
      const data = await response.json();
      
      // Reset all states
      setMessages([]);
      setCurrentStep('destination');
      setTripSummary(null);
      setFlights([]);
      setRestaurants([]);
      setAttractions([]);
      setShowSummary(false);
      
      // Get new session ID
      if (data.sessionId) {
        setSessionId(data.sessionId);
        setIsSessionActive(true);
      }
      
      setTimeout(() => {
        handleBotResponse(data.message);
      }, 500);
      
    } catch (error) {
      console.error('Error resetting conversation:', error);
      handleBotResponse("Sorry, I couldn't reset the conversation. Please refresh the page.");
    }
  };


  return (
    <div className="app-container">
      <div className="chat-container">
        <div className="chat-header">
          <h1>Travel Planner Bot</h1>
          <button className="reset-button" onClick={handleReset}>
            <i className="fas fa-redo"></i> New Trip
          </button>
        </div>
        
        <div className="chat-messages">
          {messages.map((message, index) => (
            <Message key={index} message={message.text} sender={message.sender} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={chatEndRef} />
        </div>
        
        <form className="chat-input" onSubmit={handleSubmit}>
          <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder={showSummary ? "Ask anything about your trip..." : `Enter your ${currentStep}...`}
        disabled={false}
          />
      <button type="submit" disabled={!inputText.trim()}>
        <i className="fas fa-paper-plane"></i>
      </button>
        </form>
      </div>
      
      {showSummary && (
        <div className="summary-container">
          <div className="summary-header">
            <h2>Your Trip Summary</h2>
          </div>
          
          <div className="summary-text">
            <p>{tripSummary}</p>
          </div>
          
          <div className="summary-section">
            <h3>
              <i className="fas fa-plane"></i> Available Flights
            </h3>
            <div className="cards-container">
              {flights.length > 0 ? (
                flights.map((flight, index) => (
                  <FlightCard key={index} flight={flight} />
                ))
              ) : (
                <p className="no-data">No flight information available</p>
              )}
            </div>
          </div>
          
          <div className="summary-section">
            <h3>
              <i className="fas fa-utensils"></i> Recommended Restaurants
            </h3>
            <div className="cards-container">
              {restaurants.length > 0 ? (
                restaurants.slice(0, 6).map((restaurant, index) => (
                  <RestaurantCard key={index} restaurant={restaurant} />
                ))
              ) : (
                <p className="no-data">No restaurant information available</p>
              )}
            </div>
          </div>
          
          <div className="summary-section">
            <h3>
              <i className="fas fa-landmark"></i> Tourist Attractions
            </h3>
            <div className="cards-container">
              {attractions.length > 0 ? (
                attractions.slice(0, 6).map((attraction, index) => (
                  <AttractionCard key={index} attraction={attraction} />
                ))
              ) : (
                <p className="no-data">No attraction information available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;