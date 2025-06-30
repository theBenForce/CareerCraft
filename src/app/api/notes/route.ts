import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/activities - Get all activities (including notes) for the current user
export async function GET() {
  try {
    // For demo purposes, using userId = 1. In a real app, get from session/JWT
    const userId = 1;
    const activities = await prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        activityTags: { include: { tag: true } },
      },
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, tags } = body;

    // Validate required fields
    if (!title || !title.trim() || !content || !content.trim()) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // For demo purposes, using userId = 1. In a real app, get from session/JWT
    const userId = 1;

    // Create a new activity
    const activity = await prisma.activity.create({
      data: {
        title: title.trim(),
        subject: title.trim(),
        note: content.trim(),
        userId,
        date: new Date(),
        activityTags: tags
          ? {
              create: tags.split(",").map((tag: string) => ({
                tag: { connect: { name: tag.trim() } },
              })),
            }
          : undefined,
      },
      include: {
        activityTags: { include: { tag: true } },
      },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { error: "Failed to create activity" },
      { status: 500 }
    );
  }
}
