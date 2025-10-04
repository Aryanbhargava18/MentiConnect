import { useAuth } from '../hooks/useAuth.jsx';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Github, Users, Code, Heart, ArrowRight } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const HomePage = () => {
  const { isAuthenticated, loading } = useAuth();

  // Redirect authenticated users to dashboard
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGitHubLogin = () => {
    window.location.href = 'http://localhost:5001/auth/github';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{' '}
            <span className="text-blue-600">MentiConnect</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with mentors and mentees in the tech community. 
            Build meaningful relationships and accelerate your learning journey.
          </p>
          
          {!isAuthenticated && (
            <Button
              onClick={handleGitHubLogin}
              size="lg"
              className="text-lg px-8 py-4"
            >
              <Github className="mr-2 h-5 w-5" />
              Get Started with GitHub
            </Button>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Smart Matching</CardTitle>
              <CardDescription>
                Our algorithm matches you with mentors and mentees based on skills, 
                interests, and availability.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>GitHub Integration</CardTitle>
              <CardDescription>
                Connect your GitHub profile to showcase your projects and 
                track your coding progress with mentors.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Community Driven</CardTitle>
              <CardDescription>
                Join a supportive community of developers helping each other 
                grow and succeed in their careers.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How it Works */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up with GitHub</h3>
              <p className="text-gray-600">
                Connect your GitHub account to get started. We'll use your profile 
                to understand your skills and interests.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Complete Your Profile</h3>
              <p className="text-gray-600">
                Tell us about your role, skills, and availability. This helps us 
                find the perfect matches for you.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Connecting</h3>
              <p className="text-gray-600">
                Browse potential matches, accept connections, and start your 
                mentorship journey.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div className="mt-20 text-center">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
                <CardDescription>
                  Join thousands of developers who are already using MentiConnect 
                  to grow their skills and help others.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleGitHubLogin}
                  size="lg"
                  className="w-full"
                >
                  <Github className="mr-2 h-5 w-5" />
                  Sign Up with GitHub
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
