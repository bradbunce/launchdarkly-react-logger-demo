import { Logger } from '@bradbunce/launchdarkly-react-logger';

/**
 * LaunchDarkly Logger Configuration
 * 
 * Required Feature Flags:
 * 1. Console Log Level Flag (number 0-5)
 *    - FATAL (0) 💀 Most severe, always shown
 *    - ERROR (1) 🔴 Error conditions
 *    - WARN  (2) 🟡 Warning conditions
 *    - INFO  (3) 🔵 General information
 *    - DEBUG (4) ⚪ Debug information
 *    - TRACE (5) 🟣 Most detailed information
 * 
 * 2. SDK Log Level Flag (string)
 *    Values: 'error', 'warn', 'info', 'debug'
 */

// Create logger with your flag keys
const logger = new Logger({
  // Your LaunchDarkly feature flag keys
  consoleLogFlagKey: 'console-log-level',  // Number flag (0-5)
  sdkLogFlagKey: 'sdk-log-level'          // String flag
});

// Log initialization
console.log('LaunchDarkly logger created with flags:', {
  consoleLogFlagKey: logger.config.consoleLogFlagKey,
  sdkLogFlagKey: logger.config.sdkLogFlagKey
});

export { logger };
