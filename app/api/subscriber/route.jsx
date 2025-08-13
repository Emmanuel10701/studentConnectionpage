// This API route handles adding and retrieving newsletter subscribers.

import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'; // Assumes a singleton prisma client


export async function POST(req) {
  try {
    const { email } = await req.json();

    // --- Input Validation ---
    if (!email) {
      return new NextResponse(
        JSON.stringify({ message: "Email is required." }),
        { status: 400 }
      );
    }

    // --- Check for an existing subscriber to prevent duplicates ---
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      return new NextResponse(
        JSON.stringify({ message: "Email is already subscribed." }),
        { status: 409 } // 409 Conflict status code
      );
    }

    // --- Create a new subscriber record in the database ---
    const newSubscriber = await prisma.subscriber.create({
      data: { email },
    });

    return new NextResponse(
      JSON.stringify({
        message: "Successfully subscribed!",
        subscriber: newSubscriber,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to add subscriber:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const subscribers = await prisma.subscriber.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    return new NextResponse(JSON.stringify(subscribers), { status: 200 });
  } catch (error) {
    console.error("Failed to retrieve subscribers:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
