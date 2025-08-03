import React, { useState, useEffect } from 'react';
import { blogAPI } from '../services/api';

const Test = () => {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  console.log('🧪 Test component loaded');
  
  const testSupabaseConnection = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      console.log('🧪 Testing Supabase connection...');
      const result = await blogAPI.getPosts();
      setTestResult({
        success: true,
        message: 'Supabase connection successful!',
        data: result.data
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Supabase connection failed',
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Page</h1>
        <p className="text-gray-600 mb-4">If you can see this, the app is loading correctly.</p>
        
        <div className="space-y-2 text-sm mb-6">
          <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
          <p><strong>API URL:</strong> {process.env.REACT_APP_API_URL || 'Not set'}</p>
          <p><strong>Supabase Key:</strong> {process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</p>
          <p><strong>Supabase Key Length:</strong> {process.env.REACT_APP_SUPABASE_ANON_KEY?.length || 0}</p>
        </div>
        
        <button 
          onClick={testSupabaseConnection}
          disabled={isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded mb-4"
        >
          {isLoading ? 'Testing...' : 'Test Supabase Connection'}
        </button>
        
        {testResult && (
          <div className={`p-4 border rounded ${
            testResult.success 
              ? 'bg-green-100 border-green-400 text-green-700' 
              : 'bg-red-100 border-red-400 text-red-700'
          }`}>
            <h3 className="font-bold">{testResult.success ? '✅ Success' : '❌ Error'}</h3>
            <p>{testResult.message}</p>
            {testResult.error && <p className="text-sm mt-2">Error: {testResult.error}</p>}
            {testResult.status && <p className="text-sm">Status: {testResult.status}</p>}
            {testResult.data && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm">Response Data</summary>
                <pre className="text-xs mt-1 overflow-auto">{JSON.stringify(testResult.data, null, 2)}</pre>
              </details>
            )}
          </div>
        )}
        
        <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          ✅ App is working correctly!
        </div>
      </div>
    </div>
  );
};

export default Test; 