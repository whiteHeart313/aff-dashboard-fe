import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Extract token from cookies
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No authentication token found' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const payoutModel = searchParams.get('payoutModel') || '';
    const mobileOperator = searchParams.get('mobileOperator') || '';

    // Build query parameters for backend
    const backendParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(status && { status }),
      ...(payoutModel && { payoutModel }),
      ...(mobileOperator && { mobileOperator }),
    });

    // Call backend API with Bearer token
    const backendResponse = await fetch(
      `${process.env.BACKEND_API_URL}/getAffDashboard?${backendParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || 'Failed to fetch offers from backend',
        },
        { status: backendResponse.status }
      );
    }

    const backendData = await backendResponse.json();

    // Return the data in the expected format
    return NextResponse.json({
      success: true,
      message: backendData.message || 'Offers retrieved successfully',
      data: backendData.data || {
        offers: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Extract token from cookies
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No authentication token found' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Call backend API to create offer with Bearer token
    const backendResponse = await fetch(
      `${process.env.BACKEND_API_URL}/createOffer`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || 'Failed to create offer',
        },
        { status: backendResponse.status }
      );
    }

    const backendData = await backendResponse.json();

    return NextResponse.json({
      success: true,
      message: backendData.message || 'Offer created successfully',
      data: backendData.data,
    });
  } catch (error) {
    console.error('Error creating offer:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create offer' },
      { status: 500 }
    );
  }
}
