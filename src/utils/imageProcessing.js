/**
 * Image Processing Utilities
 * 
 * This module provides utility functions for image processing operations.
 */

import { perfectCorpService, apyHubService, openaiService } from '../services';

/**
 * Applies basic adjustments to an image
 * 
 * @param {Blob|File} imageFile - The image file to process
 * @param {Object} adjustments - Adjustment parameters
 * @returns {Promise<Blob>} - Promise resolving to the processed image blob
 */
export const applyAdjustments = async (imageFile, adjustments) => {
  try {
    // Use Perfect Corp API for basic adjustments
    return await perfectCorpService.applyBasicAdjustments(imageFile, adjustments);
  } catch (error) {
    console.error('Error applying adjustments:', error);
    
    // Fallback to ApyHub API if Perfect Corp fails
    try {
      return await apyHubService.applyAdjustments(imageFile, adjustments);
    } catch (fallbackError) {
      console.error('Fallback error applying adjustments:', fallbackError);
      throw new Error('Failed to apply adjustments to image');
    }
  }
};

/**
 * Removes the background from an image
 * 
 * @param {Blob|File} imageFile - The image file to process
 * @param {Object} options - Background removal options
 * @returns {Promise<Blob>} - Promise resolving to the processed image blob
 */
export const removeBackground = async (imageFile, options = {}) => {
  try {
    // Use Perfect Corp API for background removal
    return await perfectCorpService.removeBackground(imageFile, options);
  } catch (error) {
    console.error('Error removing background:', error);
    throw new Error('Failed to remove background from image');
  }
};

/**
 * Applies an artistic filter to an image
 * 
 * @param {Blob|File} imageFile - The image file to process
 * @param {string} filterType - The type of filter to apply
 * @param {Object} options - Filter options
 * @returns {Promise<Blob>} - Promise resolving to the processed image blob
 */
export const applyFilter = async (imageFile, filterType, options = {}) => {
  try {
    // Use ApyHub API for filters
    return await apyHubService.applyFilter(imageFile, filterType, options);
  } catch (error) {
    console.error('Error applying filter:', error);
    throw new Error('Failed to apply filter to image');
  }
};

/**
 * Enhances an image using AI
 * 
 * @param {Blob|File} imageFile - The image file to process
 * @param {Object} options - Enhancement options
 * @returns {Promise<Blob>} - Promise resolving to the processed image blob
 */
export const enhanceImage = async (imageFile, options = {}) => {
  try {
    // Use Perfect Corp API for enhancement
    return await perfectCorpService.enhanceImage(imageFile, options);
  } catch (error) {
    console.error('Error enhancing image:', error);
    throw new Error('Failed to enhance image');
  }
};

/**
 * Creates a variation of an image using AI
 * 
 * @param {Blob|File} imageFile - The image file to process
 * @param {string} prompt - Text prompt for the variation
 * @param {Object} options - Variation options
 * @returns {Promise<Blob>} - Promise resolving to the processed image blob
 */
export const createVariation = async (imageFile, prompt, options = {}) => {
  try {
    // Use OpenAI API for image variations
    const result = await openaiService.editImage(imageFile, prompt, options);
    
    // Convert the result URL to a blob
    const response = await fetch(result.url);
    return await response.blob();
  } catch (error) {
    console.error('Error creating image variation:', error);
    throw new Error('Failed to create image variation');
  }
};

/**
 * Applies a canvas filter to an image
 * 
 * @param {HTMLImageElement} image - The image element
 * @param {Object} adjustments - Adjustment parameters
 * @returns {Promise<Blob>} - Promise resolving to the processed image blob
 */
export const applyCanvasFilter = (image, adjustments) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions to match the image
      canvas.width = image.width;
      canvas.height = image.height;
      
      // Build the CSS filter string
      const filterString = [
        adjustments.brightness !== 0 ? `brightness(${100 + adjustments.brightness}%)` : '',
        adjustments.contrast !== 0 ? `contrast(${100 + adjustments.contrast}%)` : '',
        adjustments.saturation !== 0 ? `saturate(${100 + adjustments.saturation}%)` : '',
        adjustments.blur > 0 ? `blur(${adjustments.blur}px)` : '',
        adjustments.sepia > 0 ? `sepia(${adjustments.sepia}%)` : '',
        adjustments.hueRotate !== 0 ? `hue-rotate(${adjustments.hueRotate}deg)` : ''
      ].filter(Boolean).join(' ');
      
      // Apply the filter
      ctx.filter = filterString;
      
      // Draw the image on the canvas
      ctx.drawImage(image, 0, 0);
      
      // Convert the canvas to a blob
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Resizes an image
 * 
 * @param {Blob|File} imageFile - The image file to resize
 * @param {number} width - Target width
 * @param {number} height - Target height
 * @param {boolean} maintainAspectRatio - Whether to maintain aspect ratio
 * @returns {Promise<Blob>} - Promise resolving to the resized image blob
 */
export const resizeImage = (imageFile, width, height, maintainAspectRatio = true) => {
  return new Promise((resolve, reject) => {
    try {
      // Create an image element
      const img = new Image();
      
      // Set up image onload handler
      img.onload = () => {
        // Calculate dimensions
        let targetWidth = width;
        let targetHeight = height;
        
        if (maintainAspectRatio) {
          const aspectRatio = img.width / img.height;
          
          if (width && !height) {
            targetHeight = width / aspectRatio;
          } else if (height && !width) {
            targetWidth = height * aspectRatio;
          } else {
            // Both width and height provided, use the more restrictive dimension
            const widthRatio = width / img.width;
            const heightRatio = height / img.height;
            
            if (widthRatio < heightRatio) {
              targetHeight = width / aspectRatio;
            } else {
              targetWidth = height * aspectRatio;
            }
          }
        }
        
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        // Convert the canvas to a blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        }, imageFile.type);
      };
      
      // Set up image onerror handler
      img.onerror = () => {
        reject(new Error('Failed to load image for resizing'));
      };
      
      // Load the image
      img.src = URL.createObjectURL(imageFile);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Converts a data URL to a Blob
 * 
 * @param {string} dataUrl - The data URL to convert
 * @returns {Blob} - The converted Blob
 */
export const dataUrlToBlob = (dataUrl) => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
};

/**
 * Converts a Blob to a data URL
 * 
 * @param {Blob} blob - The Blob to convert
 * @returns {Promise<string>} - Promise resolving to the data URL
 */
export const blobToDataUrl = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Gets the dimensions of an image
 * 
 * @param {Blob|File} imageFile - The image file
 * @returns {Promise<Object>} - Promise resolving to an object with width and height
 */
export const getImageDimensions = (imageFile) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(imageFile);
  });
};

