// File: /api/employee/user/[userId]/route.js
import prisma from '../../../../../libs/prisma';
import { NextResponse } from 'next/server';

// =============================
// GET: Get Employee by Login User ID (Minimal)
// =============================
export async function GET(request, { params }) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log('Fetching employee for login user ID:', userId);

    // Find the user with basic info and role-specific profile only
    const employee = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        // Include role-specific profiles
        employerProfile: {
          include: {
            company: true
          }
        },
        studentProfile: true
        // Don't include other relations if not needed
      }
    });

    if (!employee) {
      return NextResponse.json(
        { success: false, message: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        employee: employee
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to fetch employee:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal Server Error', 
        error: error.message 
      },
      { status: 500 }
    );
  }
}