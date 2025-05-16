import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API key from env variables
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error("Missing Gemini API key in environment variables");
}

const genAI = new GoogleGenerativeAI(geminiApiKey);

// Use Gemini 2.0 Flash models explicitly
const textModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const visionModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export { textModel, visionModel };
