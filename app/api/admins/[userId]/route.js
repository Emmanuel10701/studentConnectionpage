// File: app/api/admins/[userId]/route.js
import prisma from '../../../../libs/prisma';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { userId } = await params;

    // Find admin by userId
    const admin = await prisma.admin.findUnique({
      where: { userId }
    });

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json(admin);
  } catch (error) {
    console.error('Error fetching admin:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}