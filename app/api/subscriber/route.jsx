import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import nodemailer from "nodemailer";

// Configure transporter (using Gmail for example)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your gmail
    pass: process.env.EMAIL_PASS  // app password (not your main password!)
  },
});

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already subscribed" }, { status: 400 });
    }

    // Save subscriber
    await prisma.subscriber.create({ data: { email } });

    // HTML template
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Subscription Successful</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f9f9f9; text-align: center; padding: 40px; }
          .card { background: #fff; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 500px; margin: auto; }
          h1 { color: #2563eb; }
          p { font-size: 16px; }
          .footer { margin-top: 20px; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🎉 Congratulations!</h1>
          <p>Dear <strong>${email}</strong>,</p>
          <p>You have successfully subscribed to our newsletter updates. 🚀</p>
          <p>Stay tuned for the latest news and updates directly in your inbox!</p>
          <div class="footer">© 2025 Your Company. All rights reserved.</div>
        </div>
      </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      from: `"Your Company" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Subscription Successful",
      html: htmlContent,
    });

    // API Response
    return NextResponse.json({ message: "Subscription successful, email sent!" });

  } catch (error) {
    console.error("Error in subscription API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function GET() {
  try {
    const subscribers = await prisma.subscriber.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    return new NextResponse(JSON.stringify(subscribers), { status: 200 });
  } catch (error) {
    console.error("Failed to retrieve subscribers:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
