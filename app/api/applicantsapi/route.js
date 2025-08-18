import prisma from "../../../libs/prisma";
import { NextResponse } from "next/server";

// ---------- GET all applications ----------
export async function GET() {
  try {
    const applications = await prisma.jobApplication.findMany({
      include: { job: true, student: true },
    });
    return NextResponse.json(applications);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ---------- POST: student applies to a job ----------
export async function POST(req) {
  try {
    const { jobId, studentId, coverLetter, resumePath } = await req.json();

    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        studentId,
        coverLetter,
        resumePath,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
