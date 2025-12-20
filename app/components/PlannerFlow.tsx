/**
 * PlannerFlow Component
 * 
 * Main orchestrator for the Decision-Based RAG Planner
 * Manages state, step navigation, and conditional rendering
 * 
 * Flow:
 * 1. Fetch current step from API
 * 2. User selects option
 * 3. Save answer, get next step from API
 * 4. Repeat until no next step
 * 5. Submit all answers to API for calculation
 */

'use client';

import { useState, useEffect } from 'react';
import { UserAnswer, StepDefinition, FinalRecommendation } from '../types';
import StepCard from './StepCard';
import OptionSelector from './OptionSelector';
import ProgressBar from './ProgressBar';
import AnswerHistory from './AnswerHistory';
import FinalSummary from './FinalSummary';

export default function PlannerFlow() {
    // State management
    const [currentStep, setCurrentStep] = useState<StepDefinition | null>(null);
    const [answers, setAnswers] = useState<UserAnswer[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const [recommendation, setRecommendation] = useState<FinalRecommendation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch initial step on mount
     */
    useEffect(() => {
        fetchStep('STEP_1');
    }, []);

    /**
     * Fetch a step by ID
     */
    const fetchStep = async (stepId: string) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/planner?stepId=${stepId}`);
            if (!res.ok) throw new Error('Failed to fetch step');
            const data = await res.json();

            if (data.success && data.step) {
                setCurrentStep(data.step);
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (err) {
            console.error('Error fetching step:', err);
            setError('Could not load step. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Submit answers to get final recommendation
     */
    const getRecommendation = async (finalAnswers: UserAnswer[]) => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/planner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers: finalAnswers })
            });

            if (!res.ok) throw new Error('Failed to calculate recommendation');
            const data = await res.json();

            if (data.success && data.recommendation) {
                setRecommendation(data.recommendation);
                setIsComplete(true);
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (err) {
            console.error('Error getting recommendation:', err);
            setError('Failed to generate recommendation. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handle option selection
     * Saves answer and navigates to next step
     */
    const handleOptionSelect = (optionId: string) => {
        if (!currentStep) return;

        // Find the selected option
        const selectedOption = currentStep.options.find(opt => opt.id === optionId);
        if (!selectedOption) return;

        // Create answer record
        const newAnswer: UserAnswer = {
            stepId: currentStep.id,
            selectedOptionId: optionId,
            selectedLabel: selectedOption.label,
            timestamp: new Date()
        };

        // Update answers array
        const updatedAnswers = [...answers, newAnswer];
        setAnswers(updatedAnswers);

        // Check for next step or finish
        if (selectedOption.nextStepId) {
            fetchStep(selectedOption.nextStepId);
        } else {
            // End of flow - calculate recommendation via API
            getRecommendation(updatedAnswers);
        }
    };

    /**
     * Restart the planner from beginning
     */
    const handleRestart = () => {
        setAnswers([]);
        setIsComplete(false);
        setRecommendation(null);
        setError(null);
        fetchStep('STEP_1');
    };

    // Calculate progress (approximate based on steps 1-9)
    // In a real app we might get total steps from API
    const currentStepNum = currentStep ? currentStep.stepNumber : 0;
    const progress = {
        current: currentStepNum,
        total: 9
    };

    // Render loading state
    if (isLoading && !currentStep && !isComplete) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="text-center p-8 bg-black/20 rounded-xl border border-red-500/30">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                    onClick={handleRestart}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white transaction-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // Render final summary if complete
    if (isComplete && recommendation) {
        return <FinalSummary recommendation={recommendation} onRestart={handleRestart} />;
    }

    // Render current step
    if (!currentStep) return null;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress bar */}
            <ProgressBar current={progress.current} total={progress.total} />

            {/* Answer history (locked previous answers) */}
            <AnswerHistory answers={answers} />

            {/* Current step */}
            <StepCard step={currentStep} stepProgress={progress} />

            {/* Option selector */}
            <div className="mt-8">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-pulse flex space-x-4">
                            <div className="h-12 w-full bg-white/5 rounded"></div>
                        </div>
                    </div>
                ) : (
                    <OptionSelector
                        options={currentStep.options}
                        onSelect={handleOptionSelect}
                    />
                )}
            </div>

            {/* Helper text */}
            <div className="mt-8 text-center">
                <p className="text-sm text-purple-300/60">
                    💡 เลือกคำตอบที่เหมาะสมที่สุดกับสถานการณ์ของคุณ คำตอบที่เลือกแล้วจะถูกล็อก
                </p>
            </div>
        </div>
    );
}
