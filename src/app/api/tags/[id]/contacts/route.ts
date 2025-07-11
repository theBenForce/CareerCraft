import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/tags/[id]/contacts - Get all contacts with a specific tag
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tagId = params.id;

    if (!tagId || typeof tagId !== "string") {
      return NextResponse.json({ error: "Invalid tag ID" }, { status: 400 });
    }

    const contacts = await prisma.contact.findMany({
      where: { tags: { some: { id: tagId } } },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts for tag:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}
