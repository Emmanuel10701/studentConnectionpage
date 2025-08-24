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
    const { title, description, content } = body;
    
    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    // Use description if provided, otherwise use content, otherwise empty string
    const newsContent = description || content || '';
    
    const news = await prisma.news.create({
      data: {
        title,
        description: newsContent,
        date: new Date() // Always use current date
      }
    });
    
    return NextResponse.json(news, { status: 201 });
  } catch (err) {
    console.error('Error creating news:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}