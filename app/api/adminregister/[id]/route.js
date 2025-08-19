import prisma from '../../../../libs/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

// ---------------- GET SINGLE ADMIN ----------------
export async function GET(req, { params }) {
  try {
    const { id } = await params; // ✅ must await
    const admin = await prisma.admin.findUnique({
      where: { id },
      include: { user: true },
    });

    return NextResponse.json(admin || null);
  } catch (error) {
    console.error('GET Admin Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ---------------- PUT ADMIN ----------------
export async function PUT(req, { params }) {
  try {
    const { id } = await params; // ✅ must await
    const body = await req.json();

    // Protect role and userId from being changed
    delete body.role;
    delete body.userId;

    // Handle password update separately
    let passwordData = {};
    if (body.password) {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      passwordData = { user: { update: { password: hashedPassword } } };
      delete body.password;
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: {
        ...body,
        ...passwordData,
      },
      include: { user: true },
    });

    return NextResponse.json(updatedAdmin);
  } catch (error) {
    console.error('PUT Admin Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ---------------- DELETE ADMIN ----------------
export async function DELETE(req, { params }) {
  try {
    const { id } = await params; // ✅ must await

    const admin = await prisma.admin.findUnique({ where: { id } });
    if (!admin) {
      return NextResponse.json(null);
    }

    await prisma.admin.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('DELETE Admin Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
