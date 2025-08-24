// app/api/getapplicants/[jobId]/route.js
import { NextResponse } from "next/server";
import prisma from "../../../../libs/prisma";

export async function GET(req, { params }) {
  try {
    const { jobId } = await params;

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const applicants = await prisma.jobApplication.findMany({
      where: {
        jobId: jobId,
      },
      // Include the 'student' and 'user' data here
      include: {
        student: {
          include: {
            user: true, // This will fetch all user details
             address: true, // This is the line you need to add

          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (applicants.length === 0) {
      return NextResponse.json(
        { message: "No applicants found for this job ID." },
        { status: 404 }
      );
    }

    return NextResponse.json(applicants);
  } catch (err) {
    console.error("GET applicants by job ID error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}