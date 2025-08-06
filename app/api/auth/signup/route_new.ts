// pages/api/auth/signup.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyRecaptchaToken } from '@/lib/recaptcha';
import {
  getSignupSchema,
  SignupSchemaType,
} from '@/app/(auth)/forms/signup-schema';

export async function POST(req: NextRequest) {
  try {
    const recaptchaToken = req.headers.get('x-recaptcha-token');

    if (!recaptchaToken) {
      return NextResponse.json(
        { message: 'reCAPTCHA verification required' },
        { status: 400 }
      );
    }

    const isValidToken = await verifyRecaptchaToken(recaptchaToken);

    if (!isValidToken) {
      return NextResponse.json(
        { message: 'reCAPTCHA verification failed' },
        { status: 400 }
      );
    }

    // Parse the request body as JSON.
    const body = await req.json();

    // Validate the data using safeParse.
    const result = getSignupSchema().safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          message: 'Invalid input. Please check your data and try again.',
        },
        { status: 400 }
      );
    }

    const { email, password, name }: SignupSchemaType = result.data;

    // Call your backend API for signup
    console.log(
      `Sending signup request to backend: ${process.env.BACKEND_API_URL}/signup`
    );
    const backendResponse = await fetch(
      `${process.env.BACKEND_API_URL}/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      }
    );

    console.log('Backend response status:', backendResponse.status);

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
      message:
        data.message ||
        'Registration successful. Check your email to verify your account.',
      user: data.user,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Registration failed. Please try again later.',
      },
      { status: 500 }
    );
  }
}
