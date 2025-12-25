/**
 * Planner Service - Database-Driven
 * 
 * Uses Drizzle ORM to query Neon PostgreSQL
 */

import { db } from './index';
import { plannerSteps, plannerOptions, plannerRules, plannerSessions } from './schema';
import { eq, and, desc, sql as drizzleSql } from 'drizzle-orm';
import type { StepDefinition, UserAnswer, FinalRecommendation, ChannelAllocation } from '../types';

// ============================================================================
// Step Retrieval
// ============================================================================

/**
 * Get step by ID with its options
 */
export async function getStepById(stepId: string): Promise<StepDefinition | null> {
    try {
        const step = await db.query.plannerSteps.findFirst({
            where: eq(plannerSteps.id, stepId),
        });

        if (!step) return null;

        const options = await db.query.plannerOptions.findMany({
            where: eq(plannerOptions.stepId, stepId),
            orderBy: (options, { asc }) => [asc(options.displayOrder)],
        });

        return {
            id: step.id,
            stepNumber: parseFloat(step.stepNumber),
            question: step.question,
            insight: step.insight,
            category: step.category || undefined,
            options: options.map(opt => ({
                id: opt.id,
                label: opt.label,
                description: opt.description || undefined,
                nextStepId: opt.nextStepId,
                metadata: opt.metadata as any,
            })),
        };
    } catch (error) {
        console.error('Error fetching step:', error);
        return null;
    }
}

/**
 * Get initial step (STEP_1)
 */
export async function getInitialStep(): Promise<StepDefinition | null> {
    return getStepById('STEP_1');
}

// ============================================================================
// Decision Engine
// ============================================================================

/**
 * Extract key decisions from user answers
 */
function extractKeyDecisions(answers: UserAnswer[]): Record<string, any> {
    const decisions: Record<string, any> = {};

    const findAnswer = (stepId: string) =>
        answers.find(a => a.stepId === stepId)?.selectedOptionId;

    const objective = findAnswer('STEP_1');
    if (objective) decisions.objective = objective;

    const audience = findAnswer('STEP_1A');
    if (audience) decisions.audience = audience;

    const priceRange = findAnswer('STEP_2');
    if (priceRange === 'high_ticket') decisions.priceRange = 'high';
    if (priceRange === 'low_ticket') decisions.priceRange = 'low';

    const kpiQuality = findAnswer('STEP_3A');
    const kpiVolume = findAnswer('STEP_3B');
    if (kpiQuality) decisions.kpi = kpiQuality;
    if (kpiVolume) decisions.kpi = kpiVolume;

    const budget = findAnswer('STEP_4');
    if (budget === 'low_budget') decisions.budget = 'low';
    if (budget === 'high_budget') decisions.budget = 'high';

    const kpiFocus = findAnswer('STEP_5');
    if (kpiFocus) decisions.kpiFocus = kpiFocus;

    const duration = findAnswer('STEP_6');
    if (duration) decisions.duration = duration;

    const data = findAnswer('STEP_7');
    decisions.hasData = data === 'has_data';

    const client = findAnswer('STEP_8');
    decisions.clientInsist = client === 'client_insist';

    const tracking = findAnswer('STEP_9');
    if (tracking === 'good_tracking') decisions.tracking = 'good';
    if (tracking === 'weak_tracking') decisions.tracking = 'weak';

    return decisions;
}

/**
 * Match rules from database using JSONB containment
 */
async function matchRules(conditions: Record<string, any>) {
    try {
        // Use Drizzle's sql operator for JSONB containment
        const matchedRules = await db
            .select()
            .from(plannerRules)
            .where(
                and(
                    eq(plannerRules.isActive, true),
                    drizzleSql`${plannerRules.conditions} @> ${JSON.stringify(conditions)}::jsonb`
                )
            )
            .orderBy(desc(plannerRules.priority))
            .limit(20);

        return matchedRules;
    } catch (error) {
        console.error('Error matching rules:', error);
        return [];
    }
}

/**
 * Calculate final recommendation
 */
export async function calculateRecommendation(
    answers: UserAnswer[]
): Promise<FinalRecommendation> {

    const decisions = extractKeyDecisions(answers);
    console.log('📊 Key decisions:', decisions);

    const matchedRules = await matchRules(decisions);
    console.log(`🎯 Matched ${matchedRules.length} rules`);

    let allocations: ChannelAllocation[] = [];
    const reasoning: string[] = [];

    // Get primary allocation rule (priority 100+)
    const primaryRule = matchedRules.find(r =>
        r.priority >= 100 && (r.result as any).allocations
    );

    if (primaryRule) {
        allocations = (primaryRule.result as any).allocations;
        reasoning.push(`✓ ${primaryRule.explanation}`);
        console.log('🎯 Primary rule applied:', primaryRule.ruleName);
    }

    // Apply budget constraint
    if (decisions.budget === 'low' && allocations.length > 2) {
        allocations = allocations
            .filter(a => a.role !== 'Test')
            .slice(0, 2);

        const total = allocations.reduce((sum, a) => sum + a.percentage, 0);
        allocations = allocations.map(a => ({
            ...a,
            percentage: Math.round((a.percentage / total) * 100)
        }));

        reasoning.push('⚠️ งบประมาณต่ำกว่า 100k → ตัด Test channel ออก เน้นแค่ Hero + Support');
    }

    // KPI Focus adjustment
    if (decisions.kpiFocus === 'prefer_quality') {
        allocations = adjustAllocation(allocations, 'Google', +10);
        allocations = adjustAllocation(allocations, 'Facebook', -10);
        reasoning.push('📈 ปรับเน้น Quality → เพิ่ม Google +10%, ลด Facebook -10%');
    } else if (decisions.kpiFocus === 'prefer_volume') {
        allocations = adjustAllocation(allocations, 'Facebook', +10);
        allocations = adjustAllocation(allocations, 'Google', -10);
        reasoning.push('📈 ปรับเน้น Volume → เพิ่ม Facebook +10%, ลด Google -10%');
    }

    // Duration preference
    if (decisions.duration === 'burst') {
        reasoning.push('⏱️ แคมเปญระยะสั้น → Social Media (FB/TikTok) สร้าง momentum เร็วกว่า');
    } else if (decisions.duration === 'always_on') {
        reasoning.push('⏱️ แคมเปญระยะยาว → Google Search เสถียรกว่าในระยะยาว');
    }

    // Tracking capability
    if (decisions.tracking === 'weak') {
        reasoning.push('🎯 Tracking อ่อน → แนะนำเน้น Facebook เพราะ Pixel track conversion ได้ดีกว่า');
    }

    // Generate summary
    const heroChannel = allocations.find(a => a.role === 'Hero');
    const summary = heroChannel
        ? `แนะนำใช้ ${heroChannel.channel} เป็น Hero Channel (${heroChannel.percentage}%) ` +
        `ตามกลยุทธ์ที่วิเคราะห์จากคำตอบของคุณ`
        : 'แนะนำแบ่งงบประมาณตามสัดส่วนที่วิเคราะห์ได้';

    // Normalize percentages
    const total = allocations.reduce((sum, a) => sum + a.percentage, 0);
    if (total !== 100) {
        allocations = allocations.map(a => ({
            ...a,
            percentage: Math.round((a.percentage / total) * 100)
        }));
    }

    return {
        allocations,
        reasoning,
        summary,
        generatedAt: new Date()
    };
}

function adjustAllocation(
    allocations: ChannelAllocation[],
    channel: string,
    delta: number
): ChannelAllocation[] {
    return allocations.map(a => {
        if (a.channel === channel) {
            return {
                ...a,
                percentage: Math.max(0, Math.min(100, a.percentage + delta))
            };
        }
        return a;
    });
}

// ============================================================================
// Session Management
// ============================================================================

/**
 * Save session to database
 */
export async function saveSession(
    answers: UserAnswer[],
    recommendation: FinalRecommendation
): Promise<string | null> {
    try {
        const [result] = await db.insert(plannerSessions).values({
            answers: answers as any,
            recommendation: recommendation as any,
        }).returning({ id: plannerSessions.id });

        console.log('💾 Session saved:', result.id);
        return result.id;
    } catch (error) {
        console.error('Error saving session:', error);
        return null;
    }
}

/**
 * Get session by ID
 */
export async function getSessionById(sessionId: string) {
    try {
        const session = await db.query.plannerSessions.findFirst({
            where: eq(plannerSessions.id, sessionId),
        });

        if (!session) return null;

        return {
            id: session.id,
            answers: session.answers as UserAnswer[],
            recommendation: session.recommendation as FinalRecommendation,
            totalBudget: session.totalBudget,
            createdAt: session.createdAt,
        };
    } catch (error) {
        console.error('Error fetching session:', error);
        return null;
    }
}
