import { GoogleGenerativeAI } from "@google/generative-ai";
import { ScamAnalysis, MessageType } from "@/types/fraudshield";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const messageTypeLabels: Record<MessageType, string> = {
  job: "job offer",
  scholarship: "scholarship offer",
  grant: "grant offer",
  email: "email",
  sms: "SMS or WhatsApp message",
  investment: "investment opportunity",
  unknown: "message",
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGeminiWithRetry(
  model: ReturnType<typeof GoogleGenerativeAI.prototype.getGenerativeModel>,
  prompt: string,
  retries = 4
): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err: unknown) {
    const error = err as { status?: number; statusText?: string; message?: string };
    const errMsg = error?.message || (err instanceof Error ? err.message : String(err));
    
    const is429 = error?.status === 429 || errMsg.includes("429") || errMsg.includes("Quota exceeded") || errMsg.includes("Too Many Requests");
    const isTemporaryServerLoad = 
      error?.status === 503 || 
      error?.status === 502 || 
      error?.status === 504 || 
      errMsg.includes("503") || 
      errMsg.includes("502") || 
      errMsg.includes("504") || 
      errMsg.includes("Service Unavailable") || 
      errMsg.includes("overloaded") || 
      errMsg.includes("high demand");

    if (is429 && retries > 0) {
      // Rate limited — wait 30s then retry
      await sleep(30000);
      return callGeminiWithRetry(model, prompt, retries - 1);
    }
    if (isTemporaryServerLoad && retries > 0) {
      // Temporary high load — wait 4s then retry
      await sleep(4000);
      return callGeminiWithRetry(model, prompt, retries - 1);
    }
    throw err;
  }
}

export async function analyzeScamText(
  text: string,
  messageType: MessageType = "unknown"
): Promise<ScamAnalysis> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tools: [{ googleSearch: {} }] as any,
  });

  const typeLabel = messageTypeLabels[messageType];

  const prompt = `You are FraudShield AI, a scam detection assistant with real-time web-search capability. Analyze the following ${typeLabel} and decide whether it may be a scam, phishing attempt, fake job offer, fake scholarship, fake grant, fake investment, or other suspicious online offer.

CRITICAL: You MUST use your web search tool to go online and check if similar scams, complaints, phishing campaigns, or warnings are reported on the web (such as on Reddit, community forums, tech/consumer blogs, or official alert sites). If you find any matching reports or discussions, extract their details, specific names, or URLs.

Evaluate the message based on:
1. Requests for money, fees, deposits, registration payments, or processing fees.
2. Requests for passwords, OTPs, bank details, ID numbers, passport information, or private documents.
3. Unrealistic promises such as guaranteed jobs, instant scholarships, large prizes, or high returns.
4. Urgency or pressure, such as "today only", "act now", or "limited slots".
5. Suspicious contact details, unofficial emails, shortened links, or unclear organization names.
6. Poor grammar, generic greetings, and lack of verifiable details.
7. Claims that the user won or was selected without applying.
8. Any instruction to hide the communication from others.

Message to analyze:
"""
${text}
"""

Return ONLY valid JSON (no markdown, no code blocks, just raw JSON) with exactly these fields:
{
  "risk_score": <integer 0-100>,
  "risk_level": <"Low Risk" | "Medium Risk" | "High Risk">,
  "scam_category": <"Fake job" | "Fake scholarship" | "Fake grant" | "Phishing" | "Fake investment" | "Romance/social scam" | "Fake delivery/payment scam" | "General suspicious message" | "Unknown">,
  "confidence_level": <"Low" | "Medium" | "High">,
  "summary": <string: 1-2 sentence summary using careful language like "appears suspicious" or "may be risky">,
  "warning_signs": <array of strings, each a specific warning sign found in this message>,
  "recommended_actions": <array of strings, each a safe action the user should take>,
  "sources": <array of strings, each a brief description and specific URL of similar scams, warnings, or Reddit/blog reports you found online. If none are found, return an empty array []>,
  "disclaimer": "This result is for guidance only. Always verify important opportunities through official sources."
}

CRITICAL: Do NOT include any emojis, icons, or pictorial characters (such as 🚨, ⚠️, ❌, 💼, 🎓, etc.) in any of the fields. Use clean, plain English text only.
Risk score must be 0 to 100. Risk level must match the score: 0-30 = Low Risk, 31-70 = Medium Risk, 71-100 = High Risk.
Do not say something is definitely a scam unless the evidence is very strong. Use careful language.
If the message appears legitimate, still note any minor concerns or confirm it appears safe.`;

  const responseText = await callGeminiWithRetry(model, prompt);


  // Strip any accidental markdown code fences
  const cleaned = responseText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const parsed: ScamAnalysis = JSON.parse(cleaned);

  // Validate and clamp risk score
  parsed.risk_score = Math.max(0, Math.min(100, Math.round(parsed.risk_score)));

  // Ensure risk_level matches score
  if (parsed.risk_score <= 30) parsed.risk_level = "Low Risk";
  else if (parsed.risk_score <= 70) parsed.risk_level = "Medium Risk";
  else parsed.risk_level = "High Risk";

  // Ensure sources is present and sanitized
  if (!parsed.sources || !Array.isArray(parsed.sources)) {
    parsed.sources = [];
  }

  return parsed;
}
