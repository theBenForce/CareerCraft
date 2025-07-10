import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { existsSync } from "fs";
import { firebaseStorageService } from "@/lib/firebase-storage";

// Helper function for local file system upload (fallback)
async function uploadToLocalStorage(file: File, category: string) {
  // Generate unique filename
  const fileExtension = file.name.split(".").pop();
  const fileName = `${randomUUID()}.${fileExtension}`;

  // Convert file to buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Save file to appropriate directory based on category
  const uploadsBaseDir =
    process.env.UPLOADS_DIR || join(process.cwd(), "public/uploads");
  const uploadDir = join(uploadsBaseDir, category);
  const filePath = join(uploadDir, fileName);

  // Ensure upload directory exists
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  await writeFile(filePath, buffer);

  // Return the file path that can be used in img src
  const publicPath = `/uploads/${category}/${fileName}`;

  return {
    success: true,
    filePath: publicPath,
    fileName,
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const category = (formData.get("category") as string) || "logos"; // Default to logos for backwards compatibility

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

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Check if Firebase is enabled
    const useFirebase = process.env.USE_FIREBASE === 'true' || process.env.FIREBASE_PROJECT_ID;

    let result;
    if (useFirebase) {
      try {
        // Upload to Firebase Storage
        result = await firebaseStorageService.uploadFile({
          buffer,
          originalName: file.name,
          mimeType: file.type,
          category
        });
      } catch (firebaseError) {
        console.error("Firebase Storage upload failed, falling back to local storage:", firebaseError);
        // Fallback to local storage
        result = await uploadToLocalStorage(file, category);
      }
    } else {
      // Use local storage
      result = await uploadToLocalStorage(file, category);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
