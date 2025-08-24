// app/api/jobs/notify-students/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    // The request now contains the full job object and an array of student profile objects
    const { newJob, students } = await request.json();

    if (!newJob || !students || !Array.isArray(students) || students.length === 0) {
      return NextResponse.json({ error: 'Job details and a valid student list are required.' }, { status: 400 });
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    if (!emailUser || !emailPass) {
      console.error('EMAIL_USER and EMAIL_PASS are not set');
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: emailUser, pass: emailPass },
    });

    // A generic message to replace the personalized one from the LLM
    const personalizedMessage = "A great new job has been posted! Based on your profile, this could be a perfect opportunity for you.";

    // An array to hold all the email sending promises for concurrent execution
    const emailPromises = students.map(async (student) => {
      // Step 1: Create the email HTML with both job and dashboard links
      const htmlContent = `
        <div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f0f4f8; padding: 40px 20px; text-align: center;">
          <div style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); max-width: 600px; margin: auto; overflow: hidden;">
            <div style="background-color: #4a90e2; color: #ffffff; padding: 30px 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 600;">New Job Alert!</h1>
              <p style="margin: 5px 0 0; font-size: 16px; opacity: 0.9;">An exciting opportunity from ${newJob.companyName || 'A company'}</p>
            </div>
            <div style="padding: 30px;">
              <div style="text-align: left; font-size: 16px; color: #555;">
                <p>Hello ${student.name},</p>
                <p>${personalizedMessage}</p>
                
                <h3 style="font-size: 18px; color: #333; margin-top: 25px; margin-bottom: 10px;">Job Details:</h3>
                <ul style="list-style-type: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 8px;"><strong style="color: #4a90e2;">Title:</strong> ${newJob.title}</li>
                  <li style="margin-bottom: 8px;"><strong style="color: #4a90e2;">Type:</strong> ${newJob.jobType}</li>
                  <li style="margin-bottom: 8px;"><strong style="color: #4a90e2;">Location:</strong> ${newJob.location}</li>
                  <li style="margin-bottom: 8px;"><strong style="color: #4a90e2;">Salary:</strong> ${newJob.salaryRange || 'Not specified'}</li>
                </ul>

                <p style="margin-top: 30px;">Ready to apply? Click the button below to view the job and submit your application!</p>
                
                <div style="text-align: center; margin-top: 30px;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs/${newJob.id}" style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #ffffff; background-color: #4a90e2; text-decoration: none; border-radius: 8px; font-weight: 600; box-shadow: 0 4px 10px rgba(0, 102, 204, 0.2);">
                    View Job & Apply
                  </a>
                </div>

                <p style="text-align: center; margin-top: 30px; font-size: 14px; color: #777;">
                  If you are not logged in, you can do so here:
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/studentlogin" style="color: #4a90e2; font-weight: 600;">
                    Student Login
                  </a>
                </p>

              </div>
            </div>
            <div style="background-color: #f7f9fc; padding: 20px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #999;">This email was sent by a ktsu for young youth administrator.</p>
            </div>
          </div>
        </div>
      `;
      // Step 2: Send the personalized email
      const mailOptions = {
        from: emailUser,
        to: student.email,
        subject: `New Job Alert: ${newJob.title} at ${newJob.companyName || 'A company'}`,
        html: htmlContent,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Successfully sent job notification to ${student.email}`);
      } catch (mailError) {
        console.error(`Failed to send email to ${student.email}:`, mailError);
      }
    });

    // Wait for all emails to be processed concurrently
    await Promise.all(emailPromises);

    return NextResponse.json({ message: 'Job notifications sent successfully.' }, { status: 200 });

  } catch (error) {
    console.error('Error sending job notifications:', error);
    return NextResponse.json({ error: 'Internal server error. Please try again later.' }, { status: 500 });
  }
}
