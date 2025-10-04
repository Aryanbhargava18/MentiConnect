import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import apiClient from '../../api/apiClient';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { User, Code, Users, Calendar, Save } from 'lucide-react';

const UpdateProfileForm = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    role: user?.role || 'mentee',
    skills: user?.skills || [],
    mentoringCapacity: user?.mentoringCapacity || 0,
    availability: user?.availability || [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await apiClient.put('/api/users/me', formData);
      updateUser(response.data);
      setMessage('Profile updated successfully! Redirecting to discover matches...');
      
      // Redirect to discover page after successful update
      setTimeout(() => {
        window.location.href = '/discover';
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.status === 401) {
        setMessage('Session expired. Please login again.');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setMessage('Error updating profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Update Profile</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="mentee">Mentee</option>
              <option value="mentor">Mentor</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              value={formData.skills.join(', ')}
              onChange={(e) => handleArrayInputChange('skills', e.target.value)}
              placeholder="e.g., React, Node.js, Python, Design"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {formData.role === 'mentor' || formData.role === 'both' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mentoring Capacity
              </label>
              <input
                type="number"
                name="mentoringCapacity"
                value={formData.mentoringCapacity}
                onChange={handleInputChange}
                min="0"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : null}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Availability (comma-separated)
            </label>
            <input
              type="text"
              value={formData.availability.join(', ')}
              onChange={(e) => handleArrayInputChange('availability', e.target.value)}
              placeholder="e.g., Mon 5-7pm, Wed 6-8pm, Sat 10am-12pm"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {message && (
            <div className={`p-3 rounded-md ${
              message.includes('Error') 
                ? 'bg-red-100 text-red-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {message}
              {message.includes('successfully') && (
                <div className="mt-2 text-sm">
                  🎉 Your profile is complete! Let's find your perfect match...
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => window.location.href = '/discover'}
                      className="text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                      Start discovering matches →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Updating...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Update Profile</span>
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdateProfileForm;
