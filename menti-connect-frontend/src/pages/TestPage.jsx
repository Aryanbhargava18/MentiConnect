import React from 'react';

const TestPage = () => {
  console.log('TestPage rendering...');
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🚀 MentiConnect Test Page
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          If you can see this, React is working!
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">System Status</h2>
          <div className="space-y-2 text-left">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>React: ✅ Working</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Tailwind CSS: ✅ Working</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Frontend Server: ✅ Running</span>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <a 
            href="/" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home Page
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
