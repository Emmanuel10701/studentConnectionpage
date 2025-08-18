import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

// GET /api/jobs/[id] - fetch a single job by id
export async function GET(req, { params }) {
  try {
    const { id } = params; // destructure id from params

    const job = await prisma.job.findUnique({
      where: { id },
      include: { employer: true, applications: true },
    });

    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    return NextResponse.json(job);
  } catch (err) {
    console.error("GET Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT /api/jobs/[id] - update a job
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    const updatedJob = await prisma.job.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedJob);
  } catch (err) {
    console.error("PUT Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/jobs/[id] - delete a job
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    await prisma.job.delete({ where: { id } });

    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("DELETE Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
