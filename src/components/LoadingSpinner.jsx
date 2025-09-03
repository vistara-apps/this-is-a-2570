import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'accent',
  label = '',
  fullScreen = false,
  overlay = false
}) => {
  // Size classes
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };
  
  // Color classes
  const colorClasses = {
    accent: 'border-accent border-t-transparent',
    white: 'border-white border-t-transparent',
    primary: 'border-primary border-t-transparent',
    gray: 'border-gray-400 border-t-transparent'
  };
  
  // Get the appropriate classes
  const spinnerSize = sizeClasses[size] || sizeClasses.medium;
  const spinnerColor = colorClasses[color] || colorClasses.accent;
  
  // Full screen spinner
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
        <div className="text-center">
          <div className={`animate-spin ${spinnerSize} ${spinnerColor} rounded-full mx-auto`}></div>
          {label && <p className="mt-4 text-white font-medium">{label}</p>}
        </div>
      </div>
    );
  }
  
  // Overlay spinner (for components)
  if (overlay) {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50 rounded-lg">
        <div className="text-center">
          <div className={`animate-spin ${spinnerSize} ${spinnerColor} rounded-full mx-auto`}></div>
          {label && <p className="mt-2 text-white font-medium">{label}</p>}
        </div>
      </div>
    );
  }
  
  // Regular spinner
  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin ${spinnerSize} ${spinnerColor} rounded-full`}></div>
      {label && <span className="ml-3 text-white">{label}</span>}
    </div>
  );
};

export default LoadingSpinner;

