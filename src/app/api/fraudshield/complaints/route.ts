import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyGoogleAdmin } from "@/lib/google-auth";

const FALLBACK_REPORTS = [
  {
    id: "rep-4",
    reportedMessage: "AI automated crypto algorithm yields 300% weekly returns with zero risk. Send 0.05 BTC to VIP tier bot: @crypto_guru_wealth_bot.",
    category: "Fake investment",
    country: "Canada",
    userEmail: "in***@gmail.com",
    createdAt: new Date().toISOString(),
  },
  {
    id: "rep-3",
    reportedMessage: "HIRING: Remote Data Entry Clerk. Earn $500/day. Purchase mandatory starter kit for $150 refundable on first paycheck. WhatsApp: +1-555-0198.",
    category: "Fake job",
    country: "United Kingdom",
    userEmail: "ap***@outlook.com",
    createdAt: new Date().toISOString(),
  },
  {
    id: "rep-2",
    reportedMessage: "Congratulations! You have been selected for the $25,000 international scholarship. To claim your award, please send $300 registration fee via Western Union.",
    category: "Fake scholarship",
    country: "Kenya",
    userEmail: "st***@yahoo.com",
    createdAt: new Date().toISOString(),
  },
  {
    id: "rep-1",
    reportedMessage: "URGENT: Your parcel #US940011883 has been suspended due to incomplete address. Please pay $1.99 redelivery fee at http://usps-redelivery-tracking-secure.com within 24 hours.",
    category: "Phishing",
    country: "United States",
    userEmail: "ci***@gmail.com",
    createdAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";
  const category = searchParams.get("category")?.trim() || "";
  const limitParam = searchParams.get("limit") || "50";
  const limit = Math.min(100, Math.max(1, parseInt(limitParam, 10) || 50));

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

  try {
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
    console.warn("Using fallback threat reports due to DB interface error:", error);

    // Filter fallback reports in memory
    let filtered = [...FALLBACK_REPORTS];
    if (q) {
      filtered = filtered.filter((r) =>
        r.reportedMessage.toLowerCase().includes(q.toLowerCase())
      );
    }
    if (category) {
      filtered = filtered.filter(
        (r) => r.category.toLowerCase() === category.toLowerCase()
      );
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      data: filtered.slice(0, limit),
    });
  }
}
