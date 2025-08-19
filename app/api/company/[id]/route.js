import prisma from '../../../../libs/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const company = await prisma.company.findUnique({
      where: { id },
      include: { employers: true } // include linked employer profiles
    });

    if (!company) {
      return new Response(JSON.stringify({ success: false, message: 'Company not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, company }), { status: 200 });
  } catch (error) {
    console.error('Failed to fetch company:', error);
    return new Response(JSON.stringify({ success: false, message: 'Internal Server Error', error }), { status: 500 });
  }
}


export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    // If updating employer relationship, ensure employerId is provided
    if (body.hasOwnProperty('employerId') && !body.employerId) {
      return new Response(
        JSON.stringify({ success: false, message: 'employerId is required when updating employer' }),
        { status: 400 }
      );
    }

    // Convert dates if provided
    if (body.foundedDate) body.foundedDate = new Date(body.foundedDate);
    if (body.licenseExpiryDate) body.licenseExpiryDate = new Date(body.licenseExpiryDate);

    // Prepare data for update
    const updateData = { ...body };
    if (body.employerId) {
      updateData.employers = { connect: { id: body.employerId } };
      delete updateData.employerId; // remove to avoid conflict
    }

    const updatedCompany = await prisma.company.update({
      where: { id },
      data: updateData,
      include: { employers: true } // include linked employer(s)
    });

    return new Response(JSON.stringify({ success: true, company: updatedCompany }), { status: 200 });
  } catch (error) {
    console.error('Failed to update company:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal Server Error', error }),
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Optionally delete linked employers if needed, else leave for cascade
    // await prisma.employerProfile.deleteMany({ where: { companyId: id } });

    await prisma.company.delete({ where: { id } });

    return new Response(JSON.stringify({ success: true, message: 'Company deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Failed to delete company:', error);
    return new Response(JSON.stringify({ success: false, message: 'Internal Server Error', error }), { status: 500 });
  }
}
