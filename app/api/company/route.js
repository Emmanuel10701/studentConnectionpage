// File: /api/company/route.js
import prisma from '../../../libs/prisma';

// =============================
// POST: Create Company (NO userId required)
// =============================
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name, industry, description, foundedDate, companySize,
      logoUrl, email, phone, website, street, city, county,
      country, postalCode, businessRegistrationNumber, kraPin,
      businessPermitNumber, licenseExpiryDate, vatNumber, legalName,
      linkedin, twitter, facebook, instagram
    } = body;

    // ✅ Validate required fields
    if (!name || !email) {
      return new Response(
        JSON.stringify({ success: false, message: 'Company name and email are required' }),
        { status: 400 }
      );
    }

    // ✅ Check if a company already exists with this email
    const existingCompany = await prisma.company.findUnique({
      where: { email }
    });

    if (existingCompany) {
      return new Response(
        JSON.stringify({ success: false, message: 'A company already exists with this email' }),
        { status: 409 }
      );
    }

    // ✅ Create company (no link to userId anymore)
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
        instagram
      },
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

// =============================
// GET: All Companies
// =============================
export async function GET() {
  try {
    const companies = await prisma.company.findMany();

    return new Response(JSON.stringify({ success: true, companies }), { status: 200 });
  } catch (error) {
    console.error('Failed to fetch companies:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
}
