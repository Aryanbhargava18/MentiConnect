import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import apiClient from '../api/apiClient';
import ProfileCard from '../components/dashboard/ProfileCard';
import UpdateProfileForm from '../components/dashboard/UpdateProfileForm';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Users, Github } from 'lucide-react';

const DashboardPage = () => {
  const { user, login, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Debug logging
  console.log('DashboardPage render:', { user, loading });
  
  // Check if user needs to complete profile setup
  const needsProfileSetup = !user?.role || !user?.skills || user?.skills?.length === 0;
  
  // Determine user type and what they're looking for
  const isMentor = user?.role === 'mentor' || user?.role === 'both';
  const isMentee = user?.role === 'mentee' || user?.role === 'both';
  const lookingFor = isMentor && isMentee ? 'both' : isMentor ? 'mentees' : 'mentors';

  // Handle token from URL (GitHub OAuth callback) - only if not already authenticated
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token && !user && !localStorage.getItem('token')) {
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
          // Redirect to home if authentication fails
          window.location.href = '/';
        }
      };
      
      fetchUserData();
    }
  }, [user, login]);

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state if no user data and not loading
  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-4">Unable to load user data. Please try logging in again.</p>
          <Button onClick={() => window.location.href = '/'}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome{needsProfileSetup ? '' : ' back'}, {user?.username}!
          </h1>
          <p className="text-gray-600">
            {needsProfileSetup 
              ? 'Complete your profile to start connecting with mentors and mentees.'
              : `You're a ${user?.role} looking for ${lookingFor}. Let's find your perfect match!`
            }
          </p>
          {needsProfileSetup && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Quick Setup:</strong> Choose your role, add your skills, and set your availability to get started with MentiConnect!
              </p>
            </div>
          )}
          {!needsProfileSetup && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                <strong>Ready to connect!</strong> {isMentor && isMentee 
                  ? 'As both mentor and mentee, you can find mentors to learn from and mentees to help.'
                  : isMentor 
                    ? 'Find mentees who need your expertise and guidance.'
                    : 'Find mentors who can help you grow and learn new skills.'
                }
              </p>
            </div>
          )}
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
                Profile {needsProfileSetup && <span className="ml-1 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">!</span>}
              </button>
              <button
                onClick={() => window.location.href = '/discover'}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                disabled={needsProfileSetup}
              >
                Discover {lookingFor} {needsProfileSetup && <span className="ml-1 text-xs text-gray-400">(Complete profile first)</span>}
              </button>
              {isMentor && (
                <button
                  onClick={() => setActiveTab('mentees')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'mentees'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  disabled={needsProfileSetup}
                >
                  My Mentees {needsProfileSetup && <span className="ml-1 text-xs text-gray-400">(Complete profile first)</span>}
                </button>
              )}
              {isMentee && (
                <button
                  onClick={() => setActiveTab('mentors')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'mentors'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  disabled={needsProfileSetup}
                >
                  My Mentors {needsProfileSetup && <span className="ml-1 text-xs text-gray-400">(Complete profile first)</span>}
                </button>
              )}
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


          {/* Mentees Section - For Mentors */}
          {activeTab === 'mentees' && isMentor && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>My Mentees</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No mentees yet.</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Start connecting with mentees in the Discover tab!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Mentors Section - For Mentees */}
          {activeTab === 'mentors' && isMentee && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>My Mentors</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No mentors yet.</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Start connecting with mentors in the Discover tab!
                    </p>
                  </div>
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
