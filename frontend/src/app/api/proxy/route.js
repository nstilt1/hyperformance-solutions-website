import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const { actionType, ...payload } = body; // We send an 'actionType' from the button

  let targetUrl = "";

  // 1. Select the correct URL based on the actionType
  switch (actionType) {
    case 'dashboard':
      targetUrl = process.env.DASHBOARD_BUILD_URL;
      break;
    case 'frontend':
      targetUrl = process.env.FRONTEND_BUILD_URL;
      break;
    default:
      return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
  }

  // 2. Forward the request to the secret URL
  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload), // Forward the actual data
    });

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 });
  }
}