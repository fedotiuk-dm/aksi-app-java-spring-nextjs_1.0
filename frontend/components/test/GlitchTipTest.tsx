'use client';

import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Grid, Alert, Chip } from '@mui/material';
import { Error as ErrorIcon, Warning as WarningIcon, Info as InfoIcon } from '@mui/icons-material';
import * as Sentry from '@sentry/nextjs';

interface TestResult {
  test: string;
  status: 'success' | 'error' | 'pending';
  message: string;
}

export default function GlitchTipTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addTestResult = (
    test: string,
    status: 'success' | 'error' | 'pending',
    message: string
  ) => {
    setTestResults((prev) => [...prev, { test, status, message }]);
  };

  const runTest = async (testName: string, testFunction: () => void | Promise<void>) => {
    addTestResult(testName, 'pending', 'Running...');

    try {
      await testFunction();
      addTestResult(testName, 'success', 'Test completed successfully');
    } catch (error) {
      console.error(`Test ${testName} failed:`, error);
      addTestResult(
        testName,
        'error',
        `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const testBasicError = () => {
    try {
      throw new Error('Test error from React component - basic error capture');
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  const testCustomMessage = () => {
    Sentry.captureMessage('Test message from React component - custom message capture', 'warning');
  };

  const testUserContext = () => {
    Sentry.setUser({
      id: 'test-user-456',
      email: 'react-test@example.com',
      username: 'reacttestuser',
    });
    Sentry.captureMessage('Test with user context from React', 'info');
  };

  const testAdditionalContext = () => {
    Sentry.setContext('react_test_info', {
      component: 'GlitchTipTest',
      test_type: 'react_functionality_test',
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      url: window.location.href,
    });
    Sentry.captureMessage('Test with React component context', 'info');
  };

  const testPerformance = () => {
    Sentry.startSpan(
      {
        name: 'react-component-test',
        op: 'ui.interaction',
      },
      () => {
        // Simulate some work
        setTimeout(() => {
          Sentry.setContext('performance_test', {
            component: 'GlitchTipTest',
            duration: '100ms',
            status: 'completed',
          });
        }, 100);
      }
    );
  };

  const testBreadcrumb = () => {
    Sentry.addBreadcrumb({
      category: 'ui.interaction',
      message: 'User clicked GlitchTip test button',
      level: 'info',
      data: {
        component: 'GlitchTipTest',
        action: 'test_breadcrumb',
      },
    });
    Sentry.captureMessage('Test with breadcrumb from React component', 'info');
  };

  const testUnhandledError = () => {
    // This will be caught by Sentry's global error handler
    setTimeout(() => {
      throw new Error('Test unhandled error from React component');
    }, 100);
  };

  const testNetworkError = async () => {
    try {
      const response = await fetch('http://non-existent-domain-that-will-fail.com');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    const tests = [
      { name: 'Basic Error Capture', func: testBasicError },
      { name: 'Custom Message', func: testCustomMessage },
      { name: 'User Context', func: testUserContext },
      { name: 'Additional Context', func: testAdditionalContext },
      { name: 'Performance Monitoring', func: testPerformance },
      { name: 'Breadcrumb', func: testBreadcrumb },
      { name: 'Network Error', func: testNetworkError },
    ];

    for (const test of tests) {
      await runTest(test.name, test.func);
      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Test unhandled error last (it will break the component)
    setTimeout(() => {
      runTest('Unhandled Error', testUnhandledError);
    }, 1000);

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <Chip label="✓" color="success" size="small" />;
      case 'error':
        return <Chip label="✗" color="error" size="small" />;
      case 'pending':
        return <Chip label="⏳" color="warning" size="small" />;
      default:
        return null;
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ErrorIcon color="error" />
        GlitchTip Error Monitoring Test
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Цей компонент тестує функціональність GlitchTip для відстеження помилок у React додатку.
          Всі події будуть відправлені до вашого GlitchTip сервера.
        </Typography>
      </Alert>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={runAllTests}
          disabled={isRunning}
          startIcon={<ErrorIcon />}
          size="large"
        >
          {isRunning ? 'Тестування...' : 'Запустити всі тести'}
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => runTest('Basic Error', testBasicError)}
            startIcon={<ErrorIcon />}
          >
            Basic Error
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => runTest('Custom Message', testCustomMessage)}
            startIcon={<WarningIcon />}
          >
            Custom Message
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => runTest('User Context', testUserContext)}
            startIcon={<InfoIcon />}
          >
            User Context
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => runTest('Additional Context', testAdditionalContext)}
            startIcon={<InfoIcon />}
          >
            Additional Context
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => runTest('Performance', testPerformance)}
            startIcon={<InfoIcon />}
          >
            Performance
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => runTest('Breadcrumb', testBreadcrumb)}
            startIcon={<InfoIcon />}
          >
            Breadcrumb
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => runTest('Network Error', testNetworkError)}
            startIcon={<ErrorIcon />}
          >
            Network Error
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={() => runTest('Unhandled Error', testUnhandledError)}
            startIcon={<ErrorIcon />}
          >
            Unhandled Error
          </Button>
        </Grid>
      </Grid>

      {testResults.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Результати тестування:
          </Typography>
          {testResults.map((result, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {getStatusIcon(result.status)}
              <Typography variant="body2">
                <strong>{result.test}:</strong> {result.message}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <Alert severity="success" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Перевірка результатів:</strong> Відкрийте GlitchTip dashboard за адресою
          <a
            href="http://localhost:8001"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: 4 }}
          >
            http://localhost:8001
          </a>
          щоб переглянути всі відправлені події.
        </Typography>
      </Alert>
    </Paper>
  );
}
