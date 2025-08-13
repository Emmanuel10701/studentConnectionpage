// This API route handles fetching, updating, and deleting a single student's profile.
// The dynamic route `[id]` allows it to respond to requests for a specific student.

import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'; // Assumes a singleton prisma client

/**
 * Handles GET requests to retrieve a single student's details by their user ID.
 * @param {object} req The Next.js Request object.
 * @param {object} context The context object containing route parameters.
 */
export async function GET(req, { params }) {
  try {
    const { id } = params;

    // --- Validate the ID parameter ---
    if (!id) {
      return new NextResponse(
        JSON.stringify({ message: "User ID is required." }),
        { status: 400 }
      );
    }

    // --- Fetch the user and their associated student profile ---
    const student = await prisma.user.findUnique({
      where: { id },
      // Include the studentProfile to return all relevant data
      include: {
        studentProfile: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        studentProfile: true,
      }
    });

    if (!student) {
      return new NextResponse(
        JSON.stringify({ message: "Student not found." }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(student), { status: 200 });
  } catch (error) {
    console.error("Failed to retrieve student details:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

/**
 * Handles PUT requests to update a student's profile.
 * @param {object} req The Next.js Request object.
 * @param {object} context The context object containing route parameters.
 */
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    // --- Validate the ID parameter and request body ---
    if (!id || !body) {
      return new NextResponse(
        JSON.stringify({ message: "User ID and update data are required." }),
        { status: 400 }
      );
    }

    // --- Check if the student exists first ---
    const existingStudent = await prisma.user.findUnique({ where: { id } });
    if (!existingStudent) {
      return new NextResponse(
        JSON.stringify({ message: "Student not found." }),
        { status: 404 }
      );
    }

    // --- Update the user and their associated student profile ---
    const updatedStudent = await prisma.user.update({
      where: { id },
      data: {
        // Update user fields if they are provided in the body
        name: body.name,
        email: body.email,
        studentProfile: {
          update: {
            institution: body.institution,
            course: body.course,
            yearOfStudy: body.yearOfStudy,
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

    return new NextResponse(
      JSON.stringify({
        message: "Student profile updated successfully!",
        student: updatedStudent,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update student details:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

/**
 * Handles DELETE requests to remove a student's profile.
 * @param {object} req The Next.js Request object.
 * @param {object} context The context object containing route parameters.
 */
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return new NextResponse(
        JSON.stringify({ message: "User ID is required." }),
        { status: 400 }
      );
    }

    // --- Delete the student profile and then the user itself ---
    await prisma.user.delete({
      where: { id },
    });

    return new NextResponse(
      JSON.stringify({ message: "Student profile deleted successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete student:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
