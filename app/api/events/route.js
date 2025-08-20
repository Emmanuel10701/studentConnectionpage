import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Handle GET request to fetch ALL events
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        date: 'desc',
      },
    });
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json({ message: "Failed to fetch events." }, { status: 500 });
  }
}

// Handle POST request to create a NEW event
export async function POST(request) {
  try {
    const { title, date, time, location, description, registrationLink } = await request.json();

    if (!title || !date || !time || !location || !description) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        date: new Date(date),
        time,
        location,
        description,
        registrationLink,
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Failed to create event:", error);
    return NextResponse.json({ message: "Failed to create event." }, { status: 500 });
  }
}