import prisma from '../../../libs/prisma';
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, institution, course, yearOfStudy, constituency, ward } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email already exists" }), { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ No parseInt, keep yearOfStudy as STRING
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
            yearOfStudy, // now string
            constituency,
            ward
          }
        }
      },
      include: { studentProfile: true }
    });

    // ✅ Send email via Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Registration Successful 🎉",
      html: `
        <h2>Welcome, ${name}!</h2>
        <p>You have successfully registered as a <b>Job Seeker</b>.</p>
        <p>Institution: ${institution}</p>
        <p>Course: ${course}</p>
        <p>Year of Study: ${yearOfStudy}</p>
        <p>Constituency: ${constituency}, Ward: ${ward}</p>
        <br />
        <p style="color: green; font-weight: bold;">Thank you for joining us!</p>
      `,
    });

    return new Response(JSON.stringify({ message: "Student registered and email sent successfully", student }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}


// File: /api/student/route.js

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { role: "STUDENT" },
      include: {
        studentProfile: true,
      }
    });

    // Optional: convert yearOfStudy to string just in case some old data is number
    const sanitizedUsers = users.map(user => {
      if (user.studentProfile) {
        user.studentProfile.yearOfStudy = user.studentProfile.yearOfStudy?.toString() || null;
      }
      return user;
    });

    return new Response(JSON.stringify(sanitizedUsers), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch students:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
