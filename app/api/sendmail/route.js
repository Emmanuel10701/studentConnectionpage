// app/api/bulk-email/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    // Destructure the required data from the request body
    const { subject, htmlContent, recipients } = await request.json();

    // 1. Validate required input from the request body
    if (!subject || !htmlContent || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: 'Subject, htmlContent, and a valid recipients array are required.' }, { status: 400 });
    }

    // 2. Validate environment variables
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      console.error('Environment variables EMAIL_USER and EMAIL_PASS are not set.');
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    // 3. Simulate fetching email lists from a database based on the recipient groups.
    // In a real application, you would replace this with actual database queries.
    const mockEmailLists = {
      subscribers: ['subscriber1@example.com', 'subscriber2@example.com'],
      admins: ['admin1@example.com'],
      employers: ['employer1@example.com', 'employer2@example.com'],
      jobseekers: ['jobseeker1@example.com', 'jobseeker2@example.com'],
    };

    let targetEmails = [];

    // 'all' is a special recipient to send to all known users.
    if (recipients.includes('all')) {
      targetEmails = [...mockEmailLists.subscribers, ...mockEmailLists.admins, ...mockEmailLists.employers, ...mockEmailLists.jobseekers];
    } else {
      // Iterate through the selected recipients and collect their email addresses
      for (const group of recipients) {
        if (mockEmailLists[group]) {
          targetEmails = [...targetEmails, ...mockEmailLists[group]];
        }
      }
    }

    // Ensure there are emails to send to
    if (targetEmails.length === 0) {
      return NextResponse.json({ error: 'No valid recipients selected.' }, { status: 400 });
    }

    // 4. Create a transporter object
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // 5. Email options for the bulk email
    const mailOptions = {
      from: emailUser,
      to: targetEmails.join(', '), // Nodemailer can accept a comma-separated string for multiple recipients
      subject: subject,
      html: `
        <div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f0f4f8; padding: 40px 20px; text-align: center;">
          <div style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); max-width: 600px; margin: auto; overflow: hidden;">
            <div style="background-color: #4a90e2; color: #ffffff; padding: 30px 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Prescripto Newsletter</h1>
              <p style="margin: 5px 0 0; font-size: 16px; opacity: 0.9;">Your latest updates from the Prescripto team</p>
            </div>
            <div style="padding: 30px;">
              <div style="text-align: left; font-size: 16px; color: #555;">
                ${htmlContent}
              </div>
            </div>
            <div style="background-color: #f7f9fc; padding: 20px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #999;">This email was sent by a Prescripto administrator.</p>
            </div>
          </div>
        </div>
      `,
    };

    // 6. Send the email to all collected recipients
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Bulk email sent successfully.' }, { status: 200 });

  } catch (error) {
    console.error('Error sending bulk email:', error);
    return NextResponse.json({ error: 'Internal server error. Please try again later.' }, { status: 500 });
  }
}
