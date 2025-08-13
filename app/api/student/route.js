// app/api/student/register/route.js

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  const {
    name,
    email,
    password,
    institution,
    course,
    yearOfStudy,
  } = await req.json();

  // --- ADDED INPUT VALIDATION ---
  if (!name || !email || !password || !institution || !course || !yearOfStudy) {
    return new Response(JSON.stringify({ error: "Missing required fields." }), { status: 400 });
  }

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return new Response(JSON.stringify({ error: "Email already registered" }), { status: 409 });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create student user and profile
  try {
    const user = await prisma.user.create({
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
          },
        },
      },
      include: { studentProfile: true },
    });
    return new Response(JSON.stringify({ id: user.id, email: user.email }), { status: 201 });
  } catch (error) {
    console.error("Student registration failed:", error);
    return new Response(JSON.stringify({ error: "An unexpected error occurred." }), { status: 500 });
  }
}