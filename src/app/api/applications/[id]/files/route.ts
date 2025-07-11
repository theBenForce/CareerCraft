import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-helpers";

// PATCH /api/applications/[id]/files - Add or remove file associations
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser(request);
    if (!user) return unauthorizedResponse();
    const applicationId = params.id;
    const body = await request.json();
    const { addFileIds = [], removeFileIds = [] } = body;

    // Check ownership
    const application = await prisma.jobApplication.findFirst({
      where: { id: applicationId, userId: user.id },
    });
    if (!application)
      return NextResponse.json(
        { error: "Job application not found" },
        { status: 404 }
      );

    // Update associations
    await prisma.jobApplication.update({
      where: { id: applicationId },
      data: {
        files: {
          connect: addFileIds.map((id: string) => ({ id })),
          disconnect: removeFileIds.map((id: string) => ({ id })),
        },
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating job application files:", error);
    return NextResponse.json(
      { error: "Failed to update job application files" },
      { status: 500 }
    );
  }
}
