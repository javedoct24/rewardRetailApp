/**
 * logger infos
*/

const isLoggingEnabled =
  typeof process !== 'undefined' && process.env?.VITE_ENABLE_LOGS !== undefined
    ? process.env.VITE_ENABLE_LOGS !== 'false'
    : true;

const logger = {
  /* Log informational messages*/
  info: (...args) => {
    if (isLoggingEnabled) {
      console.info('[INFO]', ...args);
    }
  },

  warn: (...args) => {
    if (isLoggingEnabled) {
      console.warn('[WARN]', ...args);
    }
  },

  error: (...args) => {
    console.error('[ERROR]', ...args);
  },
};

export default logger;