import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email , password } = await request.json();
    
    // Call your actual backend API
    console.log(`sending request to backend to this endpoint ${process.env.BACKEND_API_URL}/signin`);
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email , password }),
    });
    console.log('Backend response status:', backendResponse.status);
    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      console.log('Backend error data:', errorData);
      return NextResponse.json(
        { success: false, message: errorData.message || 'Authentication failed' },
        { status: backendResponse.status }
      );
    }

    const {data} = await backendResponse.json();
    
    // Create response
    const response = NextResponse.json({ 
      success: true, 
      token: data.jwt,
      user: data.user, // Include user data if your backend returns it
      message: data.message || 'Authentication successful'
    });
    
    // Set cookie with the token from your backend
    response.cookies.set('token', data.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });
    
    return response;
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
}
