// app/api/student/register/route.js

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  // Destructure all expected fields, including the new 'constituency' and 'ward'
  const {
    name,
    email,
    password,
    institution,
    course,
    yearOfStudy,
    constituency, // Added new field
    ward, // Added new field
  } = await req.json();

  // --- UPDATED INPUT VALIDATION ---
  // Now includes checks for constituency and ward to ensure all required data is present
  if (
    !name ||
    !email ||
    !password ||
    !institution ||
    !course ||
    !yearOfStudy ||
    !constituency ||
    !ward
  ) {
    return new Response(JSON.stringify({ error: "Missing required fields." }), {
      status: 400,
    });
  }

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return new Response(
      JSON.stringify({ error: "Email already registered" }),
      { status: 409 }
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create student user and profile
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STUDENT",
        studentProfile: {
          create: {
            institution,
            course,
            yearOfStudy,
            constituency, // Added new field to the profile
            ward, // Added new field to the profile
          },
        },
      },
      include: { studentProfile: true },
    });
    return new Response(JSON.stringify({ id: user.id, email: user.email }), {
      status: 201,
    });
  } catch (error) {
    console.error("Student registration failed:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred." }),
      { status: 500 }
    );
  }
}

// --- ADDED GET SINGLE STUDENT AND ALL STUDENTS REQUESTS ---

export async function GET(req) {
  // Check for a single student ID in the query parameters
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('id');

  if (studentId) {
    // Handle request for a single student by ID
    try {
      const student = await prisma.user.findUnique({
        where: { id: studentId, role: "STUDENT" },
        select: {
          id: true,
          name: true,
          email: true,
          studentProfile: true,
        },
      });
      if (student) {
        return new Response(JSON.stringify(student), { status: 200 });
      } else {
        return new Response(JSON.stringify({ error: "Student not found." }), { status: 404 });
      }
    } catch (error) {
      console.error("Failed to fetch single student:", error);
      return new Response(JSON.stringify({ error: "An unexpected error occurred." }), { status: 500 });
    }
  } else {
    // Handle request for all students
    try {
      const students = await prisma.user.findMany({
        where: { role: "STUDENT" },
        select: {
          id: true,
          name: true,
          email: true,
          studentProfile: true,
        },
      });
      return new Response(JSON.stringify(students), { status: 200 });
    } catch (error) {
      console.error("Failed to fetch all students:", error);
      return new Response(JSON.stringify({ error: "An unexpected error occurred." }), { status: 500 });
    }
  }
}
