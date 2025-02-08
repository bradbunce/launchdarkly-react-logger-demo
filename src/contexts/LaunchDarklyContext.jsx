import { createContext, useContext, useState, useEffect } from "react";
import { withLDProvider, useLDClient as useOriginalLDClient } from "launchdarkly-react-client-sdk";
import { basicLogger } from "launchdarkly-js-client-sdk";
import PropTypes from "prop-types";
import { logger } from "../config/logger";

// Map numeric log levels to names
const LOG_LEVEL_NAMES = {
  0: 'FATAL',
  1: 'ERROR',
  2: 'WARN',
  3: 'INFO',
  4: 'DEBUG',
  5: 'TRACE'
};

// Create context for LaunchDarkly client
const LDContext = createContext(null);

// Component to handle SDK log level changes
const SdkLogLevelHandler = () => {
  const ldClient = useOriginalLDClient();

  useEffect(() => {
    if (!ldClient) return;

    const handleSdkLogLevelChange = async () => {
      const newValue = await ldClient.variation('sdk-log-level', 'info');
      const storedValue = localStorage.getItem('ld-sdk-log-level');

      if (newValue !== storedValue) {
        console.error('🚩 SDK Log Level Change:', {
          stored: storedValue || 'none (using default)',
          new: newValue,
          action: 'Refresh required to take effect'
        });
        localStorage.setItem('ld-sdk-log-level', newValue);
        window.location.reload();
      }
    };

    ldClient.on('ready', handleSdkLogLevelChange);
    ldClient.on('change:sdk-log-level', handleSdkLogLevelChange);

    return () => {
      ldClient.off('ready', handleSdkLogLevelChange);
      ldClient.off('change:sdk-log-level', handleSdkLogLevelChange);
    };
  }, [ldClient]);

  return null;
};

// Create the base component that handles initialization
const WrappedComponent = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const ldClient = useOriginalLDClient();
  
  logger.debug('WrappedComponent rendered with original client:', !!ldClient);

  useEffect(() => {
    logger.debug('WrappedComponent useEffect triggered:', { 
      hasClient: !!ldClient, 
      isInitialized: initialized 
    });

    if (ldClient && !initialized) {
      logger.info('Attempting to initialize LaunchDarkly client...');
      
      ldClient.waitForInitialization(3000) // 3 second timeout
        .then(async () => {
          // Get and log current flag values
          const consoleLevel = await ldClient.variation('console-log-level', 3);
          const sdkLevel = await ldClient.variation('sdk-log-level', 'info');
          
          console.error('🚩 LaunchDarkly Flag Values:', {
            'console-log-level': `${consoleLevel} (${LOG_LEVEL_NAMES[consoleLevel]})`,
            'sdk-log-level': sdkLevel
          });

          logger.info('LaunchDarkly initialization complete');
          setInitialized(true);

          // Set up flag change listeners
          ldClient.on('change', (changes) => {
            // Format and log flag changes
            const formattedChanges = { ...changes };
            if (formattedChanges['console-log-level']) {
              const level = formattedChanges['console-log-level'].current;
              formattedChanges['console-log-level'].current = `${level} (${LOG_LEVEL_NAMES[level]})`;
            }
            console.error('🚩 LaunchDarkly Flag Changes:', formattedChanges);
          });
        })
        .catch(error => {
          logger.error('Error initializing LaunchDarkly client:', error);
        });

      // Clean up listeners when component unmounts
      return () => {
        if (ldClient) {
          ldClient.off('change');
        }
      };
    }
  }, [ldClient, initialized]);

  if (!initialized) {
    logger.debug('Showing loading state - waiting for initialization');
    return <div>Loading feature flags...</div>;
  }

  logger.debug('Initialization complete - rendering children');
  return (
    <LDContext.Provider value={ldClient}>
      <SdkLogLevelHandler />
      {children}
    </LDContext.Provider>
  );
};

WrappedComponent.propTypes = {
  children: PropTypes.node.isRequired
};

// Export the LaunchDarkly provider
export const LDProvider = ({ children }) => {
  logger.debug('LDProvider rendering');
  
  // Initialize with stored or default SDK log level
  const sdkLogLevel = localStorage.getItem('ld-sdk-log-level') || 'info';
  console.error('🔧 Initializing LaunchDarkly SDK with log level:', sdkLogLevel);

  // Initialize with current SDK log level
  const LDComponent = withLDProvider({
    clientSideID: import.meta.env.VITE_LD_CLIENT_ID,
    options: {
      // Use SDK's built-in basicLogger which automatically uses appropriate console methods:
      // - console.log for debug
      // - console.info for info
      // - console.warn for warnings
      // - console.error for errors
      logger: basicLogger({ level: sdkLogLevel })
    }
  })(WrappedComponent);

  return <LDComponent>{children}</LDComponent>;
};

LDProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Export hook to access LaunchDarkly client
export const useLDClient = () => {
  const ldClient = useContext(LDContext);
  if (!ldClient) {
    throw new Error("useLDClient must be used within a LDProvider");
  }
  return ldClient;
};

export default LDProvider;
