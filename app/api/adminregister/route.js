import prisma from '../../../libs/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      status,
      department,
      title,
      accessLevel,
      phoneNumber,
      street,
      city,
      postalCode,
      country,
    } = body;

    // Check if email exists in User
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'Email already exists' }), { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    // Create Admin profile linked to user
    const admin = await prisma.admin.create({
      data: {
        name,
        userId: user.id,
        email,
        role: "ADMIN",
        status,
        department,
        title,
        accessLevel,
        phoneNumber,
        street,
        city,
        postalCode,
        country,
      },
    });

    return new Response(JSON.stringify({ user, admin }), { status: 201 });
  } catch (error) {
    console.error('POST Admin Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// ---------------- GET: Fetch All Admins ----------------
export async function GET() {
  try {
    const admins = await prisma.admin.findMany();
    return new Response(JSON.stringify(admins), { status: 200 });
  } catch (error) {
    console.error('GET Admins Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}