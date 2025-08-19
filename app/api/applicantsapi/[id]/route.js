import prisma from "../../../../libs/prisma";
import { NextResponse } from "next/server";

// ---------- GET single application ----------
export async function GET(req, { params }) {
  try {
    const { id } = await params; // ✅ must await

    const application = await prisma.jobApplication.findUnique({
      where: { id },
      include: {
        job: true,
        student: true, // optional relation
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ---------- PUT: update status ----------
export async function PUT(req, { params }) {
  try {
    const { id } = await params; // ✅ must await
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const updated = await prisma.jobApplication.update({
      where: { id },
      data: { status },
      include: { job: true, student: true },
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ---------- DELETE application ----------
export async function DELETE(req, { params }) {
  try {
    const { id } = await params; // ✅ must await

    const deleted = await prisma.jobApplication.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Application deleted successfully",
      deletedId: deleted.id,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
