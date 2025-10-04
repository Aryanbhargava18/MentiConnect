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
  RefreshCw
} from 'lucide-react';

const DashboardV2 = () => {
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
    <Card className="hover:shadow-lg transition-shadow duration-200">
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

  const QuickAction = ({ title, description, icon: Icon, onClick, color = "blue" }) => (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-200" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full bg-${color}-100`}>
            <Icon className={`h-5 w-5 text-${color}-600`} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </div>
      </CardContent>
    </Card>
  );

  const RecentActivity = ({ activities }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities?.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${
                activity.type === 'match' ? 'bg-green-100' :
                activity.type === 'message' ? 'bg-blue-100' :
                activity.type === 'goal' ? 'bg-purple-100' :
                'bg-gray-100'
              }`}>
                {activity.type === 'match' && <Users className="h-4 w-4 text-green-600" />}
                {activity.type === 'message' && <MessageCircle className="h-4 w-4 text-blue-600" />}
                {activity.type === 'goal' && <Target className="h-4 w-4 text-purple-600" />}
                {activity.type === 'achievement' && <Award className="h-4 w-4 text-yellow-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const UpcomingEvents = ({ events }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Upcoming Events</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events?.map((event, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{event.title}</p>
                <p className="text-xs text-gray-600">{event.time}</p>
              </div>
              <Button variant="outline" size="sm">
                Join
              </Button>
            </div>
          ))}
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
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'matches', label: 'Matches', icon: Users },
                { id: 'messages', label: 'Messages', icon: MessageCircle },
                { id: 'goals', label: 'Goals', icon: Target },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
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
                title="Active Matches"
                value={dashboardData?.activeMatches || 0}
                icon={Users}
                trend={12}
                color="green"
                subtitle="This month"
              />
              <StatCard
                title="Messages"
                value={dashboardData?.unreadMessages || 0}
                icon={MessageCircle}
                trend={8}
                color="blue"
                subtitle="Unread"
              />
              <StatCard
                title="Goals Progress"
                value={`${dashboardData?.goalsProgress || 0}%`}
                icon={Target}
                trend={15}
                color="purple"
                subtitle="Average completion"
              />
              <StatCard
                title="GitHub Activity"
                value={dashboardData?.githubActivity || 0}
                icon={GitBranch}
                trend={-3}
                color="gray"
                subtitle="Commits this week"
              />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Quick Actions */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <QuickAction
                      title="Find Matches"
                      description="Discover new mentors and mentees"
                      icon={Users}
                      onClick={() => window.location.href = '/discover'}
                      color="green"
                    />
                    <QuickAction
                      title="Start Chat"
                      description="Connect with your matches"
                      icon={MessageCircle}
                      onClick={() => window.location.href = '/chat'}
                      color="blue"
                    />
                    <QuickAction
                      title="Set Goal"
                      description="Track your learning progress"
                      icon={Target}
                      onClick={() => window.location.href = '/goals'}
                      color="purple"
                    />
                    <QuickAction
                      title="View Analytics"
                      description="Check your GitHub activity"
                      icon={BarChart3}
                      onClick={() => window.location.href = '/analytics'}
                      color="gray"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity & Upcoming Events */}
              <div className="lg:col-span-2 space-y-6">
                <RecentActivity activities={dashboardData?.recentActivity} />
                <UpcomingEvents events={dashboardData?.upcomingEvents} />
              </div>
            </div>
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData?.recentMatches?.map((match) => (
                <Card key={match._id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={match.avatarUrl}
                        alt={match.username}
                        className="h-12 w-12 rounded-full"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{match.username}</h3>
                        <p className="text-sm text-gray-600">{match.role}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {match.matchScore}% match
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dashboardData?.recentMessages?.map((conversation) => (
                <Card key={conversation._id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={conversation.avatarUrl}
                        alt={conversation.username}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">{conversation.username}</h3>
                          <span className="text-xs text-gray-500">{conversation.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                        {conversation.unreadCount > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {conversation.unreadCount} new
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dashboardData?.recentGoals?.map((goal) => (
                <Card key={goal._id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                        goal.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {goal.status}
                      </span>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm text-gray-600">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Due: {new Date(goal.targetDate).toLocaleDateString()}
                      </span>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Total Commits"
                value={dashboardData?.totalCommits || 0}
                icon={GitBranch}
                trend={25}
                color="blue"
              />
              <StatCard
                title="Pull Requests"
                value={dashboardData?.pullRequests || 0}
                icon={Code}
                trend={18}
                color="green"
              />
              <StatCard
                title="Stars Received"
                value={dashboardData?.stars || 0}
                icon={Star}
                trend={32}
                color="yellow"
              />
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Programming Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData?.languages?.map((lang, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{lang.name}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${lang.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{lang.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Activity Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">This Week</span>
                      <span className="text-sm text-gray-600">{dashboardData?.weeklyActivity || 0} commits</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">This Month</span>
                      <span className="text-sm text-gray-600">{dashboardData?.monthlyActivity || 0} commits</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Streak</span>
                      <span className="text-sm text-gray-600">{dashboardData?.streak || 0} days</span>
                    </div>
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

export default DashboardV2;
