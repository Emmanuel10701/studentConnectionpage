// File: /api/employer/route.js
// Handles employer registration (POST) and retrieval of all employers (GET)

import prisma from '../../../libs/prisma';
import bcrypt from "bcryptjs";
import { NextResponse } from 'next/server';

// ======================
// POST: Register Employer
// ======================
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      companyName,
      companySize,
      industry,
      phone,
      website,
      position,
    } = body;

    // Validate required fields
    if (!name || !email || !password || !companyName || !position) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if email is already registered
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user + employer profile
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "EMPLOYER",
        employerProfile: {
          create: {
            companyName,
            companySize,
            industry,
            phone,
            website,
            position,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        employerProfile: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Employer registration failed:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ======================
// GET: All Employers
// ======================
export async function GET() {
  try {
    const employers = await prisma.user.findMany({
      where: { role: { equals: "EMPLOYER" } },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        employerProfile: true,
      },
    });

    return NextResponse.json(employers, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch employers:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
