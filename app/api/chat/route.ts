/**
 * Chat API Route
 * 
 * POST /api/chat
 * Handles incoming questions and returns AI-generated answers
 * 
 * This endpoint:
 * 1. Validates the request
 * 2. Processes the question through RAG pipeline
 * 3. Returns the answer with metadata
 */

import { NextRequest, NextResponse } from 'next/server';
import { processQuestion } from '@/app/lib/rag-service';
import { ChatRequest, ChatResponse } from '@/app/types';

/**
 * POST handler for chat endpoint
 */
export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body: ChatRequest = await request.json();
        const { question, context } = body;

        // Validate question
        if (!question || typeof question !== 'string' || question.trim().length === 0) {
            return NextResponse.json(
                { error: 'Question is required and must be a non-empty string' },
                { status: 400 }
            );
        }

        // Check question length
        if (question.length > 1000) {
            return NextResponse.json(
                { error: 'Question is too long (max 1000 characters)' },
                { status: 400 }
            );
        }

        // Process question through RAG pipeline
        const result = await processQuestion(question);

        // Return response
        const response: ChatResponse = {
            answer: result.answer,
            category: result.category,
            retrievedContext: result.retrievedContext, // Optional: for debugging
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Error in chat API:', error);

        return NextResponse.json(
            {
                error: 'Internal server error',
                answer: 'ขออภัยครับ เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้ง',
                category: 'general' as const
            },
            { status: 500 }
        );
    }
}

/**
 * OPTIONS handler for CORS (if needed)
 */
export async function OPTIONS(request: NextRequest) {
    return NextResponse.json(
        {},
        {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        }
    );
}
