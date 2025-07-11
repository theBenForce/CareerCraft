import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/tags/[id]/activities - Get all activities with a specific tag
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tagId = params.id;

    if (!tagId || typeof tagId !== "string") {
      return NextResponse.json({ error: "Invalid tag ID" }, { status: 400 });
    }

    // Query activities with this tag using implicit many-to-many
    const activities = await prisma.activity.findMany({
      where: { tags: { some: { id: tagId } } },
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
        tags: true,
        contacts: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching activities for tag:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
