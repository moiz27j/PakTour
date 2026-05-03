import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Tag } from 'lucide-react';

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'experiences', label: 'Travel Experiences' },
    { id: 'festivals', label: 'Festivals' },
    { id: 'food', label: 'Food' },
    { id: 'tips', label: 'Travel Tips' }
  ];

  const articles = [
    {
      id: 1,
      title: 'Exploring the Hidden Gems of Hunza Valley',
      author: 'Sarah Khan',
      date: '2024-03-15',
      category: 'experiences',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5',
      excerpt: 'Discover the breathtaking beauty of Hunza Valley through the eyes of a local traveler...'
    },
    {
      id: 2,
      title: 'A Guide to Pakistani Street Food',
      author: 'Ali Ahmed',
      date: '2024-03-10',
      category: 'food',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5',
      excerpt: 'From spicy chaat to sweet jalebi, explore the vibrant street food culture of Pakistan...'
    },
    // Add more articles
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Travel Stories & Guides</h1>

        {/* Categories */}
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${activeCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Featured Article */}
        <div className="mb-12">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={articles[0].image}
                  alt={articles[0].title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 md:w-1/2">
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <User className="w-4 h-4 mr-2" />
                  <span>{articles[0].author}</span>
                  <Calendar className="w-4 h-4 ml-4 mr-2" />
                  <span>{articles[0].date}</span>
                </div>
                <h2 className="text-2xl font-bold mb-4">{articles[0].title}</h2>
                <p className="text-gray-600 mb-6">{articles[0].excerpt}</p>
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Read More
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles
            .filter(article => activeCategory === 'all' || article.category === activeCategory)
            .map((article) => (
              <motion.div
                key={article.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <User className="w-4 h-4 mr-2" />
                    <span>{article.author}</span>
                    <Calendar className="w-4 h-4 ml-4 mr-2" />
                    <span>{article.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <button className="text-blue-500 hover:text-blue-700">
                    Read More →
                  </button>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Blog; 