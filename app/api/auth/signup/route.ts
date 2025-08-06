// pages/api/auth/signup.ts
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  try {

    // Parse the request body as JSON.
    const body = await req.json();

    console.log(`Sending signup request to backend: ${process.env.BACKEND_API_URL}/signup`);
    console.log('Data to be sent:', body);
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('Backend response :', backendResponse);
    
    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      console.log('Backend error data:', errorData);
      return NextResponse.json(
        { success: false, message: errorData.message || 'Signup failed' },
        { status: backendResponse.status }
      );
    }

    const { data } = await backendResponse.json();
    
    return NextResponse.json({
      success: true,
      message: data.message || 'Registration successful. Check your email to verify your account.',
      user: data.user
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, message: 'Registration failed. Please try again later.' },
      { status: 500 }
    );
  }
}
