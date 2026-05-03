import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

const DetailedDestination = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // This would typically come from an API or data store
  const destination = {
    id: id,
    name: 'Lahore Fort',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5',
    description: 'A UNESCO World Heritage Site with rich Mughal history',
    location: 'Lahore, Punjab',
    bestTimeToVisit: 'October to March',
    highlights: [
      'Sheesh Mahal',
      'Alamgiri Gate',
      'Naulakha Pavilion',
      'Moti Masjid'
    ],
    activities: [
      'Historical Tour',
      'Photography',
      'Cultural Experience'
    ],
    nearbyAttractions: [
      'Badshahi Mosque',
      'Wazir Khan Mosque',
      'Lahore Museum'
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-96">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">{destination.name}</h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          {['overview', 'highlights', 'activities', 'nearby'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Overview</h2>
              <p className="text-gray-600 dark:text-gray-300">{destination.description}</p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Location</h3>
                  <p className="text-gray-600 dark:text-gray-300">{destination.location}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Best Time to Visit</h3>
                  <p className="text-gray-600 dark:text-gray-300">{destination.bestTimeToVisit}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'highlights' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {destination.highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                  >
                    <p className="text-gray-900 dark:text-white">{highlight}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Activities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {destination.activities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                  >
                    <p className="text-gray-900 dark:text-white">{activity}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'nearby' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Nearby Attractions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {destination.nearbyAttractions.map((attraction, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                  >
                    <p className="text-gray-900 dark:text-white">{attraction}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedDestination; 