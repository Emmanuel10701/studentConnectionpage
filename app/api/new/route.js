import prisma from '../../../libs/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const news = await prisma.news.findMany({ orderBy: { date: 'desc' } });
    return NextResponse.json(news);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, date } = body;
    const news = await prisma.news.create({ data: { title, description, date: new Date(date) } });
    return NextResponse.json(news, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
