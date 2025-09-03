/**
 * Error Reporting Utilities
 * 
 * This module provides utility functions for error reporting and logging.
 */

/**
 * Log an error to the console with additional context
 * 
 * @param {Error|string} error - The error to log
 * @param {string} context - Context information about where the error occurred
 * @param {Object} additionalData - Additional data to log with the error
 */
export const logError = (error, context = '', additionalData = {}) => {
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  const timestamp = new Date().toISOString();
  
  console.error(
    `[${timestamp}] Error in ${context}:`,
    errorObj,
    additionalData
  );
};

/**
 * Format an error for display to the user
 * 
 * @param {Error|string} error - The error to format
 * @param {boolean} includeStack - Whether to include the stack trace
 * @returns {string} - Formatted error message
 */
export const formatErrorForUser = (error, includeStack = false) => {
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  
  // Map known error types to user-friendly messages
  const knownErrors = {
    'NetworkError': 'Network connection error. Please check your internet connection and try again.',
    'AuthenticationError': 'Authentication error. Please log in again.',
    'PermissionError': 'You do not have permission to perform this action.',
    'ValidationError': 'The data you entered is invalid. Please check your inputs and try again.',
    'RateLimitError': 'You have reached the rate limit. Please try again later.',
    'ServerError': 'Server error. Please try again later.',
    'NotFoundError': 'The requested resource was not found.',
    'TimeoutError': 'The request timed out. Please try again.'
  };
  
  // Check if the error is a known type
  for (const [errorType, message] of Object.entries(knownErrors)) {
    if (errorObj.name === errorType || errorObj.message.includes(errorType)) {
      return message;
    }
  }
  
  // Default error message
  let userMessage = 'An unexpected error occurred. Please try again.';
  
  // Include original error message in development
  if (process.env.NODE_ENV === 'development') {
    userMessage += ` (${errorObj.message})`;
    
    if (includeStack && errorObj.stack) {
      userMessage += `\n\nStack trace:\n${errorObj.stack}`;
    }
  }
  
  return userMessage;
};

/**
 * Report an error to a hypothetical error tracking service
 * 
 * @param {Error|string} error - The error to report
 * @param {string} context - Context information about where the error occurred
 * @param {Object} metadata - Additional metadata to include with the error report
 * @returns {Promise<string>} - Promise resolving to the error report ID
 */
export const reportErrorToService = async (error, context = '', metadata = {}) => {
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  
  // Log the error locally
  logError(errorObj, context, metadata);
  
  // In a real app, this would send the error to a service like Sentry, LogRocket, etc.
  // For now, we'll just simulate it
  
  // Simulate API call to error reporting service
  return new Promise((resolve) => {
    setTimeout(() => {
      const reportId = `ERR-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
      console.info(`Error reported with ID: ${reportId}`);
      resolve(reportId);
    }, 500);
  });
};

/**
 * Create an error with a specific type
 * 
 * @param {string} message - The error message
 * @param {string} type - The error type
 * @returns {Error} - The created error
 */
export const createTypedError = (message, type) => {
  const error = new Error(message);
  error.name = type;
  return error;
};

// Export specific error types
export const NetworkError = (message) => createTypedError(message || 'Network error', 'NetworkError');
export const AuthenticationError = (message) => createTypedError(message || 'Authentication error', 'AuthenticationError');
export const PermissionError = (message) => createTypedError(message || 'Permission denied', 'PermissionError');
export const ValidationError = (message) => createTypedError(message || 'Validation error', 'ValidationError');
export const RateLimitError = (message) => createTypedError(message || 'Rate limit exceeded', 'RateLimitError');
export const ServerError = (message) => createTypedError(message || 'Server error', 'ServerError');
export const NotFoundError = (message) => createTypedError(message || 'Resource not found', 'NotFoundError');
export const TimeoutError = (message) => createTypedError(message || 'Request timed out', 'TimeoutError');

