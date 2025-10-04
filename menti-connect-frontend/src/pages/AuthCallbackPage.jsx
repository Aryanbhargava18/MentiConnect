import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get token from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
          // Store token and fetch user data
          localStorage.setItem('token', token);
          
          // Fetch user data from backend
          const response = await fetch('http://localhost:5001/api/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const userData = await response.json();
            login(userData, token);
            setStatus('Authentication successful! Redirecting...');
            setTimeout(() => {
              navigate('/dashboard');
            }, 1500);
          } else {
            throw new Error('Failed to fetch user data');
          }
        } else {
          throw new Error('No token received');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('Authentication failed. Redirecting to home...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    };

    handleAuthCallback();
  }, [navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {status}
        </h2>
        <p className="text-gray-600">
          Please wait while we complete your authentication...
        </p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
