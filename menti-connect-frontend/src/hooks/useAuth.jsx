import { useState, useEffect, createContext, useContext } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        try {
          // Verify token with backend
          const response = await apiClient.get('/api/users/me');
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
          console.error('Auth initialization error:', error);
          // Token is invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
          
          // If it's a GitHub token issue, show specific message
          if (error.response?.data?.code === 'GITHUB_TOKEN_INVALID') {
            console.warn('GitHub access has been revoked');
          }
        }
      } else {
        // For development: create a test user if none exists
        try {
          console.log('No stored auth, creating test user...');
          const response = await apiClient.post('/api/users/test', {
            username: 'Test User',
            email: 'test@example.com',
            role: 'mentee',
            skills: ['JavaScript', 'React'],
            availability: ['weekends']
          });
          
          if (response.data.token && response.data.user) {
            setToken(response.data.token);
            setUser(response.data.user);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            console.log('Test user created and logged in');
          }
        } catch (error) {
          console.error('Error creating test user:', error);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    console.log('useAuth logout called');
    try {
      // Call backend logout endpoint to clear GitHub token
      console.log('Calling backend logout endpoint...');
      await apiClient.post('/auth/logout');
      console.log('Backend logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with frontend logout even if backend call fails
    } finally {
      console.log('Clearing frontend auth state...');
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('Frontend logout complete');
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!token && !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
