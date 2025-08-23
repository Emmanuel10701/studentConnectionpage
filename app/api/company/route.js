// File: /api/company/route.js
import prisma from '../../../libs/prisma';

// =============================
// POST: Create Company (with employeeId relation)
// =============================
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name, industry, description, foundedDate, companySize,
      logoUrl, email, phone, website, street, city, county,
      country, postalCode, businessRegistrationNumber, kraPin,
      businessPermitNumber, licenseExpiryDate, vatNumber, legalName,
      linkedin, twitter, facebook, instagram, employeeId
    } = body;

    if (!name || !email || !employeeId) {
      return new Response(
        JSON.stringify({ success: false, message: 'Company name, email, and employeeId are required' }),
        { status: 400 }
      );
    }

    // ✅ Ensure employee exists in Users table with role EMPLOYER
    const employee = await prisma.user.findUnique({
      where: { id: employeeId },
    });

    if (!employee || employee.role !== 'EMPLOYER') {
      return new Response(
        JSON.stringify({ success: false, message: 'Employee not found or not an EMPLOYER' }),
        { status: 404 }
      );
    }

    // ✅ Create company linked to this employee
    const newCompany = await prisma.company.create({
      data: {
        name,
        industry,
        description,
        foundedDate: foundedDate ? new Date(foundedDate) : null,
        companySize,
        logoUrl,
        email,
        phone,
        website,
        street,
        city,
        county,
        country,
        postalCode,
        businessRegistrationNumber,
        kraPin,
        businessPermitNumber,
        licenseExpiryDate: licenseExpiryDate ? new Date(licenseExpiryDate) : null,
        vatNumber,
        legalName,
        linkedin,
        twitter,
        facebook,
        instagram,
        user: { connect: { id: employeeId } } // ✅ link the user
      },
      include: { user: true }
    });

    return new Response(JSON.stringify({ success: true, company: newCompany }), { status: 201 });
  } catch (error) {
    console.error('Failed to create company:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
}


/// =============================
// GET: All Companies (with employer user)
export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      include: {
        user: true,       // 👈 includes employer/owner
        // employees: true // 👈 only if you use employees[] relation
      }
    });

    return new Response(JSON.stringify({ success: true, companies }), { status: 200 });
  } catch (error) {
    console.error('Failed to fetch companies:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
}
