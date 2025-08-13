// This API route handles sending emails to a list of subscribers.

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

/**
 * Handles POST requests to send a newsletter to a list of recipients.
 * The function expects a JSON body with a subject, content, and an array of email recipients.
 */
export async function POST(req) {
  try {
    // Extract subject, content, and recipients from the request body
    const { subject, content, recipients } = await req.json();

    // --- Input Validation: Ensure all necessary fields are present ---
    if (!subject || !content || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "Missing or invalid fields. 'subject', 'content', and a non-empty 'recipients' array are required." }),
        { status: 400 }
      );
    }

    // --- Nodemailer Transporter Setup ---
    // You must configure your email service credentials in your .env file.
    // Example for Gmail:
    // EMAIL_USER="your-email@gmail.com"
    // EMAIL_PASS="your-app-password"
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email service (e.g., 'hotmail', 'yahoo', or a custom SMTP host)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // --- Email Options ---
    // The `to` field is a comma-separated string of all recipient emails.
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipients.join(', '),
      subject: subject,
      html: content, // HTML content allows for rich text emails
    };

    // --- Send the Email ---
    await transporter.sendMail(mailOptions);

    // --- Success Response ---
    return new NextResponse(JSON.stringify({ message: 'Email sent successfully!' }), { status: 200 });
  } catch (error) {
    // --- Error Handling: Log and return a generic 500 error ---
    console.error("Email sending failed:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
