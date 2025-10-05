import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import apiClient from '../api/apiClient';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  MessageCircle, 
  Star, 
  TrendingUp,
  Plus,
  Play,
  CheckCircle,
  AlertCircle,
  User,
  Award,
  BarChart3
} from 'lucide-react';

const MentorshipDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [dashboardRes, sessionsRes] = await Promise.all([
        apiClient.get('/api/mentorship/dashboard'),
        apiClient.get('/api/mentorship/sessions?upcoming=true')
      ]);
      
      setDashboardData(dashboardRes.data);
      setSessions(sessionsRes.data);
    } catch (error) {
      console.error('Error fetching mentorship data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const startVideoCall = async (sessionId) => {
    try {
      const response = await apiClient.post('/api/video/create-room', {
        sessionId,
        participantId: sessionId // This would be the other participant
      });
      
      // In a real app, this would open the video call interface
      alert(`Starting video call: ${response.data.meetingLink}`);
    } catch (error) {
      console.error('Error starting video call:', error);
      alert('Failed to start video call');
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = "blue", subtitle }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-full bg-${color}-100`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mentorship data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mentorship Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your mentorship sessions, track progress, and connect with mentors/mentees
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['overview', 'sessions', 'analytics', 'feedback'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Sessions"
                value={dashboardData?.stats?.totalSessions || 0}
                icon={Calendar}
                color="blue"
                subtitle="All time"
              />
              <StatCard
                title="Completed"
                value={dashboardData?.stats?.completedSessions || 0}
                icon={CheckCircle}
                color="green"
                subtitle="Successfully finished"
              />
              <StatCard
                title="Upcoming"
                value={dashboardData?.stats?.upcomingSessions || 0}
                icon={Clock}
                color="orange"
                subtitle="Scheduled sessions"
              />
              <StatCard
                title="Average Rating"
                value="4.8"
                icon={Star}
                color="yellow"
                subtitle="Based on feedback"
              />
            </div>

            {/* Upcoming Sessions */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Upcoming Sessions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.upcomingSessions?.length > 0 ? (
                      dashboardData.upcomingSessions.map((session) => (
                        <div key={session._id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{session.title}</p>
                              <p className="text-sm text-gray-600">
                                with {session.mentor._id === user._id ? session.mentee.username : session.mentor.username}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(session.scheduledDate).toLocaleDateString()} at {new Date(session.scheduledDate).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => startVideoCall(session._id)}
                              className="flex items-center space-x-1"
                            >
                              <Play className="h-4 w-4" />
                              <span>Start</span>
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>No upcoming sessions</p>
                        <Button className="mt-4" onClick={() => window.location.href = '/discover'}>
                          Find Mentors
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.recentSessions?.length > 0 ? (
                      dashboardData.recentSessions.map((session) => (
                        <div key={session._id} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{session.title}</p>
                            <p className="text-xs text-gray-600">
                              {session.status === 'completed' ? 'Completed' : 'Scheduled'} • 
                              {new Date(session.scheduledDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            session.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {session.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>No recent activity</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">All Sessions</h2>
              <Button onClick={() => window.location.href = '/discover'}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule New Session
              </Button>
            </div>

            <div className="grid gap-6">
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <Card key={session._id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{session.title}</h3>
                            <p className="text-gray-600">
                              with {session.mentor._id === user._id ? session.mentee.username : session.mentor.username}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(session.scheduledDate).toLocaleDateString()} at {new Date(session.scheduledDate).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            session.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {session.status}
                          </span>
                          {session.status === 'scheduled' && (
                            <Button
                              onClick={() => startVideoCall(session._id)}
                              className="flex items-center space-x-2"
                            >
                              <Video className="h-4 w-4" />
                              <span>Join Call</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No sessions found</h3>
                  <p className="text-gray-600 mb-4">Start by connecting with mentors or mentees</p>
                  <Button onClick={() => window.location.href = '/discover'}>
                    Find Matches
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Mentorship Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                      <p className="text-2xl font-bold text-gray-900">85%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Average Rating</p>
                      <p className="text-2xl font-bold text-gray-900">4.8/5</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Hours</p>
                      <p className="text-2xl font-bold text-gray-900">24.5</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Session Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Analytics data will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Feedback & Reviews</h2>
            
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>Pending Feedback</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.pendingFeedback?.length > 0 ? (
                      dashboardData.pendingFeedback.map((session) => (
                        <div key={session._id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{session.title}</p>
                            <p className="text-sm text-gray-600">
                              with {session.mentor._id === user._id ? session.mentee.username : session.mentor.username}
                            </p>
                          </div>
                          <Button size="sm">
                            Give Feedback
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Award className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>No pending feedback</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorshipDashboard;
