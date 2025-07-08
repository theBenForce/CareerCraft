import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { prisma } from "@/lib/db";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-helpers";

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const category = (formData.get("category") as string) || "logos";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate category
    const allowedCategories = ["logos", "contacts"];
    if (!allowedCategories.includes(category)) {
      return NextResponse.json(
        { error: "Invalid category. Allowed: logos, contacts" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only JPEG, PNG, SVG, and WebP images are allowed.",
        },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Create File record in DB to get ULID
    const fileExtension = file.name.split(".").pop();
    const fileRecord = await prisma.file.create({
      data: {
        fileName: file.name,
        mimeType: file.type,
        user: { connect: { id: user.id } },
      },
    });

    // Use ULID as filename
    const ulidFileName = `${fileRecord.id}.${fileExtension}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file to appropriate directory based on category
    const uploadsBaseDir =
      process.env.UPLOADS_DIR || join(process.cwd(), "public/uploads");
    const uploadDir = join(uploadsBaseDir, category);
    const filePath = join(uploadDir, ulidFileName);

    // Ensure upload directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    await writeFile(filePath, buffer);

    // Optionally, update the File record with the storage path (not required for now)

    // Return the file path and File record info
    const publicPath = `/uploads/${category}/${ulidFileName}`;

    return NextResponse.json({
      success: true,
      fileId: fileRecord.id,
      filePath: publicPath,
      fileName: fileRecord.fileName,
      mimeType: fileRecord.mimeType,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
