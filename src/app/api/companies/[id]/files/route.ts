import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-helpers";

// PATCH /api/companies/[id]/files - Add or remove file associations
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser(request);
    if (!user) return unauthorizedResponse();
    const companyId = params.id;
    const body = await request.json();
    const { addFileIds = [], removeFileIds = [] } = body;

    // Check ownership
    const company = await prisma.company.findFirst({
      where: { id: companyId, userId: user.id },
    });
    if (!company)
      return NextResponse.json({ error: "Company not found" }, { status: 404 });

    // Update associations
    await prisma.company.update({
      where: { id: companyId },
      data: {
        files: {
          connect: addFileIds.map((id: string) => ({ id })),
          disconnect: removeFileIds.map((id: string) => ({ id })),
        },
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating company files:", error);
    return NextResponse.json(
      { error: "Failed to update company files" },
      { status: 500 }
    );
  }
}
