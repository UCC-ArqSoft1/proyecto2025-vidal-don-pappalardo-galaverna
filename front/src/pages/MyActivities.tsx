import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { activityService } from '../services/api';
import { Enrollment } from '../types';
import { useAuth } from '../contexts/AuthContext';

const MyActivities: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { isAuthenticated } = useAuth();

  // Fetch user enrollments when component mounts
  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!isAuthenticated) return;
      
      setLoading(true);
      const response = await activityService.getUserEnrollments();
      
      if (response.success && response.data) {
        setEnrollments(response.data);
      } else {
        setError(response.message || 'Failed to fetch your activities');
      }
      
      setLoading(false);
    };

    fetchEnrollments();
  }, [isAuthenticated]);

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Show not authenticated message
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Please log in to view your activities.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Activities</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {enrollments.length === 0 ? (
        <div className="bg-gray-100 p-8 text-center rounded-lg">
          <h2 className="text-xl font-medium mb-2">You are not enrolled in any activities yet</h2>
          <p className="text-gray-600 mb-4">Browse our available activities and sign up for classes that interest you.</p>
          <Link 
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Browse Activities
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <Link 
              key={enrollment.id} 
              to={`/activities/${enrollment.activityId}`}
              className="block hover:shadow-lg transition-shadow duration-200"
            >
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-48 bg-gray-200">
                  {enrollment.activity?.imageUrl ? (
                    <img 
                      src={enrollment.activity.imageUrl} 
                      alt={enrollment.activity.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-bold text-xl mb-2">{enrollment.activity?.title}</h2>
                  <div className="text-gray-700 mb-2">
                    <span className="font-medium">Day:</span> {enrollment.activity?.day}
                  </div>
                  <div className="text-gray-700 mb-2">
                    <span className="font-medium">Time:</span> {enrollment.activity?.startTime} - {enrollment.activity?.endTime}
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium">Instructor:</span> {enrollment.activity?.instructor}
                  </div>
                  <div className="mt-4 px-2 py-1 bg-blue-100 text-blue-800 rounded-full inline-block">
                    {enrollment.activity?.category}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Enrolled on: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
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

export default MyActivities;