// pages/api/companies/create.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

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
  } = req.body;

  try {
    const newCompany = await prisma.company.create({
      data: {
        name,
        industry,
        description,
        foundedDate: new Date(foundedDate),
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
        licenseExpiryDate: new Date(licenseExpiryDate),
        vatNumber,
        legalName,
        linkedin,
        twitter,
        facebook,
        instagram,
      },
    });

    return res.status(201).json(newCompany);
  } catch (error) {
    console.error('Failed to create company:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}