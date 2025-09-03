import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute component that restricts access to authenticated users
 * and optionally checks for subscription tier requirements
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {string} props.requiredTier - Optional subscription tier required for access ('pro', 'premium')
 * @param {string} props.redirectTo - Path to redirect to if not authenticated or missing required tier
 */
const ProtectedRoute = ({ 
  children, 
  requiredTier = null, 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, loading, subscriptionTier } = useAuth();

  // Show loading state while auth is being checked
  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin w-10 h-10 border-3 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check if user has required subscription tier
  if (requiredTier) {
    const tierLevels = {
      'free': 0,
      'pro': 1,
      'premium': 2
    };

    const userTierLevel = tierLevels[subscriptionTier] || 0;
    const requiredTierLevel = tierLevels[requiredTier] || 0;

    if (userTierLevel < requiredTierLevel) {
      // Redirect to upgrade page if user doesn't have required tier
      return <Navigate to="/upgrade" replace />;
    }
  }

  // User is authenticated and has required tier, render children
  return children;
};

export default ProtectedRoute;

