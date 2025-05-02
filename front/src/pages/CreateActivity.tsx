import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { activityService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const CreateActivity: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    day: '',
    startTime: '',
    endTime: '',
    duration: 60,
    instructor: '',
    capacity: 10,
    imageUrl: 'https://via.placeholder.com/400x300',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'capacity' ? parseInt(value) : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !isAdmin) {
      setError('You do not have permission to create activities');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const response = await activityService.createActivity({
        ...formData,
        enrolledCount: 0
      });
      
      if (response.success) {
        setSuccess(true);
        
        // Reset form or redirect
        setTimeout(() => {
          if (response.data) {
            navigate(`/activities/${response.data.id}`);
          } else {
            navigate('/');
          }
        }, 2000);
      } else {
        setError(response.message || 'Failed to create activity');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not admin
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          You do not have permission to create activities.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Activity</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Activity created successfully! Redirecting...
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Activity Title
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              required
            />
          </div>
          
          {/* Category */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="Spinning">Spinning</option>
              <option value="Funcional">Funcional</option>
              <option value="MMA">MMA</option>
              <option value="Yoga">Yoga</option>
              <option value="Pilates">Pilates</option>
              <option value="Crossfit">Crossfit</option>
              <option value="Zumba">Zumba</option>
            </select>
          </div>
          
          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              rows={4}
              required
            />
          </div>
          
          {/* Day */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="day">
              Day
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="day"
              name="day"
              value={formData.day}
              onChange={handleChange}
              required
            >
              <option value="">Select a day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>
          
          {/* Duration */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
              Duration (minutes)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="duration"
              type="number"
              min="15"
              max="180"
              step="15"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Start Time */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startTime">
              Start Time
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="startTime"
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* End Time */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endTime">
              End Time
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="endTime"
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Instructor */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="instructor">
              Instructor
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="instructor"
              type="text"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              placeholder="Instructor name"
              required
            />
          </div>
          
          {/* Capacity */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="capacity">
              Capacity
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="capacity"
              type="number"
              min="1"
              max="100"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Image URL */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageUrl">
              Image URL
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="imageUrl"
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            className={`px-6 py-2 rounded-md font-medium ${
              loading
                ? 'bg-blue-400 text-white cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Activity'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateActivity;