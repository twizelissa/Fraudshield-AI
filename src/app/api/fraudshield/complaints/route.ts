import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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

    return NextResponse.json({
      success: true,
      count: reports.length,
      data: reports,
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
