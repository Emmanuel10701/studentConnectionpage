// File: /api/company/[userId]/route.js
import prisma from '../../../../libs/prisma';

// =============================
// GET: Get a company profile by userId
// =============================
export async function GET(request, { params }) {
  try {
    const { userId } = params;

    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, message: 'User ID is required' }),
        { status: 400 }
      );
    }

    const company = await prisma.company.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, role: true } }
      }
    });

    if (!company) {
      return new Response(
        JSON.stringify({ success: false, message: 'Company not found' }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true, company }), {
      status: 200
    });
  } catch (error) {
    console.error('Failed to fetch company:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal Server Error',
        error: error.message
      }),
      { status: 500 }
    );
  }
}

// =============================
// PUT: Update a company profile
// =============================
export async function PUT(request, { params }) {
  try {
    const { userId } = params;
    const body = await request.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, message: 'User ID is required in URL' }),
        { status: 400 }
      );
    }

    if (body.foundedDate) body.foundedDate = new Date(body.foundedDate);
    if (body.licenseExpiryDate) body.licenseExpiryDate = new Date(body.licenseExpiryDate);

    const updatedCompany = await prisma.company.update({
      where: { userId },
      data: body,
      include: {
        user: { select: { id: true, name: true, role: true } }
      }
    });

    return new Response(
      JSON.stringify({ success: true, company: updatedCompany }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to update company:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal Server Error',
        error: error.message
      }),
      { status: 500 }
    );
  }
}

// =============================
// DELETE: Delete a company profile
// =============================
export async function DELETE(request, { params }) {
  try {
    const { userId } = params;

    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, message: 'User ID is required' }),
        { status: 400 }
      );
    }

    await prisma.company.delete({
      where: { userId }
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Company deleted successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to delete company:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal Server Error',
        error: error.message
      }),
      { status: 500 }
    );
  }
}
