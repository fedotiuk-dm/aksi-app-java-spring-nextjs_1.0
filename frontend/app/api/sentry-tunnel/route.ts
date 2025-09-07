import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const envelope = await request.arrayBuffer();

    // Get GlitchTip URL from environment or use default
    const glitchtipUrl = process.env.GLITCHTIP_URL || 'http://localhost:8001';
    const dsn = process.env.NEXT_PUBLIC_GLITCHTIP_DSN;

    if (!dsn) {
      console.warn('GLITCHTIP_DSN not configured');
      return new NextResponse('Configuration Error', { status: 500 });
    }

    // Extract components from DSN
    const dsnMatch = dsn.match(/http:\/\/([^@]+)@([^\/]+)\/(\d+)/);
    if (!dsnMatch) {
      console.warn('Invalid DSN format');
      return new NextResponse('Invalid DSN', { status: 500 });
    }

    const [, sentryKey, projectId] = dsnMatch;

    // Build tunnel URL according to documentation
    const tunnelUrl = `${glitchtipUrl}/api/${projectId}/envelope/?sentry_version=7&sentry_key=${sentryKey}&sentry_client=sentry.javascript.nextjs%2F7.0.0`;

    // Forward the envelope to GlitchTip
    await fetch(tunnelUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
        Accept: '*/*',
      },
      body: envelope,
    });

    return new NextResponse(JSON.stringify({ status: 'ok' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GlitchTip tunnel error:', error);
    return new NextResponse(
      JSON.stringify({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
