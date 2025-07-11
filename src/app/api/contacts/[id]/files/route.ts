import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-helpers";

// PATCH /api/contacts/[id]/files - Add or remove file associations
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser(request);
    if (!user) return unauthorizedResponse();
    const contactId = params.id;
    const body = await request.json();
    const { addFileIds = [], removeFileIds = [] } = body;

    // Check ownership
    const contact = await prisma.contact.findFirst({
      where: { id: contactId, userId: user.id },
    });
    if (!contact)
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });

    // Update associations
    await prisma.contact.update({
      where: { id: contactId },
      data: {
        files: {
          connect: addFileIds.map((id: string) => ({ id })),
          disconnect: removeFileIds.map((id: string) => ({ id })),
        },
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating contact files:", error);
    return NextResponse.json(
      { error: "Failed to update contact files" },
      { status: 500 }
    );
  }
}
