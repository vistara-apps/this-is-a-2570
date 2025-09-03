import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services';
import * as imageProcessing from '../utils/imageProcessing';
import { EditHistory, Image } from '../models';

/**
 * Custom hook for image processing operations
 * 
 * @returns {Object} Image processing methods and state
 */
const useImageProcessing = () => {
  const { user, subscriptionTier } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [imageHistory, setImageHistory] = useState([]);
  const [editCount, setEditCount] = useState(0);

  /**
   * Upload an image to storage
   * 
   * @param {File} file - The image file to upload
   * @returns {Promise<Object>} - Promise resolving to the uploaded image data
   */
  const uploadImage = useCallback(async (file) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Upload the image to storage
      const uploadResult = await supabaseService.uploadImage(file, user.id, 'original');
      
      // Create image metadata
      const imageData = {
        userId: user.id,
        originalUrl: uploadResult.publicUrl,
        name: file.name,
        size: file.size,
        type: file.type
      };
      
      // Save image metadata to database
      const savedImage = await supabaseService.saveImageMetadata(imageData);
      
      // Create Image model instance
      const image = Image.fromSupabase(savedImage);
      
      // Update state
      setCurrentImage(image);
      setImageHistory([image]);
      
      return image;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [user]);

  /**
   * Apply adjustments to the current image
   * 
   * @param {Object} adjustments - Adjustment parameters
   * @returns {Promise<Object>} - Promise resolving to the adjusted image
   */
  const applyAdjustments = useCallback(async (adjustments) => {
    if (!currentImage) {
      throw new Error('No image selected');
    }

    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Check usage limits for free tier
      if (subscriptionTier === 'free' && editCount >= 5) {
        throw new Error('Free tier edit limit reached');
      }

      // Get the image file
      const imageUrl = currentImage.getDisplayUrl();
      const response = await fetch(imageUrl);
      const imageFile = await response.blob();

      // Apply adjustments
      const processedImage = await imageProcessing.applyAdjustments(imageFile, adjustments);
      
      // Upload the processed image
      const uploadResult = await supabaseService.uploadImage(
        processedImage, 
        user.id, 
        'edited'
      );

      // Update the image record
      const updatedImage = currentImage.updateEditedUrl(uploadResult.publicUrl);
      
      // Save edit history
      const editHistory = EditHistory.createAdjustment(
        currentImage.imageId,
        user.id,
        adjustments
      );
      
      await supabaseService.saveEditHistory(editHistory.toObject());
      
      // Update state
      setCurrentImage(updatedImage);
      setImageHistory(prev => [...prev, updatedImage]);
      setEditCount(prev => prev + 1);
      
      return updatedImage;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [currentImage, user, subscriptionTier, editCount]);

  /**
   * Remove background from the current image
   * 
   * @param {Object} options - Background removal options
   * @returns {Promise<Object>} - Promise resolving to the processed image
   */
  const removeBackground = useCallback(async (options = {}) => {
    if (!currentImage) {
      throw new Error('No image selected');
    }

    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Check usage limits for free tier
      if (subscriptionTier === 'free' && editCount >= 5) {
        throw new Error('Free tier edit limit reached');
      }

      // Get the image file
      const imageUrl = currentImage.getDisplayUrl();
      const response = await fetch(imageUrl);
      const imageFile = await response.blob();

      // Remove background
      const processedImage = await imageProcessing.removeBackground(imageFile, options);
      
      // Upload the processed image
      const uploadResult = await supabaseService.uploadImage(
        processedImage, 
        user.id, 
        'edited'
      );

      // Update the image record
      const updatedImage = currentImage.updateEditedUrl(uploadResult.publicUrl);
      
      // Save edit history
      const editHistory = EditHistory.createBackgroundRemoval(
        currentImage.imageId,
        user.id,
        options
      );
      
      await supabaseService.saveEditHistory(editHistory.toObject());
      
      // Update state
      setCurrentImage(updatedImage);
      setImageHistory(prev => [...prev, updatedImage]);
      setEditCount(prev => prev + 1);
      
      return updatedImage;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [currentImage, user, subscriptionTier, editCount]);

  /**
   * Apply a filter to the current image
   * 
   * @param {string} filterType - The type of filter to apply
   * @param {Object} options - Filter options
   * @returns {Promise<Object>} - Promise resolving to the processed image
   */
  const applyFilter = useCallback(async (filterType, options = {}) => {
    if (!currentImage) {
      throw new Error('No image selected');
    }

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if this is a pro feature
    const isProFeature = ['artistic', 'premium'].includes(filterType);
    if (isProFeature && subscriptionTier === 'free') {
      throw new Error('This filter requires a Pro or Premium subscription');
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Check usage limits for free tier
      if (subscriptionTier === 'free' && editCount >= 5) {
        throw new Error('Free tier edit limit reached');
      }

      // Get the image file
      const imageUrl = currentImage.getDisplayUrl();
      const response = await fetch(imageUrl);
      const imageFile = await response.blob();

      // Apply filter
      const processedImage = await imageProcessing.applyFilter(imageFile, filterType, options);
      
      // Upload the processed image
      const uploadResult = await supabaseService.uploadImage(
        processedImage, 
        user.id, 
        'edited'
      );

      // Update the image record
      const updatedImage = currentImage.updateEditedUrl(uploadResult.publicUrl);
      
      // Save edit history
      const editHistory = EditHistory.createFilter(
        currentImage.imageId,
        user.id,
        filterType,
        options
      );
      
      await supabaseService.saveEditHistory(editHistory.toObject());
      
      // Update state
      setCurrentImage(updatedImage);
      setImageHistory(prev => [...prev, updatedImage]);
      setEditCount(prev => prev + 1);
      
      return updatedImage;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [currentImage, user, subscriptionTier, editCount]);

  /**
   * Enhance the current image using AI
   * 
   * @param {Object} options - Enhancement options
   * @returns {Promise<Object>} - Promise resolving to the enhanced image
   */
  const enhanceImage = useCallback(async (options = {}) => {
    if (!currentImage) {
      throw new Error('No image selected');
    }

    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Check usage limits for free tier
      if (subscriptionTier === 'free' && editCount >= 5) {
        throw new Error('Free tier edit limit reached');
      }

      // Get the image file
      const imageUrl = currentImage.getDisplayUrl();
      const response = await fetch(imageUrl);
      const imageFile = await response.blob();

      // Enhance image
      const processedImage = await imageProcessing.enhanceImage(imageFile, options);
      
      // Upload the processed image
      const uploadResult = await supabaseService.uploadImage(
        processedImage, 
        user.id, 
        'edited'
      );

      // Update the image record
      const updatedImage = currentImage.updateEditedUrl(uploadResult.publicUrl);
      
      // Save edit history
      const editHistory = new EditHistory({
        imageId: currentImage.imageId,
        userId: user.id,
        operationType: 'aiEnhance',
        parameters: options
      });
      
      await supabaseService.saveEditHistory(editHistory.toObject());
      
      // Update state
      setCurrentImage(updatedImage);
      setImageHistory(prev => [...prev, updatedImage]);
      setEditCount(prev => prev + 1);
      
      return updatedImage;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [currentImage, user, subscriptionTier, editCount]);

  /**
   * Reset the current image to the original
   * 
   * @returns {Promise<Object>} - Promise resolving to the original image
   */
  const resetImage = useCallback(async () => {
    if (!currentImage || imageHistory.length <= 1) {
      return currentImage;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Get the original image
      const originalImage = imageHistory[0];
      
      // Update state
      setCurrentImage(originalImage);
      
      return originalImage;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [currentImage, imageHistory]);

  /**
   * Export the current image
   * 
   * @param {string} format - Export format ('png', 'jpg')
   * @param {number} quality - Export quality (0-100, for jpg)
   * @param {string} size - Export size ('original', 'large', 'medium', 'small')
   * @returns {Promise<Blob>} - Promise resolving to the exported image blob
   */
  const exportImage = useCallback(async (format = 'png', quality = 90, size = 'original') => {
    if (!currentImage) {
      throw new Error('No image selected');
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Get the image file
      const imageUrl = currentImage.getDisplayUrl();
      const response = await fetch(imageUrl);
      const imageFile = await response.blob();

      // Resize if needed
      let processedImage = imageFile;
      if (size !== 'original') {
        const dimensions = {
          large: { width: 2048 },
          medium: { width: 1024 },
          small: { width: 512 }
        };

        processedImage = await imageProcessing.resizeImage(
          imageFile,
          dimensions[size].width,
          null,
          true
        );
      }

      // Convert to the requested format
      const img = new Image();
      const imgLoaded = new Promise((resolve) => {
        img.onload = resolve;
      });
      img.src = URL.createObjectURL(processedImage);
      await imgLoaded;

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Get the blob in the requested format
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
          setIsProcessing(false);
        }, `image/${format}`, format === 'jpg' ? quality / 100 : undefined);
      });
    } catch (err) {
      setError(err.message);
      setIsProcessing(false);
      throw err;
    }
  }, [currentImage]);

  return {
    isProcessing,
    error,
    currentImage,
    imageHistory,
    editCount,
    uploadImage,
    applyAdjustments,
    removeBackground,
    applyFilter,
    enhanceImage,
    resetImage,
    exportImage,
    setCurrentImage,
    setImageHistory,
    setEditCount
  };
};

export default useImageProcessing;

