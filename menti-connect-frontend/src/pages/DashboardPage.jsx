import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import apiClient from '../api/apiClient';
import ProfileCard from '../components/dashboard/ProfileCard';
import UpdateProfileForm from '../components/dashboard/UpdateProfileForm';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Users, Github, UserCheck, UserX, RefreshCw } from 'lucide-react';

const DashboardPage = () => {
  const { user, login } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Handle token from URL (GitHub OAuth callback)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token && !user) {
      // Store token and fetch user data
      localStorage.setItem('token', token);
      
      // Fetch user data and login
      const fetchUserData = async () => {
        try {
          const response = await apiClient.get('/api/users/me');
          login(response.data, token);
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('token');
        }
      };
      
      fetchUserData();
    }
  }, [user, login]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/matches');
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
      if (error.response?.status === 401) {
        // Token expired, redirect to login
        window.location.href = '/';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptMatch = async (matchId) => {
    try {
      await apiClient.post(`/api/matches/accept/${matchId}`);
      fetchMatches(); // Refresh matches
    } catch (error) {
      console.error('Error accepting match:', error);
    }
  };

  const handleRejectMatch = async (matchId) => {
    try {
      await apiClient.post(`/api/matches/reject/${matchId}`);
      fetchMatches(); // Refresh matches
    } catch (error) {
      console.error('Error rejecting match:', error);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600">
            Manage your profile and discover new connections.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('matches')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'matches'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Matches ({matches.length})
              </button>
            </nav>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Profile Section */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <ProfileCard user={user} />
              <UpdateProfileForm />
            </div>
          )}

          {/* Matches Section */}
          {activeTab === 'matches' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Potential Matches</span>
                    </CardTitle>
                    <Button
                      onClick={fetchMatches}
                      disabled={loading}
                      variant="outline"
                      size="sm"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading matches...</p>
                    </div>
                  ) : matches.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No matches found at the moment.</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Complete your profile to get better matches!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {matches.map((match) => (
                        <Card key={match._id} className="p-4">
                          <div className="flex items-start space-x-4">
                            <img
                              src={match.avatarUrl}
                              alt={match.username}
                              className="h-12 w-12 rounded-full"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {match.username}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                {match.email}
                              </p>
                              {match.skills && match.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {match.skills.map((skill, index) => (
                                    <span
                                      key={index}
                                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => handleAcceptMatch(match._id)}
                                  size="sm"
                                  className="flex items-center space-x-1"
                                >
                                  <UserCheck className="h-4 w-4" />
                                  <span>Accept</span>
                                </Button>
                                <Button
                                  onClick={() => handleRejectMatch(match._id)}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center space-x-1"
                                >
                                  <UserX className="h-4 w-4" />
                                  <span>Reject</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* GitHub Integration */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Github className="h-5 w-5" />
                  <span>GitHub Integration</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Your GitHub profile is connected! We use your activity to help 
                  match you with relevant mentors and mentees.
                </p>
                <Button variant="outline" className="w-full">
                  View GitHub Activity
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {user?.acceptedMatches?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Active Matches</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {user?.skills?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Skills Listed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
