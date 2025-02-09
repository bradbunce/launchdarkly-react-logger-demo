# LaunchDarkly React Logger Demo

This React application demonstrates the usage of the LaunchDarkly React Logger utility, which provides dynamic log level control through LaunchDarkly feature flags.

## Overview

The application showcases a logging utility that allows real-time control of both console and SDK logging levels through LaunchDarkly feature flags. This enables dynamic adjustment of logging verbosity without requiring application redeployment. The application supports user authentication and per-user log level configuration through LaunchDarkly's multicontext targeting.

### Key Features

- **User Authentication**: Simple username-based authentication system
- **Per-User Log Level Control**: Set different log levels for different users using LaunchDarkly targeting rules
- **Dual Log Level Management**: Control both application console logs and SDK internal logs
- **Real-Time Updates**: Changes to log levels take effect immediately without page reload
- **Responsive Design**: Optimized layout for mobile, tablet, and desktop displays
- **Dark Mode Support**: Automatic dark mode detection for logo display

## Configuration

### Environment Setup

1. Create a `.env` file in the root directory using the `.env.example` template:
```env
VITE_NODE_ENV=development
VITE_LD_CLIENT_ID=your-client-side-id
VITE_APP_NAME=launchdarkly-react-logger-demo
VITE_LD_SDK_LOG_FLAG_KEY=your-sdk-log-flag-key
VITE_LD_CONSOLE_LOG_FLAG_KEY=your-console-log-flag-key
```

2. Configure your LaunchDarkly feature flags and targeting:

#### Required Feature Flags and Targeting Setup

1. **Application Console Log Level Flag** (Number type)
   - Controls which application log messages appear in the browser console
   - Flag key: `console-log-level`
   - Type: Number (0-5)
   - Values:
     - 0: FATAL 💀 (Most severe, always shown)
     - 1: ERROR 🔴 (Error conditions)
     - 2: WARN  🟡 (Warning conditions)
     - 3: INFO  🔵 (General information)
     - 4: DEBUG ⚪ (Debug information)
     - 5: TRACE 🟣 (Most detailed information)

2. **LaunchDarkly SDK Log Level Flag** (String type)
   - Controls the internal logging level of the LaunchDarkly SDK client itself
   - Flag key: `sdk-log-level`
   - Type: String
   - Possible values: 'error', 'warn', 'info', 'debug'

#### Multicontext Targeting

The application uses LaunchDarkly's multicontext feature for sophisticated targeting:

1. **User Context**
   - `kind: 'user'`
   - Properties:
     - `key`: Username
     - `name`: Username
     - `anonymous`: false

2. **Application Context**
   - `kind: 'application'`
   - Properties:
     - `key`: 'react-logger-demo'
     - `name`: 'React Logger Demo'
     - `version`: Current application version

This multicontext setup enables:
- Setting different log levels for different users
- Targeting based on application version or environment
- Combining user and application rules for granular control

Example targeting scenarios:
- Set DEBUG level for specific users (e.g., developers)
- Set INFO level for general users
- Override levels for specific application versions
- Create rules combining user roles and application states

### Logger Configuration

The logger is configured in `src/config/logger.js`:

```javascript
const logger = new Logger({
  consoleLogFlagKey: 'console-log-level',  // Number flag (0-5)
  sdkLogFlagKey: 'sdk-log-level'          // String flag
});
```

## Running the Demo

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the local development server URL.

## Using the Demo

1. Log in with any username (this will be used for targeting rules)

2. Open your browser's developer console (F12 or right-click > Inspect > Console)

2. Click the "Generate Log Events" button in the UI to:
   - Evaluate current feature flags
   - Generate log events at all levels (FATAL to TRACE)
   - Track performance timing
   - Send events to LaunchDarkly

3. Observe the console output, which will show different log levels based on your LaunchDarkly flag configurations

### Available Log Methods

The logger provides the following methods:
- `log.fatal()` - Level 0 (💀)
- `log.error()` - Level 1 (🔴)
- `log.warn()`  - Level 2 (🟡)
- `log.info()`  - Level 3 (🔵)
- `log.debug()` - Level 4 (⚪)
- `log.trace()` - Level 5 (🟣)

Additional utility methods:
- `log.group()` - Start a console group
- `log.groupEnd()` - End a console group
- `log.time()` - Start a timer
- `log.timeEnd()` - End a timer and log duration

## Testing Different Log Levels

1. Change the `console-log-level` flag in LaunchDarkly:
   - Set to 0 to see only FATAL logs
   - Set to 3 to see FATAL, ERROR, WARN, and INFO logs
   - Set to 5 to see all log levels

2. Change the `sdk-log-level` flag to control the LaunchDarkly SDK's internal logging:
   - Options: 'error', 'warn', 'info', 'debug'

Changes to these flags will take effect immediately without requiring a page reload. When changing the SDK log level, you'll be automatically logged out to ensure proper initialization with the new settings.

## Implementation Details

The demo component (`src/components/FlagDemo.jsx`) showcases:
- Real-time flag evaluation
- Log level control
- Performance timing
- Structured logging with metadata
- Log grouping
- Error handling

The logger is integrated with LaunchDarkly's React context and can be used throughout your application using the `useLogger` hook:

```javascript
import { useLogger } from '@bradbunce/launchdarkly-react-logger';
import { logger } from '../config/logger';

function YourComponent() {
  const log = useLogger(logger);
  
  // Use the logger
  log.info('Your log message', { metadata: 'optional' });
}

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
