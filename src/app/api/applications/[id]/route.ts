import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const application = await (prisma as any).jobApplication.findUnique({
      where: {
        id: params.id,
      },
      include: {
        company: true,
        activities: {
          orderBy: {
            createdAt: "desc",
          },
        },
        links: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Job application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error fetching job application:", error);
    return NextResponse.json(
      { error: "Failed to fetch job application" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      position,
      status,
      priority,
      jobDescription,
      salary,
      appliedDate,
      responseDate,
      interviewDate,
      offerDate,
      notes,
      source,
      companyId,
    } = body;

    const application = await (prisma as any).jobApplication.update({
      where: {
        id: params.id,
      },
      data: {
        ...(position && { position: position.trim() }),
        ...(status && { status: status.trim() }),
        ...(priority && { priority }),
        ...(jobDescription !== undefined && { jobDescription }),
        ...(salary !== undefined && { salary }),
        ...(appliedDate && { appliedDate: new Date(appliedDate) }),
        ...(responseDate !== undefined && {
          responseDate: responseDate ? new Date(responseDate) : null,
        }),
        ...(interviewDate !== undefined && {
          interviewDate: interviewDate ? new Date(interviewDate) : null,
        }),
        ...(offerDate !== undefined && {
          offerDate: offerDate ? new Date(offerDate) : null,
        }),
        ...(notes !== undefined && { notes }),
        ...(source !== undefined && { source }),
        ...(companyId && { companyId }),
      },
      include: {
        company: true,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error updating job application:", error);
    return NextResponse.json(
      { error: "Failed to update job application" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.jobApplication.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      message: "Job application deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job application:", error);
    return NextResponse.json(
      { error: "Failed to delete job application" },
      { status: 500 }
    );
  }
}
