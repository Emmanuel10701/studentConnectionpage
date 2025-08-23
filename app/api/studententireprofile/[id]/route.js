import prisma from "../../../../libs/prisma";
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

// Helper: Save resume file
async function saveResumeFile(file) {
  if (!file) return null;
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), "public/resumes");
  const fileName = `${Date.now()}-${file?.name || "resume.pdf"}`;
  const filePath = path.join(uploadDir, fileName);

  try {
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, buffer);
    return `/resumes/${fileName}`;
  } catch (err) {
    console.error("Error saving resume file:", err);
    return null;
  }
}

// ---------------- GET: Single Student Profile ----------------
// The 'id' from the URL params is treated as the 'userId'
export async function GET(req, { params }) {
  try {
    const { id: userId } = await params;

    const profile = await prisma.studentEntireProfile.findUnique({
      where: { userId }, // Find the profile by the userId field
      include: {
        address: true,
        education: true,
        experience: true,
        achievements: true,
        certifications: true,
      },
    });

    return NextResponse.json(profile || null, { status: 200 });
  } catch (err) {
    console.error("GET_SINGLE Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ---------------- DELETE: Remove Student Profile ----------------
// The 'id' from the URL params is treated as the 'userId'
export async function DELETE(req, { params }) {
  try {
    const { id: userId } = await params;

    // First, find the student profile to get the correct 'id' for nested deletes
    const studentProfile = await prisma.studentEntireProfile.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!studentProfile) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 });
    }

    // Use the studentProfile.id to delete the nested relations
    // Since MongoDB doesn't support 'onDelete: Cascade', we must delete related records manually.
    await prisma.address.delete({ where: { studentProfile: { userId } } });
    await prisma.education.deleteMany({ where: { studentProfileId: studentProfile.id } });
    await prisma.experience.deleteMany({ where: { studentProfileId: studentProfile.id } });
    
    // Finally, delete the main student profile
    await prisma.studentEntireProfile.delete({ where: { userId } });

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("DELETE Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}