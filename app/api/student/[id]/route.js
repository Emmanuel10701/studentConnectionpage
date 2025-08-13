// app/api/student/register/route.js

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// This POST request handler is for creating a new student registration.
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

  // --- INPUT VALIDATION ---
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

// --- ADDED GET, PUT, AND DELETE HANDLERS ---

// This GET request handler fetches all students or a single student by ID.
export async function GET(req) {
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
          role: true,
          createdAt: true,
          updatedAt: true,
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
          role: true,
          createdAt: true,
          updatedAt: true,
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

// This PUT request handler updates an existing student's profile by ID.
export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('id');
  const body = await req.json();

  if (!studentId || !body) {
    return new Response(
      JSON.stringify({ message: "Student ID and update data are required." }),
      { status: 400 }
    );
  }

  try {
    const existingStudent = await prisma.user.findUnique({ where: { id: studentId } });
    if (!existingStudent) {
      return new Response(JSON.stringify({ message: "Student not found." }), { status: 404 });
    }

    const updatedStudent = await prisma.user.update({
      where: { id: studentId },
      data: {
        name: body.name,
        email: body.email,
        studentProfile: {
          update: {
            institution: body.institution,
            course: body.course,
            yearOfStudy: body.yearOfStudy,
            constituency: body.constituency,
            ward: body.ward,
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
        studentProfile: true,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Student profile updated successfully!",
        student: updatedStudent,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update student details:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

// This DELETE request handler removes a student's profile by ID.
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('id');

  if (!studentId) {
    return new Response(
      JSON.stringify({ message: "Student ID is required." }),
      { status: 400 }
    );
  }

  try {
    const existingStudent = await prisma.user.findUnique({ where: { id: studentId } });
    if (!existingStudent) {
        return new Response(JSON.stringify({ message: "Student not found." }), { status: 404 });
    }

    await prisma.user.delete({
      where: { id: studentId },
    });

    return new Response(
      JSON.stringify({ message: "Student profile deleted successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete student:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
