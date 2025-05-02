import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { activityService } from '../services/api';
import { Activity } from '../types';
import { useAuth } from '../contexts/AuthContext';

const ActivityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentMessage, setEnrollmentMessage] = useState('');
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Fetch activity details when component mounts
  useEffect(() => {
    const fetchActivity = async () => {
      if (!id) return;
      
      setLoading(true);
      const activityId = parseInt(id);
      
      const response = await activityService.getActivityById(activityId);
      
      if (response.success && response.data) {
        setActivity(response.data);
      } else {
        setError(response.message || 'Failed to fetch activity details');
      }
      
      setLoading(false);
    };

    fetchActivity();
  }, [id]);

  // Handle enrollment
  const handleEnroll = async () => {
    if (!id || !isAuthenticated) return;
    
    setEnrolling(true);
    setEnrollmentMessage('');
    setEnrollmentSuccess(false);
    
    const activityId = parseInt(id);
    const response = await activityService.enrollInActivity(activityId);
    
    if (response.success) {
      setEnrollmentMessage('You have successfully enrolled in this activity!');
      setEnrollmentSuccess(true);
      
      // Update activity info to reflect new enrollment count
      const updatedActivityResponse = await activityService.getActivityById(activityId);
      if (updatedActivityResponse.success && updatedActivityResponse.data) {
        setActivity(updatedActivityResponse.data);
      }
    } else {
      setEnrollmentMessage(response.message || 'Failed to enroll in activity');
      setEnrollmentSuccess(false);
    }
    
    setEnrolling(false);
  };

  // Handle delete (admin only)
  const handleDelete = async () => {
    if (!id || !isAdmin || !activity) return;
    
    if (window.confirm(`Are you sure you want to delete the activity "${activity.title}"?`)) {
      const activityId = parseInt(id);
      const response = await activityService.deleteActivity(activityId);
      
      if (response.success) {
        navigate('/');
      } else {
        alert(response.message || 'Failed to delete activity');
      }
    }
  };

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

  // Show error state
  if (error || !activity) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Activity not found'}
        </div>
      </div>
    );
  }

  // Calculate available slots
  const availableSlots = activity.capacity - activity.enrolledCount;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Activity Image */}
        <div className="h-64 bg-gray-200">
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
        
        {/* Activity Content */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">{activity.title}</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              {activity.category}
            </span>
          </div>
          
          <p className="text-gray-700 mb-6">{activity.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Details</h2>
              <ul className="space-y-2">
                <li className="flex">
                  <span className="font-medium w-24">Day:</span> 
                  <span>{activity.day}</span>
                </li>
                <li className="flex">
                  <span className="font-medium w-24">Time:</span> 
                  <span>{activity.startTime} - {activity.endTime}</span>
                </li>
                <li className="flex">
                  <span className="font-medium w-24">Duration:</span> 
                  <span>{activity.duration} minutes</span>
                </li>
                <li className="flex">
                  <span className="font-medium w-24">Capacity:</span> 
                  <span>{activity.capacity} people</span>
                </li>
                <li className="flex">
                  <span className="font-medium w-24">Available:</span> 
                  <span className={availableSlots <= 0 ? 'text-red-500 font-medium' : 'text-green-500 font-medium'}>
                    {availableSlots <= 0 ? 'No spots available' : `${availableSlots} spots available`}
                  </span>
                </li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-2">Instructor</h2>
              <p className="mb-2">{activity.instructor}</p>
            </div>
          </div>
          
          {/* Enrollment Section */}
          {isAuthenticated && (
            <div className="mt-8">
              {enrollmentMessage && (
                <div className={`mb-4 p-3 rounded ${
                  enrollmentSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {enrollmentMessage}
                </div>
              )}
              
              <div className="flex flex-wrap gap-3">
                {!enrollmentSuccess && (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling || availableSlots <= 0}
                    className={`px-6 py-2 rounded-md font-medium ${
                      availableSlots <= 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : enrolling
                          ? 'bg-blue-400 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                )}
                
                {/* Admin Options */}
                {isAdmin && (
                  <>
                    <button
                      onClick={() => navigate(`/admin/edit-activity/${activity.id}`)}
                      className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md font-medium"
                    >
                      Edit Activity
                    </button>
                    
                    <button
                      onClick={handleDelete}
                      className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium"
                    >
                      Delete Activity
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;