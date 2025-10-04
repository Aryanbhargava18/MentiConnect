import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import apiClient from '../api/apiClient';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Code, 
  Users, 
  Settings, 
  Save, 
  Plus, 
  X, 
  Edit, 
  Camera,
  Shield,
  Bell,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Award,
  Target,
  Clock
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    role: '',
    skills: [],
    mentoringCapacity: 0,
    availability: [],
    bio: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    twitter: '',
    phone: '',
    timezone: '',
    experience: '',
    education: '',
    certifications: [],
    interests: [],
    languages: [],
    socialLinks: {}
  });
  const [newSkill, setNewSkill] = useState('');
  const [newAvailability, setNewAvailability] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (user) {
      setFormData({
        role: user.role || '',
        skills: user.skills || [],
        mentoringCapacity: user.mentoringCapacity || 0,
        availability: user.availability || [],
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        twitter: user.twitter || '',
        phone: user.phone || '',
        timezone: user.timezone || '',
        experience: user.experience || '',
        education: user.education || '',
        certifications: user.certifications || [],
        interests: user.interests || [],
        languages: user.languages || [],
        socialLinks: user.socialLinks || {}
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
      setMessage('Profile updated successfully!');
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

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? 'bg-blue-100 text-blue-700 border border-blue-200'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
              <p className="text-gray-600">Manage your profile information and preferences</p>
            </div>
            <div className="flex items-center space-x-4">
              <img
                src={user?.avatarUrl}
                alt={user?.username}
                className="h-16 w-16 rounded-full border-4 border-white shadow-lg"
              />
              <div>
                <h2 className="text-xl font-semibold">{user?.username}</h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <TabButton
              id="basic"
              label="Basic Info"
              icon={User}
              isActive={activeTab === 'basic'}
              onClick={setActiveTab}
            />
            <TabButton
              id="skills"
              label="Skills & Expertise"
              icon={Code}
              isActive={activeTab === 'skills'}
              onClick={setActiveTab}
            />
            <TabButton
              id="availability"
              label="Availability"
              icon={Calendar}
              isActive={activeTab === 'availability'}
              onClick={setActiveTab}
            />
            <TabButton
              id="social"
              label="Social Links"
              icon={Globe}
              isActive={activeTab === 'social'}
              onClick={setActiveTab}
            />
            <TabButton
              id="preferences"
              label="Preferences"
              icon={Settings}
              isActive={activeTab === 'preferences'}
              onClick={setActiveTab}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => handleSelectChange('role', value)}
                    >
                      <SelectTrigger>
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
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Professional Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="experience">Experience</Label>
                    <Textarea
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="Describe your professional experience..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="education">Education</Label>
                    <Textarea
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      placeholder="Your educational background..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={formData.timezone}
                      onValueChange={(value) => handleSelectChange('timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                        <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                        <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="UTC+0">UTC</SelectItem>
                        <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                        <SelectItem value="UTC+5:30">India Standard Time (UTC+5:30)</SelectItem>
                        <SelectItem value="UTC+8">China Standard Time (UTC+8)</SelectItem>
                        <SelectItem value="UTC+9">Japan Standard Time (UTC+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Code className="h-5 w-5" />
                    <span>Technical Skills</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="skills">Skills</Label>
                    <div className="flex space-x-2 mb-2">
                      <Input
                        type="text"
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
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                          <X
                            className="ml-2 h-4 w-4 cursor-pointer text-blue-600 hover:text-blue-800"
                            onClick={() => handleRemoveItem('skills', skill)}
                          />
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="languages">Programming Languages</Label>
                    <div className="flex space-x-2 mb-2">
                      <Input
                        type="text"
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        placeholder="Add a language (e.g., JavaScript, Python)"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={() => handleAddItem('languages', newLanguage, setNewLanguage)}
                        variant="outline"
                        size="icon"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.languages.map((language, index) => (
                        <span
                          key={index}
                          className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                        >
                          {language}
                          <X
                            className="ml-2 h-4 w-4 cursor-pointer text-green-600 hover:text-green-800"
                            onClick={() => handleRemoveItem('languages', language)}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>Certifications & Interests</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="certifications">Certifications</Label>
                    <div className="flex space-x-2 mb-2">
                      <Input
                        type="text"
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        placeholder="Add a certification"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={() => handleAddItem('certifications', newCertification, setNewCertification)}
                        variant="outline"
                        size="icon"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.certifications.map((cert, index) => (
                        <span
                          key={index}
                          className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                        >
                          {cert}
                          <X
                            className="ml-2 h-4 w-4 cursor-pointer text-purple-600 hover:text-purple-800"
                            onClick={() => handleRemoveItem('certifications', cert)}
                          />
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="interests">Interests</Label>
                    <div className="flex space-x-2 mb-2">
                      <Input
                        type="text"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        placeholder="Add an interest"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={() => handleAddItem('interests', newInterest, setNewInterest)}
                        variant="outline"
                        size="icon"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                        >
                          {interest}
                          <X
                            className="ml-2 h-4 w-4 cursor-pointer text-orange-600 hover:text-orange-800"
                            onClick={() => handleRemoveItem('interests', interest)}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Availability Tab */}
          {activeTab === 'availability' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Availability & Mentoring</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="availability">Availability</Label>
                    <div className="flex space-x-2 mb-2">
                      <Input
                        type="text"
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
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.availability.map((slot, index) => (
                        <span
                          key={index}
                          className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                        >
                          <Clock className="inline h-3 w-3 mr-1" />
                          {slot}
                          <X
                            className="ml-2 h-4 w-4 cursor-pointer text-green-600 hover:text-green-800"
                            onClick={() => handleRemoveItem('availability', slot)}
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
                        max="20"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        How many mentees can you effectively mentor at once?
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Social Links Tab */}
          {activeTab === 'social' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Social Links & Online Presence</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      placeholder="https://github.com/username"
                    />
                  </div>

                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div>
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Notification & Privacy Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">New match requests</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Message notifications</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Goal reminders</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Marketing emails</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Privacy</h3>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Profile visible to other users</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Show GitHub activity</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Show contact information</span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success Message */}
          {message && (
            <div className={`p-4 rounded-md ${
              message.includes('Error') 
                ? 'bg-red-100 text-red-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="px-8"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
