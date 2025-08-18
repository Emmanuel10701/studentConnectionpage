import prisma from '../../../libs/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const video = await prisma.video.findFirst();
    return NextResponse.json(video);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, url } = body;

    // Delete existing video if any
    await prisma.video.deleteMany({});

    const newVideo = await prisma.video.create({ data: { title, description, url } });
    return NextResponse.json(newVideo, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
