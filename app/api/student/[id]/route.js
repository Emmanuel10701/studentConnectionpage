// app/api/student/register/route.js

import prisma from '../../../../libs/prisma';
import bcrypt from "bcryptjs";

// --- ADDED GET, PUT, AND DELETE HANDLERS ---

// ✅ GET all students or single student by ID
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('id');

  if (studentId) {
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

// ✅ PUT — update student
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
            yearOfStudy: String(body.yearOfStudy), // ✅ ensure string
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

// ✅ DELETE — remove student
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
