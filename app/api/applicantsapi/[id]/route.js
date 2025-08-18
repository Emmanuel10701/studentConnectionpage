import prisma from "../../../../libs/prisma";
import { NextResponse } from "next/server";

// ---------- GET single application ----------
export async function GET(req, { params }) {
  try {
    const application = await prisma.jobApplication.findUnique({
      where: { id: params.id },
      include: { job: true, student: true },
    });
    if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 });
    return NextResponse.json(application);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ---------- PUT: update status ----------
export async function PUT(req, { params }) {
  try {
    const { status } = await req.json();
    const updated = await prisma.jobApplication.update({
      where: { id: params.id },
      data: { status },
    });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ---------- DELETE application ----------
export async function DELETE(req, { params }) {
  try {
    await prisma.jobApplication.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Application deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
