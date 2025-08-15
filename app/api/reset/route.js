// app/api/passwordreset/confirm/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '../../../libs/prisma'; // Import the singleton Prisma Client instance

export async function POST(req) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { message: 'Token and new password are required' },
        { status: 400 }
      );
    }

    // Hash the incoming token to match what's stored
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find the reset request
    const resetRequest = await prisma.passwordReset.findUnique({
      where: { token: hashedToken },
    });

    if (!resetRequest) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Check expiry
    if (resetRequest.expires < new Date()) {
      await prisma.passwordReset.delete({ where: { token: hashedToken } });
      return NextResponse.json({ message: 'Token expired' }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await prisma.user.update({
      where: { id: resetRequest.userId },
      data: { password: hashedPassword },
    });

    // Delete the reset token so it can't be reused
    await prisma.passwordReset.delete({ where: { token: hashedToken } });

    return NextResponse.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
