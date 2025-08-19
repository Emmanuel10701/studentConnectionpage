import prisma from "../../../libs/prisma";
import { NextResponse } from "next/server";

// ---------- GET all job applications safely ----------


export async function GET() {
  try {
    const applications = await prisma.jobApplication.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(applications);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
// ---------- POST: student applies to a job ----------
export async function POST(req) {
  try {
    const { studenteireprofileid, jobId, coverLetter } = await req.json();

    if (!studenteireprofileid || !jobId) {
      return NextResponse.json(
        { error: "studenteireprofileid and jobId are required" },
        { status: 400 }
      );
    }

    const studentProfile = await prisma.studentEntireProfile.findUnique({
      where: { id: studenteireprofileid },
    });
    if (!studentProfile) {
      return NextResponse.json(
        { error: "StudentEntireProfile not found" },
        { status: 404 }
      );
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const application = await prisma.jobApplication.create({
      data: {
        job: { connect: { id: jobId } },
        student: { connect: { id: studenteireprofileid } },
        coverLetter,
      },
      include: {
        job: true,
        student: true,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
