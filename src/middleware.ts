import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware will run for every request
export function middleware(req: NextRequest) {
  const response = NextResponse.next();

  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests (OPTIONS)
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: response.headers });
  }

  return response;
}

// Apply the middleware to specific routes or all routes
export const config = {
  matcher: '/api/graphql', // Apply only to the GraphQL API
};
