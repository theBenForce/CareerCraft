import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const contactId = params.id;

    const contact = await (prisma as any).contact.findFirst({
      where: {
        id: contactId,
        userId: user.id,
      },
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
    });

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const contactId = params.id;

    if (!contactId || typeof contactId !== "string") {
      return NextResponse.json(
        { error: "Invalid contact ID" },
        { status: 400 }
      );
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
    } = body;

    // Validate required fields
    if (!firstName || !firstName.trim() || !lastName || !lastName.trim()) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 }
      );
    }

    // Check if contact exists and belongs to user
    const existingContact = await (prisma as any).contact.findFirst({
      where: {
        id: contactId,
        userId: user.id,
      },
    });

    if (!existingContact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    const updatedContact = await (prisma as any).contact.update({
      where: { id: contactId },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email,
        phone,
        position,
        department,
        ...(image !== undefined && { image }),
        ...(summary !== undefined && { summary }),
        notes,
        companyId: companyId || null,
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

    return NextResponse.json(updatedContact);
  } catch (error) {
    console.error("Error updating contact:", error);
    return NextResponse.json(
      { error: "Failed to update contact" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return unauthorizedResponse();
    }
    const contactId = params.id;

    if (!contactId || typeof contactId !== "string") {
      return NextResponse.json(
        { error: "Invalid contact ID" },
        { status: 400 }
      );
    }

    // Check if contact exists and belongs to user
    const existingContact = await prisma.contact.findFirst({
      where: {
        id: contactId,
        userId: user.id,
      },
    });

    if (!existingContact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    await prisma.contact.delete({
      where: { id: contactId },
    });

    return NextResponse.json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    );
  }
}
