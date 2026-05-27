import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { FeedbackRequest } from "@/types/fraudshield";

export async function POST(req: NextRequest) {
  try {
    const body: FeedbackRequest = await req.json();
    const { scamCheckId, userRating, userComment } = body;

    if (!scamCheckId || (userRating !== 0 && userRating !== 1)) {
      return NextResponse.json(
        { success: false, error: "Invalid feedback data." },
        { status: 400 }
      );
    }

    // Verify the scam check exists
    const scamCheck = await prisma.scamCheck.findUnique({
      where: { id: scamCheckId },
    });

    if (!scamCheck) {
      return NextResponse.json(
        { success: false, error: "Scam check not found." },
        { status: 404 }
      );
    }

    await prisma.feedback.create({
      data: {
        scamCheckId,
        userRating,
        userComment: userComment ?? null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for your feedback!",
    });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit feedback. Please try again." },
      { status: 500 }
    );
  }
}
