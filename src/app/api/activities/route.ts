import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    // Get activities with basic relationships
    const activities = await prisma.activity.findMany({
      where: {
        userId: user.id,
      },
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
        tags: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // Manually fetch activity contacts for each activity
    const activitiesWithContacts = await Promise.all(
      activities.map(async (activity) => {
        // Fetch contacts for this activity (implicit many-to-many)
        const activityContacts = await prisma.contact.findMany({
          where: {
            activities: {
              some: { id: activity.id },
            },
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            position: true,
          },
        });
        return {
          ...activity,
          contacts: activityContacts,
        };
      })
    );

    return NextResponse.json(activitiesWithContacts);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const {
      type,
      subject,
      description,
      date,
      duration,
      note,
      followUpDate,
      companyId,
      jobApplicationId,
      contactIds, // Array of contact IDs
      tagIds, // Array of tag IDs (optional)
    } = body;

    // Validate required fields
    if (!type || !subject || !date) {
      return NextResponse.json(
        { error: "Type, subject, and date are required" },
        { status: 400 }
      );
    }

    // Create the activity
    const activity = await prisma.activity.create({
      data: {
        type,
        subject: subject.trim(),
        description: description?.trim(),
        date: new Date(date),
        duration: duration ? parseInt(duration) : null,
        note: note?.trim(),
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        companyId: companyId ?? null,
        jobApplicationId: jobApplicationId ?? null,
        userId: user.id,
        // Connect tags if provided
        tags:
          tagIds && Array.isArray(tagIds) && tagIds.length > 0
            ? {
                connect: tagIds.map((id: string) => ({ id })),
              }
            : undefined,
        // Connect contacts if provided
        contacts:
          contactIds && Array.isArray(contactIds) && contactIds.length > 0
            ? {
                connect: contactIds.map((id: string) => ({ id })),
              }
            : undefined,
      },
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
        tags: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        contacts: {
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

    // Transform the response
    const transformedActivity = {
      ...activity,
      contacts: activity.contacts,
      tags: activity.tags,
    };

    return NextResponse.json(transformedActivity, { status: 201 });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { error: "Failed to create activity" },
      { status: 500 }
    );
  }
}
