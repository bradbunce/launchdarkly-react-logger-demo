import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import reactLogo from '../assets/react.svg';
import ldLogoBlack from '../assets/ld_logo_black.png';
import ldLogoWhite from '../assets/lg_logo_white.png';

function Login() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth();

  useEffect(() => {
    // Check for logout message
    const logoutMessage = sessionStorage.getItem('logoutMessage');
    if (logoutMessage) {
      setMessage(logoutMessage);
      sessionStorage.removeItem('logoutMessage');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim());
    }
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        margin: 0,
        padding: 0
      }}>
        <div className="flag-demo-container">
          <div style={{ marginBottom: '20px' }}>
            <a href="https://launchdarkly.com" target="_blank" rel="noopener noreferrer" style={{ marginRight: '20px' }}>
              <picture>
                <source srcSet={ldLogoWhite} media="(prefers-color-scheme: dark)" />
                <img src={ldLogoBlack} className="logo launchdarkly" alt="LaunchDarkly logo" />
              </picture>
            </a>
            <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h2 style={{ color: '#007bff', marginBottom: '20px' }}>LaunchDarkly React Logger Utility</h2>
          {message && (
            <div style={{
              backgroundColor: '#fff3cd',
              color: '#856404',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '20px',
              width: '100%'
            }}>
              {message}
            </div>
          )}
          <div style={{ 
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#fff',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}>
            <h3 style={{ color: '#333', marginBottom: '15px', fontSize: '1.1em' }}>Login</h3>
            <form onSubmit={handleSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              width: '100%',
              maxWidth: '300px',
              margin: '0 auto'
            }}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                style={{
                  padding: '10px 12px',
                  borderRadius: '4px',
                  border: '1px solid #dee2e6',
                  fontSize: '14px',
                  width: '100%'
                }}
              />
              <button
                type="submit"
                disabled={!username.trim()}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  maxWidth: '200px',
                  margin: '0 auto',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: username.trim() ? 'pointer' : 'not-allowed',
                  opacity: username.trim() ? 1 : 0.7,
                  transition: 'background-color 0.2s'
                }}
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
