import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import apiClient from '../../api/apiClient';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { PlusCircle, XCircle, User } from 'lucide-react';

const UpdateProfileForm = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    role: user?.role || '',
    skills: user?.skills || [],
    mentoringCapacity: user?.mentoringCapacity || 0,
    availability: user?.availability || [],
  });
  const [newSkill, setNewSkill] = useState('');
  const [newAvailability, setNewAvailability] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        role: user.role || '',
        skills: user.skills || [],
        mentoringCapacity: user.mentoringCapacity || 0,
        availability: user.availability || [],
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = (field, newItem, setter) => {
    if (newItem.trim() && !formData[field].includes(newItem.trim())) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], newItem.trim()],
      }));
      setter('');
    }
  };

  const handleRemoveItem = (field, itemToRemove) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== itemToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await apiClient.put('/api/users/me', formData);
      updateUser(response.data);
      setMessage('Profile updated successfully! Redirecting to dashboard...');
      
      // Redirect to new dashboard after successful update
      setTimeout(() => {
        window.location.href = '/dashboard-v2';
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
            <Label htmlFor="role">Role</Label>
            <Select
              name="role"
              value={formData.role}
              onValueChange={(value) => handleSelectChange('role', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mentee">Mentee</SelectItem>
                <SelectItem value="mentor">Mentor</SelectItem>
                <SelectItem value="both">Both (Mentor & Mentee)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="skills">Skills</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                type="text"
                id="newSkill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill (e.g., React, Node.js)"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={() => handleAddItem('skills', newSkill, setNewSkill)}
                variant="outline"
                size="icon"
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                  <XCircle
                    className="ml-2 h-4 w-4 cursor-pointer text-blue-600 hover:text-blue-800"
                    onClick={() => handleRemoveItem('skills', skill)}
                  />
                </span>
              ))}
            </div>
          </div>

          {formData.role && (formData.role === 'mentor' || formData.role === 'both') && (
            <div>
              <Label htmlFor="mentoringCapacity">Mentoring Capacity</Label>
              <Input
                type="number"
                id="mentoringCapacity"
                name="mentoringCapacity"
                value={formData.mentoringCapacity}
                onChange={handleChange}
                placeholder="Number of mentees you can mentor"
                min="0"
              />
            </div>
          )}

          <div>
            <Label htmlFor="availability">Availability</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                type="text"
                id="newAvailability"
                value={newAvailability}
                onChange={(e) => setNewAvailability(e.target.value)}
                placeholder="e.g., Mon 5-7pm, Wed 6-8pm"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={() => handleAddItem('availability', newAvailability, setNewAvailability)}
                variant="outline"
                size="icon"
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.availability.map((slot, index) => (
                <span
                  key={index}
                  className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                >
                  {slot}
                  <XCircle
                    className="ml-2 h-4 w-4 cursor-pointer text-green-600 hover:text-green-800"
                    onClick={() => handleRemoveItem('availability', slot)}
                  />
                </span>
              ))}
            </div>
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
                      onClick={() => window.location.href = '/dashboard-v2'}
                      className="text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                      Go to Dashboard →
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
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdateProfileForm;
