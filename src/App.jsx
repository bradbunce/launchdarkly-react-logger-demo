import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LDProvider } from './contexts/LaunchDarklyContext';
import FlagDemo from './components/FlagDemo';
import Login from './components/Login';
import './App.css';

// Inner component to access auth context
function AppContent() {
  const { user } = useAuth();

  // Create anonymous user for LaunchDarkly when not logged in
  const ldUser = user || {
    key: crypto.randomUUID(),
    anonymous: true
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <LDProvider user={ldUser}>
        {user ? <FlagDemo /> : <Login />}
      </LDProvider>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;