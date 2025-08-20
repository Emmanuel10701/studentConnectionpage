import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const formData = await request.formData();

    const subject = formData.get('subject');
    const messageContent = formData.get('messageContent');
    const name = formData.get('name');
    const email = formData.get('email');
    
    const recipientsString = formData.get('recipients');
    let recipients;
    try {
      recipients = JSON.parse(recipientsString);
    } catch (e) {
      console.error('Failed to parse recipients:', recipientsString);
      return NextResponse.json({ error: 'Invalid recipients format.' }, { status: 400 });
    }

    if (!subject || !messageContent || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: 'Subject, message, and a valid recipients array are required.' }, { status: 400 });
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    if (!emailUser || !emailPass) {
      console.error('EMAIL_USER and EMAIL_PASS are not set');
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    // --- FIX: Correctly handle file attachments ---
    const files = formData.getAll('files');
    const mailAttachments = await Promise.all(files.map(async (file) => {
      // Use the File.arrayBuffer() method to get the file content
      const arrayBuffer = await file.arrayBuffer();
      // Then convert the ArrayBuffer to a Buffer
      const buffer = Buffer.from(arrayBuffer);
      return {
        filename: file.name,
        content: buffer,
        contentType: file.type,
      };
    }));
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: emailUser, pass: emailPass },
    });

    const htmlContent = `
      <div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f0f4f8; padding: 40px 20px; text-align: center;">
        <div style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); max-width: 600px; margin: auto; overflow: hidden;">
          <div style="background-color: #4a90e2; color: #ffffff; padding: 30px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 600;">KTSCU Newsletter</h1>
            <p style="margin: 5px 0 0; font-size: 16px; opacity: 0.9;">A message from ${name} at ${email}</p>
          </div>
          <div style="padding: 30px;">
            <div style="text-align: left; font-size: 16px; color: #555;">
              <h2 style="font-size: 22px; color: #333; margin-top: 0;">${subject}</h2>
              <p>${messageContent}</p>
            </div>
          </div>
          <div style="background-color: #f7f9fc; padding: 20px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 12px; color: #999;">This email was sent by a ktsu for young youth administrator.</p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: emailUser,
      to: recipients.join(', '),
      subject,
      html: htmlContent,
      attachments: mailAttachments,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Bulk email sent successfully.' }, { status: 200 });

  } catch (error) {
    console.error('Error sending bulk email:', error);
    return NextResponse.json({ error: 'Internal server error. Please try again later.' }, { status: 500 });
  }
}
