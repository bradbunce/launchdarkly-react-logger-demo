import { useState } from 'react';
import { useLDClient } from '../contexts/LaunchDarklyContext';
import { useLogger } from '@bradbunce/launchdarkly-react-logger';
import { logger } from '../config/logger';

function FlagDemo() {
  const [demoCount, setDemoCount] = useState(0);
  const ldClient = useLDClient();
  const log = useLogger(logger);

  // Function to evaluate flags and generate events
  const evaluateFlags = async () => {
    try {
      const consoleLevel = await ldClient.variation('console-log-level', 3);
      const sdkLevel = await ldClient.variation('sdk-log-level', 'info');

      // Map console level to name
      const LOG_LEVEL_NAMES = {
        0: 'FATAL',
        1: 'ERROR',
        2: 'WARN',
        3: 'INFO',
        4: 'DEBUG',
        5: 'TRACE'
      };

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
  };

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
      
      <div style={{ marginBottom: '30px' }}>
        <button 
          onClick={async () => {
            setDemoCount(prev => prev + 1);
            
            // Track timing of flag evaluation
            log.time('flag-evaluation');
            const results = await evaluateFlags();
            log.timeEnd('flag-evaluation');

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

      <div style={{ textAlign: 'left' }}>
        <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>This button will:</p>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Evaluate current feature flags</li>
          <li>Generate log events at all levels (FATAL to TRACE)</li>
          <li>Track performance timing</li>
          <li>Send events to LaunchDarkly</li>
        </ul>
        <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          Check the browser console to see the log output controlled by the feature flags
        </p>
      </div>
    </div>
  );
}

export default FlagDemo;
