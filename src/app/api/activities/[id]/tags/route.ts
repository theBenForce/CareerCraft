import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/activities/[id]/tags - Add a tag to an activity
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const activityId = params.id;
    const body = await request.json();
    const { tagId } = body;

    if (!tagId) {
      return NextResponse.json(
        { error: "Tag ID is required" },
        { status: 400 }
      );
    }

    // Add tag to activity using implicit many-to-many
    const updatedActivity = await prisma.activity.update({
      where: { id: activityId },
      data: {
        tags: {
          connect: { id: tagId },
        },
      },
      include: {
        tags: true,
      },
    });

    // Return the newly added tag (find it in the updated tags array)
    const addedTag = updatedActivity.tags.find((tag) => tag.id === tagId);
    return NextResponse.json(addedTag, { status: 201 });
  } catch (error) {
    console.error("Error adding tag to activity:", error);
    // Prisma unique constraint error (already assigned)
    if (
      error instanceof Error &&
      "code" in error &&
      (error as any).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "This tag is already assigned to this activity" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to add tag to activity" },
      { status: 500 }
    );
  }
}

// DELETE /api/activities/[id]/tags - Remove a tag from an activity
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const activityId = params.id;
    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get("tagId");

    if (!tagId) {
      return NextResponse.json(
        { error: "Tag ID is required" },
        { status: 400 }
      );
    }

    // Remove tag from activity using implicit many-to-many
    await prisma.activity.update({
      where: { id: activityId },
      data: {
        tags: {
          disconnect: { id: tagId },
        },
      },
    });

    return NextResponse.json({ message: "Tag removed from activity" });
  } catch (error) {
    console.error("Error removing tag from activity:", error);
    return NextResponse.json(
      { error: "Failed to remove tag from activity" },
      { status: 500 }
    );
  }
}

// GET /api/activities/[id]/tags - Get all tags for an activity
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const activityId = params.id;

    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: { tags: true },
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(activity.tags);
  } catch (error) {
    console.error("Error fetching activity tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity tags" },
      { status: 500 }
    );
  }
}
