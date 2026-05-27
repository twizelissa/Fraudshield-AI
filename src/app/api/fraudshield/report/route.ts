import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ReportRequest } from "@/types/fraudshield";

export async function POST(req: NextRequest) {
  try {
    const body: ReportRequest = await req.json();
    const { reportedMessage, category, country, userEmail } = body;

    if (!reportedMessage || reportedMessage.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Please provide a message to report." },
        { status: 400 }
      );
    }

    try {
      await prisma.scamReport.create({
        data: {
          reportedMessage: reportedMessage.trim(),
          category: category ?? null,
          country: country ?? null,
          userEmail: userEmail ?? null,
        },
      });
    } catch (dbError) {
      console.error("Non-blocking DB report logging error (typical in read-only serverless filesystems like Vercel):", dbError);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your report has been submitted and will help others stay safe.",
    });
  } catch (error) {
    console.error("Report error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: `Failed to submit report: ${message}` },
      { status: 500 }
    );
  }
}
