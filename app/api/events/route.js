import prisma from '../../../libs/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const events = await prisma.event.findMany({ orderBy: { date: 'asc' } });
    return NextResponse.json(events);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, date, time, location } = body;
    const event = await prisma.event.create({ data: { title, date: new Date(date), time, location } });
    return NextResponse.json(event, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
