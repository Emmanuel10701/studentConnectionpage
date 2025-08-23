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

    // Extract simple fields, including the new 'email' field
    const userId = formData.get("userId");
    const name = formData.get("name");
    const email = formData.get("email"); // ⬅️ ADDED
    const bio = formData.get("bio") || null;
    const summary = formData.get("summary") || null;
    const resumeFile = formData.get("resume");

    // Parse complex fields as JSON
    const skills = formData.get("skills") ? JSON.parse(formData.get("skills")) : [];
    const addressData = formData.get("address") ? JSON.parse(formData.get("address")) : null;
    const educationData = formData.get("education") ? JSON.parse(formData.get("education")) : [];
    const experienceData = formData.get("experience") ? JSON.parse(formData.get("experience")) : [];
    const achievementsData = formData.get("achievements") ? JSON.parse(formData.get("achievements")) : [];
    const certificationsData = formData.get("certifications") ? JSON.parse(formData.get("certifications")) : [];

    // Save resume file and get path
    const resumePath = resumeFile ? await saveResumeFile(resumeFile) : null;

    // --- NEW: Handle Address creation separately ---
    let addressId = null;
    if (addressData) {
      const newAddress = await prisma.address.create({
        data: addressData,
      });
      addressId = newAddress.id;
    }

    // Build the data object for Prisma create
    const profileData = {
      userId,
      name,
      email, // ⬅️ ADDED
      bio,
      summary,
      skills,
      resumePath,
      addressId, // Now we link the profile using the ID
      
      // Use 'createMany' for the one-to-many 'education' relation
      education: {
        createMany: {
          data: educationData,
        },
      },
      
      // Use 'createMany' for the one-to-many 'experience' relation
      experience: {
        createMany: {
          data: experienceData.map(exp => ({
            ...exp,
            startDate: new Date(exp.startDate),
            endDate: exp.isCurrent ? null : new Date(exp.endDate),
          })),
        },
      },
      
      // Use 'createMany' for the one-to-many 'achievements' relation
      achievements: {
        createMany: {
          data: achievementsData.map(achievement => ({
            name: achievement,
          })),
        },
      },
      
      // Use 'createMany' for the one-to-many 'certifications' relation
      certifications: {
        createMany: {
          data: certificationsData.map(certification => ({
            name: certification,
          })),
        },
      },
    };

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