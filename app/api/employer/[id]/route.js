// This API route handles fetching, updating, and deleting a single employer's profile.
// The dynamic route `[id]` allows it to respond to requests for a specific employer.

import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'; // Assumes a singleton prisma client

/**
 * Handles GET requests to retrieve a single employer's details by their user ID.
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

    // --- Fetch the user and their associated employer profile ---
    const employer = await prisma.user.findUnique({
      where: { id },
      // Include the employerProfile to return all relevant data
      include: {
        employerProfile: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        employerProfile: true,
      }
    });

    if (!employer) {
      return new NextResponse(
        JSON.stringify({ message: "Employer not found." }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(employer), { status: 200 });
  } catch (error) {
    console.error("Failed to retrieve employer details:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

/**
 * Handles PUT requests to update an employer's profile.
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

    // --- Check if the employer exists first ---
    const existingEmployer = await prisma.user.findUnique({ where: { id } });
    if (!existingEmployer) {
      return new NextResponse(
        JSON.stringify({ message: "Employer not found." }),
        { status: 404 }
      );
    }

    // --- Update the user and their associated employer profile ---
    const updatedEmployer = await prisma.user.update({
      where: { id },
      data: {
        // Update user fields if they are provided in the body
        name: body.name,
        email: body.email,
        // Password hashing would be handled in a separate route for security
        employerProfile: {
          update: {
            companyName: body.companyName,
            companySize: body.companySize,
            industry: body.industry,
            phone: body.phone,
            website: body.website,
            position: body.position,
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

    return new NextResponse(
      JSON.stringify({
        message: "Employer profile updated successfully!",
        employer: updatedEmployer,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update employer details:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

/**
 * Handles DELETE requests to remove an employer's profile.
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

    // --- Delete the employer profile and then the user itself ---
    // Prisma deletes related records based on your schema's on-delete rules.
    // If not set, you may need to delete the profile first.
    await prisma.user.delete({
      where: { id },
    });

    return new NextResponse(
      JSON.stringify({ message: "Employer profile deleted successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete employer:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
