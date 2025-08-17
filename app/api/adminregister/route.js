import prisma from "../../../libs/prisma";

// CREATE Company (POST)
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      industry,
      description,
      foundedDate,
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
      licenseExpiryDate,
      vatNumber,
      legalName,
      linkedin,
      twitter,
      facebook,
      instagram,
    } = body;

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
      },
    });

    return new Response(JSON.stringify(newCompany), { status: 201 });
  } catch (error) {
    console.error("Error creating company:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}

// GET ALL Companies
export async function GET() {
  try {
    const companies = await prisma.company.findMany();
    return new Response(JSON.stringify(companies), { status: 200 });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}
