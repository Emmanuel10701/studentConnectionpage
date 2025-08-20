import prisma from '../../../../libs/prisma';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
  const { id } = await params; // ✅ must await
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
  const { id } = await params; // ✅ must await
    const body = await req.json();

    const updated = await prisma.event.update({
      where: { id },
      data: { ...body, date: body.date ? new Date(body.date) : undefined },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
  const { id } = await params; // ✅ must await
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}