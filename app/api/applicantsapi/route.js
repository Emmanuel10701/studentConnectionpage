import { NextResponse } from "next/server";

// Import the prisma instance correctly
import prisma from "../../../libs/prisma"; // Adjust path as needed

// GET: Get all applications
export async function GET() {
  try {
    const applications = await prisma.jobApplication.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        job: {
          include: {
            company: true
          }
        },
        student: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(applications);
  } catch (err) {
    console.error("GET applications error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Submit a job application
export async function POST(req) {
  try {
    const { jobId, studentId, coverLetter } = await req.json();

    if (!jobId || !studentId) {
      return NextResponse.json(
        { error: "jobId and studentId are required" },
        { status: 400 }
      );
    }

    // Check if already applied
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        jobId: jobId,
        studentId: studentId,
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied to this job" },
        { status: 409 }
      );
    }

    // Create the application
    const application = await prisma.jobApplication.create({
      data: {
        jobId: jobId,
        studentId: studentId,
        coverLetter: coverLetter || "",
        status: "PENDING",
      },
      include: {
        job: {
          include: {
            company: true
          }
        },
        student: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (err) {
    console.error("Application submission error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" }, 
      { status: 500 }
    );
  }
}