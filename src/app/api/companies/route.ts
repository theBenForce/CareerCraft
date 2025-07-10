import { NextRequest, NextResponse } from "next/server";
import { prisma, firebaseDbClient } from "@/lib/db";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-helpers";

// Helper function to fetch related data for Firebase
async function fetchCompanyRelations(companyId: string, useFirebase: boolean) {
  if (!useFirebase) {
    return {}; // Prisma handles includes automatically
  }

  // For Firebase, manually fetch related data
  const [jobApplications, contacts, links] = await Promise.all([
    firebaseDbClient.jobApplication.findMany({
      where: { companyId },
    }),
    firebaseDbClient.contact.findMany({
      where: { companyId },
    }),
    firebaseDbClient.link.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    jobApplications: jobApplications.map((app: any) => ({
      id: app.id,
      status: app.status,
    })),
    contacts: contacts.map((contact: any) => ({
      id: contact.id,
    })),
    links,
  };
}

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const useFirebase = process.env.USE_FIREBASE === 'true';

    let companies;
    if (useFirebase) {
      // Firebase: Fetch companies and manually include related data
      const companiesData = await firebaseDbClient.company.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });

      // Fetch related data for each company
      companies = await Promise.all(
        companiesData.map(async (company: any) => {
          const relations = await fetchCompanyRelations(company.id, true);
          return { ...company, ...relations };
        })
      );
    } else {
      // Prisma: Use native includes
      companies = await (prisma as any).company.findMany({
        where: {
          userId: user.id,
        },
        include: {
          jobApplications: {
            select: {
              id: true,
              status: true,
            },
          },
          contacts: {
            select: {
              id: true,
            },
          },
          links: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return NextResponse.json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
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
    const { name, industry, description, location, size, logo, notes } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    const userId = user.id;
    const useFirebase = process.env.USE_FIREBASE === 'true';

    let company;
    if (useFirebase) {
      // Firebase: Create company and fetch related data
      const newCompany = await firebaseDbClient.company.create({
        data: {
          name: name.trim(),
          industry,
          description,
          location,
          size,
          logo,
          notes,
          userId,
        },
      });

      // Fetch related data (will be empty for new company)
      const relations = await fetchCompanyRelations(newCompany.id, true);
      company = { ...newCompany, ...relations };
    } else {
      // Prisma: Use native includes
      company = await (prisma as any).company.create({
        data: {
          name: name.trim(),
          industry,
          description,
          location,
          size,
          logo,
          notes,
          userId,
        },
        include: {
          jobApplications: {
            select: {
              id: true,
              status: true,
            },
          },
          contacts: {
            select: {
              id: true,
            },
          },
        },
      });
    }

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { error: "Failed to create company" },
      { status: 500 }
    );
  }
}
