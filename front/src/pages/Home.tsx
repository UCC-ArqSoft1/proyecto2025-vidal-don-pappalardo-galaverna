import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { activityService } from '../services/api';
import { Activity } from '../types';

const Home: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch activities when component mounts
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      const response = await activityService.getAllActivities();
      
      if (response.success && response.data) {
        setActivities(response.data);
      } else {
        setError(response.message || 'Failed to fetch activities');
      }
      
      setLoading(false);
    };

    fetchActivities();
  }, []);

  // Handle search submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const response = await activityService.getAllActivities(searchTerm);
    
    if (response.success && response.data) {
      setActivities(response.data);
    } else {
      setError(response.message || 'Failed to search activities');
    }
    
    setLoading(false);
  };

  // Show a loading state
  if (loading && activities.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Available Activities</h1>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8 flex">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search activities by keyword, category or time..."
          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-r-md"
        >
          Search
        </button>
      </form>
      
      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}
      
      {/* Activities List */}
      {activities.length === 0 ? (
        <div className="text-gray-500 text-center py-12">
          No activities found. Try adjusting your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <Link 
              key={activity.id} 
              to={`/activities/${activity.id}`}
              className="block hover:shadow-lg transition-shadow duration-200"
            >
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-48 bg-gray-200">
                  {activity.imageUrl ? (
                    <img 
                      src={activity.imageUrl} 
                      alt={activity.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-bold text-xl mb-2">{activity.title}</h2>
                  <div className="text-gray-700 mb-2">
                    <span className="font-medium">Day:</span> {activity.day}
                  </div>
                  <div className="text-gray-700 mb-2">
                    <span className="font-medium">Time:</span> {activity.startTime} - {activity.endTime}
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium">Instructor:</span> {activity.instructor}
                  </div>
                  <div className="mt-4 px-2 py-1 bg-blue-100 text-blue-800 rounded-full inline-block">
                    {activity.category}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;