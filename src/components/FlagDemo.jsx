import { useState, useEffect, useCallback } from 'react';
import { useLDClient } from '../contexts/LaunchDarklyContext';
import { useLogger } from '@bradbunce/launchdarkly-react-logger';
import { logger } from '../config/logger';

// Map console level to name
const LOG_LEVEL_NAMES = {
  0: 'FATAL',
  1: 'ERROR',
  2: 'WARN',
  3: 'INFO',
  4: 'DEBUG',
  5: 'TRACE'
};

function FlagDemo() {
  const [demoCount, setDemoCount] = useState(0);
  const [consoleLogLevel, setConsoleLogLevel] = useState(null);
  const [sdkLogLevel, setSdkLogLevel] = useState(null);
  const [lastEvalTime, setLastEvalTime] = useState(null);
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const ldClient = useLDClient();

  // Function to update console log level
  const updateConsoleLogLevel = useCallback(async () => {
    if (!ldClient) return;
    try {
      const level = await ldClient.variation('console-log-level', 3);
      setConsoleLogLevel(level);
    } catch (error) {
      console.error('Error getting console log level:', error);
    }
  }, [ldClient]);

  // Function to update SDK log level
  const updateSdkLogLevel = useCallback(async () => {
    if (!ldClient) return;
    try {
      const level = await ldClient.variation('sdk-log-level', 'info');
      setSdkLogLevel(level);
    } catch (error) {
      console.error('Error getting SDK log level:', error);
    }
  }, [ldClient]);

  // Listen for flag changes
  useEffect(() => {
    if (!ldClient) return;

    // Get initial values
    updateConsoleLogLevel();
    updateSdkLogLevel();

    // Set up change listeners
    const handleConsoleLogLevelChange = () => {
      updateConsoleLogLevel();
    };

    const handleSdkLogLevelChange = () => {
      updateSdkLogLevel();
    };

    ldClient.on('change:console-log-level', handleConsoleLogLevelChange);
    ldClient.on('change:sdk-log-level', handleSdkLogLevelChange);

    return () => {
      ldClient.off('change:console-log-level', handleConsoleLogLevelChange);
      ldClient.off('change:sdk-log-level', handleSdkLogLevelChange);
    };
  }, [ldClient, updateConsoleLogLevel, updateSdkLogLevel]);

  const log = useLogger(logger);

  // Function to evaluate flags and generate events
  const evaluateFlags = useCallback(async () => {
    try {
      const consoleLevel = await ldClient.variation('console-log-level', 3);
      const sdkLevel = await ldClient.variation('sdk-log-level', 'info');

      // Update state with latest values
      setConsoleLogLevel(consoleLevel);
      setSdkLogLevel(sdkLevel);

      log.info('Flag evaluation results:', {
        'console-log-level': `${consoleLevel} (${LOG_LEVEL_NAMES[consoleLevel]})`,
        'sdk-log-level': sdkLevel
      });

      // Generate different types of logs to test levels
      log.group('Flag Demo Evaluation');
      log.fatal('💀 Testing fatal log');
      log.error('🔴 Testing error log');
      log.warn('🟡 Testing warning log');
      log.info('🔵 Testing info log');
      log.debug('⚪ Testing debug log');
      log.trace('🟣 Testing trace log');
      log.groupEnd();

      return { consoleLevel, sdkLevel };
    } catch (error) {
      console.error('Error evaluating flags:', error);
      return null;
    }
  }, [ldClient, log]);

  // Initial flag evaluation
  useEffect(() => {
    if (ldClient) {
      evaluateFlags();
    }
  }, [ldClient, evaluateFlags]);

  return (
    <div style={{ 
      padding: '30px',
      border: '2px solid #007bff',
      borderRadius: '8px',
      margin: '30px auto',
      maxWidth: '600px',
      backgroundColor: '#f8f9fa'
    }}>
      <h2 style={{ color: '#007bff', marginBottom: '20px' }}>LaunchDarkly React Logger Utility Demo</h2>
      
      <div style={{ 
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#fff',
        borderRadius: '4px',
        border: '1px solid #ddd'
      }}>
        <h3 style={{ color: '#333', marginBottom: '15px', fontSize: '1.1em' }}>Current Flag Values:</h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', border: '1px solid #dee2e6', borderRadius: '6px', padding: '12px' }}>
            <h4 style={{ 
              color: '#007bff', 
              marginBottom: '4px', 
              fontSize: '1.1em',
              fontWeight: '600'
            }}>Console Log Level</h4>
            <strong style={{ fontSize: '0.9em' }}>Current Value:</strong>
            <div style={{ 
              backgroundColor: consoleLogLevel !== null ? {
                0: '#ffebee', // FATAL - light red
                1: '#ffebee', // ERROR - light red
                2: '#fff3e0', // WARN - light yellow
                3: '#e3f2fd', // INFO - light blue
                4: '#f5f5f5', // DEBUG - light gray
                5: '#f3e5f5'  // TRACE - light purple
              }[consoleLogLevel] : '#f0f0f0',
              color: consoleLogLevel !== null ? {
                0: '#d32f2f', // FATAL - dark red
                1: '#d32f2f', // ERROR - dark red
                2: '#f57c00', // WARN - dark orange
                3: '#1976d2', // INFO - dark blue
                4: '#757575', // DEBUG - dark gray
                5: '#7b1fa2'  // TRACE - dark purple
              }[consoleLogLevel] : '#666',
              padding: '8px',
              borderRadius: '4px',
              marginTop: '5px',
              fontWeight: 'bold'
            }}>
              {consoleLogLevel !== null ? `${consoleLogLevel} (${LOG_LEVEL_NAMES[consoleLogLevel]})` : 'Loading...'}
            </div>
            <p style={{ 
              fontSize: '0.8em',
              color: '#666',
              marginTop: '5px',
              fontStyle: 'italic'
            }}>
              Controls which application log messages appear in the browser console:
              0=FATAL, 1=ERROR, 2=WARN, 3=INFO, 4=DEBUG, 5=TRACE
            </p>
          </div>
          <div style={{ flex: 1, minWidth: '200px', border: '1px solid #dee2e6', borderRadius: '6px', padding: '12px' }}>
            <h4 style={{ 
              color: '#007bff', 
              marginBottom: '4px', 
              fontSize: '1.1em',
              fontWeight: '600'
            }}>SDK Log Level</h4>
            <strong style={{ fontSize: '0.9em' }}>Current Value:</strong>
            <div style={{ 
              backgroundColor: sdkLogLevel ? {
                'error': '#ffebee', // light red
                'warn': '#fff3e0',  // light yellow
                'info': '#e3f2fd',  // light blue
                'debug': '#f5f5f5'  // light gray
              }[sdkLogLevel] : '#f0f0f0',
              color: sdkLogLevel ? {
                'error': '#d32f2f', // dark red
                'warn': '#f57c00',  // dark orange
                'info': '#1976d2',  // dark blue
                'debug': '#757575'  // dark gray
              }[sdkLogLevel] : '#666',
              padding: '8px',
              borderRadius: '4px',
              marginTop: '5px',
              fontWeight: 'bold'
            }}>
              {sdkLogLevel || 'Loading...'}
            </div>
            <p style={{ 
              fontSize: '0.8em',
              color: '#666',
              marginTop: '5px',
              fontStyle: 'italic'
            }}>
              Controls the internal logging level of the LaunchDarkly SDK client.
              Available levels: error, warn, info, debug
            </p>
          </div>
        </div>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={async () => {
            setDemoCount(prev => prev + 1);
            
            const startTime = performance.now();
            const results = await evaluateFlags();
            const endTime = performance.now();
            const evalTime = (endTime - startTime).toFixed(0);
            setLastEvalTime(evalTime);
            setLastTimestamp(new Date().toISOString());

            if (results) {
              log.info(`Demo counter incremented to ${demoCount + 1}`, {
                flagResults: results,
                timestamp: new Date().toISOString()
              });
            }
          }}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          Generate Log Events ({demoCount})
        </button>
      </div>
      
      <div style={{ 
        marginTop: '15px',
        fontSize: '0.9em',
        color: '#666',
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span>Events: {demoCount}</span>
        <span>•</span>
        <span>Last eval: {lastEvalTime ? `${lastEvalTime}ms` : '-'}</span>
        <span>•</span>
        <span>Updated: {lastTimestamp ? new Date(lastTimestamp).toLocaleTimeString() : 'never'}</span>
      </div>

      <div style={{ textAlign: 'left', color: '#333', marginTop: '15px', fontSize: '0.8em' }}>
        <p style={{ fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>This button will:</p>
        <ul style={{ paddingLeft: '20px', marginBottom: '10px', color: '#333' }}>
          <li>Evaluate current flag values:
            <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
              <li>Console Log Level (0=FATAL to 5=TRACE)</li>
              <li>SDK Log Level (error, warn, info, debug)</li>
            </ul>
          </li>
          <li>Generate application test logs (visibility controlled by Console Log Level)</li>
          <li>Log performance metrics:
            <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
              <li>Flag evaluation timing</li>
              <li>Button click counter</li>
              <li>Timestamp of action</li>
            </ul>
          </li>
          <li>Send events to LaunchDarkly</li>
        </ul>
        <p style={{ marginTop: '10px', color: '#666' }}>
          Check the browser console to see the log output. Note: SDK Log Level controls visibility of LaunchDarkly's internal messages, not the test logs generated by this demo.
        </p>
      </div>
    </div>
  );
}

export default FlagDemo;