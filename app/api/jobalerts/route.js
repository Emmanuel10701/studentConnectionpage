import prisma from '../../../libs/prisma';
import { NextResponse } from 'next/server';

// POST - Find job alert by email
export async function POST(request) {
  try {
    const { email } = await request.json();

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

// GET - Find job alert by email query parameter
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