import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl font-bold">GymApp</Link>
          
          {isAuthenticated && (
            <>
              <Link to="/" className="hover:text-blue-200">Home</Link>
              <Link to="/my-activities" className="hover:text-blue-200">My Activities</Link>
              {isAdmin && (
                <Link to="/admin/create-activity" className="hover:text-blue-200">Create Activity</Link>
              )}
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="mr-2">Welcome, {user?.username}</span>
              <button 
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;