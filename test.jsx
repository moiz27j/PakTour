// 
// import React, { useState, useEffect } from 'react';
// import './journey_curator.css';

// function test() {
//   const [userInput, setUserInput] = useState('');
//   const [chatHistory, setChatHistory] = useState([
//     { role: 'assistant', content: 'Hello! I can help you plan your trip. Please tell me your destination.' }
//   ]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentStep, setCurrentStep] = useState('destination');
//   const [allInputs, setAllInputs] = useState({});

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!userInput.trim()) return;
    
//     // Add user message to chat
//     setChatHistory(prev => [...prev, { role: 'user', content: userInput }]);
//     setIsLoading(true);

//     try {
//       const response = await fetch('http://localhost:8000/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ user_input: userInput })
//       });

//       const data = await response.json();
      
//       // Update step based on server response
//       setCurrentStep(data.step);
      
//       // Track all inputs for summary display
//       setAllInputs(prev => ({
//         ...prev,
//         [currentStep]: userInput
//       }));

//       // Add assistant response to chat
//       setChatHistory(prev => [...prev, { role: 'assistant', content: data.message }]);
      
//       // Clear input field
//       setUserInput('');
//     } catch (error) {
//       console.error('Error:', error);
//       setChatHistory(prev => [...prev, { 
//         role: 'assistant', 
//         content: 'Sorry, there was an error processing your request. Please try again.' 
//       }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Helper function to display step name in a user-friendly way
//   const getStepDisplay = (step) => {
//     const stepNames = {
//       destination: 'Destination',
//       origin: 'Starting Location',
//       days: 'Days of Travel',
//       mood: 'Travel Mood/Theme',
//       route: 'Route Preference',
//       summary: 'Trip Summary'
//     };
//     return stepNames[step] || step;
//   };

//   return (
//     <div className="app-container">
//       <header>
//         <h1>Travel Planner Assistant</h1>
//         <div className="progress-tracker">
//           {['destination', 'origin', 'days', 'mood', 'route', 'summary'].map((step) => (
//             <div 
//               key={step} 
//               className={`step ${currentStep === step ? 'active' : ''} ${
//                 Object.keys(allInputs).includes(step) ? 'completed' : ''
//               }`}
//             >
//               {getStepDisplay(step)}
//             </div>
//           ))}
//         </div>
//       </header>

//       <div className="chat-container">
//         {chatHistory.map((message, index) => (
//           <div key={index} className={`message ${message.role}`}>
//             <div className="message-content">{message.content}</div>
//           </div>
//         ))}
//         {isLoading && (
//           <div className="message assistant">
//             <div className="message-content loading">
//               <span>.</span><span>.</span><span>.</span>
//             </div>
//           </div>
//         )}
//       </div>

//       <form onSubmit={handleSubmit} className="input-form">
//         <input
//           type="text"
//           value={userInput}
//           onChange={(e) => setUserInput(e.target.value)}
//           placeholder={`Enter your ${getStepDisplay(currentStep)}...`}
//           disabled={isLoading || currentStep === 'summary'}
//         />
//         <button 
//           type="submit" 
//           disabled={isLoading || !userInput.trim() || currentStep === 'summary'}
//         >
//           Send
//         </button>
//       </form>

//       {currentStep === 'summary' && (
//         <div className="summary-container">
//           <h2>Trip Summary</h2>
//           <div className="summary-details">
//             {Object.entries(allInputs).map(([key, value]) => (
//               <div key={key} className="summary-item">
//                 <strong>{getStepDisplay(key)}:</strong> {value}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default test;