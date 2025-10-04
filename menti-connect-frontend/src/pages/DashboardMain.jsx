import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import apiClient from '../api/apiClient';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  BarChart3, 
  MessageCircle, 
  Target, 
  Bell, 
  Users, 
  TrendingUp,
  Calendar,
  Award,
  Code,
  GitBranch,
  Star,
  Activity,
  Zap,
  Settings,
  Plus,
  Eye,
  ArrowRight,
  RefreshCw,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

const DashboardMain = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default data if API fails
      setDashboardData({
        activeMatches: 0,
        unreadMessages: 0,
        goalsProgress: 0,
        githubActivity: 0,
        recentActivity: [],
        upcomingEvents: [],
        recentMatches: [],
        recentMessages: [],
        recentGoals: [],
        totalCommits: 0,
        pullRequests: 0,
        stars: 0,
        languages: [],
        weeklyActivity: 0,
        monthlyActivity: 0,
        streak: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, trend, color = "blue", subtitle }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
            {trend && (
              <div className={`flex items-center mt-1 text-sm ${
                trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                <TrendingUp className="h-4 w-4 mr-1" />
                {trend > 0 ? '+' : ''}{trend}%
              </div>
            )}
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
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.username}!
              </h1>
              <p className="text-gray-600">
                Here's what's happening in your mentorship journey
              </p>
            </div>
            <Button
              onClick={fetchDashboardData}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('matches')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'matches'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Matches
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'messages'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Messages
              </button>
              <button
                onClick={() => setActiveTab('goals')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'goals'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Goals
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Active Matches"
                value={dashboardData?.activeMatches || 0}
                icon={Users}
                trend={12}
                color="blue"
                subtitle="Mentorship connections"
              />
              <StatCard
                title="Unread Messages"
                value={dashboardData?.unreadMessages || 0}
                icon={MessageCircle}
                trend={-5}
                color="green"
                subtitle="New conversations"
              />
              <StatCard
                title="Goals Progress"
                value={`${dashboardData?.goalsProgress || 0}%`}
                icon={Target}
                trend={8}
                color="purple"
                subtitle="Completion rate"
              />
              <StatCard
                title="GitHub Activity"
                value={dashboardData?.githubActivity || 0}
                icon={GitBranch}
                trend={15}
                color="orange"
                subtitle="This week"
              />
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.recentActivity?.length > 0 ? (
                      dashboardData.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">{activity}</span>
                          <span className="text-xs text-gray-500 ml-auto">2h ago</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Activity className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>No recent activity</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Upcoming Events</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.upcomingEvents?.length > 0 ? (
                      dashboardData.upcomingEvents.map((event, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">{event}</span>
                          <span className="text-xs text-gray-500 ml-auto">Tomorrow</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>No upcoming events</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Recent Matches</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.recentMatches?.length > 0 ? (
                      dashboardData.recentMatches.map((match, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <img
                            src={match.avatar || '/default-avatar.png'}
                            alt={match.name}
                            className="h-10 w-10 rounded-full"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{match.name}</p>
                            <p className="text-sm text-gray-600">{match.role}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-600">{match.score}% match</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>No recent matches</p>
                        <Button className="mt-4" onClick={() => window.location.href = '/discover'}>
                          Find Matches
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Match Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Looking for:</span>
                      <span className="text-sm font-medium">{user?.role === 'mentor' ? 'Mentees' : 'Mentors'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Skills:</span>
                      <span className="text-sm font-medium">{user?.skills?.length || 0} listed</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Availability:</span>
                      <span className="text-sm font-medium">{user?.availability?.length || 0} slots</span>
                    </div>
                    <Button className="w-full" onClick={() => window.location.href = '/discover'}>
                      Update Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Recent Messages</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.recentMessages?.length > 0 ? (
                    dashboardData.recentMessages.map((message, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <img
                          src={message.avatar || '/default-avatar.png'}
                          alt={message.sender}
                          className="h-10 w-10 rounded-full"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{message.sender}</p>
                          <p className="text-sm text-gray-600">{message.preview}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{message.time}</p>
                          {message.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-auto"></div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No recent messages</p>
                      <Button className="mt-4" onClick={() => window.location.href = '/chat'}>
                        Start Chatting
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Recent Goals</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.recentGoals?.length > 0 ? (
                      dashboardData.recentGoals.map((goal, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">{goal.title}</p>
                            <span className="text-sm text-gray-600">{goal.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Target className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>No recent goals</p>
                        <Button className="mt-4" onClick={() => window.location.href = '/goals'}>
                          Set Goals
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>Progress Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Goals Completed:</span>
                      <span className="text-sm font-medium">3/10</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">This Month:</span>
                      <span className="text-sm font-medium">2 goals</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Success Rate:</span>
                      <span className="text-sm font-medium text-green-600">85%</span>
                    </div>
                    <Button className="w-full" onClick={() => window.location.href = '/goals'}>
                      View All Goals
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Commits"
                value={dashboardData?.totalCommits || 0}
                icon={GitBranch}
                trend={15}
                color="blue"
              />
              <StatCard
                title="Pull Requests"
                value={dashboardData?.pullRequests || 0}
                icon={GitBranch}
                trend={8}
                color="green"
              />
              <StatCard
                title="Repositories"
                value={dashboardData?.repositories || 0}
                icon={Code}
                trend={5}
                color="purple"
              />
              <StatCard
                title="Stars Received"
                value={dashboardData?.stars || 0}
                icon={Star}
                trend={12}
                color="yellow"
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Code className="h-5 w-5" />
                    <span>Programming Languages</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.languages?.length > 0 ? (
                      dashboardData.languages.map((lang, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{lang}</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${Math.random() * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Code className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>No language data available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Activity Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">This Week:</span>
                      <span className="text-sm font-medium">{dashboardData?.weeklyActivity || 0} commits</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">This Month:</span>
                      <span className="text-sm font-medium">{dashboardData?.monthlyActivity || 0} commits</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Current Streak:</span>
                      <span className="text-sm font-medium text-green-600">{dashboardData?.streak || 0} days</span>
                    </div>
                    <Button className="w-full" onClick={() => window.location.href = '/analytics'}>
                      View Full Analytics
                    </Button>
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

export default DashboardMain;
