import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-helpers";

// GET /api/files?name=...&mimeType=...
export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return unauthorizedResponse();
    }
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name") || undefined;
    const mimeType = searchParams.get("mimeType") || undefined;

    const where: any = { userId: user.id };
    if (name) {
      where.fileName = { contains: name, mode: "insensitive" };
    }
    if (mimeType) {
      where.mimeType = mimeType;
    }

    const files = await prisma.file.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}
