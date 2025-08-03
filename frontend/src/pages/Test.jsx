import React from 'react';

const Test = () => {
  console.log('🧪 Test component loaded');
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Page</h1>
        <p className="text-gray-600 mb-4">If you can see this, the app is loading correctly.</p>
        
        <div className="space-y-2 text-sm">
          <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
          <p><strong>API URL:</strong> {process.env.REACT_APP_API_URL || 'Not set'}</p>
          <p><strong>Supabase Key:</strong> {process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</p>
        </div>
        
        <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          ✅ App is working correctly!
        </div>
      </div>
    </div>
  );
};

export default Test; 