import prisma from '../../../../libs/prisma';
import { NextResponse } from 'next/server';

// ✅ Get a single job by ID
export async function GET(req, { params }) {
  try {
    const { id } = await params; // ✅ must await
    const job = await prisma.job.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ Update a job
export async function PUT(req, { params }) {
  try {
    const { id } = await params; // ✅ must await
    const body = await req.json();

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        ...body,
        salaryRange: body.salaryRange || null,
        type: body.type || null,
        officeType: body.officeType || null,
      },
    });

    return NextResponse.json(updatedJob);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ Delete a job
export async function DELETE(req, { params }) {
  try {
    const { id } = await params; // ✅ must await
    await prisma.job.delete({ where: { id } });
    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
