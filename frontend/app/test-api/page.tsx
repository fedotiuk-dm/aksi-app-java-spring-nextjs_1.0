'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/axios';
import { testBackendConnection } from '@/lib/api/test-connection';

export default function TestApiPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    // Run test connection function
    await testBackendConnection();

    // Additional visual tests
    const results: any[] = [];

    // Test 1: Backend health
    try {
      const response = await apiClient.get('/api/health');
      results.push({
        test: 'Backend Health',
        status: 'success',
        data: response.data,
      });
    } catch (error: any) {
      results.push({
        test: 'Backend Health',
        status: 'error',
        error: error.message,
        details: error.response?.data,
      });
    }

    // Test 2: Auth session
    try {
      const response = await apiClient.get('/api/auth/session');
      results.push({
        test: 'Auth Session',
        status: 'success',
        data: response.data,
      });
    } catch (error: any) {
      results.push({
        test: 'Auth Session',
        status: error.response?.status === 401 ? 'info' : 'error',
        error: error.message,
        details: error.response?.data,
      });
    }

    // Test 3: API Docs
    try {
      const response = await apiClient.get('/v3/api-docs');
      results.push({
        test: 'API Documentation',
        status: 'success',
        data: {
          openapi: response.data.openapi,
          title: response.data.info?.title,
          version: response.data.info?.version,
        },
      });
    } catch (error: any) {
      results.push({
        test: 'API Documentation',
        status: 'error',
        error: error.message,
        details: error.response?.data,
      });
    }

    setTestResults(results);
    setIsLoading(false);
  };

  useEffect(() => {
    console.log('🔧 Current configuration:', {
      apiBaseURL: process.env.NEXT_PUBLIC_API_URL,
      currentOrigin: window.location.origin,
    });
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">API Connection Test</h1>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-2">Frontend: {typeof window !== 'undefined' ? window.location.origin : 'SSR'}</p>
        <p className="text-gray-600 mb-2">Backend: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}</p>
      </div>

      <button
        onClick={runTests}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Running Tests...' : 'Run Connection Tests'}
      </button>

      <div className="mt-8 space-y-4">
        {testResults.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded border ${
              result.status === 'success'
                ? 'bg-green-50 border-green-300'
                : result.status === 'info'
                ? 'bg-blue-50 border-blue-300'
                : 'bg-red-50 border-red-300'
            }`}
          >
            <h3 className="font-semibold mb-2">
              {result.status === 'success' ? '✅' : result.status === 'info' ? 'ℹ️' : '❌'} {result.test}
            </h3>
            {result.error && (
              <p className="text-red-600 mb-2">Error: {result.error}</p>
            )}
            {result.data && (
              <pre className="bg-white p-2 rounded text-xs overflow-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            )}
            {result.details && (
              <pre className="bg-white p-2 rounded text-xs overflow-auto mt-2">
                {JSON.stringify(result.details, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">📝 Console Logs</h3>
        <p className="text-sm text-gray-600">
          Check browser console (F12) for detailed logs
        </p>
      </div>
    </div>
  );
}