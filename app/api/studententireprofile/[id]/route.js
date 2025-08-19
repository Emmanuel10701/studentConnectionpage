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

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(filePath, buffer);

  return `/resumes/${fileName}`;
}

// ---------------- GET: Single Student Profile ----------------
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const profile = await prisma.studentEntireProfile.findUnique({
      where: { id },
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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ---------------- PUT: Update Student Profile ----------------
export async function PUT(req, context) {
  try {
    const { id } = await context.params; // ✅ await params
    const formData = await req.formData();

    const resumeFile = formData.get("resume");
    const resumePath = resumeFile ? await saveResumeFile(resumeFile) : undefined;

    const name = formData.get("name");
    const bio = formData.get("bio") || null;
    const summary = formData.get("summary") || null;
    const skills = formData.get("skills") ? JSON.parse(formData.get("skills")) : undefined;

    const updatedProfile = await prisma.studentEntireProfile.update({
      where: { id },
      data: {
        name,
        bio,
        summary,
        resumePath,
        skills, // <-- update skills
        address: formData.get("address")
          ? { deleteMany: {}, create: JSON.parse(formData.get("address")) }
          : undefined,
        education: formData.get("education")
          ? { deleteMany: {}, create: JSON.parse(formData.get("education")) }
          : undefined,
        experience: formData.get("experience")
          ? {
              deleteMany: {},
              create: JSON.parse(formData.get("experience")).map((exp) => ({
                ...exp,
                startDate: new Date(exp.startDate),
                endDate: new Date(exp.endDate),
              })),
            }
          : undefined,
        achievements: formData.get("achievements")
          ? { deleteMany: {}, create: JSON.parse(formData.get("achievements")) }
          : undefined,
        certifications: formData.get("certifications")
          ? { deleteMany: {}, create: JSON.parse(formData.get("certifications")) }
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
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    // Delete nested relations first
    await prisma.address.deleteMany({ where: { studentProfileId: id } });
    await prisma.education.deleteMany({ where: { studentProfileId: id } });
    await prisma.experience.deleteMany({ where: { studentProfileId: id } });
    await prisma.achievement.deleteMany({ where: { studentProfileId: id } });
    await prisma.certification.deleteMany({ where: { studentProfileId: id } });

    // Delete the main profile
    await prisma.studentEntireProfile.delete({ where: { id } });

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("DELETE Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
