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

    // ✅ Convert yearOfStudy to integer
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
            yearOfStudy: parseInt(yearOfStudy), // fix here
            constituency,
            ward
          }
        }
      }
    });

    // ✅ Send email via Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // e.g. your Gmail
        pass: process.env.EMAIL_PASS, // app password
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
