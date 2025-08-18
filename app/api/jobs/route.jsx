import prisma from "../../../libs/prisma";
import { NextResponse } from "next/server";

// ---------- GET all jobs ----------
export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        employer: true,
        applications: true,
      },
    });
    return NextResponse.json(jobs, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ---------- POST a job (Employer only) ----------
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      employerId,
      title,
      description,
      location,
      officeType,
      salary,
      type,
      qualifications,
      skills,
      benefits,
    } = body;

    const job = await prisma.job.create({
      data: {
        employerId,
        title,
        description,
        location,
        officeType,
        salary,
        type,
        qualifications,
        skills,
        benefits,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
