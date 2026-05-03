import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-96">
        <img
          src="https://images.unsplash.com/photo-1587474260584-136574528ed5"
          alt="Pakistan Landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">About Pakistan Tourism</h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Pakistan Tourism is dedicated to showcasing the incredible beauty and cultural richness of Pakistan. 
              From the majestic mountains of the north to the historical sites of the south, we aim to provide 
              travelers with unforgettable experiences.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Our platform connects travelers with authentic experiences, local guides, and the best accommodations 
              across the country. We believe in sustainable tourism that benefits local communities while preserving 
              Pakistan's natural and cultural heritage.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-gray-600 dark:text-gray-300">
                  Promote sustainable tourism practices
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-gray-600 dark:text-gray-300">
                  Support local communities and businesses
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-gray-600 dark:text-gray-300">
                  Preserve cultural and natural heritage
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-gray-600 dark:text-gray-300">
                  Provide authentic travel experiences
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Team Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((member) => (
              <motion.div
                key={member}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: member * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
              >
                <img
                  src="https://images.unsplash.com/photo-1587474260584-136574528ed5"
                  alt={`Team Member ${member}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Team Member {member}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">Tourism Expert</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 