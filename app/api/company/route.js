import prisma from '../../../libs/prisma';

// CREATE Company and require employerId
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name, industry, description, foundedDate, companySize,
      logoUrl, email, phone, website, street, city, county,
      country, postalCode, businessRegistrationNumber, kraPin,
      businessPermitNumber, licenseExpiryDate, vatNumber, legalName,
      linkedin, twitter, facebook, instagram, employerId
    } = body;

    // Validate required fields
    if (!employerId) {
      return new Response(
        JSON.stringify({ success: false, message: 'employerId is required' }),
        { status: 400 }
      );
    }

    // Check if the employer exists
    const employerExists = await prisma.employerProfile.findUnique({
      where: { id: employerId }
    });

    if (!employerExists) {
      return new Response(
        JSON.stringify({ success: false, message: 'Employer not found with this ID' }),
        { status: 400 }
      );
    }

    // Create company and link to employer
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
        employers: {
          connect: { id: employerId } // safe connect
        }
      },
      include: { employers: true } // include linked employer(s)
    });

    return new Response(JSON.stringify({ success: true, company: newCompany }), { status: 201 });
  } catch (error) {
    console.error('Failed to create company:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal Server Error', error }),
      { status: 500 }
    );
  }
}

// GET all companies
export async function GET() {
  try {
    const companies = await prisma.company.findMany({ include: { employers: true } });
    return new Response(JSON.stringify({ success: true, companies }), { status: 200 });
  } catch (error) {
    console.error('Failed to fetch companies:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal Server Error', error }),
      { status: 500 }
    );
  }
}
