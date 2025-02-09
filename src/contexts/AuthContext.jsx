import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check if we have a stored user
    const storedUser = localStorage.getItem('demoUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    // Persist user state
    if (user) {
      localStorage.setItem('demoUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('demoUser');
    }
  }, [user]);

  const login = (username) => {
    setUser({
      kind: 'user',
      key: username,
      name: username,
      anonymous: false
    });
  };

  const logout = (message) => {
    // Store logout message if provided
    if (message) {
      sessionStorage.setItem('logoutMessage', message);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
