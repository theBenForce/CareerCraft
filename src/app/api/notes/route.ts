import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // For demo purposes, using userId = 1. In a real app, get from session/JWT
    const userId = 1;

    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, tags } = body;

    // Validate required fields
    if (!title || !title.trim() || !content || !content.trim()) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // For demo purposes, using userId = 1. In a real app, get from session/JWT
    const userId = 1;

    const note = await prisma.note.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        tags: tags?.trim(),
        userId,
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}
