import { NextRequest, NextResponse } from "next/server";
import { analyzeScamText } from "@/lib/gemini";
import { prisma } from "@/lib/db";
import { AnalyzeRequest, MessageType } from "@/types/fraudshield";

export const maxDuration = 90; // seconds — needed for Gemini retry waits


export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeRequest = await req.json();
    const { inputText, selectedType } = body;

    if (!inputText || inputText.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Please provide a message with at least 10 characters." },
        { status: 400 }
      );
    }

    if (inputText.trim().length > 10000) {
      return NextResponse.json(
        { success: false, error: "Message is too long. Please limit to 10,000 characters." },
        { status: 400 }
      );
    }

    const analysis = await analyzeScamText(
      inputText.trim(),
      (selectedType as MessageType) ?? "unknown"
    );

    let recordId = "temp-" + Math.random().toString(36).substring(2, 15);
    try {
      const record = await prisma.scamCheck.create({
        data: {
          inputText: inputText.trim(),
          selectedType: selectedType ?? null,
          riskScore: analysis.risk_score,
          riskLevel: analysis.risk_level,
          scamCategory: analysis.scam_category,
          summary: analysis.summary,
          warningSigns: JSON.stringify(analysis.warning_signs),
          recommendedActions: JSON.stringify(analysis.recommended_actions),
          confidenceLevel: analysis.confidence_level,
          sources: JSON.stringify(analysis.sources),
          disclaimer: analysis.disclaimer,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      });
      recordId = record.id;
    } catch (dbError) {
      console.error("Non-blocking DB logging error (typical in read-only serverless filesystems like Vercel):", dbError);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: recordId,
        ...analysis,
      },
    });
  } catch (error) {
    console.error("Analyze error:", error);

    const err = error as { status?: number };

    if (err?.status === 429) {
      return NextResponse.json(
        { success: false, error: "The AI service is rate limited. Please wait 30 seconds and try again." },
        { status: 429 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: "AI returned an unexpected response. Please try again." },
        { status: 500 }
      );
    }

    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("API_KEY") || message.includes("API key")) {
      return NextResponse.json(
        { success: false, error: "API key is invalid or not set. Please check your .env file." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: `Analysis failed: ${message}` },
      { status: 500 }
    );
  }
}
