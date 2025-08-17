import prisma from "../../../libs/prisma";
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

// Helper function to save the file (optional)
async function saveResumeFile(file) {
  if (!file) return null;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public/resumes");
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, buffer);

    return `/resumes/${fileName}`;
  } catch (error) {
    console.error("File upload error:", error);
    throw new Error("File upload failed.");
  }
}

// ----------- POST: Create Student Profile -----------
export async function POST(req) {
  try {
    const formData = await req.formData();

    // Extract fields and file
    const userId = formData.get("userId");
    const name = formData.get("name");
    const bio = formData.get("bio");
    const summary = formData.get("summary");
    const resumeFile = formData.get("resume"); // Optional
    const address = formData.get("address");
    const education = formData.get("education");
    const experience = formData.get("experience");
    const achievements = formData.get("achievements");
    const certifications = formData.get("certifications");

    // Save resume only if provided
    const resumePath = resumeFile ? await saveResumeFile(resumeFile) : null;

    // Create profile in DB
    const profile = await prisma.studentEntireProfile.create({
      data: {
        userId,
        name,
        bio,
        summary,
        resumePath,
        address: address ? { create: JSON.parse(address) } : undefined,
        education: education ? { create: JSON.parse(education) } : undefined,
        experience: experience
          ? { create: JSON.parse(experience).map(exp => ({
              ...exp,
              startDate: new Date(exp.startDate),
              endDate: new Date(exp.endDate),
            })) }
          : undefined,
        achievements: achievements ? { create: JSON.parse(achievements) } : undefined,
        certifications: certifications ? { create: JSON.parse(certifications) } : undefined,
      },
      include: {
        address: true,
        education: true,
        experience: true,
        achievements: true,
        certifications: true,
      },
    });

    return NextResponse.json({ profile }, { status: 201 });
  } catch (err) {
    console.error("POST Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
}

// ----------- GET: Fetch All Student Profiles -----------
export async function GET() {
  try {
    const profiles = await prisma.studentEntireProfile.findMany({
      include: {
        address: true,
        education: true,
        experience: true,
        achievements: true,
        certifications: true,
      },
    });
    return NextResponse.json(profiles, { status: 200 });
  } catch (err) {
    console.error("GET Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
}
