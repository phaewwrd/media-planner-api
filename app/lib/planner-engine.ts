/**
 * Planner Engine
 * 
 * Core logic engine for the Decision-Based RAG Planner.
 * Handles:
 * - Step navigation
 * - Answer validation
 * - Final channel allocation calculation
 * - Logic reasoning generation
 * 
 * This is the "brain" that processes user answers and produces
 * the final media planning recommendation.
 */

import { StepDefinition, UserAnswer, FinalRecommendation, ChannelAllocation } from '../types';
import { getStepById, getInitialStep } from './decision-tree';

/**
 * Get the next step based on current step and selected option
 * 
 * @param currentStep - Current step definition
 * @param selectedOptionId - ID of the option user selected
 * @returns Next step definition, or null if end of tree
 * 
 * This simulates RAG retrieval where we "retrieve" the next relevant step
 * based on the user's answer context.
 */
export function getNextStep(
    currentStep: StepDefinition,
    selectedOptionId: string
): StepDefinition | null {
    // Find the selected option
    const selectedOption = currentStep.options.find(opt => opt.id === selectedOptionId);

    if (!selectedOption) {
        console.error(`Option ${selectedOptionId} not found in step ${currentStep.id}`);
        return null;
    }

    // If nextStepId is null, we've reached the end
    if (!selectedOption.nextStepId) {
        return null;
    }

    // Retrieve the next step (simulates RAG retrieval)
    return getStepById(selectedOption.nextStepId);
}

/**
 * Calculate final channel allocation based on all user answers
 * 
 * This is the core "Senior Planner Logic" that processes the decision tree
 * and produces the final recommendation.
 * 
 * @param answers - All user answers collected through the flow
 * @returns Final recommendation with channel allocations and reasoning
 */
export function calculateFinalRecommendation(answers: UserAnswer[]): FinalRecommendation {
    // Extract key decisions from answers
    const decisions = extractKeyDecisions(answers);

    // Calculate base allocation from decision tree metadata
    const baseAllocation = calculateBaseAllocation(decisions);

    // Apply adjustments based on later steps
    const finalAllocation = applyAdjustments(baseAllocation, decisions);

    // Generate reasoning
    const reasoning = generateReasoning(answers, decisions);

    // Generate summary
    const summary = generateSummary(finalAllocation, decisions);

    return {
        allocations: finalAllocation,
        reasoning,
        summary,
        generatedAt: new Date()
    };
}

/**
 * Extract key decisions from user answers
 * Maps the answers to decision variables we can work with
 */
interface KeyDecisions {
    objective?: 'awareness' | 'conversion';
    audience?: 'genz' | 'adult';
    priceRange?: 'high' | 'low';
    kpi?: 'quality' | 'volume';
    budget?: 'low' | 'high';
    kpiFocus?: 'prefer_volume' | 'prefer_quality';
    duration?: 'burst' | 'always_on';
    hasData?: boolean;
    clientInsist?: boolean;
    tracking?: 'good' | 'weak';
}

function extractKeyDecisions(answers: UserAnswer[]): KeyDecisions {
    const decisions: KeyDecisions = {};

    answers.forEach(answer => {
        // STEP 1: Objective
        if (answer.stepId === 'STEP_1') {
            decisions.objective = answer.selectedOptionId as 'awareness' | 'conversion';
        }

        // STEP 1A: Audience (only for awareness)
        if (answer.stepId === 'STEP_1A') {
            decisions.audience = answer.selectedOptionId as 'genz' | 'adult';
        }

        // STEP 2: Price range
        if (answer.stepId === 'STEP_2') {
            decisions.priceRange = answer.selectedOptionId === 'high_ticket' ? 'high' : 'low';
        }

        // STEP 3A/3B: KPI
        if (answer.stepId === 'STEP_3A' || answer.stepId === 'STEP_3B') {
            decisions.kpi = answer.selectedOptionId as 'quality' | 'volume';
        }

        // STEP 4: Budget
        if (answer.stepId === 'STEP_4') {
            decisions.budget = answer.selectedOptionId === 'low_budget' ? 'low' : 'high';
        }

        // STEP 5: KPI Focus
        if (answer.stepId === 'STEP_5') {
            decisions.kpiFocus = answer.selectedOptionId as 'prefer_volume' | 'prefer_quality';
        }

        // STEP 6: Duration
        if (answer.stepId === 'STEP_6') {
            decisions.duration = answer.selectedOptionId as 'burst' | 'always_on';
        }

        // STEP 7: Historical data
        if (answer.stepId === 'STEP_7') {
            decisions.hasData = answer.selectedOptionId === 'has_data';
        }

        // STEP 8: Client preference
        if (answer.stepId === 'STEP_8') {
            decisions.clientInsist = answer.selectedOptionId === 'client_insist';
        }

        // STEP 9: Tracking
        if (answer.stepId === 'STEP_9') {
            decisions.tracking = answer.selectedOptionId === 'good_tracking' ? 'good' : 'weak';
        }
    });

    return decisions;
}

/**
 * Calculate base allocation from primary decision factors
 * Uses the allocation metadata from decision tree
 */
function calculateBaseAllocation(decisions: KeyDecisions): ChannelAllocation[] {
    const allocations: ChannelAllocation[] = [];

    // Logic from STEP 1 + STEP 1A (Awareness flow)
    if (decisions.objective === 'awareness' && decisions.audience === 'genz') {
        // Gen Z Awareness: TikTok 40-60%, Facebook 30-40%, Google ≤20%
        allocations.push(
            { channel: 'TikTok', percentage: 50, role: 'Hero' },
            { channel: 'Facebook', percentage: 35, role: 'Support' },
            { channel: 'Google', percentage: 15, role: 'Test' }
        );
    } else if (decisions.objective === 'awareness' && decisions.audience === 'adult') {
        // Adult Awareness: Facebook 50-60%, TikTok 20-30%, Google ≤20%
        allocations.push(
            { channel: 'Facebook', percentage: 55, role: 'Hero' },
            { channel: 'TikTok', percentage: 25, role: 'Support' },
            { channel: 'Google', percentage: 20, role: 'Test' }
        );
    }
    // Logic from STEP 2 + STEP 3A (High Ticket + Quality)
    else if (decisions.priceRange === 'high' && decisions.kpi === 'quality') {
        // High Involvement Quality: Google 50-70%, Facebook 30-50%, TikTok 0-10%
        allocations.push(
            { channel: 'Google', percentage: 60, role: 'Hero' },
            { channel: 'Facebook', percentage: 35, role: 'Support' },
            { channel: 'TikTok', percentage: 5, role: 'Test' }
        );
    }
    // Logic from STEP 2 + STEP 3B (Low Ticket + Volume)
    else if (decisions.priceRange === 'low' && decisions.kpi === 'volume') {
        // Low Involvement Volume: Facebook 40-50%, TikTok 30-40%, Google 10-20%
        allocations.push(
            { channel: 'Facebook', percentage: 45, role: 'Hero' },
            { channel: 'TikTok', percentage: 35, role: 'Support' },
            { channel: 'Google', percentage: 20, role: 'Test' }
        );
    }
    // Default fallback (should not happen in normal flow)
    else {
        allocations.push(
            { channel: 'Facebook', percentage: 50, role: 'Hero' },
            { channel: 'Google', percentage: 30, role: 'Support' },
            { channel: 'TikTok', percentage: 20, role: 'Test' }
        );
    }

    return allocations;
}

/**
 * Apply adjustments based on STEP 4-9 decisions
 * Modifies the base allocation based on budget, duration, tracking, etc.
 */
function applyAdjustments(
    baseAllocation: ChannelAllocation[],
    decisions: KeyDecisions
): ChannelAllocation[] {
    let adjusted = [...baseAllocation];

    // STEP 4: Budget constraint
    if (decisions.budget === 'low') {
        // Low budget: Focus on top 2 channels only
        adjusted = adjusted
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 2);

        // Redistribute to sum to 100%
        const total = adjusted.reduce((sum, ch) => sum + ch.percentage, 0);
        adjusted = adjusted.map(ch => ({
            ...ch,
            percentage: Math.round((ch.percentage / total) * 100)
        }));
    }

    // STEP 5: KPI Focus adjustment
    if (decisions.kpiFocus === 'prefer_volume') {
        // Increase Facebook/TikTok, decrease Google
        adjusted = adjusted.map(ch => {
            if (ch.channel === 'Facebook' || ch.channel === 'TikTok') {
                return { ...ch, percentage: ch.percentage + 5 };
            } else if (ch.channel === 'Google') {
                return { ...ch, percentage: Math.max(5, ch.percentage - 10) };
            }
            return ch;
        });
    } else if (decisions.kpiFocus === 'prefer_quality') {
        // Increase Google, decrease Facebook
        adjusted = adjusted.map(ch => {
            if (ch.channel === 'Google') {
                return { ...ch, percentage: ch.percentage + 10 };
            } else if (ch.channel === 'Facebook') {
                return { ...ch, percentage: Math.max(10, ch.percentage - 10) };
            }
            return ch;
        });
    }

    // STEP 6: Campaign duration
    if (decisions.duration === 'burst') {
        // Burst: Favor Facebook/TikTok (social momentum)
        adjusted = adjusted.map(ch => {
            if (ch.channel === 'Facebook' || ch.channel === 'TikTok') {
                return { ...ch, percentage: ch.percentage + 3 };
            } else if (ch.channel === 'Google') {
                return { ...ch, percentage: Math.max(5, ch.percentage - 6) };
            }
            return ch;
        });
    } else if (decisions.duration === 'always_on') {
        // Always-on: Favor Google (stable intent)
        adjusted = adjusted.map(ch => {
            if (ch.channel === 'Google') {
                return { ...ch, percentage: ch.percentage + 5, role: 'Hero' };
            }
            return ch;
        });
    }

    // STEP 9: Tracking capability
    if (decisions.tracking === 'weak') {
        // Weak tracking: Favor Facebook (better pixel tracking)
        adjusted = adjusted.map(ch => {
            if (ch.channel === 'Facebook') {
                return { ...ch, percentage: ch.percentage + 5, role: 'Hero' };
            }
            return ch;
        });
    }

    // Normalize to 100%
    const total = adjusted.reduce((sum, ch) => sum + ch.percentage, 0);
    adjusted = adjusted.map(ch => ({
        ...ch,
        percentage: Math.round((ch.percentage / total) * 100)
    }));

    return adjusted;
}

/**
 * Generate reasoning array explaining the logic
 * References specific STEPs and decisions
 */
function generateReasoning(answers: UserAnswer[], decisions: KeyDecisions): string[] {
    const reasoning: string[] = [];

    // STEP 1 reasoning
    if (decisions.objective === 'awareness') {
        reasoning.push('📍 STEP 1: เป้าหมาย Awareness → เน้นช่องทางที่เข้าถึงกลุ่มเป้าหมายได้กว้าง');

        if (decisions.audience === 'genz') {
            reasoning.push('📍 STEP 1A: กลุ่มเป้าหมาย Gen Z → TikTok เป็น Hero Channel (viral-able, short-form content)');
        } else if (decisions.audience === 'adult') {
            reasoning.push('📍 STEP 1A: กลุ่มเป้าหมายผู้ใหญ่ → Facebook เป็น Hero Channel (usage time สูง, branding)');
        }
    } else if (decisions.objective === 'conversion') {
        reasoning.push('📍 STEP 1: เป้าหมาย Conversion → เน้นช่องทางที่มี Intent และ Track Conversion ได้ดี');
    }

    // STEP 2-3 reasoning
    if (decisions.priceRange === 'high') {
        reasoning.push('📍 STEP 2-3: สินค้า High Ticket + KPI Quality → Google Search เป็น Hero (high intent, quality leads)');
    } else if (decisions.priceRange === 'low') {
        reasoning.push('📍 STEP 2-3: สินค้า Low Ticket + KPI Volume → Facebook/TikTok เป็น Hero (scale ง่าย, ROAS ดี)');
    }

    // STEP 4 reasoning
    if (decisions.budget === 'low') {
        reasoning.push('📍 STEP 4: งบประมาณ < 100K → จำกัดเหลือ 2 ช่องทาง เพื่อ Focus และ Optimize ให้ดีที่สุด');
    } else if (decisions.budget === 'high') {
        reasoning.push('📍 STEP 4: งบประมาณ ≥ 100K → ใช้โมเดล Hero/Support/Test เพื่อกระจายความเสี่ยง');
    }

    // STEP 5 reasoning
    if (decisions.kpiFocus === 'prefer_volume') {
        reasoning.push('📍 STEP 5: เน้น Volume → เพิ่มสัดส่วน Facebook/TikTok ลด Google');
    } else if (decisions.kpiFocus === 'prefer_quality') {
        reasoning.push('📍 STEP 5: เน้น Quality → เพิ่มสัดส่วน Google Search ลด Social');
    }

    // STEP 6 reasoning
    if (decisions.duration === 'burst') {
        reasoning.push('📍 STEP 6: Burst Campaign → Social มี momentum เร็ว เหมาะกับแคมเปญระยะสั้น');
    } else if (decisions.duration === 'always_on') {
        reasoning.push('📍 STEP 6: Always-on Campaign → Google มีความเสถียร เหมาะกับการวิ่งต่อเนื่อง');
    }

    // STEP 7 reasoning
    if (decisions.hasData) {
        reasoning.push('📍 STEP 7: มีข้อมูลในอดีต → จัดสรรงบตาม Winner Channel ที่ perform ดีที่สุด');
    } else {
        reasoning.push('📍 STEP 7: ไม่มีข้อมูล → เริ่มจาก Facebook Base + Google Intent แล้วค่อยปรับ');
    }

    // STEP 8 reasoning
    if (decisions.clientInsist) {
        reasoning.push('📍 STEP 8: Client มี Preference → กันงบ 10-20% ให้ช่องทางที่ Client ต้องการ');
    }

    // STEP 9 reasoning
    if (decisions.tracking === 'good') {
        reasoning.push('📍 STEP 9: Tracking ดี → กระจาย Multi-channel ได้เพราะ track conversion แม่น');
    } else if (decisions.tracking === 'weak') {
        reasoning.push('📍 STEP 9: Tracking อ่อน → เน้น Facebook เพราะ Pixel tracking แม่นกว่าช่องทางอื่น');
    }

    return reasoning;
}

/**
 * Generate executive summary
 */
function generateSummary(allocations: ChannelAllocation[], decisions: KeyDecisions): string {
    const heroChannel = allocations.find(a => a.role === 'Hero');
    const supportChannel = allocations.find(a => a.role === 'Support');

    let summary = `แผนการจัดสรรงบประมาณสำหรับแคมเปญ ${decisions.objective === 'awareness' ? 'Awareness' : 'Conversion'} `;

    if (decisions.priceRange) {
        summary += `สินค้าราคา${decisions.priceRange === 'high' ? 'สูง' : 'ถูก'} `;
    }

    summary += `โดยใช้ ${heroChannel?.channel} เป็น Hero Channel (${heroChannel?.percentage}%)`;

    if (supportChannel) {
        summary += ` และ ${supportChannel.channel} เป็น Support Channel (${supportChannel.percentage}%)`;
    }

    summary += ` เพื่อให้ได้ผลลัพธ์ที่ดีที่สุดตามข้อมูลและบริบทของแคมเปญ`;

    return summary;
}

/**
 * Validate that all required steps have been answered
 */
export function isFlowComplete(answers: UserAnswer[]): boolean {
    // Must have at least answered STEP_1 and STEP_9
    const hasStep1 = answers.some(a => a.stepId === 'STEP_1');
    const hasStep9 = answers.some(a => a.stepId === 'STEP_9');

    return hasStep1 && hasStep9;
}

/**
 * Get step progress (current step number out of total)
 */
export function getProgress(currentStepId: string): { current: number; total: number } {
    const step = getStepById(currentStepId);
    if (!step) return { current: 0, total: 9 };

    // Map step numbers (handle sub-steps like 1.5)
    const stepNum = Math.floor(step.stepNumber);

    return {
        current: stepNum,
        total: 9
    };
}
