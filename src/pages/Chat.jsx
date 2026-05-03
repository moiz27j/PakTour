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

// Main App component
function Chat() {
  // Existing state
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState('destination');
  const [tripSummary, setTripSummary] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Initialize session with backend
        const response = await fetch(`${REACT_APP_API_URL}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_input: '' }),
        });
        
        const data = await response.json();
        if (data.session_id) {
          setSessionId(data.session_id);
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
      setShowSummary(false);
      
      // Get new session ID
      if (data.session_id) {
        setSessionId(data.session_id);
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
        </div>
      )}
    </div>
  );
}

export default Chat;
