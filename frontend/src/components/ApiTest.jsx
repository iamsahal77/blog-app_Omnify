import { useEffect, useState } from 'react';
import { blogAPI } from '../services/api';

const ApiTest = () => {
  const [status, setStatus] = useState('Testing...');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('🧪 Testing API connection...');
        const response = await blogAPI.getPosts();
        console.log('✅ API Test Response:', response);
        setData(response.data);
        setStatus('✅ API Connected Successfully');
      } catch (err) {
        console.error('❌ API Test Error:', err);
        setError(err.message);
        setStatus('❌ API Connection Failed');
      }
    };

    testApi();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md m-4">
      <h3 className="text-lg font-semibold mb-2">API Connection Test</h3>
      <p className="text-sm text-gray-600 mb-2">Status: {status}</p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {data && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <strong>Success!</strong> Found {data.count} posts
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Environment: {process.env.NODE_ENV}</p>
        <p>API URL: {process.env.REACT_APP_API_URL || 'Not set'}</p>
        <p>Supabase Key: {process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</p>
      </div>
    </div>
  );
};

export default ApiTest; 