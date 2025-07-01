import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

    const companyTag = await prisma.companyTag.create({
      data: {
        companyId,
        tagId: tagId,
      },
      include: {
        tag: true,
      },
    });

    return NextResponse.json(companyTag, { status: 201 });
  } catch (error) {
    console.error("Error adding tag to company:", error);
    if (error instanceof Error && "code" in error && error.code === "P2002") {
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

    await prisma.companyTag.delete({
      where: {
        companyId_tagId: {
          companyId,
          tagId: tagId,
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

    const companyTags = await prisma.companyTag.findMany({
      where: {
        companyId,
      },
      include: {
        tag: true,
      },
    });

    return NextResponse.json(companyTags);
  } catch (error) {
    console.error("Error fetching company tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch company tags" },
      { status: 500 }
    );
  }
}
