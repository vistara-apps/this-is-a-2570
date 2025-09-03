/**
 * Logger Utility
 * 
 * This module provides a simple logging utility for the application.
 */

// Log levels
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
};

// Default configuration
const defaultConfig = {
  level: process.env.NODE_ENV === 'production' ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG,
  enableTimestamp: true,
  enableSource: true,
  enableConsole: true,
  enableRemote: false,
  remoteUrl: null,
  batchSize: 10,
  batchInterval: 5000 // 5 seconds
};

// Current configuration
let config = { ...defaultConfig };

// Log batch for remote logging
let logBatch = [];
let batchTimeout = null;

/**
 * Configure the logger
 * 
 * @param {Object} newConfig - New configuration options
 */
export const configure = (newConfig = {}) => {
  config = { ...config, ...newConfig };
  
  // Set up batch logging if enabled
  if (config.enableRemote && config.remoteUrl) {
    if (batchTimeout) {
      clearInterval(batchTimeout);
    }
    
    batchTimeout = setInterval(flushLogs, config.batchInterval);
  }
};

/**
 * Format a log message
 * 
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {string} source - Source of the log
 * @param {Object} data - Additional data to log
 * @returns {Object} - Formatted log object
 */
const formatLog = (level, message, source, data) => {
  const log = {
    level,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (config.enableSource && source) {
    log.source = source;
  }
  
  if (data) {
    log.data = data;
  }
  
  return log;
};

/**
 * Format a log message for console output
 * 
 * @param {Object} log - Log object
 * @returns {string} - Formatted log message
 */
const formatConsoleLog = (log) => {
  let parts = [];
  
  if (config.enableTimestamp) {
    parts.push(`[${log.timestamp}]`);
  }
  
  parts.push(`[${log.level}]`);
  
  if (log.source) {
    parts.push(`[${log.source}]`);
  }
  
  parts.push(log.message);
  
  return parts.join(' ');
};

/**
 * Log to console
 * 
 * @param {Object} log - Log object
 */
const logToConsole = (log) => {
  if (!config.enableConsole) return;
  
  const formattedMessage = formatConsoleLog(log);
  
  switch (log.level) {
    case 'DEBUG':
      console.debug(formattedMessage, log.data || '');
      break;
    case 'INFO':
      console.info(formattedMessage, log.data || '');
      break;
    case 'WARN':
      console.warn(formattedMessage, log.data || '');
      break;
    case 'ERROR':
      console.error(formattedMessage, log.data || '');
      break;
    default:
      console.log(formattedMessage, log.data || '');
  }
};

/**
 * Add a log to the batch for remote logging
 * 
 * @param {Object} log - Log object
 */
const addToBatch = (log) => {
  if (!config.enableRemote) return;
  
  logBatch.push(log);
  
  if (logBatch.length >= config.batchSize) {
    flushLogs();
  }
};

/**
 * Flush logs to remote server
 */
const flushLogs = async () => {
  if (!config.enableRemote || !config.remoteUrl || logBatch.length === 0) return;
  
  const batchToSend = [...logBatch];
  logBatch = [];
  
  try {
    await fetch(config.remoteUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ logs: batchToSend })
    });
  } catch (error) {
    console.error('Failed to send logs to remote server:', error);
    
    // Add logs back to batch
    logBatch = [...batchToSend, ...logBatch];
  }
};

/**
 * Log a message
 * 
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {string} source - Source of the log
 * @param {Object} data - Additional data to log
 */
const log = (level, message, source = '', data = null) => {
  const logLevelValue = LOG_LEVELS[level];
  
  if (logLevelValue < config.level) return;
  
  const logObj = formatLog(level, message, source, data);
  
  logToConsole(logObj);
  addToBatch(logObj);
};

/**
 * Log a debug message
 * 
 * @param {string} message - Log message
 * @param {string} source - Source of the log
 * @param {Object} data - Additional data to log
 */
export const debug = (message, source = '', data = null) => {
  log('DEBUG', message, source, data);
};

/**
 * Log an info message
 * 
 * @param {string} message - Log message
 * @param {string} source - Source of the log
 * @param {Object} data - Additional data to log
 */
export const info = (message, source = '', data = null) => {
  log('INFO', message, source, data);
};

/**
 * Log a warning message
 * 
 * @param {string} message - Log message
 * @param {string} source - Source of the log
 * @param {Object} data - Additional data to log
 */
export const warn = (message, source = '', data = null) => {
  log('WARN', message, source, data);
};

/**
 * Log an error message
 * 
 * @param {string} message - Log message
 * @param {string} source - Source of the log
 * @param {Object} data - Additional data to log
 */
export const error = (message, source = '', data = null) => {
  log('ERROR', message, source, data);
};

/**
 * Create a logger for a specific source
 * 
 * @param {string} source - Source name
 * @returns {Object} - Logger object
 */
export const createLogger = (source) => {
  return {
    debug: (message, data) => debug(message, source, data),
    info: (message, data) => info(message, source, data),
    warn: (message, data) => warn(message, source, data),
    error: (message, data) => error(message, source, data)
  };
};

// Export default logger
export default {
  configure,
  debug,
  info,
  warn,
  error,
  createLogger,
  flushLogs,
  LOG_LEVELS
};

