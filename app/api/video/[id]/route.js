import prisma from '../../../../libs/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  try {
  const { id } = await params; // ✅ must await
    const body = await req.json();
    const updated = await prisma.video.update({ where: { id }, data: body });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
  const { id } = await params; // ✅ must await
    await prisma.video.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export async function GET(req, { params }) {
  try {
  const { id } = await params; // ✅ must await
    const video = await prisma.video.findUnique({ where: { id } });
    return NextResponse.json(video);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}