import prisma from "@/libs/prisma";

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      include: { company: true }, // fetch company details if needed
    });

    return new Response(JSON.stringify(jobs), { status: 200 });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch jobs" }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      location,
      officeType,
      salaryRange,
      type,
      qualifications,
      skills,
      benefits,
      companyId,
    } = body;

    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        location: location || null,
        officeType: officeType || null,
        salaryRange: salaryRange || null, // ✅ safe if missing
        type: type || null,
        qualifications: qualifications || null,
        skills: skills || null,
        benefits: benefits || null,
        companyId: companyId || null,
      },
    });

    return new Response(JSON.stringify(newJob), { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create job" }),
      { status: 500 }
    );
  }
}
