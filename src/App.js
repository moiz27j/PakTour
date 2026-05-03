import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Lazy load your pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const Chat = React.lazy(() => import('./pages/Chat'));
const Flight = React.lazy(() => import('./pages/Flight'));
const Restaurant = React.lazy(() => import('./pages/Restaurant'));
const NearbySearch = React.lazy(() => import('./pages/NearbySearch'));
const AccomodationSearch = React.lazy(() => import('./pages/AccomodationSearch'));


function App() {
  return (
    <Router>
      <Suspense fallback={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#333'
        }}>
          Loading...
        </div>
      }>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/flights" element={<Flight />} />
          <Route path="/restaurants" element={<Restaurant />} />
          <Route path="/nearby-search" element={<NearbySearch/>} />
          <Route path="/accommodation-search" element={<AccomodationSearch/>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;