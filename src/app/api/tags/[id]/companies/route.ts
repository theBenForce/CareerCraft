import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

    const companyTags = await (prisma as any).companyTag.findMany({
      where: { tagId },
      include: {
        company: true,
      },
    });

    const companies = companyTags.map((ct: any) => ct.company);

    return NextResponse.json(companies);
  } catch (error) {
    console.error("Error fetching companies for tag:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}
