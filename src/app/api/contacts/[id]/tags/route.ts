import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/contacts/[id]/tags - Add a tag to a contact
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contactId = parseInt(params.id);
    const body = await request.json();
    const { tagId } = body;

    if (!tagId) {
      return NextResponse.json(
        { error: "Tag ID is required" },
        { status: 400 }
      );
    }

    const contactTag = await prisma.contactTag.create({
      data: {
        contactId,
        tagId: parseInt(tagId),
      },
      include: {
        tag: true,
      },
    });

    return NextResponse.json(contactTag, { status: 201 });
  } catch (error) {
    console.error("Error adding tag to contact:", error);
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "This tag is already assigned to this contact" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to add tag to contact" },
      { status: 500 }
    );
  }
}

// DELETE /api/contacts/[id]/tags - Remove a tag from a contact
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contactId = parseInt(params.id);
    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get("tagId");

    if (!tagId) {
      return NextResponse.json(
        { error: "Tag ID is required" },
        { status: 400 }
      );
    }

    await prisma.contactTag.delete({
      where: {
        contactId_tagId: {
          contactId,
          tagId: parseInt(tagId),
        },
      },
    });

    return NextResponse.json({ message: "Tag removed from contact" });
  } catch (error) {
    console.error("Error removing tag from contact:", error);
    return NextResponse.json(
      { error: "Failed to remove tag from contact" },
      { status: 500 }
    );
  }
}

// GET /api/contacts/[id]/tags - Get all tags for a contact
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contactId = parseInt(params.id);

    const contactTags = await prisma.contactTag.findMany({
      where: {
        contactId,
      },
      include: {
        tag: true,
      },
    });

    return NextResponse.json(contactTags);
  } catch (error) {
    console.error("Error fetching contact tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact tags" },
      { status: 500 }
    );
  }
}
