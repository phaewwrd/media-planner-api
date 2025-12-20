/**
 * TypeScript Types for AI Q&A Application
 * 
 * Defines all interfaces and types used throughout the application
 * for type safety and better developer experience.
 */

/**
 * Category types for different use cases
 * Maps to the Junior Digital Planner's common workflows
 */
export type QuestionCategory =
    | 'media-planning'      // สำหรับการวางแผน media และ channel
    | 'campaign-strategy'   // สำหรับกลยุทธ์แคมเปญ
    | 'kpi-funnel'         // สำหรับ KPI และ funnel analysis
    | 'performance'        // สำหรับ performance marketing
    | 'general';           // สำหรับคำถามทั่วไป

/**
 * Display labels for each category (Thai)
 */
export const CATEGORY_LABELS: Record<QuestionCategory, string> = {
    'media-planning': 'Media Planning',
    'campaign-strategy': 'Campaign Strategy',
    'kpi-funnel': 'KPI & Funnel',
    'performance': 'Performance',
    'general': 'General'
};

/**
 * Color scheme for each category tag
 */
export const CATEGORY_COLORS: Record<QuestionCategory, string> = {
    'media-planning': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'campaign-strategy': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'kpi-funnel': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    'performance': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    'general': 'bg-gray-500/20 text-gray-300 border-gray-500/30'
};

/**
 * Single Q&A pair
 * Represents one question and its AI-generated answer
 */
export interface QAPair {
    id: string;                    // Unique identifier
    question: string;              // User's question
    answer: string;                // AI's response
    category: QuestionCategory;    // Auto-detected or assigned category
    timestamp: Date;               // When the question was asked
}

/**
 * API Request payload for asking a question
 */
export interface ChatRequest {
    question: string;
    context?: string[];  // Optional: previous questions for context
}

/**
 * API Response from the RAG endpoint
 */
export interface ChatResponse {
    answer: string;
    category: QuestionCategory;
    retrievedContext?: string[];  // Optional: for debugging/transparency
    error?: string;
}

// ============================================================================
// Decision-Based Planner Types
// ============================================================================

/**
 * Single answer option for a step
 * Represents a clickable choice (button or card)
 */
export interface AnswerOption {
    id: string;                    // Unique option identifier
    label: string;                 // Display text (Thai)
    description?: string;          // Optional detailed description
    nextStepId: string | null;    // Next step to navigate to (null = end)
    metadata?: Record<string, any>; // For RAG context and logic
}

/**
 * Definition of a single step in the decision tree
 * Contains question and available options
 */
export interface StepDefinition {
    id: string;                    // e.g., "STEP_1", "STEP_1A"
    stepNumber: number;            // Display as "STEP X"
    question: string;              // Main question text
    insight: string;               // Senior planner tip/context
    options: AnswerOption[];       // Available answer choices
    category?: string;             // Optional categorization
}

/**
 * User's answer to a specific step
 * Stored in planner state for history and logic
 */
export interface UserAnswer {
    stepId: string;                // Which step was answered
    selectedOptionId: string;      // Which option was chosen
    selectedLabel: string;         // Human-readable label (for display)
    timestamp: Date;               // When the answer was given
}

/**
 * Channel allocation recommendation
 * Represents budget % for a single channel
 */
export interface ChannelAllocation {
    channel: 'Facebook' | 'Google' | 'TikTok' | 'Line' | 'YouTube';
    percentage: number;            // 0-100
    role: 'Hero' | 'Support' | 'Test';  // Channel role in strategy
}

/**
 * Final media planning recommendation
 * Output after completing all steps
 */
export interface FinalRecommendation {
    allocations: ChannelAllocation[];  // Channel breakdown
    totalBudget?: number;              // Optional: if user provided budget
    reasoning: string[];               // Logic explanation (references STEPs)
    summary: string;                   // Executive summary
    generatedAt: Date;
}

/**
 * Complete planner state
 * Manages the entire decision flow
 */
export interface PlannerState {
    currentStepId: string;         // Current active step
    answers: UserAnswer[];         // All previous answers
    isComplete: boolean;           // Whether flow is finished
    recommendation?: FinalRecommendation; // Final output (when complete)
}
