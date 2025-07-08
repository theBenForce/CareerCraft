import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-helpers";

// PATCH /api/activities/[id]/files - Add or remove file associations
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser(request);
    if (!user) return unauthorizedResponse();
    const activityId = params.id;
    const body = await request.json();
    const { addFileIds = [], removeFileIds = [] } = body;

    // Check ownership
    const activity = await prisma.activity.findFirst({
      where: { id: activityId, userId: user.id },
    });
    if (!activity)
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );

    // Update associations
    await prisma.activity.update({
      where: { id: activityId },
      data: {
        files: {
          connect: addFileIds.map((id: string) => ({ id })),
          disconnect: removeFileIds.map((id: string) => ({ id })),
        },
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating activity files:", error);
    return NextResponse.json(
      { error: "Failed to update activity files" },
      { status: 500 }
    );
  }
}
