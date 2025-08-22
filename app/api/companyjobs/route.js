import prisma from "@/libs/prisma";

export async function GET(
  req,
  { params } // Destructure the `params` object from the request context
) {
  try {
    // The `companyId` is now directly available from the URL path
    const { companyId } = params;

    // Use a 'where' clause to filter the results by the companyId.
    const jobs = await prisma.job.findMany({
      where: {
        companyId: companyId,
      },
      include: {
        company: true, // Also fetch the related company details
      },
    });

    // If no jobs are found, you can return an empty array or a 404.
    if (!jobs || jobs.length === 0) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    return new Response(JSON.stringify(jobs), { status: 200 });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch jobs" }),
      { status: 500 }
    );
  }
}
