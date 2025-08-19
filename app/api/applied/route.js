import prisma from "../../../libs/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId"); // required
    const status = searchParams.get("status"); // optional

    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    const where = { jobId };
    if (status) where.status = status;

    const applicants = await prisma.jobApplication.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            resumePath: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(applicants);
  } catch (err) {
    console.error("GET_APPLICANTS Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
