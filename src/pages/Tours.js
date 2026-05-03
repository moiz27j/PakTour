import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

const Tours = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Tours' },
    { id: 'adventure', label: 'Adventure' },
    { id: 'cultural', label: 'Cultural' },
    { id: 'historical', label: 'Historical' },
    { id: 'nature', label: 'Nature' }
  ];

  const tours = [
    {
      id: 1,
      name: 'Northern Pakistan Adventure',
      category: 'adventure',
      duration: '10 days',
      groupSize: '4-12 people',
      price: '$1200',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5',
      description: 'Explore the stunning landscapes of Northern Pakistan including Hunza Valley, Nanga Parbat, and more.',
      highlights: [
        'Hunza Valley',
        'Nanga Parbat Base Camp',
        'Attabad Lake',
        'Khunjerab Pass'
      ]
    },
    {
      id: 2,
      name: 'Cultural Heritage Tour',
      category: 'cultural',
      duration: '7 days',
      groupSize: '6-15 people',
      price: '$800',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5',
      description: 'Discover the rich cultural heritage of Pakistan through its historical sites and local traditions.',
      highlights: [
        'Lahore Fort',
        'Badshahi Mosque',
        'Shalimar Gardens',
        'Wazir Khan Mosque'
      ]
    },
    {
      id: 3,
      name: 'Mountain Expedition',
      category: 'adventure',
      duration: '14 days',
      groupSize: '4-8 people',
      price: '$2000',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5',
      description: 'Challenge yourself with this high-altitude mountain expedition in the Karakoram range.',
      highlights: [
        'K2 Base Camp',
        'Concordia',
        'Baltoro Glacier',
        'Gasherbrum Peaks'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-64">
        <img
          src="https://images.unsplash.com/photo-1587474260584-136574528ed5"
          alt="Tours"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">Our Tours</h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Categories */}
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours
            .filter(tour => selectedCategory === 'all' || tour.category === selectedCategory)
            .map((tour) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
              >
                <img
                  src={tour.image}
                  alt={tour.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{tour.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{tour.description}</p>
                  
                  {/* Tour Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                      <span className="text-gray-600 dark:text-gray-300">{tour.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-blue-500 mr-2" />
                      <span className="text-gray-600 dark:text-gray-300">{tour.groupSize}</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Highlights:</h3>
                    <ul className="space-y-1">
                      {tour.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center">
                          <MapPin className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price and Book Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-500">{tour.price}</span>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      Book Now
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

export default Tours; 