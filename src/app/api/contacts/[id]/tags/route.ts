import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/contacts/[id]/tags - Add a tag to a contact
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contactId = params.id;
    const body = await request.json();
    const { tagId } = body;

    if (!tagId) {
      return NextResponse.json(
        { error: "Tag ID is required" },
        { status: 400 }
      );
    }

    // Use connect for many-to-many relation
    const updatedContact = await prisma.contact.update({
      where: { id: contactId },
      data: {
        tags: {
          connect: { id: tagId },
        },
      },
      include: {
        tags: true,
      },
    });

    return NextResponse.json(updatedContact, { status: 201 });
  } catch (error) {
    console.error("Error adding tag to contact:", error);
    if (
      error instanceof Error &&
      "code" in error &&
      (error as any).code === "P2002"
    ) {
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
    const contactId = params.id;
    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get("tagId");

    if (!tagId) {
      return NextResponse.json(
        { error: "Tag ID is required" },
        { status: 400 }
      );
    }

    // Use disconnect for many-to-many relation
    await prisma.contact.update({
      where: { id: contactId },
      data: {
        tags: {
          disconnect: { id: tagId },
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
    const contactId = params.id;

    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      include: {
        tags: true,
      },
    });

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json(contact.tags);
  } catch (error) {
    console.error("Error fetching contact tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact tags" },
      { status: 500 }
    );
  }
}
