import prisma from '../../../../libs/prisma';

export async function GET(request, { params }) {
  try {
    const { userId } = await params;

    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, message: 'User ID is required' }),
        { status: 400 }
      );
    }

    // First, check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true, image: true }
    });

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: 'User not found' }),
        { status: 404 }
      );
    }

    // Fetch the complete student profile with all related data
    const studentEntireProfile = await prisma.studentEntireProfile.findUnique({
      where: { userId },
      include: {
        address: true,
        education: {
          orderBy: {
            graduationYear: 'desc'
          }
        },
        experience: {
          orderBy: {
            startDate: 'desc'
          }
        },
        achievements: true,
        certifications: true,
        jobs: {
          include: {
            job: {
              include: {
                company: {
                  select: {
                    id: true,
                    name: true,
                    industry: true,
                    logoUrl: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    // If profile not found, return user info only
    if (!studentEntireProfile) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Basic student profile found, but complete profile not created yet',
          user: user,
          hasCompleteProfile: false
        }),
        { status: 200 }
      );
    }

    // Combine user data with student profile data
    const responseData = {
      ...studentEntireProfile,
      user: user // Use the user data we fetched separately
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        student: responseData,
        hasCompleteProfile: true
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to fetch student profile:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Internal Server Error', 
        error: error.message 
      }),
      { status: 500 }
    );
  }
}