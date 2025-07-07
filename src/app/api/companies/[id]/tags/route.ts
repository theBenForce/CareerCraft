import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/companies/[id]/tags - Add a tag to a company
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = params.id;
    const body = await request.json();
    const { tagId } = body;

    if (!tagId) {
      return NextResponse.json(
        { error: "Tag ID is required" },
        { status: 400 }
      );
    }

    // Use implicit many-to-many relation: connect tag to company
    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        tags: {
          connect: { id: tagId },
        },
      },
      include: {
        tags: true,
      },
    });

    // Return the connected tag only (for compatibility)
    const tag = updatedCompany.tags.find((t) => t.id === tagId);
    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error("Error adding tag to company:", error);
    // Prisma unique constraint error for already connected tag
    if (
      error instanceof Error &&
      "code" in error &&
      (error as any).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "This tag is already assigned to this company" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to add tag to company" },
      { status: 500 }
    );
  }
}

// DELETE /api/companies/[id]/tags - Remove a tag from a company
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = params.id;
    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get("tagId");

    if (!tagId) {
      return NextResponse.json(
        { error: "Tag ID is required" },
        { status: 400 }
      );
    }

    // Use implicit many-to-many relation: disconnect tag from company
    await prisma.company.update({
      where: { id: companyId },
      data: {
        tags: {
          disconnect: { id: tagId },
        },
      },
    });

    return NextResponse.json({ message: "Tag removed from company" });
  } catch (error) {
    console.error("Error removing tag from company:", error);
    return NextResponse.json(
      { error: "Failed to remove tag from company" },
      { status: 500 }
    );
  }
}

// GET /api/companies/[id]/tags - Get all tags for a company
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = params.id;
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        tags: true,
      },
    });
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }
    return NextResponse.json(company.tags);
  } catch (error) {
    console.error("Error fetching company tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch company tags" },
      { status: 500 }
    );
  }
}
