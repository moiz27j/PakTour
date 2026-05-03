import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Filter, MapPin, DollarSign } from 'lucide-react';

const HotelsRestaurants = () => {
  const [activeTab, setActiveTab] = useState('hotels');
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
    rating: 0,
    cuisine: 'all'
  });

  const cuisines = ['All', 'Pakistani', 'Chinese', 'Italian', 'Fast Food', 'Fine Dining'];

  const listings = [
    {
      id: 1,
      type: 'hotel',
      name: 'Pearl Continental',
      location: 'Lahore',
      price: 150,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5',
      description: 'Luxury hotel in the heart of Lahore'
    },
    {
      id: 2,
      type: 'restaurant',
      name: 'Cafe Aylanto',
      location: 'Lahore',
      price: 50,
      rating: 4.8,
      cuisine: 'Italian',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5',
      description: 'Fine dining Italian restaurant'
    },
    // Add more listings
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Hotels & Restaurants</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('hotels')}
            className={`px-6 py-3 rounded-lg font-medium ${
              activeTab === 'hotels'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Hotels
          </button>
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`px-6 py-3 rounded-lg font-medium ${
              activeTab === 'restaurants'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Restaurants
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 mr-2 text-gray-500" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  className="border rounded-lg px-3 py-2 w-full"
                  placeholder="Min"
                />
                <span>-</span>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  className="border rounded-lg px-3 py-2 w-full"
                  placeholder="Max"
                />
              </div>
            </div>
            {activeTab === 'restaurants' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cuisine
                </label>
                <select
                  value={filters.cuisine}
                  onChange={(e) => setFilters({...filters, cuisine: e.target.value})}
                  className="border rounded-lg px-3 py-2 w-full"
                >
                  {cuisines.map((cuisine) => (
                    <option key={cuisine} value={cuisine.toLowerCase()}>
                      {cuisine}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings
            .filter(listing => listing.type === activeTab.slice(0, -1))
            .map((listing) => (
              <motion.div
                key={listing.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <img
                  src={listing.image}
                  alt={listing.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{listing.name}</h3>
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="ml-1">{listing.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{listing.location}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{listing.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="ml-1">{listing.price}</span>
                    </div>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default HotelsRestaurants; 