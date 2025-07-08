import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = params.id;

    if (!companyId || typeof companyId !== "string") {
      return NextResponse.json(
        { error: "Invalid company ID" },
        { status: 400 }
      );
    }

    // Get all activities for this company
    const activities = await (prisma as any).activity.findMany({
      where: { companyId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        jobApplication: {
          select: {
            id: true,
            position: true,
          },
        },
        contacts: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        tags: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    // Transform the response to include contact information
    const transformedActivities = activities.map((activity: any) => ({
      ...activity,
    }));

    return NextResponse.json(transformedActivities);
  } catch (error) {
    console.error("Error fetching company activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch company activities" },
      { status: 500 }
    );
  }
}
