import prisma from "../../../libs/prisma";
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

// Helper function to save the file
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

    // Extract simple fields
    const userId = formData.get("userId");
    const name = formData.get("name");
    const email = formData.get("email");
    const summary = formData.get("summary") || null;
    const resumeFile = formData.get("resume");
    
    // Extract new fields
    const educationLevel = formData.get("educationLevel") || null;
    const experienceRange = formData.get("experienceRange") || null;
    const studentStatus = formData.get("studentStatus") || null;
    const jobType = formData.get("jobType") || null;

    // Parse complex fields as JSON
    const skills = formData.get("skills") ? JSON.parse(formData.get("skills")) : [];
    const addressData = formData.get("address") ? JSON.parse(formData.get("address")) : null;
    const educationData = formData.get("education") ? JSON.parse(formData.get("education")) : [];
    const experienceData = formData.get("experience") ? JSON.parse(formData.get("experience")) : [];
    const achievementsData = formData.get("achievements") ? JSON.parse(formData.get("achievements")) : [];
    const certificationsData = formData.get("certifications") ? JSON.parse(formData.get("certifications")) : [];

    // PARSE NUMERIC FIELDS - FIX FOR PRISMA VALIDATION ERROR
    const parsedEducationData = educationData.map(edu => ({
      ...edu,
      graduationYear: edu.graduationYear ? parseInt(edu.graduationYear) : null,
      isCurrent: Boolean(edu.isCurrent)
    }));

    const parsedExperienceData = experienceData.map(exp => ({
      ...exp,
      startDate: exp.startDate ? new Date(exp.startDate) : null,
      endDate: exp.endDate && !exp.isCurrent ? new Date(exp.endDate) : null,
      isCurrent: Boolean(exp.isCurrent)
    }));

    // Save resume file and get path
    const resumePath = resumeFile ? await saveResumeFile(resumeFile) : null;

    // Handle Address creation separately
    let addressId = null;
    if (addressData) {
      const newAddress = await prisma.address.create({
        data: addressData,
      });
      addressId = newAddress.id;
    }

    // Build the data object for Prisma create - ONLY INCLUDE RELATIONS THAT HAVE DATA
    const profileData = {
      userId,
      name,
      email,
      summary,
      skills,
      resumePath,
      addressId,
      // Add new fields
      educationLevel,
      experienceRange,
      studentStatus,
      jobType
    };

    // Add education relation only if there are education records
    if (parsedEducationData.length > 0) {
      profileData.education = {
        createMany: {
          data: parsedEducationData,
        },
      };
    }

    // Add experience relation only if there are experience records
    if (parsedExperienceData.length > 0) {
      profileData.experience = {
        createMany: {
          data: parsedExperienceData,
        },
      };
    }

    // Add achievements relation only if there are achievements
    if (achievementsData.length > 0) {
      profileData.achievements = {
        createMany: {
          data: achievementsData.map(achievement => ({
            name: achievement.name || achievement, // Handle both object and string
          })),
        },
      };
    }

    // Add certifications relation only if there are certifications
    if (certificationsData.length > 0) {
      profileData.certifications = {
        createMany: {
          data: certificationsData.map(certification => ({
            name: certification.name || certification, // Handle both object and string
            issuingBody: certification.issuingBody || null, // Include issuingBody if available
          })),
        },
      };
    }

    // Create a new profile in the database with all relations
    const profile = await prisma.studentEntireProfile.create({
      data: profileData,
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