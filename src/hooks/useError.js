import { useState, useCallback } from 'react';

/**
 * Custom hook for error handling
 * 
 * @param {Object} options - Hook options
 * @param {Function} options.onError - Callback function to run when an error occurs
 * @param {boolean} options.logErrors - Whether to log errors to console
 * @returns {Object} Error handling methods and state
 */
const useError = (options = {}) => {
  const { onError, logErrors = true } = options;
  const [error, setError] = useState(null);
  const [hasError, setHasError] = useState(false);

  /**
   * Handle an error
   * 
   * @param {Error|string} err - The error to handle
   * @param {string} context - Optional context information
   */
  const handleError = useCallback((err, context = '') => {
    const errorObj = typeof err === 'string' ? new Error(err) : err;
    
    // Add context to error message if provided
    if (context) {
      errorObj.message = `[${context}] ${errorObj.message}`;
    }
    
    // Log error to console if enabled
    if (logErrors) {
      console.error('Error:', errorObj);
    }
    
    // Update state
    setError(errorObj);
    setHasError(true);
    
    // Call onError callback if provided
    if (onError && typeof onError === 'function') {
      onError(errorObj, context);
    }
    
    return errorObj;
  }, [logErrors, onError]);

  /**
   * Clear the current error
   */
  const clearError = useCallback(() => {
    setError(null);
    setHasError(false);
  }, []);

  /**
   * Wrap a function with error handling
   * 
   * @param {Function} fn - The function to wrap
   * @param {string} context - Optional context information
   * @returns {Function} - The wrapped function
   */
  const withErrorHandling = useCallback((fn, context = '') => {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (err) {
        handleError(err, context);
        throw err;
      }
    };
  }, [handleError]);

  /**
   * Try to execute a function and handle any errors
   * 
   * @param {Function} fn - The function to execute
   * @param {Array} args - Arguments to pass to the function
   * @param {string} context - Optional context information
   * @returns {Object} - Object containing result or error
   */
  const tryCatch = useCallback(async (fn, args = [], context = '') => {
    try {
      const result = await fn(...args);
      return { result, error: null, success: true };
    } catch (err) {
      const handledError = handleError(err, context);
      return { result: null, error: handledError, success: false };
    }
  }, [handleError]);

  return {
    error,
    hasError,
    handleError,
    clearError,
    withErrorHandling,
    tryCatch
  };
};

export default useError;

