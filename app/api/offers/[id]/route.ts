import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Extract token from cookies
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No authentication token found' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Call backend API with Bearer token
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/getOffer/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { success: false, message: errorData.message || 'Failed to fetch offer from backend' },
        { status: backendResponse.status }
      );
    }

    const backendData = await backendResponse.json();
    
    return NextResponse.json({
      success: true,
      message: backendData.message || 'Offer retrieved successfully',
      data: backendData.data
    });
  } catch (error) {
    console.error('Error fetching offer:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch offer' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Extract token from cookies
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No authentication token found' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    
    // Call backend API to update offer with Bearer token
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/updateOffer/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { success: false, message: errorData.message || 'Failed to update offer' },
        { status: backendResponse.status }
      );
    }

    const backendData = await backendResponse.json();
    
    return NextResponse.json({
      success: true,
      message: backendData.message || 'Offer updated successfully',
      data: backendData.data
    });
  } catch (error) {
    console.error('Error updating offer:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update offer' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Extract token from cookies
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No authentication token found' },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    // Call backend API to delete offer with Bearer token
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/deleteOffer/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { success: false, message: errorData.message || 'Failed to delete offer' },
        { status: backendResponse.status }
      );
    }

    const backendData = await backendResponse.json();
    
    return NextResponse.json({
      success: true,
      message: backendData.message || 'Offer deleted successfully',
      data: backendData.data
    });
  } catch (error) {
    console.error('Error deleting offer:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete offer' },
      { status: 500 }
    );
  }
}
