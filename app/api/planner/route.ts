/**
 * Planner API Route
 * 
 * GET  /api/planner?stepId=STEP_1  → Get step definition
 * POST /api/planner                → Calculate recommendation
 */

import { NextRequest, NextResponse } from 'next/server';
import {
    getStepById,
    calculateRecommendation,
    saveSession
} from '@/app/db/planner.service';
import type { UserAnswer } from '@/app/types';

// ============================================================================
// GET /api/planner?stepId=STEP_1
// ============================================================================
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const stepId = searchParams.get('stepId');

        if (!stepId) {
            return NextResponse.json(
                { error: 'Missing stepId parameter' },
                { status: 400 }
            );
        }

        const step = await getStepById(stepId);

        if (!step) {
            return NextResponse.json(
                { error: `Step not found: ${stepId}` },
                { status: 404 }
            );
        }

        return NextResponse.json({
            step,
            success: true
        });

    } catch (error) {
        console.error('Error in GET /api/planner:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

// ============================================================================
// POST /api/planner
// ============================================================================
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { answers } = body;

        if (!answers || !Array.isArray(answers) || answers.length === 0) {
            return NextResponse.json(
                { error: 'Missing or invalid answers array' },
                { status: 400 }
            );
        }

        const isValidAnswers = answers.every((answer: any) =>
            answer.stepId &&
            answer.selectedOptionId &&
            answer.selectedLabel
        );

        if (!isValidAnswers) {
            return NextResponse.json(
                { error: 'Invalid answer format. Each answer must have stepId, selectedOptionId, and selectedLabel' },
                { status: 400 }
            );
        }

        console.log(`📝 Processing ${answers.length} answers...`);

        const recommendation = await calculateRecommendation(answers as UserAnswer[]);
        const sessionId = await saveSession(answers as UserAnswer[], recommendation);

        return NextResponse.json({
            recommendation,
            sessionId,
            success: true
        });

    } catch (error) {
        console.error('Error in POST /api/planner:', error);
        return NextResponse.json(
            {
                error: 'Failed to calculate recommendation',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
