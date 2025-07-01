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
        activityTags: {
          include: {
            tag: true,
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
        const activityContacts = await (prisma as any).activityContact.findMany(
          {
            where: { activityId: activity.id },
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
          }
        );

        return {
          ...activity,
          contacts: activityContacts.map((ac: any) => ac.contact),
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
        companyId: companyId ? parseInt(companyId) : null,
        jobApplicationId: jobApplicationId ? parseInt(jobApplicationId) : null,
        userId: user.id,
      },
    });

    // Create activity-contact relationships if contactIds provided
    if (contactIds && Array.isArray(contactIds) && contactIds.length > 0) {
      const activityContacts = contactIds.map((contactId: number) => ({
        activityId: activity.id,
        contactId: parseInt(contactId.toString()),
      }));

      await (prisma as any).activityContact.createMany({
        data: activityContacts,
      });
    }

    // Fetch the created activity with contacts
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
          },
        },
      },
    });

    const activityWithRelations = await prisma.activity.findUnique({
      where: { id: activity.id },
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

    return NextResponse.json(transformedActivity, { status: 201 });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { error: "Failed to create activity" },
      { status: 500 }
    );
  }
}
