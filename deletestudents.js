import prisma from "./libs/prisma.js";

async function main() {
  try {
    // Delete all profiles first (StudentProfile & StudentEntireProfile)
    const deletedProfiles1 = await prisma.studentProfile.deleteMany({});
    console.log(`Deleted ${deletedProfiles1.count} student profiles.`);

    const deletedProfiles2 = await prisma.studentEntireProfile.deleteMany({});
    console.log(`Deleted ${deletedProfiles2.count} entire student profiles.`);

    // Now delete all student users
    const deletedUsers = await prisma.user.deleteMany({
      where: { role: "STUDENT" },
    });
    console.log(`Deleted ${deletedUsers.count} student users.`);

    console.log("✅ All students deleted successfully.");
  } catch (error) {
    console.error("❌ Error deleting students:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
