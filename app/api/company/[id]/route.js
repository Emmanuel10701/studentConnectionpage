// File: /api/company/[id]/route.js
import prisma from '../../../../libs/prisma';

// =============================
// GET: Get single company by ID
// =============================
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return new Response(JSON.stringify({ success: false, message: 'Company ID is required' }), { status: 400 });
    }

    const company = await prisma.company.findUnique({
      where: { id },
      include: { user: true } // include employer/owner
    });

    if (!company) {
      return new Response(JSON.stringify({ success: false, message: 'Company not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, company }), { status: 200 });
  } catch (error) {
    console.error('Failed to fetch company:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
}

// =============================
// PUT: Update company by ID
// =============================
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ success: false, message: 'Company ID is required' }), { status: 400 });
    }

    // Remove fields that cannot be updated or don't exist in the schema
    const { 
      id: _, 
      userId, 
      user, 
      createdAt, 
      updatedAt, 
      employeeId, 
      lastUpdated, // Remove this field as it doesn't exist in the schema
      ...updateData 
    } = body;

    const dataToUpdate = {
      ...updateData,
      foundedDate: updateData.foundedDate ? new Date(updateData.foundedDate) : undefined,
      licenseExpiryDate: updateData.licenseExpiryDate ? new Date(updateData.licenseExpiryDate) : undefined
    };

    // ✅ Connect to new employer if employeeId provided
    if (employeeId) {
      dataToUpdate.user = { connect: { id: employeeId } };
    }

    const updatedCompany = await prisma.company.update({
      where: { id },
      data: dataToUpdate,
      include: { user: true }
    });

    return new Response(JSON.stringify({ success: true, company: updatedCompany }), { status: 200 });
  } catch (error) {
    console.error('Failed to update company:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
}

// =============================
// DELETE: Delete company by ID
// =============================
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return new Response(JSON.stringify({ success: false, message: 'Company ID is required' }), { status: 400 });
    }

    await prisma.company.delete({
      where: { id }
    });

    return new Response(JSON.stringify({ success: true, message: 'Company deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Failed to delete company:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
}