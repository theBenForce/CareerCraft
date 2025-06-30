import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const contacts = await (prisma as any).contact.findMany({
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        contactTags: {
          include: {
            tag: true,
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

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      image,
      summary,
      notes,
      companyId,
    } = body;

    // Validate required fields
    if (!firstName || !firstName.trim() || !lastName || !lastName.trim()) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 }
      );
    }

    // For now, we'll use a hardcoded userId. In a real app, you'd get this from authentication
    const userId = 1;

    const contact = await (prisma as any).contact.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email,
        phone,
        position,
        department,
        ...(image && { image }),
        ...(summary && { summary }),
        notes,
        companyId: companyId ? parseInt(companyId) : null,
        userId,
      } as any,
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 }
    );
  }
}
