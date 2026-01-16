import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { SUMMARY_PROMPT } from "@/app/lib/prompts";

export async function POST(req: Request) {
    try {
        // 1. Validate env
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "Missing GEMINI_API_KEY" },
                { status: 500 }
            );
        }

        // 2. Parse body
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json(
                { error: "Text is required" },
                { status: 400 }
            );
        }

        // 3. Init Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({    model: "gemini-2.0-flash-exp"
 
        });

        // 4. Generate
        const prompt = SUMMARY_PROMPT(text);
        const result = await model.generateContent(prompt);

        return NextResponse.json({
            text: result.response.text(),
        });
    } catch (err: any) {
        console.error("Gemini API error:", err);

        return NextResponse.json(
            { error: err.message || "Gemini API failed" },
            { status: 500 }
        );
    }
}
