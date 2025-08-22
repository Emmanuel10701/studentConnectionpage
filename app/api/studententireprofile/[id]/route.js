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
    // The id from the URL is the userId from the session
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

// ---------------- PUT: Update Student Profile ----------------
// The 'id' from the URL params is treated as the 'userId'
export async function PUT(req, { params }) {
  try {
    const { id: userId } = await params;
    const formData = await req.formData();

    const resumeFile = formData.get("resume");
    const resumePath = resumeFile ? await saveResumeFile(resumeFile) : undefined;

    const name = formData.get("name");
    const bio = formData.get("bio") || null;
    const summary = formData.get("summary") || null;
    const skills = formData.get("skills") ? JSON.parse(formData.get("skills")) : undefined;

    // Retrieve the student's profileId to use for nested updates
    const studentProfile = await prisma.studentEntireProfile.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!studentProfile) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 });
    }

    const updatedProfile = await prisma.studentEntireProfile.update({
      where: { userId }, // Update the profile using the userId
      data: {
        name,
        bio,
        summary,
        resumePath, // <-- Added back the resume path
        skills,
        // Since achievements and certifications are now string arrays,
        // we can update them directly without 'deleteMany' and 'create'.
        achievements: formData.get("achievements") ? JSON.parse(formData.get("achievements")) : undefined,
        certifications: formData.get("certifications") ? JSON.parse(formData.get("certifications")) : undefined,

        // Handle one-to-one Address relation
        address: formData.get("address")
          ? { upsert: { create: JSON.parse(formData.get("address")), update: JSON.parse(formData.get("address")) } }
          : undefined,

        // Handle one-to-many relationships
        education: formData.get("education")
          ? { deleteMany: { studentProfileId: studentProfile.id }, create: JSON.parse(formData.get("education")) }
          : undefined,
        experience: formData.get("experience")
          ? {
              deleteMany: { studentProfileId: studentProfile.id },
              create: JSON.parse(formData.get("experience")).map((exp) => ({
                ...exp,
                startDate: new Date(exp.startDate),
                // Handle optional endDate for current experience
                endDate: exp.isCurrent ? null : new Date(exp.endDate),
              })),
            }
          : undefined,
      },
      include: {
        address: true,
        education: true,
        experience: true,
        achievements: true,
        certifications: true,
      },
    });

    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (err) {
    console.error("PUT Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
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
    
    // Achievements and Certifications are now stored as string arrays on the main model,
    // so no need to delete them separately.

    // Finally, delete the main student profile
    await prisma.studentEntireProfile.delete({ where: { userId } });

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("DELETE Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
