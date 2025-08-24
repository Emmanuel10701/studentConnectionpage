// /app/api/jobalerts/route.js
import prisma from '../../../../libs/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find job alert subscription by email
    const jobAlert = await prisma.jobAlert.findUnique({
      where: {
        email: email,
      },
    });

    return NextResponse.json({ 
      isSubscribed: !!jobAlert,
      jobAlert: jobAlert 
    }, { status: 200 });

  } catch (err) {
    console.error('Error finding job alert:', err);
    return NextResponse.json(
      { error: err.message }, 
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existingAlert = await prisma.jobAlert.findUnique({
      where: {
        email: email,
      },
    });

    if (existingAlert) {
      return NextResponse.json({ 
        message: 'Already subscribed to job alerts',
        isSubscribed: true 
      }, { status: 200 });
    }

    // Create new subscription
    const jobAlert = await prisma.jobAlert.create({
      data: {
        email: email,
        subscribedAt: new Date(),
        isActive: true
      },
    });

    return NextResponse.json({ 
      message: 'Successfully subscribed to job alerts',
      isSubscribed: true,
      jobAlert: jobAlert 
    }, { status: 201 });

  } catch (err) {
    console.error('Error creating job alert:', err);
    return NextResponse.json(
      { error: err.message }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Delete subscription
    const jobAlert = await prisma.jobAlert.delete({
      where: {
        email: email,
      },
    });

    return NextResponse.json({ 
      message: 'Successfully unsubscribed from job alerts',
      isSubscribed: false 
    }, { status: 200 });

  } catch (err) {
    if (err.code === 'P2025') {
      // Record not found
      return NextResponse.json({ 
        message: 'Email not found in subscribers list',
        isSubscribed: false 
      }, { status: 404 });
    }
    
    console.error('Error deleting job alert:', err);
    return NextResponse.json(
      { error: err.message }, 
      { status: 500 }
    );
  }
}