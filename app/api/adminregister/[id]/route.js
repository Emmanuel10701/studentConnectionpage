import prisma from '../../../../libs/prisma';

// GET SINGLE ADMIN
export async function GET(req, { params }) {
  const { id } = await params; // ✅ must await

  try {
    const admin = await prisma.admin.findUnique({
      where: { id },
    });

    if (!admin) {
      return new Response(
        JSON.stringify({ message: 'Admin not found' }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(admin), { status: 200 });
  } catch (error) {
    console.error('Error fetching admin:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

// UPDATE ADMIN
export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json();

  try {
    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: body,
    });

    return new Response(JSON.stringify(updatedAdmin), { status: 200 });
  } catch (error) {
    console.error('Error updating admin:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

// DELETE ADMIN
export async function DELETE(req, { params }) {
  const { id } = await params;

  try {
    await prisma.admin.delete({
      where: { id },
    });

    return new Response(
      JSON.stringify({ message: 'Admin deleted successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting admin:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
