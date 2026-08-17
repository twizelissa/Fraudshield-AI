import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyGoogleAdmin } from "@/lib/google-auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const limitParam = searchParams.get("limit") || "50";
    const limit = Math.min(100, Math.max(1, parseInt(limitParam, 10) || 50));

    // Construct Prisma where query conditions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {};

    if (q) {
      whereClause.reportedMessage = {
        contains: q,
      };
    }

    if (category) {
      whereClause.category = {
        equals: category,
      };
    }

    // Query database with resilient safety limits
    const reports = await prisma.scamReport.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    const clientKey = searchParams.get("admin_key") || req.headers.get("x-admin-key") || "";
    const isAuthorized = clientKey.length > 100 && (await verifyGoogleAdmin(clientKey)) !== null;

    const redactEmail = (email: string | null) => {
      if (!email) return null;
      const parts = email.split("@");
      if (parts.length !== 2) return "Redacted Operator";
      const [username, domain] = parts;
      if (username.length <= 2) {
        return `${username}***@${domain}`;
      }
      return `${username.slice(0, 2)}***@${domain}`;
    };

    const sanitizedReports = reports.map((report) => {
      if (isAuthorized) return report;
      return {
        ...report,
        userEmail: report.userEmail ? redactEmail(report.userEmail) : null,
      };
    });

    return NextResponse.json({
      success: true,
      count: sanitizedReports.length,
      data: sanitizedReports,
    });
  } catch (error) {
    console.error("Failed to query threat reports from DB:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        error: `Could not interface with database threat reports: ${message}`,
        data: [],
      },
      { status: 500 }
    );
  }
}
