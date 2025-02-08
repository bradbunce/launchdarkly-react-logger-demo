import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LDProvider } from './contexts/LaunchDarklyContext'
import ErrorBoundary from './components/ErrorBoundary'
import { logger } from './config/logger'

const Root = () => {
  const isDevEnvironment = import.meta.env.VITE_NODE_ENV === 'development'
  logger.debug('Environment:', { isDevEnvironment });

  // Error fallback component
  const ErrorFallback = () => (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Something went wrong</h2>
      <p>Please try refreshing the page</p>
    </div>
  );

  // Main application with LaunchDarkly provider
  const AppComponent = (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <LDProvider>
        <App />
      </LDProvider>
    </ErrorBoundary>
  );

  // Root component with optional StrictMode for development
  return isDevEnvironment ? (
    <StrictMode>
      {AppComponent}
    </StrictMode>
  ) : AppComponent;
};

// Application initialization
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    const msg = 'Root element not found';
    logger.fatal(msg);
    throw new Error(msg);
  }

  logger.info('Creating root...');
  const root = createRoot(rootElement);
  
  logger.info('Rendering application...');
  root.render(<Root />);
} catch (error) {
  logger.error('Error initializing application:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h2>Error initializing application</h2>
      <p>${error.message}</p>
    </div>
  `;
}
