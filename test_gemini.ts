import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log("Using API Key:", apiKey ? `${apiKey.slice(0, 5)}...${apiKey.slice(-5)}` : "None");

async function testModel(modelName: string) {
  if (!apiKey) {
    console.error("No API key found!");
    return;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    console.log(`Calling ${modelName}...`);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Hello! Respond with exactly 1 word.");
    console.log(`SUCCESS for ${modelName}:`, result.response.text().trim());
  } catch (err: unknown) {
    console.error(`ERROR for ${modelName}:`, (err as Error).message);
  }
}

async function run() {
  const models = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
  ];
  for (const m of models) {
    await testModel(m);
    console.log("-------------------");
  }
}

run();
