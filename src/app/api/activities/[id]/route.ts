import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const activityId = parseInt(params.id);

    if (isNaN(activityId)) {
      return NextResponse.json(
        { error: "Invalid activity ID" },
        { status: 400 }
      );
    }

    // Get the activity with basic relationships
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        jobApplication: {
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    // Fetch activity contacts
    const activityContacts = await (prisma as any).activityContact.findMany({
      where: { activityId: activity.id },
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            position: true,
            phone: true,
          },
        },
      },
    });

    const activityWithContacts = {
      ...activity,
      contacts: activityContacts.map((ac: any) => ac.contact),
    };

    return NextResponse.json(activityWithContacts);
  } catch (error) {
    console.error("Error fetching activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const activityId = parseInt(params.id);

    if (isNaN(activityId)) {
      return NextResponse.json(
        { error: "Invalid activity ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      type,
      subject,
      description,
      date,
      duration,
      outcome,
      followUpDate,
      companyId,
      jobApplicationId,
      contactIds, // Array of contact IDs
    } = body;

    // Validate required fields
    if (!type || !subject || !date) {
      return NextResponse.json(
        { error: "Type, subject, and date are required" },
        { status: 400 }
      );
    }

    // Check if activity exists
    const existingActivity = await prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (!existingActivity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    // Update the activity
    const updatedActivity = await prisma.activity.update({
      where: { id: activityId },
      data: {
        type,
        subject: subject.trim(),
        description: description?.trim(),
        date: new Date(date),
        duration: duration ? parseInt(duration) : null,
        outcome: outcome?.trim(),
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        companyId: companyId ? parseInt(companyId) : null,
        jobApplicationId: jobApplicationId ? parseInt(jobApplicationId) : null,
      },
    });

    // Update activity-contact relationships
    // First, delete existing relationships
    await (prisma as any).activityContact.deleteMany({
      where: { activityId: activityId },
    });

    // Then, create new relationships if contactIds provided
    if (contactIds && Array.isArray(contactIds) && contactIds.length > 0) {
      const activityContacts = contactIds.map((contactId: number) => ({
        activityId: activityId,
        contactId: parseInt(contactId.toString()),
      }));

      await (prisma as any).activityContact.createMany({
        data: activityContacts,
      });
    }

    // Fetch the updated activity with all relationships
    const activityContacts = await (prisma as any).activityContact.findMany({
      where: { activityId: activityId },
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            position: true,
          },
        },
      },
    });

    const activityWithRelations = await prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        jobApplication: {
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    // Transform the response
    const transformedActivity = {
      ...activityWithRelations,
      contacts: activityContacts.map((ac: any) => ac.contact),
    };

    return NextResponse.json(transformedActivity);
  } catch (error) {
    console.error("Error updating activity:", error);
    return NextResponse.json(
      { error: "Failed to update activity" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const activityId = parseInt(params.id);

    if (isNaN(activityId)) {
      return NextResponse.json(
        { error: "Invalid activity ID" },
        { status: 400 }
      );
    }

    // Check if activity exists
    const existingActivity = await prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (!existingActivity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    // Delete activity-contact relationships first (cascade should handle this, but being explicit)
    await (prisma as any).activityContact.deleteMany({
      where: { activityId: activityId },
    });

    // Delete the activity
    await prisma.activity.delete({
      where: { id: activityId },
    });

    return NextResponse.json(
      { message: "Activity deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting activity:", error);
    return NextResponse.json(
      { error: "Failed to delete activity" },
      { status: 500 }
    );
  }
}
