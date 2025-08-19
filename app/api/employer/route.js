// File: /api/employer/route.js
import prisma from '../../../libs/prisma';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

// ======================
// Helper: Email Transporter
// ======================
const transporter = nodemailer.createTransport({
  service: 'gmail', // you can use Outlook, SMTP, etc.
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your app password
  },
});

// ======================
// POST: Register Employer
// ======================
export async function POST(req) {
  try {
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
    } = await req.json();

    // Check if email exists
    if (await prisma.user.findUnique({ where: { email } })) {
      return new Response(
        JSON.stringify({ error: 'Email already registered' }),
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with employer profile
    const employer = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'EMPLOYER',
        employerProfile: {
          create: { companyName, companySize, industry, phone, website, position },
        },
      },
      include: { employerProfile: true },
    });

    // -------------------
    // Send Welcome Email
    // -------------------
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; padding:20px;">
        <h2 style="color:#2c3e50;">🎉 Congratulations ${name}!</h2>
        <p>Welcome to <strong>JobConnect</strong> 🎯</p>
        <p>Your employer account has been successfully created with the following details:</p>
        <ul>
          <li><b>Company:</b> ${companyName}</li>
          <li><b>Industry:</b> ${industry}</li>
          <li><b>Website:</b> <a href="${website}" target="_blank">${website}</a></li>
          <li><b>Contact:</b> ${phone}</li>
        </ul>
        <p>We’re excited to have you on board and look forward to helping you find the best talent 🚀.</p>
        <p style="margin-top:20px;">Best regards,<br/>The JobConnect Team</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"JobConnect" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎉 Welcome to JobConnect!',
      html: htmlTemplate,
    });

    return new Response(JSON.stringify({ success: true, employer }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

// ======================
// GET: All Employers
// ======================
export async function GET() {
  try {
    const employers = await prisma.user.findMany({
      where: { role: 'EMPLOYER' },
      include: { employerProfile: { include: { company: true } } }, // safe include
    });

    return new Response(JSON.stringify({ success: true, employers }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
