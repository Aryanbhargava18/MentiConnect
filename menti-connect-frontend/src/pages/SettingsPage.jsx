import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import apiClient from '../api/apiClient';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Key, 
  Trash2, 
  Download, 
  Upload,
  Save,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState({
    // Account settings
    email: user?.email || '',
    username: user?.username || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    matchRequests: true,
    messages: true,
    goalReminders: true,
    weeklyDigest: true,
    marketingEmails: false,
    
    // Privacy settings
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showLocation: true,
    showGitHubActivity: true,
    allowDirectMessages: true,
    
    // Appearance settings
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    
    // Security settings
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: 30,
    requirePasswordChange: false
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        email: user.email || '',
        username: user.username || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await apiClient.put('/api/users/settings', settings);
      setMessage('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage('Error updating settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await apiClient.delete('/api/users/account');
        logout();
        window.location.href = '/';
      } catch (error) {
        console.error('Error deleting account:', error);
        setMessage('Error deleting account. Please try again.');
      }
    }
  };

  const handleExportData = async () => {
    try {
      const response = await apiClient.get('/api/users/export');
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'menticonnect-data.json';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      setMessage('Error exporting data. Please try again.');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <TabButton
              id="account"
              label="Account"
              icon={User}
              isActive={activeTab === 'account'}
              onClick={setActiveTab}
            />
            <TabButton
              id="notifications"
              label="Notifications"
              icon={Bell}
              isActive={activeTab === 'notifications'}
              onClick={setActiveTab}
            />
            <TabButton
              id="privacy"
              label="Privacy"
              icon={Shield}
              isActive={activeTab === 'privacy'}
              onClick={setActiveTab}
            />
            <TabButton
              id="appearance"
              label="Appearance"
              icon={Palette}
              isActive={activeTab === 'appearance'}
              onClick={setActiveTab}
            />
            <TabButton
              id="security"
              label="Security"
              icon={Lock}
              isActive={activeTab === 'security'}
              onClick={setActiveTab}
            />
            <TabButton
              id="data"
              label="Data & Privacy"
              icon={Globe}
              isActive={activeTab === 'data'}
              onClick={setActiveTab}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Basic Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={settings.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={settings.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Key className="h-5 w-5" />
                    <span>Change Password</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        value={settings.currentPassword}
                        onChange={handleChange}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={settings.newPassword}
                        onChange={handleChange}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={settings.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Email Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm">Email notifications</span>
                        <input
                          type="checkbox"
                          name="emailNotifications"
                          checked={settings.emailNotifications}
                          onChange={handleChange}
                          className="rounded"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm">Match requests</span>
                        <input
                          type="checkbox"
                          name="matchRequests"
                          checked={settings.matchRequests}
                          onChange={handleChange}
                          className="rounded"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm">New messages</span>
                        <input
                          type="checkbox"
                          name="messages"
                          checked={settings.messages}
                          onChange={handleChange}
                          className="rounded"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm">Goal reminders</span>
                        <input
                          type="checkbox"
                          name="goalReminders"
                          checked={settings.goalReminders}
                          onChange={handleChange}
                          className="rounded"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm">Weekly digest</span>
                        <input
                          type="checkbox"
                          name="weeklyDigest"
                          checked={settings.weeklyDigest}
                          onChange={handleChange}
                          className="rounded"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm">Marketing emails</span>
                        <input
                          type="checkbox"
                          name="marketingEmails"
                          checked={settings.marketingEmails}
                          onChange={handleChange}
                          className="rounded"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Other Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm">Push notifications</span>
                        <input
                          type="checkbox"
                          name="pushNotifications"
                          checked={settings.pushNotifications}
                          onChange={handleChange}
                          className="rounded"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm">SMS notifications</span>
                        <input
                          type="checkbox"
                          name="smsNotifications"
                          checked={settings.smsNotifications}
                          onChange={handleChange}
                          className="rounded"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Privacy Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Profile Visibility</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="profileVisibility">Profile Visibility</Label>
                        <Select
                          value={settings.profileVisibility}
                          onValueChange={(value) => handleSelectChange('profileVisibility', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="connections">Connections Only</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Information Sharing</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm">Show email address</span>
                        <input
                          type="checkbox"
                          name="showEmail"
                          checked={settings.showEmail}
                          onChange={handleChange}
                          className="rounded"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm">Show phone number</span>
                        <input
                          type="checkbox"
                          name="showPhone"
                          checked={settings.showPhone}
                          onChange={handleChange}
                          className="rounded"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm">Show location</span>
                        <input
                          type="checkbox"
                          name="showLocation"
                          checked={settings.showLocation}
                          onChange={handleChange}
                          className="rounded"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm">Show GitHub activity</span>
                        <input
                          type="checkbox"
                          name="showGitHubActivity"
                          checked={settings.showGitHubActivity}
                          onChange={handleChange}
                          className="rounded"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm">Allow direct messages</span>
                        <input
                          type="checkbox"
                          name="allowDirectMessages"
                          checked={settings.allowDirectMessages}
                          onChange={handleChange}
                          className="rounded"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Appearance & Language</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Theme</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="theme">Theme</Label>
                        <Select
                          value={settings.theme}
                          onValueChange={(value) => handleSelectChange('theme', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">
                              <div className="flex items-center space-x-2">
                                <Sun className="h-4 w-4" />
                                <span>Light</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="dark">
                              <div className="flex items-center space-x-2">
                                <Moon className="h-4 w-4" />
                                <span>Dark</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="system">
                              <div className="flex items-center space-x-2">
                                <Monitor className="h-4 w-4" />
                                <span>System</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Language & Region</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="language">Language</Label>
                        <Select
                          value={settings.language}
                          onValueChange={(value) => handleSelectChange('language', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="zh">Chinese</SelectItem>
                            <SelectItem value="ja">Japanese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select
                          value={settings.timezone}
                          onValueChange={(value) => handleSelectChange('timezone', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                            <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                            <SelectItem value="UTC+0">GMT (UTC+0)</SelectItem>
                            <SelectItem value="UTC+5:30">India Standard Time (UTC+5:30)</SelectItem>
                            <SelectItem value="UTC+8">China Standard Time (UTC+8)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <span>Security Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm">Enable 2FA</span>
                        <input
                          type="checkbox"
                          name="twoFactorEnabled"
                          checked={settings.twoFactorEnabled}
                          onChange={handleChange}
                          className="rounded"
                        />
                      </label>
                      <p className="text-xs text-gray-500">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Session Settings</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                        <Input
                          id="sessionTimeout"
                          name="sessionTimeout"
                          type="number"
                          value={settings.sessionTimeout}
                          onChange={handleChange}
                          min="5"
                          max="480"
                        />
                      </div>
                      <label className="flex items-center justify-between">
                        <span className="text-sm">Login alerts</span>
                        <input
                          type="checkbox"
                          name="loginAlerts"
                          checked={settings.loginAlerts}
                          onChange={handleChange}
                          className="rounded"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Data & Privacy Tab */}
          {activeTab === 'data' && (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Download className="h-5 w-5" />
                    <span>Data Export</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Download a copy of your data including profile, messages, goals, and analytics.
                    </p>
                    <Button
                      type="button"
                      onClick={handleExportData}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Export My Data</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-600">
                    <Trash2 className="h-5 w-5" />
                    <span>Danger Zone</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h3 className="font-medium text-red-800 mb-2">Delete Account</h3>
                      <p className="text-sm text-red-700 mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <Button
                        type="button"
                        onClick={handleDeleteAccount}
                        variant="destructive"
                        className="flex items-center space-x-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete Account</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
          {activeTab !== 'data' && (
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
                    <span>Save Settings</span>
                  </div>
                )}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
