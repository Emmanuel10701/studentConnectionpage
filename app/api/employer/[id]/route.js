import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// ===========================================
// GET: Single Employer by ID
// ===========================================
export async function GET(req, { params }) {
  try {
    const { id } = await params; // ✅ must await
    const employer = await prisma.user.findUnique({
      where: { id },
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
    return NextResponse.json(employer || null);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ===========================================
// PUT: Update Employer
// ===========================================
export async function PUT(req, { params }) {
  try {
    const { id } = await params; // ✅ must await
    const body = await req.json();

    const updatedEmployer = await prisma.user.update({
      where: { id },
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

    return NextResponse.json(updatedEmployer);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ===========================================
// DELETE: Employer
// ===========================================
export async function DELETE(req, { params }) {
  try {
    const { id } = await params; // ✅ must await
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
