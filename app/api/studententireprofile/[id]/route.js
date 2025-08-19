import prisma from "../../../../libs/prisma";
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

// Helper: Save resume
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
export async function GET(req, context) {
  try {
    const id = context.params.id; // correct usage
    const profile = await prisma.studentEntireProfile.findUnique({
      where: { id }, // keep as string if Prisma schema uses String for ID
      include: {
        address: true,
        education: true,
        experience: true,
        achievements: true,
        certifications: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (err) {
    console.error("GET_SINGLE Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
}

// ---------------- PUT: Update Student Profile ----------------
export async function PUT(req, context) {
  try {
    const id = context.params.id;
    const formData = await req.formData();

    const resumeFile = formData.get("resume");
    const resumePath = resumeFile ? await saveResumeFile(resumeFile) : undefined;

    const updatedProfile = await prisma.studentEntireProfile.update({
      where: { id }, // string id
      data: {
        name: formData.get("name"),
        bio: formData.get("bio"),
        summary: formData.get("summary"),
        resumePath,
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
export async function DELETE(req, context) {
  try {
    const id = context.params.id;

    // Delete all related children first
    await prisma.address.deleteMany({ where: { studentEntireProfileId: id } });
    await prisma.education.deleteMany({ where: { studentEntireProfileId: id } });
    await prisma.experience.deleteMany({ where: { studentEntireProfileId: id } });
    await prisma.achievements.deleteMany({ where: { studentEntireProfileId: id } });
    await prisma.certifications.deleteMany({ where: { studentEntireProfileId: id } });

    // Now delete the parent profile
    await prisma.studentEntireProfile.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Profile deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("DELETE Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
}
