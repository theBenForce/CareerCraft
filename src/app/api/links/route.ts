import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    const contactId = searchParams.get("contactId");
    const jobApplicationId = searchParams.get("jobApplicationId");

    const where: any = {};

    if (companyId) {
      where.companyId = parseInt(companyId);
    }
    if (contactId) {
      where.contactId = parseInt(contactId);
    }
    if (jobApplicationId) {
      where.jobApplicationId = parseInt(jobApplicationId);
    }

    const links = await (prisma as any).link.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error("Error fetching links:", error);
    return NextResponse.json(
      { error: "Failed to fetch links" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, label, companyId, contactId, jobApplicationId } = body;

    // Validate that exactly one parent entity is specified
    const parentCount = [companyId, contactId, jobApplicationId].filter(
      Boolean
    ).length;
    if (parentCount !== 1) {
      return NextResponse.json(
        {
          error:
            "Exactly one of companyId, contactId, or jobApplicationId must be provided",
        },
        { status: 400 }
      );
    }

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const linkData: any = {
      url,
      label: label || null,
    };

    if (companyId) linkData.companyId = companyId;
    if (contactId) linkData.contactId = contactId;
    if (jobApplicationId) linkData.jobApplicationId = jobApplicationId;

    const link = await (prisma as any).link.create({
      data: linkData,
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error("Error creating link:", error);
    return NextResponse.json(
      { error: "Failed to create link" },
      { status: 500 }
    );
  }
}
