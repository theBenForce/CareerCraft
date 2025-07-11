import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const companies = await (prisma as any).company.findMany({
      where: {
        userId: user.id,
      },
      include: {
        jobApplications: {
          select: {
            id: true,
            status: true,
          },
        },
        contacts: {
          select: {
            id: true,
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

    return NextResponse.json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
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
      name,
      industry,
      description,
      location,
      size,
      logo,
      notes,
      fileIds,
    } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    const userId = user.id;

    const company = await prisma.company.create({
      data: {
        name: name.trim(),
        industry,
        description,
        location,
        size,
        logo,
        notes,
        userId,
        files:
          fileIds && Array.isArray(fileIds) && fileIds.length > 0
            ? { connect: fileIds.map((id: string) => ({ id })) }
            : undefined,
      },
      include: {
        jobApplications: {
          select: {
            id: true,
            status: true,
          },
        },
        contacts: {
          select: {
            id: true,
          },
        },
        // files: true, // Not directly includable, fetch separately if needed
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { error: "Failed to create company" },
      { status: 500 }
    );
  }
}
