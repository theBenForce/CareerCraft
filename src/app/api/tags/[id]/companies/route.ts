import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/tags/[id]/companies - Get all companies with a specific tag
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tagId = params.id;

    if (!tagId || typeof tagId !== "string") {
      return NextResponse.json({ error: "Invalid tag ID" }, { status: 400 });
    }

    // Query companies with this tag using implicit many-to-many
    const companies = await prisma.company.findMany({
      where: { tags: { some: { id: tagId } } },
      include: { tags: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error("Error fetching companies for tag:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}
