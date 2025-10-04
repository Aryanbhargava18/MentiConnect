import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import apiClient from '../api/apiClient';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Target, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Calendar,
  Users,
  Award,
  Edit,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

const GoalsPage = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('targetDate');

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/goals');
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
      // Set default sample goals for demonstration
      setGoals([
        {
          _id: '1',
          title: 'Learn React Advanced Patterns',
          description: 'Master advanced React concepts including hooks, context, and performance optimization',
          status: 'in_progress',
          priority: 'high',
          category: 'skill_development',
          progress: 65,
          targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          skills: ['React', 'JavaScript', 'Hooks', 'Context API'],
          milestones: [
            { title: 'Complete React Hooks tutorial', completed: true },
            { title: 'Build a custom hook', completed: true },
            { title: 'Implement Context API', completed: false },
            { title: 'Optimize performance', completed: false }
          ],
          achievements: ['First Milestone', 'Consistent Progress']
        },
        {
          _id: '2',
          title: 'Complete Full-Stack Project',
          description: 'Build a complete full-stack application using MERN stack',
          status: 'not_started',
          priority: 'medium',
          category: 'project',
          progress: 0,
          targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          skills: ['MongoDB', 'Express', 'React', 'Node.js'],
          milestones: [
            { title: 'Set up backend API', completed: false },
            { title: 'Create database schema', completed: false },
            { title: 'Build frontend components', completed: false },
            { title: 'Deploy application', completed: false }
          ],
          achievements: []
        },
        {
          _id: '3',
          title: 'Master TypeScript',
          description: 'Learn TypeScript from basics to advanced concepts',
          status: 'completed',
          priority: 'high',
          category: 'skill_development',
          progress: 100,
          targetDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          skills: ['TypeScript', 'JavaScript', 'Type System'],
          milestones: [
            { title: 'Learn basic types', completed: true },
            { title: 'Understand interfaces', completed: true },
            { title: 'Master generics', completed: true },
            { title: 'Build TypeScript project', completed: true }
          ],
          achievements: ['TypeScript Expert', 'Project Completed']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    return goal.status === filter;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'targetDate':
        return new Date(a.targetDate) - new Date(b.targetDate);
      case 'progress':
        return b.progress - a.progress;
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      default:
        return 0;
    }
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'paused':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Target className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const GoalCard = ({ goal }) => (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {getStatusIcon(goal.status)}
              <CardTitle className="text-lg">{goal.title}</CardTitle>
            </div>
            <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                {goal.status.replace('_', ' ')}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                {goal.priority}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {goal.category.replace('_', ' ')}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">{goal.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${goal.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Goal Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Due: {new Date(goal.targetDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {goal.mentor ? 'Mentor assigned' : 'No mentor'}
            </span>
          </div>
        </div>

        {/* Milestones */}
        {goal.milestones && goal.milestones.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Milestones</h4>
            <div className="space-y-2">
              {goal.milestones.slice(0, 3).map((milestone, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className={`h-4 w-4 ${
                    milestone.completed ? 'text-green-500' : 'text-gray-300'
                  }`} />
                  <span className={`text-sm ${
                    milestone.completed ? 'text-gray-900 line-through' : 'text-gray-600'
                  }`}>
                    {milestone.title}
                  </span>
                </div>
              ))}
              {goal.milestones.length > 3 && (
                <p className="text-xs text-gray-500">
                  +{goal.milestones.length - 3} more milestones
                </p>
              )}
            </div>
          </div>
        )}

        {/* Skills */}
        {goal.skills && goal.skills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
            <div className="flex flex-wrap gap-1">
              {goal.skills.slice(0, 5).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
              {goal.skills.length > 5 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{goal.skills.length - 5}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Achievements */}
        {goal.achievements && goal.achievements.length > 0 && (
          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-gray-600">
              {goal.achievements.length} achievement{goal.achievements.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Goals & Progress</h1>
              <p className="text-gray-600">Track your learning journey and achievements</p>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Goal
            </Button>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Filter:</label>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Goals</option>
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="targetDate">Due Date</option>
                    <option value="progress">Progress</option>
                    <option value="priority">Priority</option>
                    <option value="createdAt">Created</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading goals...</p>
          </div>
        ) : filteredGoals.length === 0 ? (
          <div className="text-center py-12">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No goals found</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' 
                ? 'Create your first goal to get started!'
                : `No goals with status "${filter}" found.`
              }
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Goal
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredGoals.map((goal) => (
              <GoalCard key={goal._id} goal={goal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsPage;
