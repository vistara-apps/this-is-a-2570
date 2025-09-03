import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import useImageProcessing from '../hooks/useImageProcessing';
import { supabaseService } from '../services';

// Create the editor context
const EditorContext = createContext();

/**
 * EditorProvider component that wraps the application and provides editor state
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const EditorProvider = ({ children }) => {
  const { user, subscriptionTier } = useAuth();
  const imageProcessing = useImageProcessing();
  const [recentImages, setRecentImages] = useState([]);
  const [loadingRecentImages, setLoadingRecentImages] = useState(false);

  // Load recent images when user changes
  useEffect(() => {
    const loadRecentImages = async () => {
      if (!user) {
        setRecentImages([]);
        return;
      }

      try {
        setLoadingRecentImages(true);
        const images = await supabaseService.getUserImages(user.id, 10);
        setRecentImages(images);
      } catch (error) {
        console.error('Error loading recent images:', error);
      } finally {
        setLoadingRecentImages(false);
      }
    };

    loadRecentImages();
  }, [user]);

  /**
   * Get the maximum number of edits allowed for the user's tier
   * 
   * @returns {number} - Maximum number of edits (-1 for unlimited)
   */
  const getEditLimit = () => {
    switch (subscriptionTier) {
      case 'premium':
      case 'pro':
        return -1; // Unlimited
      case 'free':
      default:
        return 5;
    }
  };

  /**
   * Check if the user has reached their edit limit
   * 
   * @returns {boolean} - Whether the user has reached their edit limit
   */
  const hasReachedEditLimit = () => {
    const limit = getEditLimit();
    return limit !== -1 && imageProcessing.editCount >= limit;
  };

  /**
   * Check if a feature is available for the user's tier
   * 
   * @param {string} featureType - The type of feature to check
   * @returns {boolean} - Whether the feature is available
   */
  const isFeatureAvailable = (featureType) => {
    // Features that require pro or premium tier
    const proFeatures = ['artisticFilters', 'aiUpscale', 'batchProcessing', '4kExport'];
    
    // Features that require premium tier
    const premiumFeatures = ['aiUpscale', 'batchProcessing', '4kExport'];
    
    if (premiumFeatures.includes(featureType) && subscriptionTier !== 'premium') {
      return false;
    }
    
    if (proFeatures.includes(featureType) && subscriptionTier === 'free') {
      return false;
    }
    
    return true;
  };

  /**
   * Load an image from the user's recent images
   * 
   * @param {string} imageId - The ID of the image to load
   * @returns {Promise<Object>} - Promise resolving to the loaded image
   */
  const loadImage = async (imageId) => {
    try {
      const image = recentImages.find(img => img.id === imageId);
      
      if (!image) {
        throw new Error('Image not found');
      }
      
      imageProcessing.setCurrentImage(image);
      imageProcessing.setImageHistory([image]);
      imageProcessing.setEditCount(0);
      
      return image;
    } catch (error) {
      console.error('Error loading image:', error);
      throw error;
    }
  };

  // Value object to be provided to consumers
  const value = {
    ...imageProcessing,
    recentImages,
    loadingRecentImages,
    getEditLimit,
    hasReachedEditLimit,
    isFeatureAvailable,
    loadImage
  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};

/**
 * Custom hook to use the editor context
 * 
 * @returns {Object} Editor context value
 */
export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

export default EditorContext;

