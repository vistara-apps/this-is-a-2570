import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const VARIANTS = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
    textColor: 'text-green-400',
    iconColor: 'text-green-400'
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-400',
    iconColor: 'text-red-400'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30',
    textColor: 'text-yellow-400',
    iconColor: 'text-yellow-400'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    iconColor: 'text-blue-400'
  }
};

const Notification = ({ 
  title, 
  message, 
  variant = 'info', 
  duration = 5000, 
  onClose,
  isVisible = true
}) => {
  const [visible, setVisible] = useState(isVisible);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const [intervalId, setIntervalId] = useState(null);
  
  const variantStyles = VARIANTS[variant] || VARIANTS.info;
  const Icon = variantStyles.icon;

  // Handle auto-close with progress bar
  useEffect(() => {
    if (visible && duration > 0) {
      // Set up progress bar
      const startTime = Date.now();
      const endTime = startTime + duration;
      
      const id = setInterval(() => {
        const now = Date.now();
        const remaining = endTime - now;
        const percentage = Math.max(0, (remaining / duration) * 100);
        
        setProgress(percentage);
        
        if (percentage <= 0) {
          handleClose();
        }
      }, 16); // ~60fps
      
      setIntervalId(id);
      
      return () => {
        clearInterval(id);
      };
    }
  }, [visible, duration]);

  // Update visibility when isVisible prop changes
  useEffect(() => {
    setVisible(isVisible);
    if (isVisible) {
      setExiting(false);
      setProgress(100);
    }
  }, [isVisible]);

  // Handle close with animation
  const handleClose = () => {
    clearInterval(intervalId);
    setExiting(true);
    
    // Wait for exit animation to complete
    setTimeout(() => {
      setVisible(false);
      if (onClose) {
        onClose();
      }
    }, 300);
  };

  // Pause progress when hovering
  const handleMouseEnter = () => {
    clearInterval(intervalId);
  };

  // Resume progress when not hovering
  const handleMouseLeave = () => {
    if (visible && duration > 0) {
      const remainingTime = (progress / 100) * duration;
      const startTime = Date.now();
      const endTime = startTime + remainingTime;
      
      const id = setInterval(() => {
        const now = Date.now();
        const remaining = endTime - now;
        const percentage = Math.max(0, (remaining / remainingTime) * progress);
        
        setProgress(percentage);
        
        if (percentage <= 0) {
          handleClose();
        }
      }, 16);
      
      setIntervalId(id);
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <div 
      className={`
        max-w-md w-full ${variantStyles.bgColor} border ${variantStyles.borderColor} 
        rounded-lg shadow-lg overflow-hidden transition-all duration-300
        ${exiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`w-5 h-5 ${variantStyles.iconColor}`} />
          </div>
          <div className="ml-3 w-0 flex-1">
            {title && (
              <p className={`text-sm font-medium ${variantStyles.textColor}`}>
                {title}
              </p>
            )}
            {message && (
              <p className="mt-1 text-sm text-white/70">
                {message}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-transparent rounded-md inline-flex text-white/50 hover:text-white focus:outline-none"
              onClick={handleClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      {duration > 0 && (
        <div 
          className={`h-1 ${variantStyles.iconColor} transition-all duration-100 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      )}
    </div>
  );
};

export default Notification;

