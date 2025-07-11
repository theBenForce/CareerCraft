import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const contacts = await (prisma as any).contact.findMany({
      where: {
        userId: user.id,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: true,
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
    const user = await getSessionUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

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
      fileIds, // Array of File ULIDs to associate
    } = body;

    // Validate required fields
    if (!firstName || !firstName.trim() || !lastName || !lastName.trim()) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 }
      );
    }

    const userId = user.id;

    const contact = await prisma.contact.create({
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
        companyId: companyId || null,
        userId,
        files:
          fileIds && Array.isArray(fileIds) && fileIds.length > 0
            ? { connect: fileIds.map((id: string) => ({ id })) }
            : undefined,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        // files: true, // REMOVE: not supported in include, fetch files separately if needed
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
