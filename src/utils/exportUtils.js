/**
 * Export Utilities
 * 
 * This module provides utility functions for exporting images in various formats.
 */

/**
 * Exports an image with applied filters
 * 
 * @param {HTMLImageElement} image - The image element
 * @param {Object} adjustments - Adjustment parameters
 * @param {string} format - Export format ('png', 'jpg', 'webp')
 * @param {number} quality - Export quality (0-100, for jpg and webp)
 * @param {Object} size - Export size options
 * @param {number} size.width - Target width (optional)
 * @param {number} size.height - Target height (optional)
 * @param {boolean} size.maintainAspectRatio - Whether to maintain aspect ratio
 * @returns {Promise<Blob>} - Promise resolving to the exported image blob
 */
export const exportImage = (image, adjustments, format = 'png', quality = 90, size = {}) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate dimensions
      let targetWidth = size.width || image.naturalWidth;
      let targetHeight = size.height || image.naturalHeight;
      
      if (size.maintainAspectRatio !== false && (size.width || size.height)) {
        const aspectRatio = image.naturalWidth / image.naturalHeight;
        
        if (size.width && !size.height) {
          targetHeight = size.width / aspectRatio;
        } else if (size.height && !size.width) {
          targetWidth = size.height * aspectRatio;
        } else {
          // Both width and height provided, use the more restrictive dimension
          const widthRatio = size.width / image.naturalWidth;
          const heightRatio = size.height / image.naturalHeight;
          
          if (widthRatio < heightRatio) {
            targetHeight = size.width / aspectRatio;
          } else {
            targetWidth = size.height * aspectRatio;
          }
        }
      }
      
      // Set canvas dimensions
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      // Apply filters if provided
      if (adjustments) {
        const filterString = [
          adjustments.brightness !== 0 ? `brightness(${100 + adjustments.brightness}%)` : '',
          adjustments.contrast !== 0 ? `contrast(${100 + adjustments.contrast}%)` : '',
          adjustments.saturation !== 0 ? `saturate(${100 + adjustments.saturation}%)` : '',
          adjustments.blur > 0 ? `blur(${adjustments.blur}px)` : '',
          adjustments.sepia > 0 ? `sepia(${adjustments.sepia}%)` : '',
          adjustments.hueRotate !== 0 ? `hue-rotate(${adjustments.hueRotate}deg)` : ''
        ].filter(Boolean).join(' ');
        
        ctx.filter = filterString;
      }
      
      // Draw the image on the canvas
      ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
      
      // Convert the canvas to a blob
      const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      }, mimeType, quality / 100);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generates a download link for an image blob
 * 
 * @param {Blob} blob - The image blob
 * @param {string} fileName - The file name
 * @returns {string} - The download URL
 */
export const generateDownloadLink = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  return link;
};

/**
 * Triggers a download for an image blob
 * 
 * @param {Blob} blob - The image blob
 * @param {string} fileName - The file name
 */
export const downloadImage = (blob, fileName) => {
  const link = generateDownloadLink(blob, fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

/**
 * Converts a blob to a base64 data URL
 * 
 * @param {Blob} blob - The blob to convert
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
 * Gets the appropriate file extension for a format
 * 
 * @param {string} format - The format ('png', 'jpg', 'webp')
 * @returns {string} - The file extension
 */
export const getFileExtension = (format) => {
  switch (format.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
      return 'jpg';
    case 'png':
      return 'png';
    case 'webp':
      return 'webp';
    default:
      return format.toLowerCase();
  }
};

/**
 * Generates a file name with timestamp
 * 
 * @param {string} baseName - The base file name
 * @param {string} format - The format ('png', 'jpg', 'webp')
 * @returns {string} - The generated file name
 */
export const generateFileName = (baseName = 'pixelflow', format = 'png') => {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
  const extension = getFileExtension(format);
  return `${baseName}-${timestamp}.${extension}`;
};

