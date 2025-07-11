import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const applicationId = params.id;
    if (!applicationId || typeof applicationId !== "string") {
      return NextResponse.json(
        { error: "Invalid application ID" },
        { status: 400 }
      );
    }

    // Get all activities for this job application
    const activities = await prisma.activity.findMany({
      where: { jobApplicationId: applicationId },
      include: {
        company: {
          select: { id: true, name: true },
        },
        jobApplication: {
          select: { id: true, position: true },
        },
        contacts: {
          select: { id: true, firstName: true, lastName: true },
        },
        tags: true,
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching application activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch application activities" },
      { status: 500 }
    );
  }
}
