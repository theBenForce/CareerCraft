import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Get all stats in parallel for better performance
    const [
      activeApplicationsCount,
      companiesCount,
      contactsCount,
      recentActivitiesCount,
    ] = await Promise.all([
      // Count active applications (not rejected or closed)
      prisma.jobApplication.count({
        where: {
          status: {
            notIn: ["rejected", "closed", "withdrawn"],
          },
        },
      }),
      // Count total companies
      prisma.company.count(),
      // Count total contacts
      prisma.contact.count(),
      // Count activities from the last 30 days
      prisma.activity.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          },
        },
      }),
    ]);

    const stats = {
      activeApplications: activeApplicationsCount,
      companies: companiesCount,
      contacts: contactsCount,
      recentActivities: recentActivitiesCount,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
