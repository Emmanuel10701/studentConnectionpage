// This API route handles fetching, updating, and deleting a single employer.
// It is intended for a Next.js App Router dynamic route, e.g., /api/employer/[id]/route.js

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// ===========================================
// EMPLOYER API HANDLERS
// ===========================================

// This GET request handler fetches a single employer by ID.
// This is useful for fetching the data of a specific employer to display or edit.
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const employerId = searchParams.get("id");

  if (!employerId) {
    return new NextResponse(
      JSON.stringify({ message: "Employer ID is required." }),
      { status: 400 }
    );
  }

  try {
    const employer = await prisma.user.findUnique({
      where: { id: employerId, role: "EMPLOYER" },
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
    if (employer) {
      return new NextResponse(JSON.stringify(employer), { status: 200 });
    } else {
      return new NextResponse(
        JSON.stringify({ error: "Employer not found." }),
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Failed to fetch single employer:", error);
    return new NextResponse(
      JSON.stringify({ error: "An unexpected error occurred." }),
      { status: 500 }
    );
  }
}


// This PUT request handler updates an existing employer's profile by ID.
// The request body should contain the fields to be updated.
export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const employerId = searchParams.get("id");
  const body = await req.json();

  if (!employerId || !body) {
    return new NextResponse(
      JSON.stringify({ message: "Employer ID and update data are required." }),
      { status: 400 }
    );
  }

  try {
    const existingEmployer = await prisma.user.findUnique({
      where: { id: employerId },
    });
    if (!existingEmployer) {
      return new NextResponse(
        JSON.stringify({ message: "Employer not found." }),
        { status: 404 }
      );
    }

    // Update the user and their associated employer profile in a single operation.
    const updatedEmployer = await prisma.user.update({
      where: { id: employerId },
      data: {
        name: body.name,
        email: body.email,
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

// This DELETE request handler removes an employer's profile by ID.
// This will cascade and delete the associated employerProfile as well.
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const employerId = searchParams.get("id");

  if (!employerId) {
    return new NextResponse(
      JSON.stringify({ message: "Employer ID is required." }),
      { status: 400 }
    );
  }

  try {
    const existingEmployer = await prisma.user.findUnique({
      where: { id: employerId },
    });
    if (!existingEmployer) {
      return new NextResponse(
        JSON.stringify({ message: "Employer not found." }),
        { status: 404 }
      );
    }

    // Delete the user record, which will also delete the associated profile.
    await prisma.user.delete({
      where: { id: employerId },
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
