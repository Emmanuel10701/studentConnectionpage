import prisma from '../../../../libs/prisma';

// GET a single company by ID
export async function GET(request, { params }) {
  try {
    const id = params.id; // keep as string
    const company = await prisma.company.findUnique({ where: { id } });

    if (!company) {
      return new Response(JSON.stringify({ message: 'Company not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(company), { status: 200 });
  } catch (error) {
    console.error('Failed to fetch company:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

// UPDATE a company by ID
export async function PUT(request, { params }) {
  try {
    const id = params.id; // keep as string
    const body = await request.json();

    if (body.foundedDate) body.foundedDate = new Date(body.foundedDate);
    if (body.licenseExpiryDate) body.licenseExpiryDate = new Date(body.licenseExpiryDate);

    const updatedCompany = await prisma.company.update({
      where: { id },
      data: body,
    });

    return new Response(JSON.stringify(updatedCompany), { status: 200 });
  } catch (error) {
    console.error('Failed to update company:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

// DELETE a company by ID
export async function DELETE(request, { params }) {
  try {
    const id = params.id; // keep as string
    await prisma.company.delete({ where: { id } });

    return new Response(JSON.stringify({ message: 'Company deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Failed to delete company:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
