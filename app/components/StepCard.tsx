/**
 * StepCard Component
 * 
 * Displays a single step of the decision tree
 * Shows the question, step number, and senior planner insight
 */

'use client';

import { StepDefinition } from '../types';

interface StepCardProps {
    step: StepDefinition;
    stepProgress: { current: number; total: number };
}

export default function StepCard({ step, stepProgress }: StepCardProps) {
    return (
        <div className="bg-gradient-to-br from-surface/80 to-surface-light/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 shadow-xl animate-slide-up">
            {/* Step number badge */}
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full mb-6">
                <span className="text-sm font-bold text-purple-300">
                    STEP {Math.floor(step.stepNumber)} / {stepProgress.total}
                </span>
            </div>

            {/* Main question */}
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-200 via-blue-200 to-cyan-200 bg-clip-text text-transparent">
                {step.question}
            </h2>

            {/* Senior planner insight */}
            <div className="bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 text-2xl">💡</div>
                    <div>
                        <p className="text-sm font-semibold text-purple-300 mb-1">
                            Senior Planner Insight
                        </p>
                        <p className="text-sm text-purple-200/80 leading-relaxed">
                            {step.insight}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
