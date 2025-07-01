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

    const activityTag = await prisma.activityTag.create({
      data: {
        activityId,
        tagId,
      },
      include: {
        tag: true,
      },
    });

    return NextResponse.json(activityTag, { status: 201 });
  } catch (error) {
    console.error("Error adding tag to activity:", error);
    if (error instanceof Error && "code" in error && error.code === "P2002") {
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

    await prisma.activityTag.delete({
      where: {
        activityId_tagId: {
          activityId,
          tagId,
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

    const activityTags = await prisma.activityTag.findMany({
      where: {
        activityId,
      },
      include: {
        tag: true,
      },
    });

    return NextResponse.json(activityTags);
  } catch (error) {
    console.error("Error fetching activity tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity tags" },
      { status: 500 }
    );
  }
}
