import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/tags/[id]/activities - Get all activities with a specific tag
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tagId = parseInt(params.id);

    if (isNaN(tagId)) {
      return NextResponse.json({ error: "Invalid tag ID" }, { status: 400 });
    }

    const activityTags = await (prisma as any).activityTag.findMany({
      where: { tagId },
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
          },
        },
      },
    });

    // Get activities with their contacts
    const activitiesWithContacts = await Promise.all(
      activityTags.map(async (at: any) => {
        const activityContacts = await (prisma as any).activityContact.findMany(
          {
            where: { activityId: at.activity.id },
            include: {
              contact: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  position: true,
                },
              },
            },
          }
        );

        return {
          ...at.activity,
          contacts: activityContacts.map((ac: any) => ac.contact),
        };
      })
    );

    return NextResponse.json(activitiesWithContacts);
  } catch (error) {
    console.error("Error fetching activities for tag:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
