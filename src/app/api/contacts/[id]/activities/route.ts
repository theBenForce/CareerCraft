import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contactId = parseInt(params.id);

    if (isNaN(contactId)) {
      return NextResponse.json(
        { error: "Invalid contact ID" },
        { status: 400 }
      );
    }

    // Get all activities for this contact
    const activityContacts = await (prisma as any).activityContact.findMany({
      where: { contactId },
      include: {
        activity: {
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
            activityTags: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
      orderBy: {
        activity: {
          date: "desc",
        },
      },
    });

    // Transform the response to return activities with metadata
    const activities = activityContacts.map((ac: any) => ac.activity);

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching contact activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact activities" },
      { status: 500 }
    );
  }
}
