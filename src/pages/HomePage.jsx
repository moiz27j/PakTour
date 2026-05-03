/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Plane, Utensils, Search, Hotel, Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import './HomePage.css';
import hunzaImage from '../images/hunza.jpg';
import historicalImage from '../images/mohenjo-daro.jpg';
import lahoreFortImage from '../images/lahore_fort.jpg';
import swatImage from '../images/swat.jpg';
import makliImage from '../images/makri.jpg';
import beachesImage from '../images/beaches.jpg';
import cultureImage from '../images/culture.jpg';
import poloFestImage from '../images/polo_fest.jpg';
import basantImage from '../images/basant.jpg';
import silkRouteImage from '../images/silk_route_festival.jpg';


const HomePage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Initialize AOS-like animations
    const animatedElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      animatedElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const popularDestinations = [
    {
      id: 1,
      name: 'Hunza Valley',
      image: hunzaImage,
      description: 'Experience breathtaking mountain landscapes and rich local culture',
      rating: 4.9
    },
    {
      id: 2,
      name: 'Lahore Fort',
      image: lahoreFortImage,
      description: 'Explore the historical Mughal architecture and vibrant city life',
      rating: 4.7
    },
    {
      id: 3,
      name: 'Swat Valley',
      image: swatImage,
      description: 'Discover the "Switzerland of Pakistan" with lush green hills',
      rating: 4.8
    },
    {
      id: 4,
      name: 'Makli Necropolis',
      image: makliImage,
      description: 'One of the world\'s largest necropolises with historical tombs',
      rating: 4.5
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      text: 'My trip to Pakistan was life-changing! This app made planning so easy and the recommendations were spot-on.',
      location: 'Visited Hunza Valley'
    },
    {
      id: 2,
      name: 'Ahmed Khan',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      text: 'As a local Pakistani, I still use this app to discover hidden gems in my own country. Fantastic experience!',
      location: 'Explored Skardu'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
      text: 'The cultural experiences recommended were absolutely authentic. I felt welcomed everywhere I went.',
      location: 'Visited Lahore'
    }
  ];

  const categories = [
    { 
      name: 'Mountains',
      image: hunzaImage,
      places: ['K2 Base Camp', 'Fairy Meadows', 'Nanga Parbat', 'Deosai Plains']
    },
    { 
      name: 'Beaches',
      image: beachesImage,
      places: ['Kund Malir', 'Clifton Beach', 'Gwadar']
    },
    { 
      name: 'Historical',
      image: historicalImage,
      places: ['Badshahi Mosque', 'Mohenjo-daro', 'Taxila', 'Rohtas Fort']
    },
    { 
      name: 'Cultural',
      image: cultureImage,
      places: ['Kalash Valley', 'Peshawar Bazar', 'Lok Virsa Museum', 'Karachi Food Street']
    }
  ];

  const upcomingEvents = [
    {
      name: 'Shandur Polo Festival',
      date: 'July 7-9, 2025',
      location: 'Shandur Pass',
      image: poloFestImage
    },
    {
      name: 'Basant Kite Festival',
      date: 'February 18, 2026',
      location: 'Lahore',
      image: basantImage
    },
    {
      name: 'Silk Route Festival',
      date: 'August 20-25, 2025',
      location: 'Gilgit-Baltistan',
      image: silkRouteImage
    }
  ];

  return (
    <div className="font-sans min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* Navigation Bar */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="text-blue-600 text-2xl font-bold flex items-center">
                <span className="gradient-text">Pakistan</span>
                <span className="ml-1 text-black">Explorer</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/chat" className="nav-link">Plan My Trip</Link>
            <Link to="/flights" className="nav-link">Flights</Link>
            <Link to="/accommodation-search" className="nav-link">Accomodations</Link>
            <Link to="/nearby-search" className="nav-link">Explore Pakistan</Link>
            <Link to="/restaurants" className="nav-link">Restaurants</Link>
          </nav>

          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-blue-600 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden bg-white shadow-lg overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link to="/experiences" className="block py-2 hover:text-blue-600 transition">Experiences</Link>
            <Link to="/culture" className="block py-2 hover:text-blue-600 transition">Culture</Link>
            <Link to="/plan" className="block py-2 hover:text-blue-600 transition">Plan Your Trip</Link>
            <Link to="/about" className="block py-2 hover:text-blue-600 transition">About Pakistan</Link>
            
            <div className="pt-4 flex flex-col space-y-3">
             
            </div>
          </div>
        </div>
      </header>

      <section
  className="hero-section flex flex-col items-center justify-center relative overflow-hidden bg-white"
  style={{
    minHeight: '90vh',
    transition: 'background 0.7s cubic-bezier(0.4,0,0.2,1)',
    background:
      'linear-gradient(120deg, #f8fafc 0%, #e0f2fe 100%)'
  }}
>
  {/* Animated background shapes */}
  <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
    <svg width="100%" height="100%" viewBox="0 0 1440 320" className="absolute bottom-0 left-0">
      <path
        fill="#38bdf8"
        fillOpacity="0.08"
        d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
      ></path>
    </svg>
    <div className="absolute top-10 right-10 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-60 animate-float-slow"></div>
    <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-200 rounded-full blur-xl opacity-40 animate-float"></div>
  </div>

  <div className="hero-content container mx-auto px-4 md:px-6 relative z-10 text-center pt-36 pb-20 md:py-44">
    <h1
      className="text-5xl md:text-7xl font-extrabold mb-6 hero-title text-gray-900 transition-all duration-700 animate-fade-in-up"
      style={{ letterSpacing: '-0.03em' }}
    >
      Discover the Magic of{' '}
      <span className="gradient-text bg-gradient-to-r from-blue-500 via-cyan-400 to-green-400 bg-clip-text text-transparent animate-gradient-x">
        Pakistan
      </span>
    </h1>
    <p className="text-lg md:text-2xl mb-10 max-w-2xl mx-auto hero-subtitle text-gray-700 animate-fade-in-up delay-150">
      From snow-capped mountains to ancient civilizations, embark on an unforgettable journey
    </p>

    <div className="mt-12 flex flex-wrap justify-center gap-4 md:gap-8 animate-fade-in-up delay-500">
  <Link to="/chat" className="feature-card hero-action-btn">
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 mb-3 shadow-lg">
      <MapPin className="text-white" size={24} />
    </div>
    <p className="text-blue-700 font-semibold">Plan My Trip</p>
  </Link>
  <Link to="/flights" className="feature-card hero-action-btn">
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 mb-3 shadow-lg">
      <Plane className="text-white" size={24} />
    </div>
    <p className="text-green-700 font-semibold">Find Flights</p>
  </Link>
  <Link to="/restaurants" className="feature-card hero-action-btn">
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-pink-400 to-yellow-400 mb-3 shadow-lg">
      <Utensils className="text-white" size={24} />
    </div>
    <p className="text-pink-700 font-semibold">Find Restaurants</p>
  </Link>
  <Link to="/nearby-search" className="feature-card hero-action-btn">
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 mb-3 shadow-lg">
      <Search className="text-white" size={24} />
    </div>
    <p className="text-purple-700 font-semibold">Explore Destinations</p>
  </Link>
  <Link to="/accommodation-search" className="feature-card hero-action-btn">
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-yellow-400 to-green-400 mb-3 shadow-lg">
      <Hotel className="text-white" size={24} />
    </div>
    <p className="text-yellow-700 font-semibold">Accommodations</p>
  </Link>
</div>
  </div>

        
        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <p className="text-white text-sm mt-2">Scroll to explore</p>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Popular Destinations</h2>
              <p className="text-gray-600 max-w-2xl">Discover the most breathtaking and awe-inspiring places Pakistan has to offer</p>
            </div>
            <Link to="/nearby-search" className="flex items-center text-blue-600 mt-4 md:mt-0 hover:text-blue-800 transition group">
              View all destinations
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination) => (
              <div 
                key={destination.id} 
                className="destination-card rounded-xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl cursor-pointer fade-in"
              >
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={destination.image} 
                    alt={destination.name} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full py-1 px-3 flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="font-medium">{destination.rating}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{destination.description}</p>
                 
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center fade-in">Explore by Category</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12 fade-in">
            Pakistan offers diverse experiences from majestic mountains to pristine beaches and rich cultural heritage
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div 
                key={index}
                className="category-card rounded-xl overflow-hidden shadow-lg transition-all duration-300 cursor-pointer fade-in"
                onClick={() => setActiveCategory(activeCategory === index ? null : index)}
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center transition-opacity duration-300 hover:bg-opacity-20">
                    <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                  </div>
                </div>
                
                <div className={`bg-white overflow-hidden transition-all duration-300 ${activeCategory === index ? 'max-h-72' : 'max-h-0'}`}>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">Popular Places</h4>
                      {activeCategory === index ? 
                        <ChevronUp size={20} className="text-blue-600" /> : 
                        <ChevronDown size={20} className="text-blue-600" />
                      }
                    </div>
                    <ul className="space-y-2">
                      {category.places.map((place, i) => (
                        <li key={i} className="flex items-center">
                          <MapPin size={16} className="text-blue-600 mr-2" />
                          <span>{place}</span>
                        </li>
                      ))}
                    </ul>
                    <Link 
                      to={`/nearby-search`}
                      className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm"
                    >
                      View all {category.name}
                      <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experiences Section */}
      <section className="py-16 md:py-24 bg-blue-600 text-white experiences-section">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Unforgettable Experiences</h2>
            <p className="max-w-3xl mx-auto opacity-90">
              Immerse yourself in authentic Pakistani culture and create memories that will last a lifetime
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="experience-card fade-in">
              <div className="rounded-xl overflow-hidden shadow-lg h-full bg-white bg-opacity-10 backdrop-blur-sm p-6 border border-white border-opacity-20">
                <div className="icon-wrapper mb-6">
                  <img src="https://img.icons8.com/fluency/96/mountain.png" alt="Mountain trekking" className="h-16 w-16" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Mountain Trekking</h3>
                <p className="opacity-90 mb-5">
                  Pakistan is home to five of the world's fourteen 8000+ meter peaks, including K2, the second highest mountain in the world.
                </p>
                
              </div>
            </div>
            
            <div className="experience-card fade-in">
              <div className="rounded-xl overflow-hidden shadow-lg h-full bg-white bg-opacity-10 backdrop-blur-sm p-6 border border-white border-opacity-20">
                <div className="icon-wrapper mb-6">
                  <img src="https://img.icons8.com/fluency/96/dining-room.png" alt="Culinary tours" className="h-16 w-16" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Culinary Tours</h3>
                <p className="opacity-90 mb-5">
                  Experience the rich flavors of authentic Pakistani cuisine from street food to royal dishes that reflect centuries of culinary art.
                </p>
               
              </div>
            </div>
            
            <div className="experience-card fade-in">
              <div className="rounded-xl overflow-hidden shadow-lg h-full bg-white bg-opacity-10 backdrop-blur-sm p-6 border border-white border-opacity-20">
                <div className="icon-wrapper mb-6">
                  <img src="https://img.icons8.com/fluency/96/dancing-party.png" alt="Cultural festivals" className="h-16 w-16" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Cultural Festivals</h3>
                <p className="opacity-90 mb-5">
                  Join the vibrant celebrations of Pakistan's diverse cultural festivals throughout the year, from Basant to the Shandur Polo Festival.
                </p>
               
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 fade-in">Upcoming Events</h2>
          <p className="text-gray-600 mb-12 max-w-2xl fade-in">
            Plan your visit around these special cultural events and festivals
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <div 
                key={index} 
                className="event-card rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer fade-in"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={event.image} 
                    alt={event.name} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs uppercase font-bold py-1 px-3 rounded-full">
                    Upcoming
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-1">{event.name}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin size={16} className="mr-1" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <p className="text-blue-600 font-medium mb-4">{event.date}</p>
                  <Link 
                    to={`/chat`} 
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm"
                  >
                    Learn more
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Traveler Stories</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Hear from travelers who have experienced the beauty and hospitality of Pakistan
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="testimonial-card bg-white rounded-xl p-6 shadow-lg relative fade-in"
              >
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
                <div className="quote-marks absolute top-6 right-6 text-blue-100 text-6xl font-serif">❝</div>
                <p className="text-gray-700 relative z-10 italic">{testimonial.text}</p>
                <div className="mt-4 flex">
                  <span className="text-yellow-500">★★★★★</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-16 md:py-28 text-white text-center relative overflow-hidden">
        <div className="overlay absolute inset-0 bg-black bg-opacity-50 z-10"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-20 fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 max-w-3xl mx-auto">Ready to Experience the Wonder of Pakistan?</h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            From the peaks of the Karakoram to the shores of the Arabian Sea, your adventure awaits
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/chat" className="px-8 py-3 bg-white text-blue-600 rounded-full font-medium hover:bg-opacity-90 transition duration-300 shadow-lg">
              Plan My Journey
            </Link>
            <Link to="/nearby-search" className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-medium hover:bg-white hover:bg-opacity-10 transition duration-300">
              Browse Tourist Attractions
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="newsletter-container bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between fade-in">
            <div className="text-left mb-6 md:mb-0 md:mr-8 md:w-1/2">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">Stay Updated</h3>
              <p className="opacity-90">Subscribe to our newsletter for travel tips, exclusive offers, and insights into Pakistan's hidden gems</p>
            </div>
            <div className="w-full md:w-1/2">
              <div className="flex flex-col sm:flex-row">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-1 px-4 py-3 rounded-l-full outline-none text-gray-800 focus:ring-2 focus:ring-blue-300"
                />
                <button className="mt-3 sm:mt-0 bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-full sm:rounded-l-none transition duration-300">
                  Subscribe
                </button>
              </div>
              <p className="text-sm mt-3 opacity-80">
                By subscribing, you agree to our Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="mb-6">
                <Link to="/" className="text-2xl font-bold flex items-center">
                  <span className="gradient-text">Pakistan</span>
                  <span className="ml-1 text-white">Explorer</span>
                </Link>
              </div>
              <p className="text-gray-400 mb-6">
                Your gateway to the breathtaking landscapes and rich cultural heritage of Pakistan.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="social-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="social-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
                <a href="#" className="social-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
                <li><Link to="/destinations" className="text-gray-400 hover:text-white transition">Destinations</Link></li>
                <li><Link to="/experiences" className="text-gray-400 hover:text-white transition">Experiences</Link></li>
                <li><Link to="/blog" className="text-gray-400 hover:text-white transition">Travel Blog</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition">Contact Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/visa" className="text-gray-400 hover:text-white transition">Visa Information</Link></li>
                <li><Link to="/safety" className="text-gray-400 hover:text-white transition">Travel Safety</Link></li>
                <li><Link to="/faq" className="text-gray-400 hover:text-white transition">FAQs</Link></li>
                <li><Link to="/transportation" className="text-gray-400 hover:text-white transition">Transportation</Link></li>
                <li><Link to="/weather" className="text-gray-400 hover:text-white transition">Weather Guide</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-gray-400 mt-1">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span className="text-gray-400">Islamabad, Pakistan</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-gray-400 mt-1">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span className="text-gray-400">+92 51 1234 5678</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-gray-400 mt-1">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span className="text-gray-400">info@pakistanexplorer.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Pakistan Explorer. All rights reserved.
              </p>
              <div className="mt-4 md:mt-0">
                <ul className="flex space-x-6">
                  <li><Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="text-gray-400 hover:text-white text-sm transition">Terms of Service</Link></li>
                  <li><Link to="/sitemap" className="text-gray-400 hover:text-white text-sm transition">Sitemap</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>

      </div>
  );}

export default HomePage;