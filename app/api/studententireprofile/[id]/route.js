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

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const profile = await prisma.studentEntireProfile.findUnique({
      where: { userId: id },
      include: {
        address: true,
        education: true,
        experience: true,
        achievements: true,
        certifications: true,
      },
    });
    return NextResponse.json(profile || null);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const formData = await req.formData();

    // Extract fields
    const name = formData.get("name");
    const email = formData.get("email");
    const summary = formData.get("summary") || null;
    const resumeFile = formData.get("resume");
    
    // Extract new fields
    const educationLevel = formData.get("educationLevel") || null;
    const experienceRange = formData.get("experienceRange") || null;
    const studentStatus = formData.get("studentStatus") || null;
    const jobType = formData.get("jobType") || null;

    const skills = formData.get("skills") ? JSON.parse(formData.get("skills")) : [];
    const addressData = formData.get("address") ? JSON.parse(formData.get("address")) : null;
    const educationData = formData.get("education") ? JSON.parse(formData.get("education")) : [];
    const experienceData = formData.get("experience") ? JSON.parse(formData.get("experience")) : [];
    const achievementsData = formData.get("achievements") ? JSON.parse(formData.get("achievements")) : [];
    const certificationsData = formData.get("certifications") ? JSON.parse(formData.get("certifications")) : [];

    // Save resume file
    const resumePath = resumeFile ? await saveResumeFile(resumeFile) : null;

    // Handle address
    let addressId = null;
    if (addressData) {
      const { id: _, ...cleanAddressData } = addressData;
      const existingProfile = await prisma.studentEntireProfile.findUnique({
        where: { userId: id },
        include: { address: true }
      });

      if (existingProfile?.address) {
        const updatedAddress = await prisma.address.update({
          where: { id: existingProfile.address.id },
          data: cleanAddressData,
        });
        addressId = updatedAddress.id;
      } else {
        const newAddress = await prisma.address.create({ data: cleanAddressData });
        addressId = newAddress.id;
      }
    }

    // Update main profile
    const updateData = {
      name,
      email,
      summary,
      skills,
      educationLevel,
      experienceRange,
      studentStatus,
      jobType,
      ...(resumePath && { resumePath }),
      ...(addressId && { addressId }),
    };

    const updatedProfile = await prisma.studentEntireProfile.update({
      where: { userId: id },
      data: updateData,
    });

    // Handle relations
    await Promise.all([
      prisma.education.deleteMany({ where: { studentProfileId: updatedProfile.id } }),
      prisma.experience.deleteMany({ where: { profileId: updatedProfile.id } }),
      prisma.achievement.deleteMany({ where: { studentProfileId: updatedProfile.id } }),
      prisma.certification.deleteMany({ where: { studentProfileId: updatedProfile.id } }),
    ]);

    await Promise.all([
      educationData.length > 0 && prisma.education.createMany({
        data: educationData.map(edu => ({
          ...edu,
          graduationYear: edu.graduationYear ? parseInt(edu.graduationYear) : null,
          studentProfileId: updatedProfile.id,
        })),
      }),

      experienceData.length > 0 && prisma.experience.createMany({
        data: experienceData.map(exp => ({
          ...exp,
          startDate: exp.startDate ? new Date(exp.startDate) : null,
          endDate: exp.endDate && !exp.isCurrent ? new Date(exp.endDate) : null,
          profileId: updatedProfile.id,
        })),
      }),

      achievementsData.length > 0 && prisma.achievement.createMany({
        data: achievementsData.map(achievement => ({
          name: achievement.name || achievement,
          studentProfileId: updatedProfile.id,
        })),
      }),

      certificationsData.length > 0 && prisma.certification.createMany({
        data: certificationsData.map(certification => ({
          name: certification.name || certification,
          issuingBody: certification.issuingBody || null,
          studentProfileId: updatedProfile.id,
        })),
      }),
    ]);

    // Return complete updated profile
    const completeProfile = await prisma.studentEntireProfile.findUnique({
      where: { userId: id },
      include: {
        address: true,
        education: true,
        experience: true,
        achievements: true,
        certifications: true,
      },
    });

    return NextResponse.json(completeProfile);
  } catch (err) {
    console.error("PUT Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const profile = await prisma.studentEntireProfile.findUnique({
      where: { userId: id },
      select: { id: true }
    });
    
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    
    await Promise.all([
      prisma.address.deleteMany({ where: { studentProfile: { userId: id } } }),
      prisma.education.deleteMany({ where: { studentProfileId: profile.id } }),
      prisma.experience.deleteMany({ where: { profileId: profile.id } }),
      prisma.achievement.deleteMany({ where: { studentProfileId: profile.id } }),
      prisma.certification.deleteMany({ where: { studentProfileId: profile.id } }),
    ]);
    
    await prisma.studentEntireProfile.delete({ where: { userId: id } });
    
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}