import React, { useState } from 'react';
import { motion } from 'framer-motion';

const DestinationExplorer = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedProvince, setSelectedProvince] = useState(null);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'historical', label: 'Historical' },
    { id: 'mountains', label: 'Mountains' },
    { id: 'beaches', label: 'Beaches' },
    { id: 'adventure', label: 'Adventure' },
    { id: 'cultural', label: 'Cultural' }
  ];

  const provinces = [
    { id: 'punjab', name: 'Punjab', coordinates: { x: 50, y: 50 } },
    { id: 'sindh', name: 'Sindh', coordinates: { x: 50, y: 50 } },
    { id: 'kpk', name: 'Khyber Pakhtunkhwa', coordinates: { x: 50, y: 50 } },
    { id: 'balochistan', name: 'Balochistan', coordinates: { x: 50, y: 50 } },
    { id: 'gilgit', name: 'Gilgit-Baltistan', coordinates: { x: 50, y: 50 } }
  ];

  const destinations = [
    {
      id: 1,
      name: 'Lahore Fort',
      province: 'punjab',
      category: 'historical',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5',
      description: 'A UNESCO World Heritage Site with rich Mughal history'
    },
    {
      id: 2,
      name: 'Nanga Parbat',
      province: 'gilgit',
      category: 'mountains',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5',
      description: 'The ninth highest mountain in the world'
    },
    // Add more destinations as needed
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Explore Pakistan</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-4 mb-8">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedFilter === filter.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Map and Destinations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Pakistan Map</h2>
            <div className="relative h-96 bg-gray-200 dark:bg-gray-700 rounded-lg">
              {/* This would be replaced with an actual map component */}
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Interactive Map Coming Soon</p>
              </div>
            </div>
          </div>

          {/* Destinations Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {destinations
                .filter(dest => selectedFilter === 'all' || dest.category === selectedFilter)
                .map((destination) => (
                  <motion.div
                    key={destination.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
                  >
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{destination.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{destination.description}</p>
                      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        View More
                      </button>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationExplorer; 