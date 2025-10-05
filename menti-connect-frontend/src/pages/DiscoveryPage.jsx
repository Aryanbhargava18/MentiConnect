import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import apiClient from '../api/apiClient';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Users, 
  UserCheck, 
  UserX, 
  RefreshCw, 
  Filter, 
  Search, 
  Star,
  Clock,
  Code,
  TrendingUp,
  Heart,
  MessageCircle
} from 'lucide-react';

const DiscoveryPage = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [sortBy, setSortBy] = useState('matchScore'); // matchScore, recent, activity
  const [connectingUsers, setConnectingUsers] = useState(new Set());
  const [connectionStatus, setConnectionStatus] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Determine user type and what they're looking for
  const isMentor = user?.role === 'mentor' || user?.role === 'both';
  const isMentee = user?.role === 'mentee' || user?.role === 'both';
  const lookingFor = isMentor && isMentee ? 'both' : isMentor ? 'mentees' : 'mentors';

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/matches');
      setMatches(response.data);
      setFilteredMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
      if (error.response?.status === 401) {
        if (error.response?.data?.code === 'GITHUB_TOKEN_INVALID') {
          alert('Your GitHub access has been revoked. Please re-authenticate.');
        }
        window.location.href = '/';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptMatch = async (matchId, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Prevent multiple clicks
    if (connectingUsers.has(matchId)) return;
    
    setConnectingUsers(prev => new Set(prev).add(matchId));
    setConnectionStatus(prev => ({ ...prev, [matchId]: 'connecting' }));
    
    try {
      const response = await apiClient.post(`/api/matches/accept/${matchId}`);
      console.log('Match accepted:', response.data);
      
      if (response.data.success) {
        // Update connection status
        setConnectionStatus(prev => ({ ...prev, [matchId]: 'connected' }));
        
        // Show success message
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
        
        // Remove the accepted match from the list after a short delay
        setTimeout(() => {
          setMatches(prev => prev.filter(match => match._id !== matchId));
          setFilteredMatches(prev => prev.filter(match => match._id !== matchId));
          setConnectionStatus(prev => {
            const newStatus = { ...prev };
            delete newStatus[matchId];
            return newStatus;
          });
        }, 1500);
      } else {
        throw new Error(response.data.message || 'Connection failed');
      }
      
    } catch (error) {
      console.error('Error accepting match:', error);
      setConnectionStatus(prev => ({ ...prev, [matchId]: 'error' }));
      
      // Show error message
      alert(error.response?.data?.message || error.message || 'Failed to connect. Please try again.');
      
      // Reset error status after 3 seconds
      setTimeout(() => {
        setConnectionStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[matchId];
          return newStatus;
        });
      }, 3000);
    } finally {
      setConnectingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(matchId);
        return newSet;
      });
    }
  };

  const handleRejectMatch = async (matchId, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Prevent multiple clicks
    if (connectingUsers.has(matchId)) return;
    
    setConnectingUsers(prev => new Set(prev).add(matchId));
    setConnectionStatus(prev => ({ ...prev, [matchId]: 'rejecting' }));
    
    try {
      const response = await apiClient.post(`/api/matches/reject/${matchId}`);
      console.log('Match rejected:', response.data);
      
      if (response.data.success) {
        // Update connection status
        setConnectionStatus(prev => ({ ...prev, [matchId]: 'rejected' }));
        
        // Remove the rejected match from the list after a short delay
        setTimeout(() => {
          setMatches(prev => prev.filter(match => match._id !== matchId));
          setFilteredMatches(prev => prev.filter(match => match._id !== matchId));
          setConnectionStatus(prev => {
            const newStatus = { ...prev };
            delete newStatus[matchId];
            return newStatus;
          });
        }, 1000);
      } else {
        throw new Error(response.data.message || 'Rejection failed');
      }
      
    } catch (error) {
      console.error('Error rejecting match:', error);
      setConnectionStatus(prev => ({ ...prev, [matchId]: 'error' }));
      
      // Show error message
      alert(error.response?.data?.message || error.message || 'Failed to pass. Please try again.');
      
      // Reset error status after 3 seconds
      setTimeout(() => {
        setConnectionStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[matchId];
          return newStatus;
        });
      }, 3000);
    } finally {
      setConnectingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(matchId);
        return newSet;
      });
    }
  };

  // Filter and search functionality
  useEffect(() => {
    let filtered = matches;

    // Search by name or skills
    if (searchTerm) {
      filtered = filtered.filter(match => 
        match.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.skills?.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by specific skill
    if (skillFilter) {
      filtered = filtered.filter(match => 
        match.skills?.some(skill => 
          skill.toLowerCase().includes(skillFilter.toLowerCase())
        )
      );
    }

    // Sort matches
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'matchScore':
          return (b.matchScore || 0) - (a.matchScore || 0);
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'activity':
          return (b.aiInsights?.githubActivity?.recentPRs || 0) - (a.aiInsights?.githubActivity?.recentPRs || 0);
        default:
          return 0;
      }
    });

    setFilteredMatches(filtered);
  }, [matches, searchTerm, skillFilter, sortBy]);

  useEffect(() => {
    fetchMatches();
  }, []);

  // Get unique skills from all matches for filter dropdown
  const allSkills = [...new Set(matches.flatMap(match => match.skills || []))];

  // Get button status for a specific match
  const getButtonStatus = (matchId) => {
    const status = connectionStatus[matchId];
    const isConnecting = connectingUsers.has(matchId);
    
    if (isConnecting) return 'loading';
    if (status === 'connected') return 'success';
    if (status === 'rejected') return 'rejected';
    if (status === 'error') return 'error';
    return 'default';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
          <UserCheck className="h-5 w-5" />
          <span>Successfully connected!</span>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Discover {lookingFor}
          </h1>
          <p className="text-gray-600">
            {isMentor && isMentee 
              ? 'Find mentors to learn from and mentees to help grow.'
              : isMentor 
                ? 'Find mentees who need your expertise and guidance.'
                : 'Find mentors who can help you grow and learn new skills.'
            }
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Find Your Perfect Match</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Skill Filter */}
                <select
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Skills</option>
                  {allSkills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>

                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="matchScore">Best Match</option>
                  <option value="recent">Most Recent</option>
                  <option value="activity">Most Active</option>
                </select>

                {/* Refresh Button */}
                <Button
                  onClick={fetchMatches}
                  disabled={loading}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Finding perfect matches...</p>
            </div>
          ) : filteredMatches.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No matches found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || skillFilter 
                  ? 'Try adjusting your search criteria'
                  : 'Complete your profile to get better matches!'
                }
              </p>
              {(searchTerm || skillFilter) && (
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSkillFilter('');
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            filteredMatches.map((match) => (
              <Card key={match._id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-4">
                    <img
                      src={match.avatarUrl}
                      alt={match.username}
                      className="h-16 w-16 rounded-full border-2 border-gray-200"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {match.username}
                        </h3>
                        {match.matchScore && (
                          <div className="text-right">
                            <div className="text-sm font-bold text-green-600">
                              {match.matchScore}%
                            </div>
                            <div className="text-xs text-gray-500">match</div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          {match.role}
                        </span>
                        {match.aiInsights?.githubActivity?.activityLevel && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            match.aiInsights.githubActivity.activityLevel === 'high' 
                              ? 'bg-green-100 text-green-800'
                              : match.aiInsights.githubActivity.activityLevel === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {match.aiInsights.githubActivity.activityLevel} activity
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* AI Insights */}
                  {match.aiInsights && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">AI Insights</span>
                      </div>
                      <p className="text-xs text-blue-800 mb-2">
                        Compatibility: {match.aiInsights.compatibilityScore}% • 
                        Skills: {match.skillMatches} match{match.skillMatches !== 1 ? 'es' : ''}
                      </p>
                      {match.aiInsights.githubActivity && (
                        <div className="flex flex-wrap gap-1">
                          {match.aiInsights.githubActivity.languages.slice(0, 3).map((lang, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {lang}
                            </span>
                          ))}
                          {match.aiInsights.githubActivity.recentPRs > 0 && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {match.aiInsights.githubActivity.recentPRs} PRs
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Skills */}
                  {match.skills && match.skills.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Code className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Skills</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {match.skills.slice(0, 6).map((skill, index) => (
                          <span
                            key={index}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {match.skills.length > 6 && (
                          <span className="text-xs text-gray-500">
                            +{match.skills.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Availability */}
                  {match.availability && match.availability.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Availability</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {match.availability.slice(0, 3).map((slot, index) => (
                          <span
                            key={index}
                            className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                          >
                            {slot}
                          </span>
                        ))}
                        {match.availability.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{match.availability.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-4 border-t border-gray-200">
                    {(() => {
                      const buttonStatus = getButtonStatus(match._id);
                      const isConnecting = connectingUsers.has(match._id);
                      
                      return (
                        <>
                          <Button
                            onClick={(e) => handleAcceptMatch(match._id, e)}
                            disabled={isConnecting}
                            size="sm"
                            className={`flex-1 flex items-center justify-center space-x-2 ${
                              buttonStatus === 'success' 
                                ? 'bg-green-500 hover:bg-green-600' 
                                : buttonStatus === 'error'
                                ? 'bg-red-500 hover:bg-red-600'
                                : ''
                            }`}
                          >
                            {buttonStatus === 'loading' ? (
                              <>
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                <span>Connecting...</span>
                              </>
                            ) : buttonStatus === 'success' ? (
                              <>
                                <UserCheck className="h-4 w-4" />
                                <span>Connected!</span>
                              </>
                            ) : buttonStatus === 'error' ? (
                              <>
                                <UserX className="h-4 w-4" />
                                <span>Failed</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4" />
                                <span>Connect</span>
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={(e) => handleRejectMatch(match._id, e)}
                            disabled={isConnecting}
                            variant="outline"
                            size="sm"
                            className={`flex-1 flex items-center justify-center space-x-2 ${
                              buttonStatus === 'rejected' 
                                ? 'border-red-500 text-red-500' 
                                : buttonStatus === 'error'
                                ? 'border-red-500 text-red-500'
                                : ''
                            }`}
                          >
                            {buttonStatus === 'loading' ? (
                              <>
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                <span>Passing...</span>
                              </>
                            ) : buttonStatus === 'rejected' ? (
                              <>
                                <UserX className="h-4 w-4" />
                                <span>Passed</span>
                              </>
                            ) : buttonStatus === 'error' ? (
                              <>
                                <UserX className="h-4 w-4" />
                                <span>Error</span>
                              </>
                            ) : (
                              <>
                                <UserX className="h-4 w-4" />
                                <span>Pass</span>
                              </>
                            )}
                          </Button>
                        </>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Stats */}
        {filteredMatches.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Showing {filteredMatches.length} of {matches.length} potential matches
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoveryPage;
