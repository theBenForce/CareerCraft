import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const applications = await (prisma as any).jobApplication.findMany({
      where: {
        userId: user.id,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        links: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch job applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

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

    // Validate required fields
    if (!position || !position.trim()) {
      return NextResponse.json(
        { error: "Position is required" },
        { status: 400 }
      );
    }

    if (!status || !status.trim()) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    if (!appliedDate) {
      return NextResponse.json(
        { error: "Applied date is required" },
        { status: 400 }
      );
    }

    if (!companyId) {
      return NextResponse.json(
        { error: "Company is required" },
        { status: 400 }
      );
    }

    const application = await (prisma as any).jobApplication.create({
      data: {
        position: position.trim(),
        status: status.trim(),
        priority: priority || "medium",
        jobDescription,
        salary,
        appliedDate: new Date(appliedDate),
        responseDate: responseDate ? new Date(responseDate) : null,
        interviewDate: interviewDate ? new Date(interviewDate) : null,
        offerDate: offerDate ? new Date(offerDate) : null,
        notes,
        source,
        companyId: companyId,
        userId: user.id,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Error creating job application:", error);
    return NextResponse.json(
      { error: "Failed to create job application" },
      { status: 500 }
    );
  }
}
