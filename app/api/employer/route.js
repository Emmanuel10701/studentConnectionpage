// File: /api/employer/route.js
import prisma from '../../../libs/prisma';
import bcrypt from "bcryptjs";

// ======================
// POST: Register Employer
// ======================
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      companyName,
      companySize,
      industry,
      phone,
      website,
      position,
    } = body;

    // Check if email is already registered
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email already registered" }), { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user + employer profile
    const employer = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "EMPLOYER",
        employerProfile: {
          create: {
            companyName,
            companySize,
            industry,
            phone,
            website,
            position,
          },
        },
      },
      include: {
        employerProfile: true,
      },
    });

    return new Response(JSON.stringify(employer), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// ======================
// GET: All Employers
// ======================
export async function GET() {
  try {
    const employers = await prisma.user.findMany({
      where: { role: "EMPLOYER" },
      include: {
        employerProfile: true,
      },
    });

    return new Response(JSON.stringify(employers), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
