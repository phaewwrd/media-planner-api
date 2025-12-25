import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

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
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 }
            );
        }

        // 3. Init Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        // 4. Generate
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
