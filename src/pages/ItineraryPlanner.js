import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Calendar, DollarSign, Clock } from 'lucide-react';

const ItineraryPlanner = () => {
  const [destinations, setDestinations] = useState([]);
  const [budget, setBudget] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');

  const addDestination = (destination) => {
    setDestinations([...destinations, destination]);
  };

  const removeDestination = (index) => {
    setDestinations(destinations.filter((_, i) => i !== index));
  };

  const calculateTotalCost = () => {
    return destinations.reduce((total, dest) => total + dest.estimatedCost, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Plan Your Trip</h1>

        {/* Trip Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Trip Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Budget"
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>
          </div>
        </div>

        {/* Destinations List */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Destinations</h2>
            <button
              onClick={() => addDestination({
                name: 'New Destination',
                days: 1,
                estimatedCost: 0
              })}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Destination
            </button>
          </div>

          <div className="space-y-4">
            {destinations.map((destination, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{destination.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{destination.days} days</span>
                    <DollarSign className="w-4 h-4 ml-4 mr-1" />
                    <span>${destination.estimatedCost}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeDestination(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Budget Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Budget Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Total Estimated Cost</p>
              <p className="text-2xl font-bold">${calculateTotalCost()}</p>
            </div>
            <div>
              <p className="text-gray-600">Remaining Budget</p>
              <p className="text-2xl font-bold">${budget - calculateTotalCost()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryPlanner; 