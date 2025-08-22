import prisma from '../../../../../libs/prisma';
import { NextResponse } from 'next/server';

// ✅ Get all jobs for a specific company
export async function GET(req, { params }) {
  try {
    const { companyId } = await params;

    const jobs = await prisma.job.findMany({
      where: {
        companyId: companyId,
      },
      include: {
        company: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(jobs);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}