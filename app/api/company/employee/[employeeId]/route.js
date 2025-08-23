// File: /api/company/[employeeId]/route.js
import prisma from '../../../../../libs/prisma';

// =============================
// GET: Get Company by Employee ID
// =============================
export async function GET(request, { params }) {
  try {
    const { employeeId } = await params;

    if (!employeeId) {
      return new Response(
        JSON.stringify({ success: false, message: 'Employee ID is required' }),
        { status: 400 }
      );
    }

    // Find the company that belongs to this employee
    const company = await prisma.company.findFirst({
      where: {
        userId: employeeId
      },
      include: {
        user: true // Include the user/employee details if needed
      }
    });

    if (!company) {
      return new Response(
        JSON.stringify({ success: false, message: 'Company not found for this employee' }),
        { status: 404 }
      );
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