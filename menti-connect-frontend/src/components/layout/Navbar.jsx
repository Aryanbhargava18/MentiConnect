import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { Button } from '../ui/button';
import { Github, User, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    console.log('Logout button clicked');
    setIsLoggingOut(true);
    try {
      await logout();
      console.log('Logout successful, redirecting to home');
      // Small delay to ensure logout completes
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if logout fails
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleGitHubLogin = () => {
    window.location.href = 'http://localhost:5001/auth/github';
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Github className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">MentiConnect</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <img
                      src={user?.avatarUrl}
                      alt={user?.username}
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {user?.username}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                  </Button>
                </div>
              </>
            ) : (
              <Button onClick={handleGitHubLogin} className="flex items-center space-x-2">
                <Github className="h-4 w-4" />
                <span>Login with GitHub</span>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {isAuthenticated ? (
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2 px-3 py-2">
                    <img
                      src={user?.avatarUrl}
                      alt={user?.username}
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {user?.username}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleGitHubLogin}
                  className="w-full justify-start"
                >
                  <Github className="h-4 w-4 mr-2" />
                  Login with GitHub
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
