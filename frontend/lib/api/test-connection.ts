/**
 * Test file to check backend connection
 */

import { apiClient } from '../axios';

export async function testBackendConnection() {
  console.log('🔍 Testing backend connection...');
  
  try {
    // Test 1: Check if backend is running
    console.log('\n📡 Test 1: Checking backend health...');
    const healthResponse = await apiClient.get('/api/health');
    console.log('✅ Health check response:', healthResponse.data);
  } catch (error: any) {
    console.error('❌ Health check failed:', error.message);
    console.error('Response:', error.response?.data);
    console.error('Status:', error.response?.status);
  }

  try {
    // Test 2: Check CORS and cookies
    console.log('\n🍪 Test 2: Checking session/cookies...');
    const sessionResponse = await apiClient.get('/api/auth/session');
    console.log('✅ Session response:', sessionResponse.data);
  } catch (error: any) {
    console.error('❌ Session check failed:', error.message);
    if (error.response?.status === 401) {
      console.log('ℹ️ This is expected if not logged in');
    }
  }

  try {
    // Test 3: Check if API docs are accessible
    console.log('\n📚 Test 3: Checking API docs...');
    const docsResponse = await apiClient.get('/v3/api-docs');
    console.log('✅ API docs available, OpenAPI version:', docsResponse.data.openapi);
  } catch (error: any) {
    console.error('❌ API docs check failed:', error.message);
  }

  // Test 4: Check request headers
  console.log('\n🔧 Test 4: Checking request configuration...');
  apiClient.interceptors.request.use((config) => {
    console.log('Request config:', {
      url: config.url,
      baseURL: config.baseURL,
      withCredentials: config.withCredentials,
      headers: config.headers,
    });
    return config;
  });

  // Make a test request to see the config
  try {
    await apiClient.get('/test-headers');
  } catch (error) {
    // Expected to fail, we just want to see the request config
  }
}

// Helper to test from browser console
if (typeof window !== 'undefined') {
  (window as any).testBackendConnection = testBackendConnection;
  console.log('💡 You can run testBackendConnection() in browser console to test the connection');
}