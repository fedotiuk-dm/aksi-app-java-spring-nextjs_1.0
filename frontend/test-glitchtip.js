// Test script for GlitchTip error monitoring
// This should be run in browser console, not Node.js
// Copy and paste the code below into browser console when on http://localhost:3000/test-glitchtip

console.log('🚨 This script should be run in browser console, not Node.js!');
console.log('📋 Instructions:');
console.log('1. Start frontend: npm run dev');
console.log('2. Open: http://localhost:3000/test-glitchtip');
console.log('3. Open browser console (F12)');
console.log('4. Copy and paste the test code from the page');
console.log('5. Or use the React component buttons');

process.exit(0);

console.log('🚀 Testing GlitchTip Error Monitoring...\n');

// Test 1: Basic error capture
console.log('📝 Test 1: Capturing basic error...');
try {
  throw new Error('Test error from frontend - basic error capture');
} catch (error) {
  Sentry.captureException(error);
  console.log('✅ Basic error captured and sent to GlitchTip');
}

// Test 2: Custom message
console.log('\n📝 Test 2: Capturing custom message...');
Sentry.captureMessage('Test message from frontend - custom message capture', 'warning');
console.log('✅ Custom message captured and sent to GlitchTip');

// Test 3: User context
console.log('\n📝 Test 3: Setting user context...');
Sentry.setUser({
  id: 'test-user-123',
  email: 'test@example.com',
  username: 'testuser',
});
Sentry.captureMessage('Test with user context', 'info');
console.log('✅ User context set and message sent');

// Test 4: Additional context
console.log('\n📝 Test 4: Adding additional context...');
Sentry.setContext('test_info', {
  test_type: 'glitchtip_functionality_test',
  timestamp: new Date().toISOString(),
  user_agent: 'Node.js Test Script',
  environment: process.env.NODE_ENV || 'development',
});
Sentry.captureMessage('Test with additional context', 'info');
console.log('✅ Additional context added and message sent');

// Test 5: Performance monitoring
console.log('\n📝 Test 5: Performance monitoring...');
Sentry.startSpan(
  {
    name: 'test-performance-monitoring',
    op: 'test',
  },
  () => {
    setTimeout(() => {
      Sentry.setContext('performance_test', {
        test_duration: '100ms',
        status: 'completed',
        timestamp: new Date().toISOString(),
      });
      console.log('✅ Performance span completed');
    }, 100);
  }
);

// Test 6: Breadcrumb
console.log('\n📝 Test 6: Adding breadcrumb...');
Sentry.addBreadcrumb({
  category: 'test',
  message: 'Test breadcrumb added',
  level: 'info',
  data: {
    test_action: 'glitchtip_test',
    test_step: 'breadcrumb_test',
  },
});
Sentry.captureMessage('Test with breadcrumb', 'info');
console.log('✅ Breadcrumb added and message sent');

// Test 7: Promise rejection
console.log('\n📝 Test 7: Testing unhandled promise rejection...');
Promise.reject(new Error('Test unhandled promise rejection')).catch((error) => {
  Sentry.captureException(error);
  console.log('✅ Unhandled promise rejection captured');
});

console.log('\n🎉 All GlitchTip tests completed!');
console.log(
  '📊 Check your GlitchTip dashboard at http://localhost:8001 to see the captured events'
);
console.log('⏱️  Waiting 5 seconds for events to be sent...');

// Give some time for events to be sent
setTimeout(() => {
  console.log('✅ Test script finished. Events should now be visible in GlitchTip.');
  console.log(
    '📊 Check your GlitchTip dashboard at http://localhost:8001 to see the captured events'
  );
  process.exit(0);
}, 5000);
