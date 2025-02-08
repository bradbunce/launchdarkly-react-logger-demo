/**
 * LaunchDarkly Configuration
 * Defines context kinds and their properties for feature flag evaluation
 */

// Validate required environment variables at startup
const requiredEnvVars = [
  'VITE_NODE_ENV',
  'VITE_LD_CLIENT_ID',
  'VITE_APP_NAME',
  'VITE_LD_SDK_LOG_FLAG_KEY',
  'VITE_LD_CONSOLE_LOG_FLAG_KEY'
];

const missingEnvVars = requiredEnvVars.filter(
  varName => !import.meta.env[varName]
);

if (missingEnvVars.length > 0) {
  console.log('Available env vars:', import.meta.env);
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
}

// Valid SDK log levels
export const SDK_LOG_LEVELS = ['error', 'warn', 'info', 'debug'];

// Valid console log levels
export const CONSOLE_LOG_LEVELS = {
  FATAL: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  TRACE: 5
};

// Local storage keys
export const SDK_LOG_LEVEL_STORAGE_KEY = 'ld_sdk_log_level';

/**
 * Gets the stored SDK log level from localStorage
 * @returns {string} The stored log level or 'info' as default
 */
export const getStoredLogLevel = () => {
  const storedLevel = localStorage.getItem(SDK_LOG_LEVEL_STORAGE_KEY);
  return (storedLevel && SDK_LOG_LEVELS.includes(storedLevel))
    ? storedLevel
    : 'info';
};

/**
 * Stores the SDK log level in localStorage
 * @param {string} level - The log level to store
 * @returns {boolean} True if level was valid and stored, false otherwise
 */
export const storeLogLevel = (level) => {
  if (SDK_LOG_LEVELS.includes(level)) {
    localStorage.setItem(SDK_LOG_LEVEL_STORAGE_KEY, level);
    return true;
  }
  return false;
};

export const ContextKinds = {
  USER: {
    kind: "user",
    createContext: (userData) => ({
      kind: "user",
      key: userData?.username || "anonymous",
      name: userData?.name,
      email: userData?.email,
      anonymous: !userData?.username,
    }),
  },

  APPLICATION: {
    kind: "application",
    createContext: () => ({
      kind: "application",
      key: import.meta.env.VITE_APP_NAME,
      environment: import.meta.env.VITE_NODE_ENV,
    }),
  },
};

export const createLDContexts = (userData) => {
  return {
    kind: "multi",
    user: ContextKinds.USER.createContext(userData),
    application: ContextKinds.APPLICATION.createContext()
  };
};

export const evaluateApplicationFlag = (ldClient, flagKey) => {
  const applicationContext = ContextKinds.APPLICATION.createContext();
  return ldClient.variation(flagKey, applicationContext, false);
};

/**
 * Evaluates the SDK log level flag
 */
export const evaluateSDKLogLevel = (ldClient, context) => {
  const flagKey = import.meta.env.VITE_LD_SDK_LOG_FLAG_KEY;
  if (!flagKey) {
    console.warn("SDK log level flag key not configured");
    return { value: null, isValid: false };
  }

  const value = ldClient.variation(flagKey, context, getStoredLogLevel());
  const isValid = SDK_LOG_LEVELS.includes(value);
  
  if (isValid) {
    storeLogLevel(value);
  }

  return { value, isValid };
};

/**
 * Evaluates the console log level flag
 */
export const evaluateConsoleLogLevel = (ldClient, context) => {
  const flagKey = import.meta.env.VITE_LD_CONSOLE_LOG_FLAG_KEY;
  if (!flagKey) {
    console.warn("Console log level flag key not configured");
    return { value: null, isValid: false };
  }

  const value = ldClient.variation(flagKey, context, CONSOLE_LOG_LEVELS.INFO);
  const isValid = Object.values(CONSOLE_LOG_LEVELS).includes(value);
  
  return { value, isValid };
};

// Export the configuration for the LDProvider
export const ldConfig = {
  clientSideID: import.meta.env.VITE_LD_CLIENT_ID,
  options: {
    bootstrap: 'localStorage'
  }
};

export const loggerConfig = {
  consoleLogFlagKey: import.meta.env.VITE_LD_CONSOLE_LOG_FLAG_KEY,
  sdkLogFlagKey: import.meta.env.VITE_LD_SDK_LOG_FLAG_KEY,
  clientSideId: import.meta.env.VITE_LD_CLIENT_ID,
  environment: import.meta.env.VITE_NODE_ENV,
  appName: import.meta.env.VITE_APP_NAME
};
