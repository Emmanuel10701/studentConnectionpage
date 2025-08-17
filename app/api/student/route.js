import prisma from '../../../libs/prisma';
import bcrypt from "bcryptjs";
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, institution, course, yearOfStudy, constituency, ward } = body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email already exists" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STUDENT",
        studentProfile: {
          create: {
            institution,
            course,
            yearOfStudy,
            constituency,
            ward
          }
        }
      }
    });

    return new Response(JSON.stringify(student), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}


export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        studentProfile: true, // include student profile details
      }
    });

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}