import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const companies = await (prisma as any).company.findMany({
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
    const body = await request.json();
    const {
      name,
      industry,
      description,
      location,
      size,
      logo,
      notes,
    } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    // For now, we'll use a hardcoded userId. In a real app, you'd get this from authentication
    const userId = 1;

    const company = await (prisma as any).company.create({
      data: {
        name: name.trim(),
        industry,
        description,
        location,
        size,
        logo,
        notes,
        userId,
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
