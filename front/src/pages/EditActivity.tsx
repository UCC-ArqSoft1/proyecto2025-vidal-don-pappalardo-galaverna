// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { activityService } from '../../services/api';
// import { Activity } from '../../types';
// import { useAuth } from '../../contexts/AuthContext';

// const EditActivity: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const { isAuthenticated, isAdmin } = useAuth();
//   const navigate = useNavigate();
  
//   const [formData, setFormData] = useState<Activity | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);

//   // Fetch activity details when component mounts
//   useEffect(() => {
//     const fetchActivity = async () => {
//       if (!id || !isAuthenticated || !isAdmin) return;
      
//       setLoading(true);
//       const activityId = parseInt(id);
      
//       const response = await activityService.getActivityById(activityId);
      
//       if (response.success && response.data) {
//         setFormData(response.data);
//       } else {
//         setError(response.message || 'Failed to fetch activity details');
//       }
      
//       setLoading(false);
//     };

//     fetchActivity();
//   }, [id, isAuthenticated, isAdmin]);

//   // Handle input changes
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     if (!formData) return;
    
//     const { name, value } = e.target;
    
//     setFormData(prev => {
//       if (!prev) return prev;
      
//       return {
//         ...prev,
//         [name]: name === 'duration' || name === 'capacity' ? parseInt(value) : value
//       };
//     });
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData || !id || !isAuthenticated || !isAdmin) {
//       setError('You do not have permission to edit activities');
//       return;
//     }
    
//     setSaving(true);
//     setError('');
//     setSuccess(false);
    
//     try {
//       const activityId = parseInt(id);
//       const response = await activityService.updateActivity(activityId, formData);
      
//       if (response.success) {
//         setSuccess(true);
        
//         // Redirect after a brief delay
//         setTimeout(() => {
//           navigate(`/activities/${activityId}`);
//         }, 2000);
//       } else {
//         setError(response.message || 'Failed to update activity');
//       }
//     } catch (err) {
//       setError('An unexpected error occurred');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Redirect if not admin
//   if (!isAuthenticated || !isAdmin) {
//     return (
//       <div className="container mx-auto p-4">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//           You do not have permission to edit activities.
//         </div>
//       </div>
//     );
//   }

//   // Show loading state
//   if (loading) {
//     return (
//       <div className="container mx-auto p-4">
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       </div>
//     );
//   }

//   // Show error state if no formData
//   if (!formData) {
//     return (
//       <div className="container mx-auto p-4">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//           {error || 'Activity not found'}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-6">Edit Activity</h1>
      
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>