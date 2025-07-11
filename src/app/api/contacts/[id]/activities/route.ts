import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contactId = params.id;

    // Fetch the contact and include related activities
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      include: {
        activities: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
              },
            },
            jobApplication: {
              select: {
                id: true,
                position: true,
              },
            },
            tags: true,
          },
          orderBy: {
            date: "desc",
          },
        },
      },
    });

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    // Return the activities array
    return NextResponse.json(contact.activities);
  } catch (error) {
    console.error("Error fetching contact activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact activities" },
      { status: 500 }
    );
  }
}
