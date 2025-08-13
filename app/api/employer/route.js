// This API route handles employer registration requests using Next.js 13+ App Router.

import prisma from '../../../libs/prisma'; // Import the singleton Prisma Client instance
import bcrypt from "bcryptjs";
import { NextResponse } from 'next/server'; // Use NextResponse for consistent responses

export async function POST(req) {
  try {
    // Get the request body and destructure the required fields
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

    // --- Input Validation: Ensure all necessary fields are present ---
    if (!name || !email || !password || !companyName || !position) {
      return new NextResponse(
        JSON.stringify({ message: "Missing Fields" }),
        { status: 400 }
      );
    }

    // --- Check for an existing user with the same email ---
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ message: "Email already registered" }),
        { status: 409 }
      );
    }

    // --- Password Hashing: Securely store the password ---
    const hashedPassword = await bcrypt.hash(password, 10);

    // --- Database Operation: Create user and employer profile ---
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // The schema field name is 'password'
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
      // Select fields to return to the client, excluding the hashed password
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        employerProfile: true
      }
    });

    // --- Success Response: Return a 201 Created status with the new user data ---
    return new NextResponse(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    // --- Error Handling: Log and return a generic 500 error ---
    console.error("Employer registration failed:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
